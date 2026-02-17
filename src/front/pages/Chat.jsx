import React, { useState, useEffect, useMemo, useRef } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { chatAPI } from "./utilsChat";
import { jwtDecode } from "jwt-decode";
import { createSocket  } from "../../socket";

const API_URL = import.meta.env.VITE_BACKEND_URL;


export const Chat = () => {
    const { store } = useGlobalReducer();

    const [messages, setMessages] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [targetId, setTargetId] = useState(null);
    const [text, setText] = useState("");
    const currentRoomRef = useRef(null);

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

    const targetRole = myRole === "client" ? "company" : "client";

    const token = store.tokenClient || store.company_token;

    const socket = useMemo(() => {
        if (!token) return null;
        return createSocket(token);
     }, [token]);

    /* ===== LOAD CONTACTS ===== */

    const loadContacts = async () => {
    if (!myId || !myRole) return;

    if (myRole === "client") {

        const resp = await fetch(`${API_URL}api/companies`);
        const data = resp.ok ? await resp.json() : [];

        setContacts(data);

        if (data.length > 0 && !targetId) {
            setTargetId(data[0].id);
        }

    } else {

        const data = await chatAPI.getContacts(myId, myRole);

        setContacts(data);

        if (data.length > 0 && !targetId) {
            setTargetId(data[0].id);
        }
    }
};

    /* ===== LOAD CONVERSATION ===== */

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

    useEffect(() => {
        loadContacts();
    }, [myId]);

    useEffect(() => {
        setMessages([]);
        loadChat();
    }, [targetId, myId]);

    
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

    /* ===== RENDER ===== */

    return (
        <div className="container-fluid mt-3">
            <div className="row vh-75" style={{ height: "80vh" }}>

                {/* LEFT PANEL - ROOMS */}
                <div className="col-md-4 col-lg-3 border-end bg-light d-none d-md-block">
                    <div className="p-3 border-bottom fw-bold">
                        Conversaciones
                    </div>

                    <div className="list-group list-group-flush">
                        {contacts.map(c => (
                            <button
                                key={`${c.id}-${c.role}`}
                                onClick={() => setTargetId(c.id)}
                                className={`list-group-item list-group-item-action ${targetId === c.id ? "active" : ""
                                    }`}
                            >

                                <div className="d-flex align-items-center gap-2">

                                    <img
                                        src={c.photo_url || "https://via.placeholder.com/32"}
                                        alt="avatar"
                                        width="32"
                                        height="32"
                                        className="rounded-circle"
                                        style={{ objectFit: "cover" }}
                                    />

                                    <div className="text-truncate">
                                        {c.email || c.name}                                
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
                        {contacts.find(c => c.id === targetId)?.email ||
                            contacts.find(c => c.id === targetId)?.name ||
                            "Selecciona conversación"}
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