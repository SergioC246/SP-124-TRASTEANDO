import { useState, useEffect, useMemo, useRef } from "react";
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
    const currentRoomRef = useRef(null);
    const [showNewChat, setShowNewChat] = useState(false);

    /* ===== USER ===== */

    const decodedClient = store.tokenClient
        ? jwtDecode(store.tokenClient)
        : null;

    const decodedCompany = store.company_token
        ? jwtDecode(store.company_token)
        : null;

    const myId = decodedClient
        ? parseInt(decodedClient.sub)
        : decodedCompany
            ? parseInt(decodedCompany.sub)
            : null;

    const myRole = decodedClient
        ? "client"
        : decodedCompany
            ? "company"
            : null;

    const token = store.tokenClient || store.company_token;

    const socket = useMemo(() => {
        if (!token) return null;
        return createSocket(token);
    }, [token]);

    /* ===== LOAD CONTACTS ===== */

    const loadContacts = async () => {

        if (!myId || !myRole) return;

        const data = await chatAPI.getContacts(myId, myRole); 

            setContacts(data);

            if (data.length > 0 && !targetId) {
                setTargetId(data[0].id);
                setTargetRole(data[0].role);
            }

        };
    
    /* ===== LOAD DIRECTORY (AGENDA) ===== */

    const loadDirectory = async () => {

        if (!myRole) return;

        if (myRole === "client") {

            const resp = await fetch(`${API_URL}/api/companies`); // ✅ FIX (barra)
            const data = resp.ok ? await resp.json() : [];

            setDirectory(data.map(c => ({ ...c, role: "company" })));

        } else {

            const resp = await fetch(`${API_URL}/api/clients`);
            const data = resp.ok ? await resp.json() : [];

            setDirectory(data.map(c => ({ ...c, role: "client" })));
        }
    };

    /* ===== LOAD CHAT  ===== */

    const loadChat = async () => {
        if (!myId || !targetId || !targetRole) return;

        const history = await chatAPI.getConversation(
            myId,
            myRole,
            targetId,
            targetRole
        );

        setMessages(history);
    };

    useEffect(() => {
        loadContacts();
    }, [myId]);

    useEffect(() => {
        setMessages([]);
        loadChat();
    }, [targetId, targetRole]);


    useEffect(() => {
        if (!socket || !myId || !targetId) return;

        const handler = (msg) => {

            const isForThisChat =
                (msg.sender_id === myId &&
                    msg.sender_role === myRole &&
                    msg.receiver_id === targetId &&
                    msg.receiver_role === targetRole
                ) ||
                (msg.sender_id === targetId &&
                    msg.sender_role === targetRole &&
                    msg.receiver_id === myId &&
                    msg.receiver_role === myRole
                );

            if (isForThisChat) {
                setMessages(prev => [...prev, msg]);
            }
        };

        socket.on("message:new", handler);

        return () => {
            socket.off("message:new", handler);
        };
    }, [socket, myId, targetId, myRole, targetRole]);

    useEffect(() => {
        if (!socket || !targetId) return;

        const roomKey = `${targetId}-${targetRole}`;


        if (currentRoomRef.current === roomKey) {
            return;
        }

        const doJoin = () => {

            socket.emit("room:join", {
                myRole,
                targetId,
                targetRole
            });

            currentRoomRef.current = roomKey;
        };

        // Esperar un momento para que el socket conecte
        const timer = setTimeout(() => {
            if (socket.connected) {
                doJoin();
            } else {
                // Si no está conectado, esperar al evento connect
                const handleConnect = () => {
                    doJoin();
                };

                socket.once("connect", handleConnect);
            }
        }, 100);

        // Cleanup
        return () => {
            clearTimeout(timer);

            // Solo hacer leave si realmente cambiamos de room
            const newRoomKey = `${targetId}-${targetRole}`;
            if (currentRoomRef.current && currentRoomRef.current !== newRoomKey) {

                if (socket.connected) {
                    socket.emit("room:leave", {
                        myRole,
                        targetId,
                        targetRole
                    });
                }
            }
        };
    }, [socket, targetId, myRole, targetRole]);



    /* ===== SEND ===== */

    const handleSend = async () => {
        if (!text.trim() || !targetId) return;

        const payload = {
            sender_id: myId,
            sender_role: myRole,
            receiver_id: targetId,
            receiver_role: targetRole,
            content: text
        };

        const sent = await chatAPI.send(payload);

        if (sent) {
            setText("");
        }
    };

    /* ===== DELETE ===== */

    const handleDeleteConversation = async () => {

        const confirmDelete = window.confirm("¿Seguro que quieres borrar esta conversación?");
        if (!confirmDelete) return;

        await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/messages/conversation/${myId}/${myRole}/${targetId}/${targetRole}`,
            {
                method: "DELETE"
            }
        );

        setMessages([]);

        setContacts(prev =>
            prev.filter(c => c.id !== targetId)
        );

        setTargetId(null);
        setTargetRole(null);
    };

    /* ===== DELETE ===== */

    const handleNewChat = async () => {
    console.log("NEW CHAT CLICKED");
        await loadDirectory();
        setShowNewChat(true);
};
    /* ===== RENDER ===== */

    return (
        <div className="container-fluid mt-3">
            <div className="row vh-75" style={{ height: "80vh" }}>

                {/* LEFT PANEL - ROOMS */}
                <div className="col-md-4 col-lg-3 border-end bg-light d-none d-md-block">
                    <div className="p-3 border-bottom fw-bold">
                        Conversaciones
                    </div>
                    <div className="p-2 border-bottom">
                        <button
                            className="btn btn-primary w-100"
                            onClick={handleNewChat}
                        >
                            Nuevo chat
                        </button>
                    </div>
                    {showNewChat && (
                        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                            <div className="modal-dialog">
                                <div className="modal-content">

                                    <div className="modal-header">
                                        <h5>Nuevo chat</h5>
                                        <button className="btn-close" onClick={() => setShowNewChat(false)} />
                                    </div>

                                    <div className="modal-body">

                                        {directory.length === 0 ? (
                                            <div className="text-muted">No hay contactos disponibles</div>
                                        ) : (
                                            directory.map(c => (
                                                <button
                                                    key={`${c.id}-${c.role}`}
                                                    className="list-group-item list-group-item-action"
                                                    onClick={() => {
                                                        setTargetId(c.id);
                                                        setTargetRole(c.role);
                                                        setContacts(prev => {

                                                            const exists = prev.some(p => p.id === c.id);

                                                            if (exists) return prev;

                                                            return [...prev, c];
                                                        });

                                                        setShowNewChat(false);
                                                    }}
                                                >
                                                    {c.name || c.email}
                                                </button>
                                            ))
                                        )}

                                    </div>

                                </div>
                            </div>
                        </div>
                    )}

                    <div className="list-group list-group-flush rounded p-2">
                        {contacts.map(c => (
                            <button
                                key={`${c.id}-${c.role}`}
                                onClick={() => setTargetId(c.id)}
                                className={`list-group-item-info list-group-item-action rounded p-2 mb-1 ${targetId === c.id ? "active" : ""
                                    }`}
                            >

                                <div className="d-flex align-items-center">   

                                    <img
                                        src={c.photo_url || c.photo || "https://via.placeholder.com/32"}
                                        alt="avatar"
                                        width="32"
                                        height="32"
                                        className="rounded-circle me-3"
                                        style={{ objectFit: "cover" }}
                                    />

                                    <div className="text-truncate align-items-center p-1">
                                        { c.name }
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* RIGHT PANEL - CHAT */}
                <div className="col-md-8 col-lg-9 d-flex flex-column">

                    {/* HEADER */}
                    <div className="border-bottom p-3 fw-bold">
                        <span>{contacts.find(c => c.id === targetId)?.email ||
                            contacts.find(c => c.id === targetId)?.name ||
                            "Selecciona conversación"}
                        </span>
                        {targetId && (
                            <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={handleDeleteConversation}
                            >
                                🗑
                            </button>
                        )}
                    </div>

                    {/* MESSAGES */}
                    <div className="flex-grow-1 overflow-auto p-3 bg-white">
                        {messages.map((m, i) => (
                            <div
                                key={i}
                                className={`d-flex mb-2 ${m.sender_role === myRole
                                    ? "justify-content-end"
                                    : "justify-content-start"
                                    }`}
                            >
                                <div
                                    className={`p-2 rounded ${m.sender_role === myRole
                                        ? "bg-primary text-white"
                                        : "bg-light border"
                                        }`}
                                    style={{ maxWidth: "70%" }}
                                >
                                    {m.content}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* INPUT */}
                    <div className="border-top p-2">
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                value={text}
                                onChange={e => setText(e.target.value)}
                                placeholder="Escribe mensaje..."
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
        </div>
    );
};