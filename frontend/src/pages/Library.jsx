import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { isBookmarked, toggleBookmark, isRead } from '../utils/storage'

function Library() {
    const navigate = useNavigate()
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [activeSubject, setActiveSubject] = useState('all')
    const [activeSource, setActiveSource] = useState('all')
    const [showBookmarked, setShowBookmarked] = useState(false)
    const [expandedSources, setExpandedSources] = useState({})
    const [, forceUpdate] = useState(0)

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await api.get('/posts')
                setPosts(response.data.posts)
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        }
        fetchPosts()
    }, [])

    const subjects = ['all', ...new Set(posts.map(p => p.subject))]

    const sources = ['all', ...new Set(
        posts
            .filter(p => activeSubject === 'all' || p.subject === activeSubject)
            .map(p => p.source)
    )]

    const filteredPosts = posts.filter(p => {
        const matchesSubject = activeSubject === 'all' || p.subject === activeSubject
        const matchesSource = activeSource === 'all' || p.source === activeSource
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase())
        const matchesBookmark = !showBookmarked || isBookmarked(p._id)
        return matchesSubject && matchesSource && matchesSearch && matchesBookmark
    })

    const grouped = filteredPosts.reduce((acc, post) => {
        const key = post.source
        if (!acc[key]) acc[key] = []
        acc[key].push(post)
        return acc
    }, {})

    const handleBookmark = (e, postId) => {
        e.stopPropagation()
        toggleBookmark(postId)
        forceUpdate(n => n + 1)
    }

    const toggleSource = (source) => {
        setExpandedSources(prev => ({
            ...prev,
            [source]: !prev[source]
        }))
    }

    const shortSource = (source) => {
        return source.length > 35 ? source.slice(0, 35) + '...' : source
    }

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p className="text-glow" style={{ fontSize: '14px', letterSpacing: '3px' }}>loading library...</p>
            </div>
        )
    }

    if (posts.length === 0) {
        return (
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                <p className="section-title">library is empty</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>upload some pdfs first</p>
                <button className="btn-ghost" onClick={() => navigate('/')}>go to upload</button>
            </div>
        )
    }

    return (
        <div className="page">

            <div style={{ marginBottom: '32px' }}>
                <p className="section-title">library</p>
                <h1 style={{ fontSize: '32px', letterSpacing: '3px' }}>
                    DOOM<span className="text-glow">LIBRARY</span>
                </h1>
                <div className="divider-accent" style={{ marginTop: '12px' }} />
                <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '8px', letterSpacing: '1px' }}>
                    {posts.length} posts across {subjects.length - 1} subjects
                </p>
            </div>

            <input
                type="text"
                placeholder="search posts..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                    width: '100%',
                    background: 'rgba(22, 22, 22, 0.8)',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    padding: '12px 16px',
                    fontSize: '13px',
                    letterSpacing: '0.5px',
                    marginBottom: '20px',
                    backdropFilter: 'blur(8px)'
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />

            <div style={{ marginBottom: '16px' }}>
                <p className="section-title" style={{ marginBottom: '10px' }}>subject</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {subjects.map(subject => (
                        <button
                            key={subject}
                            onClick={() => { setActiveSubject(subject); setActiveSource('all') }}
                            style={{
                                background: activeSubject === subject ? 'var(--accent-primary)' : 'rgba(22,22,22,0.8)',
                                color: activeSubject === subject ? '#fff' : 'var(--text-secondary)',
                                border: `1px solid ${activeSubject === subject ? 'var(--accent-primary)' : 'var(--border)'}`,
                                borderRadius: '2px',
                                padding: '5px 12px',
                                fontSize: '10px',
                                letterSpacing: '1.5px',
                                textTransform: 'uppercase',
                                transition: 'all 0.2s ease',
                                boxShadow: activeSubject === subject ? '0 0 12px var(--accent-glow)' : 'none'
                            }}
                        >
                            {subject}
                        </button>
                    ))}
                </div>
            </div>

            {sources.length > 2 && (
                <div style={{ marginBottom: '16px' }}>
                    <p className="section-title" style={{ marginBottom: '10px' }}>source</p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {sources.map(source => (
                            <button
                                key={source}
                                onClick={() => setActiveSource(source)}
                                style={{
                                    background: activeSource === source ? 'rgba(124,58,237,0.3)' : 'rgba(22,22,22,0.8)',
                                    color: activeSource === source ? 'var(--accent-light)' : 'var(--text-muted)',
                                    border: `1px solid ${activeSource === source ? 'var(--accent-primary)' : 'var(--border)'}`,
                                    borderRadius: '2px',
                                    padding: '5px 12px',
                                    fontSize: '10px',
                                    letterSpacing: '1px',
                                    textTransform: 'uppercase',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {source === 'all' ? 'all' : shortSource(source)}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div style={{ marginBottom: '24px' }}>
                <button
                    onClick={() => setShowBookmarked(!showBookmarked)}
                    style={{
                        background: showBookmarked ? 'rgba(124,58,237,0.2)' : 'transparent',
                        color: showBookmarked ? 'var(--accent-light)' : 'var(--text-muted)',
                        border: `1px solid ${showBookmarked ? 'var(--accent-primary)' : 'var(--border)'}`,
                        borderRadius: '2px',
                        padding: '6px 14px',
                        fontSize: '10px',
                        letterSpacing: '1.5px',
                        textTransform: 'uppercase',
                        transition: 'all 0.2s ease'
                    }}
                >
                    {showBookmarked ? '★ bookmarked only' : '☆ show bookmarked'}
                </button>
            </div>

            <div>
                {Object.keys(grouped).length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px', letterSpacing: '1px' }}>
                        no posts match your filters
                    </p>
                ) : (
                    Object.keys(grouped).map(source => (
                        <div key={source} style={{ marginBottom: '16px' }}>
                            <div
                                style={{
                                    width: '100%',
                                    background: 'rgba(22,22,22,0.8)',
                                    border: '1px solid var(--border)',
                                    borderRadius: expandedSources[source] ? '6px 6px 0 0' : '6px',
                                    display: 'flex',
                                    alignItems: 'stretch',
                                    overflow: 'hidden',
                                    transition: 'border-color 0.2s ease',
                                    backdropFilter: 'blur(8px)'
                                }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
                                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                            >
                                <button
                                    onClick={() => toggleSource(source)}
                                    style={{
                                        flex: 1,
                                        background: 'transparent',
                                        padding: '12px 16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        cursor: 'pointer',
                                        textAlign: 'left'
                                    }}
                                >
                                    <div>
                                        <p style={{ fontSize: '11px', color: 'var(--accent-light)', letterSpacing: '1px', marginBottom: '2px' }}>
                                            ▓ {shortSource(source)}
                                        </p>
                                        <p style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '1px' }}>
                                            {grouped[source].length} posts · {grouped[source].filter(p => isRead(p._id)).length} read
                                        </p>
                                    </div>
                                    <span style={{
                                        color: 'var(--text-muted)',
                                        fontSize: '12px',
                                        display: 'inline-block',
                                        transition: 'transform 0.2s ease',
                                        transform: expandedSources[source] ? 'rotate(180deg)' : 'rotate(0deg)',
                                        marginLeft: '12px'
                                    }}>▼</span>
                                </button>

                                <button
                                    onClick={() => navigate('/feed', { state: { filterSource: source } })}
                                    style={{
                                        background: 'rgba(124,58,237,0.15)',
                                        borderLeft: '1px solid #222',
                                        color: 'var(--accent-light)',
                                        fontSize: '9px',
                                        letterSpacing: '1.5px',
                                        textTransform: 'uppercase',
                                        padding: '0 16px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        whiteSpace: 'nowrap',
                                        flexShrink: 0
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.35)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(124,58,237,0.15)'}
                                >
                                    study →
                                </button>
                            </div>

                            {expandedSources[source] && (
                                <div style={{ border: '1px solid var(--border)', borderTop: 'none', borderRadius: '0 0 6px 6px', overflow: 'hidden' }}>
                                    {grouped[source].map((post, i) => (
                                        <div
                                            key={post._id}
                                            onClick={() => navigate('/feed', { state: { startAtId: post._id, filterSource: source } })}
                                            style={{
                                                background: 'rgba(16,16,16,0.8)',
                                                borderTop: i === 0 ? 'none' : '1px solid var(--border)',
                                                padding: '12px 16px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                gap: '12px',
                                                backdropFilter: 'blur(8px)',
                                                cursor: 'pointer',
                                                transition: 'background 0.2s ease'
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.08)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(16,16,16,0.8)'}
                                        >
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                    {isRead(post._id) && (
                                                        <span style={{ fontSize: '9px', color: 'var(--accent-light)', letterSpacing: '1px', flexShrink: 0 }}>✓</span>
                                                    )}
                                                    <p style={{
                                                        fontSize: '13px',
                                                        color: isRead(post._id) ? 'var(--text-secondary)' : 'var(--text-primary)',
                                                        letterSpacing: '0.3px',
                                                        lineHeight: '1.3'
                                                    }}>
                                                        {post.title}
                                                    </p>
                                                </div>
                                                <span style={{
                                                    fontSize: '9px',
                                                    background: 'rgba(124,58,237,0.15)',
                                                    border: '1px solid rgba(124,58,237,0.3)',
                                                    color: 'var(--accent-light)',
                                                    padding: '2px 6px',
                                                    borderRadius: '2px',
                                                    letterSpacing: '1px',
                                                    textTransform: 'uppercase'
                                                }}>
                                                    {post.subject}
                                                </span>
                                            </div>
                                            <button
                                                onClick={(e) => handleBookmark(e, post._id)}
                                                style={{
                                                    background: 'transparent',
                                                    fontSize: '16px',
                                                    color: isBookmarked(post._id) ? '#A855F7' : '#444',
                                                    textShadow: isBookmarked(post._id) ? '0 0 10px rgba(168,85,247,0.8)' : 'none',
                                                    flexShrink: 0,
                                                    padding: '0 4px',
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                {isBookmarked(post._id) ? '★' : '☆'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

        </div>
    )
}

export default Library