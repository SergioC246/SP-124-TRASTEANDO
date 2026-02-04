const STORAGES_URL = `${import.meta.env.VITE_BACKEND_URL}api/storage`;

// Get one storage

export const getStorage = async (storageId) => {
    const response = await fetch(`${STORAGES_URL}/${storageId}`);

    if (!response.ok) {
        throw new  Error("Storage not found");
    }

    const data = await response.json();
    return data;
};

// Get All Storages

export const getAllStorages = async () => {
    const response = await fetch(STORAGES_URL);

    if (!response.ok) {
        throw new  Error("Get all storages failed");
    }

    const data = await response.json();
    return data;
};

// Create storage

export const createStorage = async (storageData) => {
    console.log(storageData)
    const response = await fetch(STORAGES_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(storageData)
    });

    console.log(response)
    // if (!response.ok) {
    //     throw new  Error("Create storage failed");
    // }

    // const data = await response.json();
    // return data;
};

// Edit storage

export const editStorage = async (storageId, storageData) => {
    const response = await fetch(`${STORAGES_URL}/${storageId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(storageData)
    });

    if (!response.ok) {
        throw new  Error("Edit storage failed");
    }

    const data = await response.json();
    return data;
};

// Delete storage

export const deleteStorage = async (storageId) => {
    const response = await fetch(`${STORAGES_URL}/${storageId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new  Error("Delete storage failed");
    }

    const data = await response.json();
    return data;
};