import { useState, useRef, useEffect, useContext } from "react";
import "./ChatWidget.css";
import { StoreContext } from "../context/StoreContext";

const AI_URL = "https://meridian-ai-hvnn.onrender.com";

const SYSTEM_PROMPT = `You are a friendly ordering assistant for Meridian Eats food delivery.

CRITICAL RULE: When a user asks to see the menu, full menu, or any category — you MUST call get_menu tool FIRST before saying anything else. Never ask "which item" before showing the menu.

Our menu categories: Rice, Salad, Rolls, Deserts, Sandwich, Cake, Pasta, Noodles, Veg.

ORDERING STEPS — follow in order:
1. When user asks for menu → call get_menu("all") or get_menu("category") immediately
2. Show the results clearly with names, IDs and prices
3. Ask which item they want
4. Ask for quantity — never assume
5. Ask about promo/coupon code
6. Ask for delivery address (street, city, state, ZIP, phone)
7. Confirm full order summary
8. Only then call add_to_cart and place_order

NEVER skip showing the menu when asked. NEVER ask for an order before showing menu items.`;

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! 👋 I'm Meridian's AI assistant. I can help you browse the menu, place orders, track deliveries, and more. How can I help you today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const messagesEndRef = useRef(null);
  const { token } = useContext(StoreContext);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch(`${AI_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          model: "openai/gpt-oss-20b",
          system_prompt: SYSTEM_PROMPT,
          allow_search: true,
          session_id: sessionId,
          user_token: token || ""  // ← passes logged-in user's JWT token
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Sorry, I'm having trouble connecting. Please try again."
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = async () => {
    await fetch(`${AI_URL}/conversation/${sessionId}`, { method: "DELETE" });
    setMessages([{
      role: "assistant",
      content: "Chat cleared! How can I help you?"
    }]);
  };

  return (
    <div className="chat-widget">
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">🤖</div>
              <div>
                <div className="chat-title">Meridian Assistant</div>
                <div className="chat-subtitle">
                  {token ? "Online • Logged in" : "Online • Ask me anything"}
                </div>
              </div>
            </div>
            <div className="chat-header-actions">
              <button onClick={clearChat} className="chat-clear-btn" title="Clear chat">
                🗑️
              </button>
              <button onClick={() => setIsOpen(false)} className="chat-close-btn">
                ✕
              </button>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.role}`}>
                {msg.role === "assistant" && (
                  <div className="chat-message-avatar">🤖</div>
                )}
                <div className="chat-message-bubble">
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="chat-message assistant">
                <div className="chat-message-avatar">🤖</div>
                <div className="chat-message-bubble chat-typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-area">
            <textarea
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={token ? "Ask about menu, orders, delivery..." : "Login to place orders..."}
              rows={1}
            />
            <button
              className="chat-send-btn"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
            >
              ➤
            </button>
          </div>
        </div>
      )}

      <button
        className={`chat-toggle-btn ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "✕" : "💬"}
      </button>
    </div>
  );
}