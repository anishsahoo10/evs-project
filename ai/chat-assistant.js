// AI Chat Assistant Functions
let chatOpen = false;

function toggleChat() {
    const chatBody = document.getElementById('chatBody');
    const toggleIcon = document.getElementById('chatToggleIcon');
    
    chatOpen = !chatOpen;
    
    if (chatOpen) {
        chatBody.style.display = 'flex';
        toggleIcon.className = 'fas fa-chevron-down';
    } else {
        chatBody.style.display = 'none';
        toggleIcon.className = 'fas fa-chevron-up';
    }
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

async function sendChatMessage() {
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Add user message
    const userMessage = document.createElement('div');
    userMessage.className = 'chat-message user-message';
    userMessage.innerHTML = `
        <div class="message-content">
            <div class="message-text">${message}</div>
        </div>
        <div class="message-avatar">👤</div>
    `;
    chatMessages.appendChild(userMessage);
    
    // Clear input
    chatInput.value = '';
    
    // Add loading message
    const loadingMessage = document.createElement('div');
    loadingMessage.className = 'chat-message ai-message';
    loadingMessage.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            <div class="message-text">Thinking... 🌱</div>
        </div>
    `;
    chatMessages.appendChild(loadingMessage);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    try {
        // Get user's garden context
        const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js');
        const user = window.auth?.currentUser;
        
        let gardenContext = 'No plants in garden yet';
        if (user) {
            const gardenDoc = await getDoc(doc(window.db, 'gardens', user.uid));
            if (gardenDoc.exists()) {
                const plants = gardenDoc.data().plants || [];
                gardenContext = `User's plants: ${plants.map(p => p.name).join(', ')}`;
            }
        }
        
        const prompt = `You are an expert gardening assistant. User's question: "${message}". Context: ${gardenContext}. Provide helpful, specific gardening advice. Keep response concise but informative.`;
        
        const aiResponse = await callGeminiAPI(prompt);
        
        // Replace loading message with AI response
        loadingMessage.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <div class="message-text">${aiResponse}</div>
            </div>
        `;
        
    } catch (error) {
        console.error('Chat error:', error);
        loadingMessage.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <div class="message-text">Sorry, I'm having trouble right now. Please try again!</div>
            </div>
        `;
    }
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}