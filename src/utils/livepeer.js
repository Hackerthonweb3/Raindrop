import { livepeerAPI } from "./constants";

export const getUploadURL = async () => {
    const response = await fetch(
        "https://livepeer.studio/api/asset/request-upload",
        {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${livepeerAPI}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: "Raindrop File FIRST",
            }),
        }
    );

    console.log('Response', response);

    const { url, asset } = await response.json();

    return { url, asset };
}

export const uploadFile = async (url, file) => {

    if (!url) { return }

    const res = await fetch(url, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${livepeerAPI}`,
            "Content-Type": "video/mp4"
        },
        body: file
    });

    console.log('Livepeer uploaded, response:', res);
}

export const getFileStatus = async (id) => {
    const response = await fetch(`https://livepeer.studio/api/asset/${id}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${livepeerAPI}`,
        },
    });

    const { status } = response.json();

    console.log(status);
    return (status);
}