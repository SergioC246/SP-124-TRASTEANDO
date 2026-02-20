const API_URL = import.meta.env.VITE_BACKEND_URL;

export const chatAPI = {
    send: async (data) => {
        const resp = await fetch(`${API_URL}api/messages`, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(data)
    });
    return resp.ok ? await resp.json() : null;
 },

getConversation: async (myId, myRole, targetId, targetRole) => {
    const resp = await fetch(
        `${API_URL}api/messages/conversation/${myId}/${myRole}/${targetId}/${targetRole}`
    );
    return resp.ok ? await resp.json() : [];
},

getContacts: async (myId, myRole) => {
    const resp = await fetch(
        `${API_URL}api/messages/contacts/${myId}/${myRole}`
    );

    return resp.ok ? await resp.json() : [];
}

};