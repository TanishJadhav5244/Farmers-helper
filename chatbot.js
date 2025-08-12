
// Toggle chat window
document.getElementById('chat-icon').addEventListener('click', () => {
    const win = document.getElementById('chat-window');
    win.style.display = (win.style.display === 'none' || win.style.display === '') ? 'flex' : 'none';
});

// Append message to chat
function appendMessage(text, sender) {
    const messages = document.getElementById('messages');
    const div = document.createElement('div');
    div.className = 'msg ' + sender;
    div.textContent = (sender === 'user' ? 'You: ' : 'Bot: ') + text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

// Send message to backend
async function sendMessage() {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if (!msg) return;
    appendMessage(msg, 'user');
    input.value = '';
    appendMessage('...', 'bot'); // loading placeholder

    try {
        const res = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: msg })
        });
        const data = await res.json();
        document.getElementById('messages').lastChild.remove(); // remove "..."
        appendMessage(data.reply || 'No reply received', 'bot');
    } catch (err) {
        document.getElementById('messages').lastChild.remove();
        appendMessage('Error contacting chatbot API', 'bot');
    }
}

// Button and Enter key
document.getElementById('chat-send').addEventListener('click', sendMessage);
document.getElementById('chat-input').addEventListener('keypress', e => {
    if (e.key === 'Enter') sendMessage();
});
