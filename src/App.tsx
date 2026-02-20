import { useEffect, useRef, useState } from "react"
import { fetchEventSource } from "@microsoft/fetch-event-source"
import Markdown from "react-markdown"
import "./App.css"

type Message = {
  role: "user" | "assistant"
  content: string
}

type ChatThread = {
  threadId: string
  title: string
  messages: Message[]
}

function App() {
  const [threads, setThreads] = useState<ChatThread[]>(() => [
    { threadId: crypto.randomUUID(), title: "New Chat", messages: [] },
  ])
  
  // Set the current thread to the first thread
  const [currentThreadId, setCurrentThreadId] = useState(() => threads[0].threadId)
  const [input, setInput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const apiUrl = import.meta.env.VITE_API_URL



  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [threads, currentThreadId])

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = input
    setInput("")
    setError(null)
    setLoading(true)

    setThreads(prev =>
      prev.map(thread =>
        thread.threadId === currentThreadId
          ? { ...thread, messages: [...thread.messages, { role: "user", content: userMessage }] }
          : thread
      )
    )

    const controller = new AbortController()

    try {
      await fetchEventSource(`${apiUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, thread_id: currentThreadId }),
        signal: controller.signal,

        onmessage(event) {
          if (event.data === "[DONE]") {
            controller.abort()
            setLoading(false)
            return
          }

          setThreads(prev =>
            prev.map(thread => {
              if (thread.threadId !== currentThreadId) return thread

              const last = thread.messages[thread.messages.length - 1]
              if (last?.role === "assistant") {
                return {
                  ...thread,
                  messages: [
                    ...thread.messages.slice(0, -1),
                    { role: "assistant", content: last.content + event.data }
                  ]
                }
              }

              return { ...thread, messages: [...thread.messages, { role: "assistant", content: event.data }] }
            })
          )
          setLoading(false)
        },

        onerror(err) {
          console.error(err)
          setError("Streaming failed")
          controller.abort()
          setLoading(false)
        },
      })
    } catch (err) {
      console.error(err)
      setError("Connection failed")
    }
  }

  const newChat = () => {
    const newId = crypto.randomUUID()
    setCurrentThreadId(newId)
    setThreads(prev => [...prev, { threadId: newId, title: "New Chat", messages: [] }])
  }

  const switchThread = (threadId: string) => {
    setCurrentThreadId(threadId)
  }

  const currentMessages = threads.find(t => t.threadId === currentThreadId)?.messages || []

  const deleteThread = (threadId: string) => {
    setThreads(prev => prev.filter(thread => thread.threadId !== threadId))
  
    // If deleted thread is current, switch to first available thread
    if (threadId === currentThreadId) {
      const remainingThreads = threads.filter(t => t.threadId !== threadId)
      if (remainingThreads.length > 0) {
        setCurrentThreadId(remainingThreads[0].threadId)
      } else {
        // No threads left, create a new one
        const newId = crypto.randomUUID()
        const newThread: ChatThread = { threadId: newId, title: "New Chat", messages: [] }
        setThreads([newThread])
        setCurrentThreadId(newId)
      }
    }
  }

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h3>Chats</h3>
        <button className="new-chat-btn" onClick={newChat}>
          + New Chat
        </button>
        <div className="thread-list">
  {threads.map(thread => (
    <div
      key={thread.threadId}
      className={`thread-item ${thread.threadId === currentThreadId ? "active-thread" : ""}`}
    >
      <div
        className="thread-info"
        onClick={() => switchThread(thread.threadId)}
      >
        <span className="thread-title">{thread.title}</span>
        <span className="thread-preview">
          {thread.messages[thread.messages.length - 1]?.content.slice(0, 30)}
        </span>
      </div>
      
      {/* Delete button */}
      <button
        className="delete-thread-btn"
        onClick={() => deleteThread(thread.threadId)}
      >
        🗑️
      </button>
    </div>
  ))}
</div>
      </div>

      {/* Chat Area */}
      <div className="chat-area">
        <div className="chat-box">
          {currentMessages.map((msg, index) => (
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
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
          />
          <button onClick={sendMessage} disabled={loading}>
            →
          </button>
        </div>
      </div>
    </div>
  )
}

export default App