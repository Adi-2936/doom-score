import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Upload() {
    const [file, setFile] = useState(null)
    const [subject, setSubject] = useState('')
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [dragOver, setDragOver] = useState(false)
    const navigate = useNavigate()

    const handleFileChange = (e) => {
        setFile(e.target.files[0])
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setDragOver(false)
        const droppedFile = e.dataTransfer.files[0]
        if (droppedFile && droppedFile.type === 'application/pdf') {
            setFile(droppedFile)
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        setDragOver(true)
    }

    const handleDragLeave = () => {
        setDragOver(false)
    }

    const handleUpload = async () => {
        if (!file || !subject) return

        setLoading(true)
        setProgress(0)

        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 90) {
                    clearInterval(interval)
                    return 90
                }
                return prev + 10
            })
        }, 500)

        try {
            const formData = new FormData()
            formData.append('pdf', file)
            formData.append('subject', subject)

            const response = await axios.post('http://localhost:5000/api/upload', formData)

            clearInterval(interval)
            setProgress(100)

            setTimeout(() => {
                navigate('/feed', { state: { posts: response.data.posts } })
            }, 500)

        } catch (err) {
            console.log(err)
            clearInterval(interval)
            setLoading(false)
            setProgress(0)
        }
    }

    return (
        <div className="page">

            <div style={{ marginBottom: '48px' }}>
                <p className="section-title">initialize</p>
                <h1 style={{ fontSize: '42px', letterSpacing: '4px', lineHeight: '1.1' }}>
                    DOOM<span className="text-glow">SCORE</span>
                </h1>
                <div className="divider-accent" style={{ marginTop: '16px' }} />
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '12px', letterSpacing: '1px' }}>
                    feed your pdfs. consume knowledge.
                </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
                <p className="section-title" style={{ marginBottom: '8px' }}>subject</p>
                <input
                    type="text"
                    placeholder="e.g. web development, DSA, DBMS..."
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    style={{
                        width: '100%',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: '4px',
                        padding: '12px 16px',
                        fontSize: '14px',
                        color: 'var(--text-primary)',
                        letterSpacing: '1px',
                        transition: 'border-color 0.2s ease'
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
            </div>

            <div style={{ marginBottom: '32px' }}>
                <p className="section-title" style={{ marginBottom: '8px' }}>upload pdf</p>
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => document.getElementById('fileInput').click()}
                    style={{
                        width: '100%',
                        minHeight: '160px',
                        border: `2px dashed ${dragOver ? 'var(--accent-light)' : file ? 'var(--accent-primary)' : 'var(--border)'}`,
                        borderRadius: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        background: dragOver ? 'rgba(124, 58, 237, 0.05)' : 'var(--bg-card)',
                        transition: 'all 0.2s ease',
                        boxShadow: file ? '0 0 20px var(--accent-glow)' : 'none'
                    }}
                >
                    <input
                        id="fileInput"
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                    {file ? (
                        <>
                            <p style={{ color: 'var(--accent-light)', fontSize: '13px', letterSpacing: '1px' }}>
                                ▓ {file.name}
                            </p>
                            <p style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '6px' }}>
                                {(file.size / 1024).toFixed(1)} KB
                            </p>
                        </>
                    ) : (
                        <>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', letterSpacing: '2px' }}>
                                DROP PDF HERE
                            </p>
                            <p style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '8px', letterSpacing: '1px' }}>
                                or click to browse
                            </p>
                        </>
                    )}
                </div>
            </div>

            {loading && (
                <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <p className="section-title">analyzing pdf</p>
                        <p className="section-title">{progress}%</p>
                    </div>
                    <div style={{
                        width: '100%',
                        height: '4px',
                        background: 'var(--border)',
                        borderRadius: '2px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            height: '100%',
                            width: `${progress}%`,
                            background: 'var(--accent-primary)',
                            boxShadow: '0 0 10px var(--accent-glow)',
                            transition: 'width 0.4s ease',
                            borderRadius: '2px'
                        }} />
                    </div>
                    <p style={{
                        color: 'var(--text-muted)',
                        fontSize: '11px',
                        marginTop: '8px',
                        letterSpacing: '1px'
                    }}>
                        {progress < 30 ? 'extracting text...' :
                            progress < 60 ? 'feeding to AI...' :
                                progress < 90 ? 'generating posts...' :
                                    'almost done...'}
                    </p>
                </div>
            )}

            <button
                className="btn-primary"
                onClick={handleUpload}
                disabled={!file || !subject || loading}
                style={{
                    width: '100%',
                    opacity: (!file || !subject || loading) ? 0.4 : 1,
                    cursor: (!file || !subject || loading) ? 'not-allowed' : 'pointer'
                }}
            >
                {loading ? 'processing...' : '▓ initialize doom score'}
            </button>

        </div>
    )
}

export default Upload