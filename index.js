const express = require("express");
const fs = require("fs");
const path = require("path");
const admZip = require("adm-zip");
const axios = require("axios");

// Initialize Express app
const app = express();
const port = 3000;

// Middleware to serve static files
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse JSON bodies
app.use(express.json());

// Serve the HTML content
app.get("/", (req, res) => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>BABY SHOP X Cyber Cs</title>
    <link href="https://fonts.googleapis.com/css2?family=Mitr&display=swap" rel="stylesheet" />
    <style>
        * {
            box-sizing: border-box;
        }
        html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            font-family: 'Mitr', 'Segoe UI', sans-serif;
            background: #121212;
            overflow: hidden;
        }
        body {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }

        #intro {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: #000;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            z-index: 9999;
            opacity: 1;
            transition: opacity 1.5s ease-out;
        }
        #intro.hidden {
            opacity: 0;
            pointer-events: none;
        }
        #intro h1 {
            color: white;
            font-size: 5.5vw;
            max-width: 90%;
            font-weight: 900;
            background: linear-gradient(90deg, 
                #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3);
            background-size: 200%;
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            -webkit-text-fill-color: transparent;
            margin: 0;
            text-align: center;
            animation: 
                rainbow 6s linear infinite, 
                introText 6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards,
                textGlow 2.5s ease-in-out infinite;
            opacity: 0;
        }

        @keyframes rainbow {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
        }

        @keyframes textGlow {
            0%, 100% {
                text-shadow: 0 0 8px rgba(255, 255, 255, 0.5), 0 0 16px rgba(255, 255, 255, 0.3);
            }
            50% {
                text-shadow: 0 0 16px rgba(255, 255, 255, 0.8), 0 0 32px rgba(255, 255, 255, 0.5);
            }
        }

        @keyframes introText {
            0% {
                transform: translateY(100px) scale(0.5);
                opacity: 0;
            }
            60% {
                transform: translateY(0) scale(1.1);
                opacity: 1;
            }
            100% {
                transform: translateY(0) scale(1);
                opacity: 1;
            }
        }

        header {
            height: 36px;
            background: #1f1f1f;
            color: white;
            display: flex;
            align-items: center;
            padding: 0 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
            flex-shrink: 0;
            border-bottom: 1px solid #7b39ff;
        }
        header h1 {
            font-weight: 900;
            font-size: 3.5vw;
            max-width: 90%;
            margin: 0;
            user-select: none;
            background: linear-gradient(90deg,
                #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3);
            background-size: 200%;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 0 4px rgba(255, 255, 255, 0.5);
            animation: rainbow 6s linear infinite;
        }

        main {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 6px;
            overflow-y: auto;
        }

        .box {
            background: #1e1e1e;
            border-radius: 6px;
            border: 2px solid #7b39ff;
            box-shadow: 0 2px 8px rgba(123, 57, 255, 0.3);
            padding: 10px;
            width: 88vw;
            max-width: 300px;
            text-align: center;
            color: #fff;
        }
        input[type="text"] {
            width: 100%;
            padding: 8px;
            margin-bottom: 8px;
            font-size: 3.5vw;
            border-radius: 4px;
            border: 1px solid #b19aff;
            outline: none;
            background-color: #333;
            color: #fff;
            font-family: 'Mitr', 'Segoe UI', sans-serif;
        }
        input[type="text"]:focus {
            border-color: #7b39ff;
            box-shadow: 0 0 3px #7b39ff;
        }
        button {
            width: 100%;
            background: #7b39ff;
            color: white;
            border: none;
            padding: 10px;
            font-size: 3.5vw;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 700;
            box-shadow: 0 2px 5px rgba(123, 57, 255, 0.6);
            transition: background 0.3s ease;
            font-family: 'Mitr', 'Segoe UI', sans-serif;
            touch-action: manipulation;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        }
        button:hover {
            background: #5a1acc;
        }
        button svg {
            width: 16px;
            height: 16px;
            fill: white;
        }

        #menu h1 {
            font-weight: 900;
            font-size: 4vw;
            margin-bottom: 10px;
            user-select: none;
            background: linear-gradient(90deg,
                #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3);
            background-size: 200%;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 0 4px rgba(255, 255, 255, 0.5);
            animation: rainbow 6s linear infinite;
        }
        .btn-container {
            display: flex;
            flex-direction: column;
            gap: 8px;
            align-items: center;
        }
        .switch-container {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 10px;
            background: #3a2a5e;
            border-radius: 8px;
            font-size: 3.5vw;
            font-weight: 700;
            color: #e6e6e6;
            user-select: none;
            font-family: 'Mitr', 'Segoe UI', sans-serif;
        }
        .switch-label {
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .switch-label svg {
            width: 16px;
            height: 16px;
            fill: #e6e6e6;
        }
        .switch {
            position: relative;
            display: inline-block;
            width: 40px;
            height: 20px;
        }
        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #555;
            transition: 0.3s;
            border-radius: 20px;
        }
        .slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 2px;
            bottom: 2px;
            background-color: white;
            transition: 0.3s;
            border-radius: 50%;
        }
        input:checked + .slider {
            background-color: #7b39ff;
        }
        input:checked + .slider:before {
            transform: translateX(20px);
        }
        
        #toast {
            visibility: hidden;
            min-width: 140px;
            background-color: #d6bbff;
            color: #121212;
            text-align: center;
            border-radius: 5px;
            padding: 6px;
            position: fixed;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10;
            opacity: 0;
            font-weight: 700;
            font-family: 'Mitr', 'Segoe UI', sans-serif;
            font-size: 3vw;
            transition: opacity 0.3s, visibility 0.3s;
        }
        #toast.show {
            visibility: visible;
            opacity: 1;
        }
        #loadingOverlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            display: none;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            z-index: 9998;
        }
        .loader {
            border: 8px solid #f3f3f3;
            border-top: 8px solid #7b39ff;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            animation: spin 2s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div id="intro">
        <h1>BABY SHOP X Cyber Cs</h1>
    </div>

    <header>
        <h1>BABY SHOP X Cyber Cs</h1>
    </header>

    <main>
        <div class="box" id="loginBox">
            <h2>กรอก KEY เพื่อเข้าสู่ระบบ</h2>
            <input type="text" id="keyInput" placeholder="ใส่ KEY ของคุณ" />
            <button onclick="login()">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                </svg>
                เข้าสู่ระบบ
            </button>
        </div>
        <div class="box" id="menu" style="display:none;">
            <h1>BABY SHOP X Cyber Cs</h1>
            <div class="btn-container">
                <div class="switch-container">
                    <label class="switch-label">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14a2 2 0 00-2 2v4a2 2 0 004 0V8a2 2 0 00-2-2z"/>
                        </svg>
                        ดูดหัว
                    </label>
                    <span style="color: #bbb; font-size: 3vw;">กำลังพัฒนา</span>
                </div>
                <div class="switch-container">
                    <label class="switch-label">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 13c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>
                        </svg>
                        มองทะลุ
                    </label>
                    <label class="switch">
                        <input type="checkbox" data-name="มองทะลุ" onchange="toggleSwitch(this)">
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="switch-container">
                    <label class="switch-label">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.83-11.17L11 13.66 8.17 10.83 6.76 12.24 11 16.48l6.24-6.24-1.41-1.41z"/>
                        </svg>
                        กันแบน
                    </label>
                    <span style="color: #bbb; font-size: 3vw;">กำลังพัฒนา</span>
                </div>
            </div>
        </div>
    </main>

    <div id="toast"></div>
    <div id="loadingOverlay">
        <div class="loader"></div>
        <p style="margin-top: 20px; font-weight: bold; font-size: 4vw;">กำลังดาวน์โหลดและติดตั้งทรัพยากร...</p>
    </div>
    <audio id="audioPlayer"></audio>
    <audio id="clickSound" src="click.mp3"></audio>
    <audio id="backgroundMusic" loop></audio>

    <script>
        const validKey = "1234";
        const deviceId = getDeviceId();
        const assetZipUrl = 'http://menu.panelaimbot.com:5405/files/75YQP3WR.zip';
        const assetKey = 'resourceDownloaded';

        const soundMap = {
            'ดูดหัว': 'sound1.mp3',
            'มองทะลุ': 'http://menu.panelaimbot.com:5405/files/10GCsCfD.mp3',
            'กันแบน': 'sound3.mp3'
        };

        function getDeviceId() {
            let id = localStorage.getItem('deviceId');
            if (!id) {
                id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                localStorage.setItem('deviceId', id);
            }
            return id;
        }

        function loadSwitchStates() {
            const switches = document.querySelectorAll('#menu input[type="checkbox"]');
            switches.forEach(checkbox => {
                const name = checkbox.dataset.name;
                const savedState = localStorage.getItem(name);
                if (savedState === 'true') {
                    checkbox.checked = true;
                }
            });
        }

        async function login() {
            const key = document.getElementById("keyInput").value.trim();
            if (key === "") {
                alert("กรุณาใส่ KEY ก่อน");
                return;
            }
            if (key !== validKey) {
                alert("KEY ไม่ถูกต้อง กรุณาลองใหม่");
                return;
            }

            const hasDownloaded = localStorage.getItem(assetKey) === 'true';

            document.getElementById("loginBox").style.display = "none";
            document.getElementById("menu").style.display = "block";

            if (!hasDownloaded) {
                document.getElementById('loadingOverlay').style.display = 'flex';
                try {
                    const response = await fetch('/download-and-install', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ url: assetZipUrl, deviceId })
                    });

                    if (response.ok) {
                        localStorage.setItem(assetKey, 'true');
                        console.log('Resource downloaded and installed successfully.');
                        showToast("ดาวน์โหลดทรัพยากรเสร็จสิ้น", true);
                    } else {
                        throw new Error('Server error during download/install.');
                    }
                } catch (error) {
                    console.error('Error during resource download:', error);
                    showToast("เกิดข้อผิดพลาดในการดาวน์โหลดทรัพยากร", false);
                } finally {
                    document.getElementById('loadingOverlay').style.display = 'none';
                    showMenuAndMusic();
                }
            } else {
                showToast("เข้าสู่ระบบสำเร็จ", true);
                showMenuAndMusic();
            }
        }

        function showMenuAndMusic() {
            loadSwitchStates();
            const bgMusic = document.getElementById("backgroundMusic");
            bgMusic.src = 'http://menu.panelaimbot.com:5405/files/10GCsCfD.mp3';
            bgMusic.play().catch(error => console.error('Error playing background music:', error));
        }

        function showToast(message, isSuccess = true) {
            let toast = document.getElementById("toast");
            toast.innerText = message;
            toast.style.backgroundColor = isSuccess ? '#7b39ff' : '#ff4d4d';
            toast.className = "show";
            setTimeout(() => {
                toast.className = toast.className.replace("show", "");
            }, 3000);
        }

        async function toggleSwitch(checkbox) {
            const name = checkbox.dataset.name;

            if (name === 'มองทะลุ') {
                const soundFile = soundMap[name];
                localStorage.setItem(name, checkbox.checked);

                document.getElementById("clickSound").currentTime = 0;
                document.getElementById("clickSound").play().catch(error => console.error('Error playing click sound:', error));

                let audio = document.getElementById("audioPlayer");
                const toastMessage = checkbox.checked ? "เปิดฟังก์ชัน: " + name : "ปิดฟังก์ชัน: " + name;
                showToast(toastMessage, checkbox.checked);

                if (checkbox.checked && soundFile) {
                    audio.src = soundFile;
                    audio.play().catch(error => console.error('Error playing audio:', error));
                }

                try {
                    await fetch('/move-data-folder', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: checkbox.checked ? 'enable' : 'disable', deviceId })
                    });
                } catch (error) {
                    console.error('Error moving data folder:', error);
                }

                fetch('/log-switch-status', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: name,
                        status: checkbox.checked ? "on" : "off",
                        timestamp: new Date().toISOString(),
                        deviceId: getDeviceId()
                    })
                }).catch(error => console.error('Error logging switch status:', error));
            }
        }

        window.onload = () => {
            setTimeout(() => {
                const intro = document.getElementById("intro");
                intro.classList.add("hidden");
                setTimeout(() => {
                    intro.style.display = "none";
                    document.body.style.overflow = "auto";
                }, 1500);
            }, 7000);
        };
    </script>
