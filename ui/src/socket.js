import { io } from 'socket.io-client';

// In a Docker Compose setup, 'localhost:5000' works because the 
// browser (on your host machine) maps to the container's exposed port.
const URL = "http://localhost:5000";

export const socket = io(URL, {
    autoConnect: false, // We manually connect when the app loads
    transports: ['websocket'], // Forces WebSocket for better performance/flow
    reconnectionAttempts: 5,
    timeout: 10000,
});

// Helpful for debugging connection issues in the UI folder
socket.on("connect", () => {
    console.log("Connected to Backend ID:", socket.id);
});

socket.on("connect_error", (err) => {
    console.error("Connection failed. Is the backend container running?", err.message);
});