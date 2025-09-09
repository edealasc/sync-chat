(function () {
  // Prevent double-initialization
  if (window.__SyncChatWidgetLoaded) return
  window.__SyncChatWidgetLoaded = true

  // Inject marked.js if not present
  if (!window.marked) {
    const markedScript = document.createElement("script");
    markedScript.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";
    markedScript.onload = () => render();
    document.head.appendChild(markedScript);
  }

  // Styles
  const style = document.createElement("style")
  style.innerHTML = `
    .syncchat-widget-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      font-family: 'Segoe UI', Arial, sans-serif;
    }
    .syncchat-chatbox {
      width: 320px;
      height: 500px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.12);
      border-radius: 16px;
      background: #fff;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: syncchat-fadein 0.2s;
    }
    @keyframes syncchat-fadein { from { opacity: 0; } to { opacity: 1; } }
    .syncchat-header {
      padding: 16px;
      background: linear-gradient(to right, #a8c69f, #96b88a);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .syncchat-header-bot {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .syncchat-boticon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .syncchat-header-title {
      color: #fff;
      font-weight: 500;
      font-size: 14px;
    }
    .syncchat-header-status {
      color: rgba(255,255,255,0.8);
      font-size: 12px;
    }
    .syncchat-closebtn {
      background: none;
      border: none;
      color: #fff;
      font-size: 20px;
      cursor: pointer;
      padding: 4px;
      border-radius: 50%;
      transition: background 0.2s;
    }
    .syncchat-messages {
      flex: 1;
      padding: 16px;
      background: #f9fafb;
      overflow-y: auto;
    }
    .syncchat-msgrow {
      display: flex;
      align-items: flex-start;
      margin-bottom: 12px;
      gap: 8px;
    }
    .syncchat-msgrow.user {
      flex-direction: row-reverse;
    }
    .syncchat-msg-boticon {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: linear-gradient(to bottom right, #a8c69f, #96b88a);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .syncchat-msgbubble {
      border-radius: 8px;
      padding: 8px 12px;
      max-width: 200px;
      font-size: 14px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.04);
      background: #fff;
      color: #222;
      /* Markdown styles */
      word-break: break-word;
    }
    .syncchat-msgbubble.user {
      background: linear-gradient(to right, #a8c69f, #96b88a);
      color: #fff;
    }
    .syncchat-msgbubble a { color: #2563eb; text-decoration: underline; word-break: break-all; }
    .syncchat-msgbubble code { background: #f3f4f6; color: #222; padding: 2px 4px; border-radius: 4px; font-size: 13px; }
    .syncchat-msgbubble pre { background: #f3f4f6; padding: 8px; border-radius: 6px; overflow-x: auto; font-size: 13px; }
    .syncchat-typing {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .syncchat-typing-dots span {
      display: inline-block;
      width: 6px;
      height: 6px;
      background: #bbb;
      border-radius: 50%;
      margin-right: 2px;
      animation: syncchat-bounce 1s infinite;
    }
    .syncchat-typing-dots span:nth-child(2) { animation-delay: 0.2s; }
    .syncchat-typing-dots span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes syncchat-bounce {
      0%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-6px); }
    }
    .syncchat-inputbar {
      padding: 12px;
      border-top: 1px solid #eee;
      background: #fff;
      display: flex;
      gap: 8px;
    }
    .syncchat-input {
      flex: 1;
      font-size: 14px;
      padding: 8px 10px;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
      outline: none;
    }
    .syncchat-sendbtn {
      background: linear-gradient(to right, #a8c69f, #96b88a);
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 8px 16px;
      font-weight: 500;
      cursor: pointer;
      font-size: 14px;
    }
    .syncchat-togglebtn {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(to right, #a8c69f, #96b88a);
      color: #fff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.12);
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      cursor: pointer;
    }
  `
  document.head.appendChild(style)

  // Widget container
  const container = document.createElement("div")
  container.className = "syncchat-widget-container"
  document.body.appendChild(container)

  // Global safeguard: prevent any form submission inside widget
  container.addEventListener("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  });

  // Debug panel
  const debugDiv = document.createElement("div");
  debugDiv.style.position = "fixed";
  debugDiv.style.top = "0";
  debugDiv.style.left = "0";
  debugDiv.style.background = "#fff";
  debugDiv.style.zIndex = "99999";
  debugDiv.style.fontSize = "12px";
  debugDiv.style.padding = "4px 8px";
  debugDiv.style.border = "1px solid #ccc";
  debugDiv.textContent = "Debug:";
  document.body.appendChild(debugDiv);

  function logDebug(msg) {
    debugDiv.textContent = "Debug: " + msg;
  }

  // State
  let isOpen = false
  let messages = [
    { id: 1, text: "Hello! How can I help you today?", isBot: true }
  ]
  let isTyping = false
  let conversationId = null;

  // Bot responses
  const botResponses = [
    "That's a great question! Let me help you with that.",
    "I understand what you're looking for. Here's what I can suggest...",
    "Thanks for reaching out! I'm here to assist you.",
    "Let me think about that for a moment...",
    "I'd be happy to help you with that request!",
    "That's an interesting point. Here's my perspective...",
  ]

  // Render
  function render() {
    container.innerHTML = ""
    if (!isOpen) {
      // Toggle button
      const btn = document.createElement("button")
      btn.className = "syncchat-togglebtn"
      btn.innerHTML = `
        <svg width="28" height="28" fill="white" viewBox="0 0 24 24">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      `
      btn.onclick = () => { isOpen = true; render() }
      container.appendChild(btn)
      return
    }

    // Chatbox
    const chatbox = document.createElement("div")
    chatbox.className = "syncchat-chatbox"

    // Header
    const header = document.createElement("div")
    header.className = "syncchat-header"
    header.innerHTML = `
      <div class="syncchat-header-bot">
        <div class="syncchat-boticon">
          <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/>
            <rect x="9" y="8" width="6" height="8" rx="3" fill="#fff"/>
          </svg>
        </div>
        <div>
          <div class="syncchat-header-title">SyncChat AI</div>
          <div class="syncchat-header-status">Online</div>
        </div>
      </div>
      <button class="syncchat-closebtn" aria-label="Close chat">&#10005;</button>
    `
    header.querySelector(".syncchat-closebtn").onclick = () => { isOpen = false; render() }
    chatbox.appendChild(header)

    // Messages
    const msgArea = document.createElement("div")
    msgArea.className = "syncchat-messages"
    messages.forEach(msg => {
      const row = document.createElement("div")
      row.className = "syncchat-msgrow" + (msg.isBot ? "" : " user")
      if (msg.isBot) {
        const botIcon = document.createElement("div")
        botIcon.className = "syncchat-msg-boticon"
        botIcon.innerHTML = `<svg width="14" height="14" fill="white" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>`
        row.appendChild(botIcon)
      }
      const bubble = document.createElement("div")
      bubble.className = "syncchat-msgbubble" + (msg.isBot ? "" : " user")
      // Markdown rendering
      if (window.marked) {
        bubble.innerHTML = window.marked.parse(msg.text || "");
      } else {
        bubble.textContent = msg.text;
      }
      row.appendChild(bubble)
      msgArea.appendChild(row)
    })
    if (isTyping) {
      const typingRow = document.createElement("div")
      typingRow.className = "syncchat-typing"
      typingRow.innerHTML = `
        <div class="syncchat-msg-boticon">
          <svg width="14" height="14" fill="white" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>
        </div>
        <div class="syncchat-msgbubble">
          <div class="syncchat-typing-dots">
            <span></span><span></span><span></span>
          </div>
        </div>
      `
      msgArea.appendChild(typingRow)
    }
    chatbox.appendChild(msgArea)

    // Input bar
    const inputBar = document.createElement("div")
    inputBar.className = "syncchat-inputbar"
    const input = document.createElement("input")
    input.className = "syncchat-input"
    input.type = "text"
    input.placeholder = "Type a message..."
    input.value = ""
    input.onkeydown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
      }
    }
    inputBar.appendChild(input)
    const sendBtn = document.createElement("button")
    sendBtn.setAttribute("type", "button") // force button, not submit
    sendBtn.className = "syncchat-sendbtn"
    sendBtn.textContent = "Send"
    sendBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      sendMessage();
    })
    inputBar.appendChild(sendBtn)
    chatbox.appendChild(inputBar)

    container.appendChild(chatbox)

    // Focus input
    setTimeout(() => input.focus(), 100)
  }

  const BOT_ID = "12"; // <-- Replace with your actual bot ID
  const API_URL = `http://127.0.0.1:8000/api/user/bot/${BOT_ID}/chat/`;

  // Send message
  function sendMessage(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    logDebug("Send button clicked");
    const input = container.querySelector(".syncchat-input")
    const text = input.value.trim()
    if (!text) return
    messages.push({ id: Date.now(), text, isBot: false })
    render()
    input.value = ""
    isTyping = true
    render()

    // Make request to backend
    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: text,
        conversation_id: conversationId,
        // You can add customer_name if needed
      })
    })
      .then(res => {
        logDebug("API response received");
        return res.json();
      })
      .then(data => {
        logDebug("API response parsed");
        const botText = data.bot_reply || "Sorry, no response."
        messages.push({ id: Date.now() + 1, text: botText, isBot: true })
        isTyping = false
        // Store conversationId from backend if not already set
        if (data.conversation_id) {
          conversationId = data.conversation_id;
        }
        render()
        // Scroll to bottom
        const msgArea = container.querySelector(".syncchat-messages")
        if (msgArea) msgArea.scrollTop = msgArea.scrollHeight
      })
      .catch(() => {
        logDebug("API error");
        messages.push({ id: Date.now() + 1, text: "Error contacting bot.", isBot: true })
        isTyping = false
        render()
      })
  }

  // Initial render
  render()
})()