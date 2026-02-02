import { useState } from 'react'
import './App.css'

type ChatResponse = {
reply:string 
}

function App() {

  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string| null>('')
  const [reply, setReply] = useState<string>('')

  const apiUrl= import.meta.env.VITE_API_URL

  const sendMessage = async() => {
    if(!message.trim()) return
    setLoading(true);
    setError(null)

    try {

      const response = await fetch(`${apiUrl}/chat`,{
        method: 'POST',
        headers:{"Content-Type": "application/json" },
        body: JSON.stringify({message})

      })

      const data: ChatResponse = await response.json()
      setReply(data.reply)
    }catch(error){
      setError('failed to get response from server')
    }finally{
      setLoading(false)
    }

  }

  return (
    <>
      <div className='chat-wrapper'>
        <h2>LLM Agent chat</h2>
        <textarea
        className='styled-textarea'
          placeholder='Ask about weather in any city'
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button 
        onClick={sendMessage}
        disabled={loading}
        >
        {loading? 'Thinking' : 'Send '}
        </button>

        {error && <p  className='error'> {error} </p>}

        {reply && (
          <div className='reply-box'>
          <strong>Agent :</strong>
          <p>{reply}</p>
            </div>
        )}


      </div>
    </>
  )
}

export default App
