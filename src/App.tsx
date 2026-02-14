import { useEffect, useRef, useState } from "react"
import { fetchEventSource } from "@microsoft/fetch-event-source"
import Markdown from "react-markdown"
import "./App.css"

type Message = {
  role: "user" | "assistant"
  content: string
}

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [error, setError] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const apiUrl = import.meta.env.VITE_API_URL

  // Stable thread ID for short-term memory
  const [threadId] = useState(() => crypto.randomUUID())

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = input
    setInput("")
    setError(null)


    // Add user message
    setMessages(prev => [
      ...prev,
      { role: "user", content: userMessage }
    ])

    const controller = new AbortController()

    try {
      await fetchEventSource(`${apiUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          thread_id: threadId,
        }),
        signal: controller.signal,

        onmessage(event) {
          if (event.data === "[DONE]") {
            controller.abort()
            return
          }

          setMessages(prev => {
            const last = prev[prev.length - 1]
          
            if (last?.role === "assistant") {
              return [
                ...prev.slice(0, -1),
                { role: "assistant", content: last.content + event.data }
              ]
            }
          
            return [
              ...prev,
              { role: "assistant", content: event.data }
            ]
          })
        },

        onerror(err) {
          console.error(err)
          setError("Streaming failed")
          controller.abort()
        },

        onclose() {
        },
      })
    } catch (err) {
      console.error(err)
      setError("Connection failed")
    }
  }

  const newChat = () => {
    setMessages([])
  }

  return (
    <div className="chat-wrapper">
      <h2>LLM Agent Chat</h2>

      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <div className="bubble">
              <Markdown>{msg.content}</Markdown>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {error && <p className="error">{error}</p>}

      <div className="input-area">
        <textarea
          rows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something about weather..."
          onKeyDown={(e)=> {
            if(e.key === "Enter"){
                sendMessage()
            } }}
        />
        <div className="actions">
        <button onClick={newChat}>New Chat</button>
        </div>
      </div>
    </div>
  )
}

export default App
