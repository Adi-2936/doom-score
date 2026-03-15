import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Upload() {
    const [files, setFiles] = useState([])
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [dragOver, setDragOver] = useState(false)
    const navigate = useNavigate()

    const handleFiles = (incoming) => {
        const pdfs = Array.from(incoming).filter(f => f.type === 'application/pdf')
        const newFiles = pdfs.map(file => ({ file, subject: '' }))
        setFiles(prev => [...prev, ...newFiles])
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setDragOver(false)
        handleFiles(e.dataTransfer.files)
    }

    const handleFileInput = (e) => {
        handleFiles(e.target.files)
    }

    const updateSubject = (index, value) => {
        setFiles(prev => prev.map((item, i) =>
            i === index ? { ...item, subject: value } : item
        ))
    }

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index))
    }

    const canUpload = files.length > 0 && files.every(f => f.subject.trim() !== '')

    const handleUpload = async () => {
        if (!canUpload) return

        setLoading(true)
        setProgress(0)

        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 90) { clearInterval(interval); return 90 }
                return prev + 5
            })
        }, 800)

        try {
            const formData = new FormData()
            files.forEach(item => formData.append('pdfs', item.file))
            files.forEach(item => formData.append('subjects', item.subject))

            await axios.post('http://localhost:5000/api/upload', formData)

            clearInterval(interval)
            setProgress(100)

            setTimeout(() => navigate('/feed'), 600)

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

            <div
                onDrop={handleDrop}
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onClick={() => document.getElementById('fileInput').click()}
                style={{
                    width: '100%',
                    minHeight: '140px',
                    border: `2px dashed ${dragOver ? 'var(--accent-light)' : 'var(--border)'}`,
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    background: dragOver ? 'rgba(124, 58, 237, 0.05)' : 'var(--bg-card)',
                    transition: 'all 0.2s ease',
                    marginBottom: '24px'
                }}
            >
                <input
                    id="fileInput"
                    type="file"
                    accept=".pdf"
                    multiple
                    onChange={handleFileInput}
                    style={{ display: 'none' }}
                />
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', letterSpacing: '2px' }}>
                    DROP PDFS HERE
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '8px', letterSpacing: '1px' }}>
                    or click to browse — multiple files supported
                </p>
            </div>

            {files.length > 0 && (
                <div style={{ marginBottom: '32px' }}>
                    <p className="section-title" style={{ marginBottom: '12px' }}>
                        {files.length} pdf{files.length > 1 ? 's' : ''} queued
                    </p>
                    {files.map((item, index) => (
                        <div key={index} style={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            padding: '14px 16px',
                            marginBottom: '10px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <p style={{ color: 'var(--accent-light)', fontSize: '12px', letterSpacing: '0.5px' }}>
                                    ▓ {item.file.name}
                                </p>
                                <button
                                    onClick={(e) => { e.stopPropagation(); removeFile(index) }}
                                    style={{
                                        background: 'transparent',
                                        color: 'var(--text-muted)',
                                        fontSize: '16px',
                                        padding: '0 4px'
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                            <input
                                type="text"
                                placeholder="subject (e.g. DSA, Web Dev, DBMS...)"
                                value={item.subject}
                                onChange={e => updateSubject(index, e.target.value)}
                                onClick={e => e.stopPropagation()}
                                style={{
                                    width: '100%',
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '4px',
                                    padding: '10px 14px',
                                    fontSize: '13px',
                                    color: 'var(--text-primary)',
                                    letterSpacing: '0.5px'
                                }}
                                onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
                                onBlur={e => e.target.style.borderColor = 'var(--border)'}
                            />
                        </div>
                    ))}
                </div>
            )}

            {loading && (
                <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <p className="section-title">analyzing pdfs</p>
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
                                    'saving to database...'}
                    </p>
                </div>
            )}

            <button
                className="btn-primary"
                onClick={handleUpload}
                disabled={!canUpload || loading}
                style={{
                    width: '100%',
                    opacity: (!canUpload || loading) ? 0.4 : 1,
                    cursor: (!canUpload || loading) ? 'not-allowed' : 'pointer'
                }}
            >
                {loading ? 'processing...' : `▓ initialize doom score`}
            </button>

        </div>
    )
}

export default Upload