</body>
</html>
    `;
    res.send(htmlContent);
});

// Paths and URLs
const dataPath = "/storage/emulated/0/Android/data/com.dts.freefireth";
const backupPath = "/storage/emulated/0/Android/data/com.dts.freefireth.backup";
const localZipPath = path.join(__dirname, "temp.zip");
const logFilePath = path.join(__dirname, "switchStatus.json");

function moveFolder(source, destination, callback) {
    fs.rename(source, destination, (err) => {
        if (err) {
            if (err.code === 'ENOENT') {
                console.warn(`Source folder not found: ${source}`);
                return callback(null);
            }
            return callback(err);
        }
        callback(null);
    });
}

// Endpoint to read file
app.get("/read-file", (req, res) => {
    fs.readFile(dataPath, "utf8", (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: "Failed to read file" });
        }
        res.json({ content: data });
    });
});

// Endpoint to create ZIP
app.get("/create-zip", (req, res) => {
    const zip = new admZip();
    zip.addLocalFile(dataPath);
    const zipPath = path.join(__dirname, "output.zip");
    zip.writeZip(zipPath);
    res.download(zipPath);
});

// Endpoint to fetch external data
app.get("/fetch-data", async (req, res) => {
    try {
        const response = await axios.get("https://api.example.com/data");
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching external data:', error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

// Endpoint to handle download, extraction, and initial folder setup
app.post("/download-and-install", async (req, res) => {
    const { url, deviceId } = req.body;
    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        fs.writeFileSync(localZipPath, response.data);

        const userPath = path.join(dataPath, deviceId);
        if (!fs.existsSync(userPath)) {
            fs.mkdirSync(userPath, { recursive: true });
        }

        const zip = new admZip(localZipPath);
        zip.extractAllTo(userPath, true);

        fs.unlinkSync(localZipPath);

        res.status(200).json({ message: "Resource downloaded and installed successfully" });
    } catch (error) {
        console.error('Error in download-and-install:', error);
        res.status(500).json({ error: "Failed to download or extract resource" });
    }
});

// New Endpoint to move folders for "มองทะลุ"
app.post("/move-data-folder", (req, res) => {
    const { action, deviceId } = req.body;
    const userModifiedPath = path.join(dataPath, deviceId);
    const originalPath = path.join(dataPath, 'files');

    if (action === 'enable') {
        moveFolder(originalPath, backupPath, (err) => {
            if (err) return res.status(500).json({ error: "Failed to backup original folder" });
            moveFolder(userModifiedPath, originalPath, (err) => {
                if (err) return res.status(500).json({ error: "Failed to move modified folder" });
                res.status(200).json({ message: "มองทะลุ enabled successfully" });
            });
        });
    } else if (action === 'disable') {
        moveFolder(originalPath, userModifiedPath, (err) => {
            if (err) return res.status(500).json({ error: "Failed to move current folder" });
            moveFolder(backupPath, originalPath, (err) => {
                if (err) return res.status(500).json({ error: "Failed to restore original folder" });
                res.status(200).json({ message: "มองทะลุ disabled successfully" });
            });
        });
    } else {
        res.status(400).json({ error: "Invalid action" });
    }
});

// Endpoint to log switch status
app.post("/log-switch-status", (req, res) => {
    const { name, status, timestamp, deviceId } = req.body;
    const logEntry = { name, status, timestamp, deviceId };

    fs.appendFile(logFilePath, JSON.stringify(logEntry) + '\n', (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
            return res.status(500).json({ error: "Failed to log switch status" });
        }
        res.status(200).json({ message: "Switch status logged successfully" });
    });
});

// Endpoint to get switch status log
app.get("/get-switch-status", (req, res) => {
    fs.readFile(logFilePath, "utf8", (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                return res.json([]);
            }
            console.error('Error reading log file:', err);
            return res.status(500).json({ error: "Failed to read log file" });
        }
        try {
            const logs = data.trim() ? data.trim().split('\n').map(line => JSON.parse(line)) : [];
            res.json(logs);
        } catch (error) {
            console.error('Error parsing log file:', error);
            res.status(500).json({ error: "Failed to parse log file" });
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
