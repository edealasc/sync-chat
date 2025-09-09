(function () {
  // Chat colors (customize as needed)
  const primaryColor = "#a8c69f";
  const secondaryColor = "#96b88a";

  // Set your bot's ID and API endpoint here
  const BOT_ID = "12"; // <-- Replace with your actual bot ID
  const API_URL = `http://127.0.0.1:8000/api/user/bot/${BOT_ID}/chat/`; // Adjust if your endpoint differs
  let conversationId = null; // Track conversation ID

  // Utility: create element with classes and styles
  function createEl(tag, opts = {}) {
    const el = document.createElement(tag);
    if (opts.className) el.className = opts.className;
    if (opts.style) Object.assign(el.style, opts.style);
    if (opts.attrs) for (const k in opts.attrs) el.setAttribute(k, opts.attrs[k]);
    if (opts.html) el.innerHTML = opts.html;
    if (opts.textContent) el.textContent = opts.textContent; // <-- Added support for textContent
    return el;
  }

  // Styles for chat widget
  const style = document.createElement("style");
  style.innerHTML = `
    .scw-fade-in { animation: scw-fade-in 0.2s; }
    @keyframes scw-fade-in { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: none;} }
    .scw-shadow { box-shadow: 0 4px 20px rgba(0,0,0,0.15);}
    .scw-scrollbar::-webkit-scrollbar { width: 6px; background: #eee; }
    .scw-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
    .scw-bounce { animation: scw-bounce 1s infinite; }
    @keyframes scw-bounce {
      0%, 100% { transform: translateY(0);}
      50% { transform: translateY(-5px);}
    }
  `;
  document.head.appendChild(style);

  // Chat state
  let isChatOpen = false;
  let messages = [
    {
      id: 1,
      text: "Hello! How can I help you today?",
      isBot: true,
      timestamp: new Date(),
    },
  ];
  let isTyping = false;

  // Main container
  const container = createEl("div", {
    style: {
      position: "fixed",
      bottom: "24px",
      right: "24px",
      zIndex: 99999,
      fontFamily: "inherit",
    },
  });

  // Mini chat button
  const chatBtn = createEl("button", {
    style: {
      width: "56px",
      height: "56px",
      borderRadius: "50%",
      background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
      color: "#fff",
      border: "none",
      boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "28px",
      transition: "box-shadow 0.2s",
    },
    attrs: { "aria-label": "Open chat" },
    html: `<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  });

  // Chat card
  const chatCard = createEl("div", {
    className: "scw-fade-in scw-shadow",
    style: {
      width: "340px",
      height: "500px",
      background: "#fff",
      borderRadius: "16px",
      overflow: "hidden",
      display: "none",
      flexDirection: "column",
      boxSizing: "border-box",
    },
  });

  // Header
  const header = createEl("div", {
    style: {
      padding: "16px",
      background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
  });

  // Bot avatar and name
  const botInfo = createEl("div", {
    style: { display: "flex", alignItems: "center", gap: "10px" },
    html: `
      <div style="width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;">
        <svg width="18" height="18" fill="none" stroke="#fff" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 15h8M9 9h.01M15 9h.01"/></svg>
      </div>
      <div>
        <div style="color:#fff;font-weight:500;font-size:15px;">SyncChat AI</div>
        <div style="color:rgba(255,255,255,0.8);font-size:12px;">Online</div>
      </div>
    `,
  });

  // Close button
  const closeBtn = createEl("button", {
    style: {
      background: "none",
      border: "none",
      color: "#fff",
      borderRadius: "50%",
      width: "32px",
      height: "32px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginLeft: "8px",
      transition: "background 0.2s",
    },
    attrs: { "aria-label": "Close chat" },
    html: `<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>`,
  });

  header.appendChild(botInfo);
  header.appendChild(closeBtn);

  // Messages area
  const messagesArea = createEl("div", {
    className: "scw-scrollbar",
    style: {
      flex: "1",
      padding: "18px 14px",
      background: "#f9fafb",
      overflowY: "auto",
      display: "flex",
      flexDirection: "column",
      gap: "14px",
      fontSize: "15px",
    },
  });

  // Input area
  const inputArea = createEl("div", {
    style: {
      padding: "12px",
      borderTop: "1px solid #e5e7eb",
      background: "#fff",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
  });

  const input = createEl("input", {
    style: {
      flex: "1",
      fontSize: "15px",
      padding: "8px 12px",
      borderRadius: "8px",
      border: "1px solid #e5e7eb",
      outline: "none",
      background: "#f3f4f6",
    },
    attrs: { 
      placeholder: "Type a message...",
      id: "scw-chat-input",         // <-- Add this line
      name: "scw-chat-input"        // <-- Add this line
    },
  });

  const sendBtn = createEl("button", {
    style: {
      background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      padding: "7px 18px",
      fontSize: "15px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "background 0.2s",
    },
    attrs: { type: "button" }, // <-- Prevents form submission/page reload
    html: "Send",
  });

  inputArea.appendChild(input);
  inputArea.appendChild(sendBtn);

  chatCard.appendChild(header);
  chatCard.appendChild(messagesArea);
  chatCard.appendChild(inputArea);

  // Render messages
  function renderMessages() {
    messagesArea.innerHTML = "";
    messages.forEach((msg) => {
      const row = createEl("div", {
        style: {
          display: "flex",
          flexDirection: msg.isBot ? "row" : "row-reverse",
          alignItems: "flex-start",
          gap: "8px",
        },
      });

      // Avatar
      if (msg.isBot) {
        const avatar = createEl("div", {
          style: {
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            background: `linear-gradient(to bottom right, ${primaryColor}, ${secondaryColor})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
          html: `<svg width="13" height="13" fill="none" stroke="#fff" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 15h8M9 9h.01M15 9h.01"/></svg>`,
        });
        row.appendChild(avatar);
      } else {
        // Add empty space for alignment
        const spacer = createEl("div", {
          style: { width: "24px", height: "24px" },
        });
        row.appendChild(spacer);
      }

      // Bubble
      const bubble = createEl("div", {
        style: Object.assign(
          {
            borderRadius: "10px",
            padding: "8px 12px",
            maxWidth: "220px",
            fontSize: "14px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            wordBreak: "break-word",
            marginLeft: msg.isBot ? "0" : "auto",
            marginRight: msg.isBot ? "auto" : "0",
          },
          msg.isBot
            ? { background: "#fff", color: "#222" }
            : {
                background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
                color: "#fff",
              }
        ),
        textContent: msg.text,
      });
      row.appendChild(bubble);

      messagesArea.appendChild(row);
    });

    // Typing indicator
    if (isTyping) {
      const row = createEl("div", {
        style: { display: "flex", alignItems: "center", gap: "8px" },
      });
      const avatar = createEl("div", {
        style: {
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          background: `linear-gradient(to bottom right, ${primaryColor}, ${secondaryColor})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        html: `<svg width="13" height="13" fill="none" stroke="#fff" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 15h8M9 9h.01M15 9h.01"/></svg>`,
      });
      row.appendChild(avatar);

      const dots = createEl("div", {
        style: {
          background: "#fff",
          borderRadius: "10px",
          padding: "8px 12px",
          display: "flex",
          gap: "4px",
          alignItems: "center",
        },
      });
      for (let i = 0; i < 3; i++) {
        const dot = createEl("div", {
          style: {
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            background: "#a3a3a3",
            animation: "scw-bounce 1s infinite",
            animationDelay: `${i * 0.15}s`,
          },
        });
        dots.appendChild(dot);
      }
      row.appendChild(dots);
      messagesArea.appendChild(row);
    }

    // Scroll to bottom
    messagesArea.scrollTop = messagesArea.scrollHeight;
  }

  // Send message
  async function sendMessage() {
    if (!isChatOpen) return; // Prevent sending if chat is closed

    const text = input.value.trim();
    if (!text) return;
    messages.push({
      id: Date.now(),
      text,
      isBot: false,
      timestamp: new Date(),
    });
    input.value = "";
    renderMessages();

    isTyping = true;
    renderMessages();

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          conversation_id: conversationId,
          customer_name: "Anonymous",
        }),
      });

      if (!res.ok) {
        let errorMsg = "Network error. Please try again.";
        try {
          const data = await res.json();
          if (data.error) errorMsg = data.error;
        } catch (fetchErr) {
          console.error("Error parsing error response:", fetchErr);
        }
        console.error("Fetch error:", errorMsg);
        messages.push({
          id: Date.now() + 1,
          text: "Sorry, there was an error: " + errorMsg,
          isBot: true,
          timestamp: new Date(),
        });
      } else {
        const data = await res.json();
        if (data.error) {
          console.error("API error:", data.error);
          messages.push({
            id: Date.now() + 2,
            text: "Sorry, there was an error: " + data.error,
            isBot: true,
            timestamp: new Date(),
          });
        } else {
          conversationId = data.conversation_id;
          messages.push({
            id: Date.now() + 3,
            text: data.bot_reply,
            isBot: true,
            timestamp: new Date(),
          });
        }
      }
    } catch (err) {
      console.error("Network or unexpected error:", err);
      messages.push({
        id: Date.now() + 4,
        text: "Network error. Please try again.",
        isBot: true,
        timestamp: new Date(),
      });
    }
    isTyping = false;
    renderMessages();
  }

  // Event listeners
  chatBtn.onclick = () => {
    isChatOpen = true;
    chatBtn.style.display = "none";
    chatCard.style.display = "flex";
    renderMessages();
    setTimeout(() => input.focus(), 200);
  };

  // Only close chat when closeBtn is clicked
  closeBtn.onclick = () => {
    isChatOpen = false;
    chatBtn.style.display = "flex";
    chatCard.style.display = "none";
  };

  sendBtn.onclick = () => {
    if (isChatOpen) sendMessage();
  };
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (isChatOpen) sendMessage();
    }
  });

  // Mount
  container.appendChild(chatBtn);
  container.appendChild(chatCard);
  document.body.appendChild(container);
})();
