import React, { useState, useEffect } from "react"
import { io } from "socket.io-client"
import { SendIcon } from "lucide-react"
import "./App.css"

const socket = io("http://localhost:3000")

function App() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [joined, setJoined] = useState(false);

  const colors = ["red", "blue", "black", "yellow", "green", "orange", "brown", "pink"]

  useEffect(() => {
    socket.on("message", (data) => {
      setMessages((prev) => [...prev, data])
    });

    return () => socket.off("message");
  }, []);

  const joinChat = () => {
    if (name.trim()) {
      socket.emit("join", name)
      setJoined(true);
    } else {alert("Iltimos ismingizni kiriting!")}
  };

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("sendMessage", message);
      setMessage("");
    }
  };

  return (
    <div className="container">
      {!joined ? (
        <div className="login">
          <div>
            <h2>Ismingizni kiriting</h2>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ism..." />
            <button onClick={joinChat}>Kirish</button>
          </div>
        </div>
      ) : (
        <div className="chat">

          <h2>Tinchmi chati 😎</h2>

          <div className="messages">
            {messages.map((msg, index) => (
              <div className={`message ${msg.user === name ? "own-message" : ""}`} key={index}>
                <p className="avatar">{msg.user ? msg.user.slice(0, 1) : "?"}</p>
                <p className="content">
                  <strong>{msg.user}</strong>
                  {msg.text}
                </p>
              </div>
            ))}
          </div>
          
          <div className="send-message">
            <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Xabar yuboring..." />
            <button onClick={sendMessage}><SendIcon /></button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App