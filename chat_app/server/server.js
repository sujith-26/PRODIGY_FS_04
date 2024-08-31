const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const connectDB = require('./config');
const authRoutes = require('./auth');
const cookieParser = require('cookie-parser');

connectDB();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/api/auth', authRoutes);

let clients = [];

wss.on('connection', (ws) => {
    clients.push(ws);
    
    ws.on('message', (message) => {
        const parsedMessage = JSON.parse(message);
        clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(parsedMessage));
            }
        });
    });

    ws.on('close', () => {
        clients = clients.filter(client => client !== ws);
    });
});

server.listen(8080, () => {
    console.log('Server started on http://localhost:8080');
});
