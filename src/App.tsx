import { useState } from 'react'
import './App.css'
import Markdown from "react-markdown"

function App() {
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<string>("")

  const apiUrl = import.meta.env.VITE_API_URL

  const startStreaming = async () => {
    if (!message.trim()) return
    
    setLoading(true)
    setError(null)
    setData("") // Clear previous data

    try {
      const response = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body!.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { value, done } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        
        // Parse SSE format: "data: content\n\n"
        const lines = chunk.split('\n')
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const content = line.slice(6) // Remove "data: " prefix
            
            // Skip [DONE] signal
            if (content === '[DONE]') continue
            
            // For plain text streaming
            setData((prev) => prev + content)
            
            }
        }
      }
    } catch (error) {
      setError('Failed to get response from server')
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className='chat-wrapper'>
        <h2>LLM Agent Chat</h2>
        <textarea
          className='styled-textarea'
          placeholder='Ask about weather in any city'
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button 
          onClick={startStreaming}
          disabled={loading}
        >
          {loading ? 'Thinking...' : 'Send'}
        </button>

        {error && <p className='error'>{error}</p>}

        {data && (
          <div className='reply-box'>
            <strong>Agent:</strong>
            <Markdown>{data}</Markdown>
          </div>
        )}
      </div>
    </>
  )
}

export default App
