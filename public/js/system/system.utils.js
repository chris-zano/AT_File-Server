const initiatePostRequest = async (url= "", options = {}) => {
    if ((Object.keys(options).length === 0) || !url) {
        return {status: 400, doc: {}};
    }

    const response = await fetch(
        `${url.trim()}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(options)
        }
    );

    const data = await response.json();

    return {status: response.status, doc: data};
}

const initiateGetRequest = async (url= "") => {
    if (!url) {
        return {status: 400, doc: {}};
    }

    const response = await fetch(`${url.trim()}`);

    const data = await response.json();

    return {status: response.status, doc: data};
}

const getId = (id) => {
    return document.getElementById(id);
}
