let username;
let ws;

const usernameContainer = document.getElementById('username-container');
const usernameInput = document.getElementById('username-input');
const enterChatButton = document.getElementById('enter-chat-button');

const chatContainer = document.getElementById('chat-container');
const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

// Event listener for entering the chat
enterChatButton.addEventListener('click', () => {
    username = usernameInput.value.trim();
    if (username) {
        usernameContainer.style.display = 'none';
        chatContainer.style.display = 'block';

        ws = new WebSocket('ws://localhost:8080');

        ws.onmessage = (event) => {
            const messageData = JSON.parse(event.data);
            const message = document.createElement('div');
            
            if (messageData.username === username) {
                message.className = 'me';
                message.textContent = `me: ${messageData.message}`;
            } else {
                message.className = 'other';
                message.textContent = `${messageData.username}: ${messageData.message}`;
            }

            chatBox.appendChild(message);
            chatBox.scrollTop = chatBox.scrollHeight;
        };
    }
});

// Send message
sendButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
        const messageData = JSON.stringify({ username, message });
        ws.send(messageData);
        messageInput.value = '';
    }
});

messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendButton.click();
    }
});
