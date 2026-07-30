import { useState, useRef, useEffect } from 'react'
import apiFetch from './api'

function ChatbotWidget({ token, courseId, lessonId }) {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  async function handleSend(event) {
    event.preventDefault()
    if (!message.trim()) return

    const userMessage = message
    setMessages((prev) => [...prev, { sender: 'user', text: userMessage }])
    setMessage('')
    setSending(true)

    try {
      const response = await apiFetch(`/chatbot/ask?token=${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          course_id: courseId,
          lesson_id: lessonId || null,
        }),
      })

      if (!response.ok) {
        setMessages((prev) => [...prev, {
          sender: 'tutor',
          text: "Oops! Something went wrong. Try again? 😊"
        }])
        setSending(false)
        return
      }

      const data = await response.json()
      setMessages((prev) => [...prev, { sender: 'tutor', text: data.response }])
      setSending(false)
    } catch (error) {
      setMessages((prev) => [...prev, {
        sender: 'tutor',
        text: "I lost connection! Check your internet and try again. 🌐"
      }])
      setSending(false)
    }
  }

  const suggestions = [
    '💡 Explain this differently',
    '📝 Give me a practice problem',
    '🌍 Show a real-world example',
  ]

  return (
    <div className="ai-character-wrap">
      {!isOpen && (
        <div className="ai-character-label">Ask me anything! 👋</div>
      )}

      {isOpen && (
        <div className="ai-chat-popup">
          <div className="ai-chat-popup__header">
            <span style={{ fontSize: '1.8rem' }}>🦉</span>
            <div>
              <h4>Owly — AI Tutor</h4>
              <p>Always here to help you learn!</p>
            </div>
            <button className="ai-chat-popup__close" onClick={() => setIsOpen(false)}>
              ✕
            </button>
          </div>

          <div className="ai-chat-popup__messages">
            {messages.length === 0 && (
              <div className="chat-message chat-message--tutor" style={{ borderRadius: '12px' }}>
                🦉 Hi there! I'm Owly, your study buddy! Ask me anything about what you're learning — no question is too big or too small! 🌟
              </div>
            )}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${msg.sender === 'user' ? 'chat-message--user' : 'chat-message--tutor'}`}
                style={{ borderRadius: '12px' }}
              >
                {msg.text}
              </div>
            ))}
            {sending && (
              <div className="chat-message chat-message--tutor" style={{ borderRadius: '12px' }}>
                🦉 Thinking... ✨
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 0 && (
            <div className="ai-chips">
              {suggestions.map((chip) => (
                <button
                  key={chip}
                  className="chat-chip"
                  onClick={() => setMessage(chip.replace(/^[^\w💡📝🌍]+/, '').trim())}
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSend} className="ai-chat-popup__input-row">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask Owly anything..."
              autoFocus
            />
            <button type="submit" disabled={sending}>Send</button>
          </form>
        </div>
      )}

      <button
        className="ai-character-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Ask Owly!"
      >
        🦉
      </button>
    </div>
  )
}

export default ChatbotWidget