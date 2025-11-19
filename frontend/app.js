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

if (window.location.pathname.endsWith("files.html")) {
    loadFiles();
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}
