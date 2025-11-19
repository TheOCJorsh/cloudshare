const BASE_URL = "https://cloudshare-jrla.onrender.com";

function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    fetch(`${BASE_URL}/api/token/`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username, password})
    })
    .then(res => res.json())
    .then(data => {
        if (data.access) {
            localStorage.setItem("token", data.access);
            window.location.href = "upload.html";
        } else {
            document.getElementById("msg").innerText = "Invalid login!";
        }
    });
}

async function login(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch("https://cloudshare-jrla.onrender.com/api/token/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    });

    const data = await response.json();

    if (response.ok) {
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        window.location.href = "upload.html";
    } else {
        alert("Login failed");
    }
}

function uploadFile() {
    let fileInput = document.getElementById("fileInput");
    let token = localStorage.getItem("token");

    if (!fileInput.files.length) {
        alert("Please select a file.");
        return;
    }

    let formData = new FormData();
    formData.append("file", fileInput.files[0]);

    fetch(`${BASE_URL}/api/files/upload/`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById("msg").innerText = "Upload successful!";
    });
}

async function uploadFile() {
    const file = document.getElementById("fileInput").files[0];
    if (!file) {
        alert("Select a file first!");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("access");

    const response = await fetch("https://cloudshare-jrla.onrender.com/api/files/upload/", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: formData
    });

    const data = await response.json();
    if (response.ok) {
        alert("File uploaded!");
        window.location.href = "files.html";
    } else {
        alert("Upload failed: " + JSON.stringify(data));
    }
}

function loadFiles() {
    let token = localStorage.getItem("token");

    fetch(`${BASE_URL}/api/files/list/`, {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(files => {
        let list = document.getElementById("fileList");
        list.innerHTML = "";

        files.forEach(file => {
            let li = document.createElement("li");
            li.innerHTML = `
                ${file.original_name}
                <a href="${BASE_URL}${file.file}" download>Download</a>
            `;
            list.appendChild(li);
        });
    });
}

async function loadFiles() {
    const token = localStorage.getItem("access");

    const response = await fetch("https://cloudshare-jrla.onrender.com/api/files/list/", {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const files = await response.json();

    const tableBody = document.querySelector("#fileTable tbody");
    tableBody.innerHTML = "";

    files.forEach(file => {
        const row = `
            <tr>
                <td>${file.file_name}</td>
                <td>${(file.size / 1024).toFixed(1)}</td>
                <td>
                    <button onclick="deleteFile(${file.id})">Delete</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

async function deleteFile(id) {
    const token = localStorage.getItem("access");

    const response = await fetch(`https://cloudshare-jrla.onrender.com/api/files/delete/${id}/`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (response.ok) {
        alert("File deleted");
        loadFiles();
    } else {
        alert("Failed to delete");
    }
}

if (window.location.pathname.endsWith("files.html")) {
    loadFiles();
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}

