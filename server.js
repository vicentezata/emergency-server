const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve the monitoring page
app.use(express.static(path.join(__dirname, "public")));

wss.on("connection", (ws) => {
    console.log("User connected.");

    ws.on("message", (message) => {
        console.log("Emergency Signal Received: " + message);
        
        // Send response back to the user
        ws.send("Emergency Received! Help is on the way.");

        // Broadcast the emergency message to all monitoring screens
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ alert: message }));
            }
        });
    });

    ws.on("close", () => console.log("User disconnected."));
});

server.listen(8080, () => console.log("Monitoring Base running on port 8080"));
