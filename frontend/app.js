// CONFIG — update if your backend URL changes
const BASE_URL = "https://cloudshare-production-eb41.up.railway.app";

// Helper - log wrapper
const debug = (...args) => {
    if (window.console) console.log("[CloudShare]", ...args);
};

// Utility to get stored token
function getToken() {
    return localStorage.getItem("access") || localStorage.getItem("token");
}

// Attach login handler (avoids inline onclick issues)
document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("loginBtn");
    if (loginBtn) {
        loginBtn.addEventListener("click", (e) => login(e));
    }
});

// LOGIN
async function login(event) {
    try {
        if (event && event.preventDefault) event.preventDefault();
        debug("login() called");

        const username = document.getElementById("username")?.value?.trim();
        const password = document.getElementById("password")?.value?.trim();
        const msgEl = document.getElementById("msg");

        msgEl.textContent = "";

        if (!username || !password) {
            msgEl.textContent = "Please enter username and password.";
            return;
        }

        const res = await fetch(`${BASE_URL}/api/token/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        debug("token response status:", res.status);
        const data = await res.json().catch(() => null);
        debug("token response data:", data);

        if (!res.ok) {
            msgEl.textContent = (data && (data.detail || data.error)) || "Login failed";
            return;
        }

        // store tokens consistently
        if (data.access) {
            localStorage.setItem("access", data.access);
        }
        if (data.refresh) {
            localStorage.setItem("refresh", data.refresh);
        }

        // final check
        if (!getToken()) {
            msgEl.textContent = "No access token returned.";
            return;
        }

        debug("login success, redirecting to upload.html");
        window.location.href = "upload.html";
    } catch (err) {
        console.error(err);
        const msgEl = document.getElementById("msg");
        if (msgEl) msgEl.textContent = "An error occurred while logging in.";
    }
}

// UPLOAD
async function uploadFile() {
    try {
        const fileInput = document.getElementById("fileInput");
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            alert("Please choose a file first.");
            return;
        }
        const file = fileInput.files[0];
        const token = getToken();
        if (!token) { alert("Not authenticated"); window.location.href = "index.html"; return; }

        const fd = new FormData();
        fd.append("file", file);

        const res = await fetch(`${BASE_URL}/api/files/upload/`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` },
            body: fd
        });

        const data = await res.json().catch(()=>null);
        debug("upload response", res.status, data);

        if (!res.ok) {
            alert("Upload failed: " + (data && (data.error || JSON.stringify(data)) || res.status));
            return;
        }
        alert("Upload successful");
        window.location.href = "files.html";
    } catch (err) {
        console.error(err);
        alert("Upload failed (see console)");
    }
}

// LOAD FILES
async function loadFiles() {
    try {
        const token = getToken();
        if (!token) { window.location.href = "index.html"; return; }

        const res = await fetch(`${BASE_URL}/api/files/list/`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        debug("loadFiles status:", res.status);
        const files = await res.json().catch(()=>null);
        debug("files:", files);

        if (!res.ok) {
            const errMsg = (files && (files.detail || JSON.stringify(files))) || "Failed to load files";
            document.getElementById("filesMsg").textContent = errMsg;
            return;
        }

        const tbody = document.querySelector("#fileTable tbody");
        tbody.innerHTML = "";

        if (!files || files.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4">No files uploaded yet.</td></tr>`;
            return;
        }

        files.forEach(f => {
            const tr = document.createElement("tr");

            const nameTd = document.createElement("td");
            nameTd.textContent = f.file_name || f.original_name || f.file?.split('/').pop() || "unknown";
            tr.appendChild(nameTd);

            const sizeTd = document.createElement("td");
            sizeTd.textContent = f.size ? (f.size/1024).toFixed(1) : "-";
            tr.appendChild(sizeTd);

            const dateTd = document.createElement("td");
            dateTd.textContent = f.uploaded_at ? new Date(f.uploaded_at).toLocaleString() : "-";
            tr.appendChild(dateTd);

            const actionTd = document.createElement("td");
            const delBtn = document.createElement("button");
            delBtn.textContent = "Delete";
            delBtn.addEventListener("click", () => deleteFile(f.id));
            actionTd.appendChild(delBtn);

            // download link
            if (f.file) {
                const a = document.createElement("a");
                a.href = `${BASE_URL}${f.file}`;
                a.textContent = " Download";
                a.style.marginLeft = "8px";
                a.setAttribute("target","_blank");
                actionTd.appendChild(a);
            }

            tr.appendChild(actionTd);
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error(err);
        document.getElementById("filesMsg").textContent = "Failed to load files (see console).";
    }
}

// DELETE
async function deleteFile(id) {
    if (!confirm("Delete this file?")) return;
    try {
        const token = getToken();
        const res = await fetch(`${BASE_URL}/api/files/delete/${id}/`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) {
            const err = await res.json().catch(()=>null);
            alert("Delete failed: " + (err && (err.error || JSON.stringify(err)) || res.status));
            return;
        }
        alert("File deleted");
        loadFiles();
    } catch (err) {
        console.error(err);
        alert("Delete failed (see console).");
    }
}

// LOGOUT
function logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("token");
    window.location.href = "index.html";
}
