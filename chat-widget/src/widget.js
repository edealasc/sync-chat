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
    { id: 1, text: "Hello! How can I help you today?", isBot: true, satisfaction: null }
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
  function render({ preserveInput = false } = {}) {
    // Save scroll and input value if needed
    let prevScroll = 0;
    let prevInput = "";
    const msgAreaOld = container.querySelector(".syncchat-messages");
    const inputOld = container.querySelector(".syncchat-input");
    if (msgAreaOld) prevScroll = msgAreaOld.scrollTop;
    if (preserveInput && inputOld) prevInput = inputOld.value;

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
    messages.forEach((msg, idx) => {
      const row = document.createElement("div")
      row.className = "syncchat-msgrow" + (msg.isBot ? "" : " user")
      if (msg.isBot) {
        const botIcon = document.createElement("div")
        botIcon.className = "syncchat-msg-boticon"
        botIcon.innerHTML = `<svg width="14" height="14" fill="white" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>`
        row.appendChild(botIcon)
      }
      const bubbleAndRating = document.createElement("div")
      bubbleAndRating.style.display = "flex"
      bubbleAndRating.style.flexDirection = "column"
      bubbleAndRating.style.alignItems = msg.isBot ? "flex-start" : "flex-end"

      // Chat bubble
      const bubble = document.createElement("div")
      bubble.className = "syncchat-msgbubble" + (msg.isBot ? "" : " user")
      // Markdown rendering
      if (window.marked) {
        bubble.innerHTML = window.marked.parse(msg.text || "");
      } else {
        bubble.textContent = msg.text;
      }
      bubbleAndRating.appendChild(bubble)

      // Satisfaction rating for bot messages (below bubble)
      if (msg.isBot) {
        const ratingDiv = document.createElement("div")
        ratingDiv.style.display = "flex"
        ratingDiv.style.alignItems = "center"
        ratingDiv.style.gap = "6px" // Add gap between icons
        ratingDiv.style.marginTop = "4px"

        // Thumbs up
        const upBtn = document.createElement("button")
        upBtn.type = "button"
        upBtn.style.background = "none"
        upBtn.style.border = "none"
        upBtn.style.cursor = msg.satisfaction === true ? "default" : "pointer"
        upBtn.style.padding = "2px"
        upBtn.disabled = msg.satisfaction === true
        upBtn.setAttribute("aria-label", "Thumbs up")
        upBtn.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
  stroke="${msg.satisfaction === true ? "#22c55e" : "#a3a3a3"}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M7 10v12"></path>
  <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"></path>
</svg>
`
        if (msg.satisfaction !== true) {
          upBtn.onclick = () => {
            // Optimistically update UI
            upBtn.disabled = true;
            upBtn.querySelector("svg").setAttribute("stroke", "#22c55e");
            downBtn.disabled = false;
            downBtn.querySelector("svg").setAttribute("stroke", "#a3a3a3");
            messages[idx].satisfaction = true;

            // Send satisfaction to backend
            fetch(`http://127.0.0.1:8000/api/user/message/${msg.id}/toggle_satisfaction/`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ satisfied: true })
            })
            .then(res => res.json())
            .then(data => {
              // Optionally handle response or errors
              if (!data.success) {
                // Rollback UI if needed
                messages[idx].satisfaction = null;
                upBtn.disabled = false;
                upBtn.querySelector("svg").setAttribute("stroke", "#a3a3a3");
              }
            })
            .catch(() => {
              // Rollback UI on error
              messages[idx].satisfaction = null;
              upBtn.disabled = false;
              upBtn.querySelector("svg").setAttribute("stroke", "#a3a3a3");
            });
          }
        }

        // Thumbs down (SVG flipped vertically)
        const downBtn = document.createElement("button")
        downBtn.type = "button"
        downBtn.style.background = "none"
        downBtn.style.border = "none"
        downBtn.style.cursor = msg.satisfaction === false ? "default" : "pointer"
        downBtn.style.padding = "2px"
        downBtn.disabled = msg.satisfaction === false
        downBtn.setAttribute("aria-label", "Thumbs down")
        downBtn.innerHTML = `
<span style="display:inline-block; transform:scaleY(-1);">
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="${msg.satisfaction === false ? "#ef4444" : "#a3a3a3"}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M7 10v12"></path>
    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"></path>
  </svg>
</span>
`
        if (msg.satisfaction !== false) {
          downBtn.onclick = () => {
            // Optimistically update UI
            downBtn.disabled = true;
            downBtn.querySelector("svg").setAttribute("stroke", "#ef4444");
            upBtn.disabled = false;
            upBtn.querySelector("svg").setAttribute("stroke", "#a3a3a3");
            messages[idx].satisfaction = false;

            // Send satisfaction to backend
            fetch(`http://127.0.0.1:8000/api/user/message/${msg.id}/toggle_satisfaction/`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ satisfied: false })
            })
            .then(res => res.json())
            .then(data => {
              // Optionally handle response or errors
              if (!data.success) {
                // Rollback UI if needed
                messages[idx].satisfaction = null;
                downBtn.disabled = false;
                downBtn.querySelector("svg").setAttribute("stroke", "#a3a3a3");
              }
            })
            .catch(() => {
              // Rollback UI on error
              messages[idx].satisfaction = null;
              downBtn.disabled = false;
              downBtn.querySelector("svg").setAttribute("stroke", "#a3a3a3");
            });
          }
        }

        ratingDiv.appendChild(upBtn)
        ratingDiv.appendChild(downBtn)
        bubbleAndRating.appendChild(ratingDiv)
      }

      row.appendChild(bubbleAndRating)
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
    input.value = preserveInput ? prevInput : ""
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

    // Restore scroll position
    setTimeout(() => {
      const msgArea = container.querySelector(".syncchat-messages");
      if (msgArea && prevScroll) msgArea.scrollTop = prevScroll;
      // Only focus input if not preserving (i.e., just opened)
      if (!preserveInput) input.focus();
    }, 0)
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
        const botText = data.bot_reply || "Sorry, no response.";
        // Use the real message id from backend for the bot message
        messages.push({
          id: data.bot_message_id, // <-- Use backend-provided message id
          text: botText,
          isBot: true,
          satisfaction: null
        });
        isTyping = false;
        // Store conversationId from backend if not already set
        if (data.conversation_id) {
          conversationId = data.conversation_id;
        }
        render();
        // Scroll to bottom
        const msgArea = container.querySelector(".syncchat-messages");
        if (msgArea) msgArea.scrollTop = msgArea.scrollHeight;
      })
      .catch(() => {
        logDebug("API error");
        messages.push({ id: Date.now() + 1, text: "Error contacting bot.", isBot: true, satisfaction: null })
        isTyping = false
        render()
      })
  }

  // Initial render
  render()
})()