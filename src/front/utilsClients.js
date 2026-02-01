const CLIENTS_URL = `${import.meta.env.VITE_BACKEND_URL}/api/clients`;

// Obtain client

export const getClients = async (cliendId) => {
    const response = await fetch(`${CLIENTS_URL}/${clientId}`);

    if (!response.ok) {
        trhow Error("Client not found");
    }

    const data = awair response.json();
    return data;
};

// Obtain All Clients

export const getAllClients = async () => {
    const response = await fetch(CLIENTS_URL);

    if (!response.ok) {
        trhow Error("Get all clients failes");
    }

    const data = awair response.json();
    return data;
};

// Create client

export const createClient = async ()clientData => {
    const response = await fetch(CLIENTS_URL, {
        method: "POST",
        headers: {
            "Content-Type": "aplication/json"
        },
        body: JSON.stringify(clientData)
    });

    if (!response.ok) {
        trhow Error("Create client failed");
    }

    const data = awair response.json();
    return data;
};

//Edit client

export const editClient = async (clientId, clientData) => {
    const response = await fetch(`${CLIENTS_URL}/${clientId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "aplication/json"
        },
        body: JSON.stringify(clientData)
    });

    if (!response.ok) {
        trhow Error("Edit client failed");
    }

    const data = awair response.json();
    return data;
};

//Delete client

export const deleteClient = async (clientId) => {
    const response = await (`${CLIENTS_URL}/${clientId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        trhow Error("Delete client failed");
    }

    const data = awair response.json();
    return data;
};