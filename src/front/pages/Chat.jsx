import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { chatAPI } from "./utilsChat";
import { jwtDecode } from "jwt-decode";

export const Chat = () => {
    const { store } = useGlobalReducer();

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [contacts, setContacts] = useState([]);
    const [targetId, setTargetId] = useState(null);

    /* ===== IDENTIFICAR USUARIO ===== */

    const decodedClient = store.tokenClient
        ? jwtDecode(store.tokenClient)
        : null;

    const decodedCompany = store.company_token
        ? jwtDecode(store.company_token)
        : null;

    const myId = decodedClient
        ? decodedClient.sub
        : decodedCompany
        ? decodedCompany.sub
        : null;

    const myRole = decodedClient
        ? "client"
        : decodedCompany
        ? "company"
        : null;

    const targetRole = myRole === "client" ? "company" : "client";

    /* ===== CARGAR CONTACTOS ===== */

    const loadContacts = async () => {
        if (!myId || !myRole) return;

        const data = await chatAPI.getContacts(myId, myRole);

        console.log("CONTACTS FILTRADOS:", data);

        setContacts(data);

        if (data.length > 0) {
            setTargetId(data[0].id);
        } else {
            setTargetId(null);
        }
    };

    /* ===== CARGAR CONVERSACIÓN ===== */

    const loadChat = async () => {
        if (!myId || !targetId) return;

        const history = await chatAPI.getConversation(
            myId,
            myRole,
            targetId,
            targetRole
        );

        setMessages(history);
    };

     /* ===== EFECTOS ===== */

    useEffect(() => {
        loadContacts();
    }, [myId]);

    useEffect(() => {
        loadChat();
    }, [myId, targetId]);

    useEffect(() => {
    if (!myId || !targetId) return;

    const interval = setInterval(() => {
        loadChat();
    }, 4000); // cada 4 segundos

    return () => clearInterval(interval);

}, [myId, targetId]);

    /* ===== ENVIAR MENSAJE ===== */

    const handleSend = async () => {
        if (!myId || !targetId || !text.trim()) return;

        const payload = {
            sender_id: myId,
            sender_role: myRole,
            receiver_id: targetId,
            receiver_role: targetRole,
            content: text
        };

        const sent = await chatAPI.send(payload);

        if (sent) {
            setMessages(prev => [...prev, sent]);
            setText("");
        }
    };

    return (
        <div className="container mt-5">
            <div className="card mx-auto" style={{ maxWidth: "500px" }}>
                <div className="card-header bg-dark text-white d-flex justify-content-between">
                    <span>Chat ({myRole || "no-role"})</span>
                    <button
                        className="btn btn-sm btn-outline-light"
                        onClick={loadChat}
                    >
                        Refrescar
                    </button>
                </div>

                <div className="p-2 border-bottom bg-light small">
                    Hablar con:
                    <select
                        className="form-select form-select-sm mt-1"
                        value={targetId || ""}
                        onChange={e =>
                            setTargetId(parseInt(e.target.value))
                        }
                    >
                        {contacts.length === 0 && (
                            <option value="">
                                Sin conversaciones
                            </option>
                        )}

                        {contacts.map(c => (
                            <option key={`${c.id}-${c.role}`} value={c.id}>
                                {c.email || c.name || `ID ${c.id}`}
                            </option>
                        ))}
                    </select>
                </div>

                <div
                    className="card-body"
                    style={{ height: "300px", overflowY: "auto" }}
                >
                    {messages.length === 0 && (
                        <p className="text-muted small">
                            No hay mensajes todavía
                        </p>
                    )}

                    {messages.map((m, i) => (
                        <div
                            key={i}
                            className={`d-flex ${
                                m.sender_role === myRole
                                    ? "justify-content-end"
                                    : "justify-content-start"
                            } mb-2`}
                        >
                            <div
                                className={`p-2 rounded ${
                                    m.sender_role === myRole
                                        ? "bg-primary text-white"
                                        : "bg-light border"
                                }`}
                            >
                                <small
                                    className="d-block fw-bold"
                                    style={{ fontSize: "0.7rem" }}
                                >
                                    {m.sender_role === myRole
                                        ? "Tú"
                                        : `${m.sender_role} ${m.sender_id}`}
                                </small>
                                {m.content}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="card-footer">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            value={text}
                            onChange={e => setText(e.target.value)}
                            placeholder="Escribe..."
                        />
                        <button
                            className="btn btn-primary"
                            onClick={handleSend}
                        >
                            Enviar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};