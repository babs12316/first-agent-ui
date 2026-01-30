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

  const sendMessage = async() => {
    if(!message.trim()) return
    setLoading(true);
    setError(null)

    try {

      const response = await fetch("http://localhost:8000/chat",{
        method: 'POST',
        headers:{"Content-Type": "application/json" },
        body: JSON.stringify({message})

      })

      const data: ChatResponse = await response.json()
      setReply(data.reply)
    }catch(error){
      setError('ailed to get response from server')
    }finally{
      setLoading(false)
    }

  }

  return (
    <>
      <div style={{ padding: 24, maxWidth: 6000, margin: "auto" }}>
        <h2>LLM Agent chat</h2>
        <textarea
          placeholder='ask something'
          style={{ width: "50%" }}
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button 
        onClick={sendMessage}
        disabled={loading}
        style={{marginTop:"12px"}}
        >
        {loading? 'Thinking' : 'Send '}
        </button>

        {error && <p style={{color:"red"}}> {error} </p>}

        {reply && (
          <div style= {{marginTop:20}}>
          <strong>Agent :</strong>
          <p>{reply}</p>
            </div>
        )}


      </div>
    </>
  )
}

export default App
