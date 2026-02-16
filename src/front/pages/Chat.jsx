import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { chatAPI } from "./utilsChat";
import { jwtDecode } from "jwt-decode";

const API_URL = import.meta.env.VITE_BACKEND_URL;


export const Chat = () => {
    const { store } = useGlobalReducer();

    const [messages, setMessages] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [targetId, setTargetId] = useState(null);
    const [text, setText] = useState("");

    /* ===== USER ===== */

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

    /* ===== LOAD CONTACTS ===== */

    const loadContacts = async () => {
    if (!myId || !myRole) return;

    console.log("LOAD CONTACTS RUNNING");
    console.log("MY ID:", myId);
    console.log("MY ROLE:", myRole);

    if (myRole === "client") {

        const resp = await fetch(`${API_URL}api/companies`);
        const data = resp.ok ? await resp.json() : [];

        console.log("CONTACTS RESPONSE:", data);

        setContacts(data);

        if (data.length > 0 && !targetId) {
            setTargetId(data[0].id);
        }

    } else {

        const data = await chatAPI.getContacts(myId, myRole);

        console.log("CONTACTS RESPONSE:", data);

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
        loadChat();
    }, [targetId]);

    /* ===== POLLING V2 ===== */

    useEffect(() => {
        if (!targetId) return;

        const interval = setInterval(() => {
            loadChat();
        }, 4000);

        return () => clearInterval(interval);
    }, [targetId]);

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
            setMessages(prev => [...prev, sent]);
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