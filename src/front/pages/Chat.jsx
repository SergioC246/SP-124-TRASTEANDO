import React, { useState, useEffect, useRef } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { chatAPI } from "./utilsChat";
import { jwtDecode } from "jwt-decode";
import { createSocket } from "../../socket";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const Chat = () => {
  const { store } = useGlobalReducer();
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [directory, setDirectory] = useState([]);
  const [targetId, setTargetId] = useState(null);
  const [targetRole, setTargetRole] = useState(null);
  const [text, setText] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);
  const [socket, setSocket] = useState(null);
  const [unread, setUnread] = useState({});

  // Referencias para que el socket siempre vea el chat activo actual
  const activeChatRef = useRef({ targetId: null, targetRole: null });
  const myInfoRef = useRef({ id: null, role: null });

  /* ===== USER DATA ===== */
  const decodedClient = store.tokenClient ? jwtDecode(store.tokenClient) : null;
  const decodedCompany = store.company_token ? jwtDecode(store.company_token) : null;
  const myId = decodedClient ? parseInt(decodedClient.sub) : decodedCompany ? parseInt(decodedCompany.sub) : null;
  const myRole = decodedClient ? "client" : decodedCompany ? "company" : null;
  const token = store.tokenClient || store.company_token;

  // Actualizar referencias
  useEffect(() => {
    activeChatRef.current = { targetId, targetRole };
    myInfoRef.current = { id: myId, role: myRole };
  }, [targetId, targetRole, myId, myRole]);

  /* ===== SOCKET INIT ===== */
  useEffect(() => {
    if (!token) return;
    const s = createSocket(token);
    setSocket(s);

    s.on("message:new", (msg) => {
      const { targetId: tId, targetRole: tRole } = activeChatRef.current;
      const { id: mId, role: mRole } = myInfoRef.current;

      // ¿El mensaje es para la conversación que tengo abierta ahora mismo?
      const isForActiveChat =
        (msg.sender_id === tId && msg.sender_role === tRole) ||
        (msg.sender_id === mId && msg.sender_role === mRole && msg.receiver_id === tId);

      if (isForActiveChat) {
        setMessages(prev => [...prev, msg]);
      } else {
        // Si no es el chat activo y yo soy el receptor, sumar a "no leídos"
        if (msg.receiver_id === mId && msg.receiver_role === mRole) {
          const key = `${msg.sender_id}-${msg.sender_role}`;
          setUnread(prev => ({
            ...prev,
            [key]: (prev[key] || 0) + 1
          }));
        }
      }
    });

    return () => s.disconnect();
  }, [token]);

  /* ===== LOADS ===== */
  const loadContacts = async () => {
    if (!myId || !myRole) return;
    const data = await chatAPI.getContacts(myId, myRole);
    setContacts(data);
  };

  const loadChat = async () => {
    if (!myId || !targetId || !targetRole) return;
    const history = await chatAPI.getConversation(myId, myRole, targetId, targetRole);
    setMessages(history);
    // Limpiar no leídos al entrar
    setUnread(prev => ({ ...prev, [`${targetId}-${targetRole}`]: 0 }));
  };

  useEffect(() => { loadContacts(); }, [myId, myRole]);
  useEffect(() => { loadChat(); }, [targetId, targetRole]);

  const handleSend = async () => {
    if (!text.trim() || !targetId) return;
    const payload = { sender_id: myId, sender_role: myRole, receiver_id: targetId, receiver_role: targetRole, content: text };
    await chatAPI.send(payload);
    setText("");
  };

  /* ===== RENDER ===== */
  return (
    <div className="container-fluid mt-3">
      <div className="row" style={{ height: "80vh" }}>

        {/* PANEL IZQUIERDO */}
        <div className="col-md-4 col-lg-3 border-end bg-light overflow-auto">
          <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
            <h5 className="m-0">Mensajes</h5>
            <button className="btn btn-primary btn-sm" onClick={async () => {
              const endpoint = myRole === "client" ? "api/companies" : "api/clients";
              const resp = await fetch(`${API_URL}${endpoint}`);
              setDirectory(await resp.json());
              setShowNewChat(true);
            }}>Nuevo</button>
          </div>
          <div className="list-group list-group-flush">
            {contacts.map(c => {
              const key = `${c.id}-${c.role}`;
              return (
                <button key={key} onClick={() => { setTargetId(c.id); setTargetRole(c.role); }}
                  className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${targetId === c.id ? "active" : ""}`}>
                  <div className="text-truncate">{c.name || c.email}</div>
                  {unread[key] > 0 && (
                    <span className="badge bg-danger rounded-pill">{unread[key]}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* PANEL DERECHO */}
        <div className="col-md-8 col-lg-9 d-flex flex-column bg-white border rounded">
          <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
            <span className="fw-bold">
              {contacts.find(c => c.id === targetId)?.name || contacts.find(c => c.id === targetId)?.email || "Selecciona un chat"}
            </span>
            {targetId && (
              <button className="btn btn-link text-danger p-0" onClick={async () => {
                if (window.confirm("¿Borrar chat?")) {
                  await fetch(`${API_URL}api/messages/conversation/${myId}/${targetId}`, { method: "DELETE" });
                  setMessages([]); setTargetId(null); loadContacts();
                }
              }}>
                <i className="fas fa-trash-alt"></i>
              </button>
            )}
          </div>

          <div className="flex-grow-1 overflow-auto p-3">
            {messages.map((m, i) => (
              <div key={i} className={`d-flex mb-3 ${m.sender_id === myId && m.sender_role === myRole ? "justify-content-end" : "justify-content-start"}`}>
                <div className={`p-2 px-3 rounded-pill ${m.sender_id === myId && m.sender_role === myRole ? "bg-primary text-white" : "bg-light border"}`} style={{ maxWidth: "80%" }}>
                  {m.content}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-top">
            <div className="input-group">
              <input type="text" className="form-control" value={text} onChange={e => setText(e.target.value)} placeholder="Escribe un mensaje..." onKeyDown={e => e.key === "Enter" && handleSend()} />
              <button className="btn btn-primary" onClick={handleSend}>
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DIRECTORIO */}
      {showNewChat && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Nuevo Chat</h5>
                <button className="btn-close" onClick={() => setShowNewChat(false)}></button>
              </div>
              <div className="modal-body overflow-auto" style={{ maxHeight: "400px" }}>
                <div className="list-group">
                  {directory.map(d => (
                    <button key={d.id} className="list-group-item list-group-item-action" onClick={() => {
                      const role = myRole === "client" ? "company" : "client";
                      setTargetId(d.id); setTargetRole(role); setShowNewChat(false);
                      if (!contacts.find(c => c.id === d.id)) setContacts(prev => [...prev, { ...d, role }]);
                    }}>
                      {d.name || d.email}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};