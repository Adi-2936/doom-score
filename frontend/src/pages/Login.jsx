import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../utils/api'

function Login({ onLogin }) {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleLogin = async () => {
        if (!email || !password) return
        setLoading(true)
        setError('')

        try {
            const response = await api.post('/auth/login', { email, password })
            localStorage.setItem('doomscore_token', response.data.token)
            localStorage.setItem('doomscore_user', JSON.stringify(response.data.user))
            onLogin()
            navigate('/welcome')
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleLogin()
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                background: 'rgba(16,16,16,0.8)',
                border: '1px solid #222',
                borderRadius: '16px',
                padding: '40px 32px',
                backdropFilter: 'blur(12px)'
            }}>

                <div style={{ marginBottom: '36px' }}>
                    <p className="section-title">welcome back</p>
                    <h1 style={{ fontSize: '36px', letterSpacing: '4px' }}>
                        DOOM<span className="text-glow">SCORE</span>
                    </h1>
                    <div className="divider-accent" style={{ marginTop: '12px' }} />
                    <p style={{
                        color: 'var(--text-secondary)',
                        fontSize: '12px',
                        marginTop: '10px',
                        letterSpacing: '1px'
                    }}>
                        turn your pdfs into a scrollable knowledge feed
                    </p>
                </div>

                {error && (
                    <div style={{
                        background: 'rgba(255,60,172,0.1)',
                        border: '1px solid rgba(255,60,172,0.3)',
                        borderRadius: '6px',
                        padding: '10px 14px',
                        marginBottom: '20px',
                        fontSize: '12px',
                        color: '#FF3CAC',
                        letterSpacing: '0.5px'
                    }}>
                        {error}
                    </div>
                )}

                <div style={{ marginBottom: '16px' }}>
                    <p className="section-title" style={{ marginBottom: '8px' }}>email</p>
                    <input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={{
                            width: '100%',
                            background: 'rgba(22,22,22,0.9)',
                            border: '1px solid #222',
                            borderRadius: '6px',
                            padding: '12px 16px',
                            fontSize: '13px',
                            letterSpacing: '0.5px'
                        }}
                        onFocus={e => e.target.style.borderColor = '#7C3AED'}
                        onBlur={e => e.target.style.borderColor = '#222'}
                    />
                </div>

                <div style={{ marginBottom: '28px' }}>
                    <p className="section-title" style={{ marginBottom: '8px' }}>password</p>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={{
                            width: '100%',
                            background: 'rgba(22,22,22,0.9)',
                            border: '1px solid #222',
                            borderRadius: '6px',
                            padding: '12px 16px',
                            fontSize: '13px',
                            letterSpacing: '0.5px'
                        }}
                        onFocus={e => e.target.style.borderColor = '#7C3AED'}
                        onBlur={e => e.target.style.borderColor = '#222'}
                    />
                </div>

                <button
                    className="btn-primary"
                    onClick={handleLogin}
                    disabled={loading}
                    style={{
                        width: '100%',
                        opacity: loading ? 0.5 : 1,
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'logging in...' : '▓ login'}
                </button>

                <p style={{
                    textAlign: 'center',
                    marginTop: '20px',
                    fontSize: '12px',
                    color: '#555',
                    letterSpacing: '0.5px'
                }}>
                    no account?{' '}
                    <Link to="/register" style={{
                        color: '#A855F7',
                        textDecoration: 'none',
                        letterSpacing: '1px'
                    }}>
                        register
                    </Link>
                </p>

            </div>
        </div>
    )
}

export default Login