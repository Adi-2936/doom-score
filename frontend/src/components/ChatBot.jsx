import { useState } from 'react'
import axios from 'axios'

function ChatBot({ post, onClose }) {
    const [messages, setMessages] = useState([
        {
            role: 'bot',
            text: `ask me anything about "${post.title}"`
        }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)

    const sendMessage = async () => {
        if (!input.trim() || loading) return

        const userMessage = { role: 'user', text: input }
        setMessages(prev => [...prev, userMessage])
        setInput('')
        setLoading(true)

        try {
            const response = await axios.post('http://localhost:5000/api/chat', {
                question: input,
                context: `Title: ${post.title}\n${post.body}`
            })
            setMessages(prev => [...prev, { role: 'bot', text: response.data.answer }])
        } catch (err) {
            setMessages(prev => [...prev, { role: 'bot', text: 'something went wrong. try again.' }])
        }

        setLoading(false)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') sendMessage()
    }

    return (
        <div className="slide-up" style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '60vh',
            background: 'var(--bg-secondary)',
            borderTop: '1px solid var(--accent-primary)',
            boxShadow: '0 -10px 40px var(--accent-glow)',
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '600px',
            margin: '0 auto',
            zIndex: 100
        }}>

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
                borderBottom: '1px solid var(--border)'
            }}>
                <div>
                    <p className="section-title">doombot</p>
                    <p style={{ color: 'var(--accent-light)', fontSize: '12px', letterSpacing: '1px' }}>
                        {post.title}
                    </p>
                </div>
                <button onClick={onClose} style={{
                    background: 'transparent',
                    color: 'var(--text-secondary)',
                    fontSize: '18px',
                    padding: '4px 8px'
                }}>✕</button>
            </div>

            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
            }}>
                {messages.map((msg, i) => (
                    <div key={i} style={{
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '85%',
                        background: msg.role === 'user' ? 'var(--accent-primary)' : 'var(--bg-card)',
                        border: msg.role === 'bot' ? '1px solid var(--border)' : 'none',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        fontSize: '13px',
                        lineHeight: '1.6',
                        color: 'var(--text-primary)',
                        letterSpacing: '0.5px'
                    }}>
                        {msg.text}
                    </div>
                ))}
                {loading && (
                    <div style={{
                        alignSelf: 'flex-start',
                        color: 'var(--accent-light)',
                        fontSize: '12px',
                        letterSpacing: '2px'
                    }}>
                        thinking...
                    </div>
                )}
            </div>

            <div style={{
                padding: '12px 20px',
                borderTop: '1px solid var(--border)',
                display: 'flex',
                gap: '10px'
            }}>
                <input
                    type="text"
                    placeholder="ask something..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{
                        flex: 1,
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: '4px',
                        padding: '10px 14px',
                        fontSize: '13px',
                        color: 'var(--text-primary)',
                        letterSpacing: '0.5px'
                    }}
                />
                <button
                    className="btn-primary"
                    onClick={sendMessage}
                    disabled={loading}
                    style={{ padding: '10px 20px', opacity: loading ? 0.5 : 1 }}
                >
                    send
                </button>
            </div>

        </div>
    )
}

export default ChatBot