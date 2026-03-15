import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { getReadPosts, getBookmarks } from '../utils/storage'

function Stats() {
    const navigate = useNavigate()
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/posts')
                setPosts(response.data.posts)
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        }
        fetchPosts()
    }, [])

    const readIds = getReadPosts()
    const bookmarkIds = getBookmarks()

    const totalPosts = posts.length
    const totalRead = posts.filter(p => readIds.includes(p._id)).length
    const totalBookmarked = posts.filter(p => bookmarkIds.includes(p._id)).length
    const readPercent = totalPosts > 0 ? Math.round((totalRead / totalPosts) * 100) : 0

    const subjects = [...new Set(posts.map(p => p.subject))]
    const subjectStats = subjects.map(subject => {
        const subjectPosts = posts.filter(p => p.subject === subject)
        const subjectRead = subjectPosts.filter(p => readIds.includes(p._id)).length
        const percent = Math.round((subjectRead / subjectPosts.length) * 100)
        return { subject, total: subjectPosts.length, read: subjectRead, percent }
    })

    const sources = [...new Set(posts.map(p => p.source))]
    const sourceStats = sources.map(source => {
        const sourcePosts = posts.filter(p => p.source === source)
        const sourceRead = sourcePosts.filter(p => readIds.includes(p._id)).length
        const percent = Math.round((sourceRead / sourcePosts.length) * 100)
        return { source, total: sourcePosts.length, read: sourceRead, percent }
    })

    const bookmarkedPosts = posts.filter(p => bookmarkIds.includes(p._id))

    if (loading) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <p className="text-glow" style={{ fontSize: '14px', letterSpacing: '3px' }}>
                    loading stats...
                </p>
            </div>
        )
    }

    if (posts.length === 0) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px'
            }}>
                <p className="section-title">no data yet</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                    upload some pdfs first
                </p>
                <button className="btn-ghost" onClick={() => navigate('/')}>
                    go to upload
                </button>
            </div>
        )
    }

    return (
        <div className="page">

            <div style={{ marginBottom: '32px' }}>
                <p className="section-title">your progress</p>
                <h1 style={{ fontSize: '32px', letterSpacing: '3px' }}>
                    DOOM<span className="text-glow">STATS</span>
                </h1>
                <div className="divider-accent" style={{ marginTop: '12px' }} />
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '12px',
                marginBottom: '32px'
            }}>
                {[
                    { label: 'total posts', value: totalPosts },
                    { label: 'posts read', value: totalRead },
                    { label: 'bookmarked', value: totalBookmarked },
                ].map(stat => (
                    <div key={stat.label} style={{
                        background: 'rgba(22,22,22,0.8)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        padding: '16px 12px',
                        textAlign: 'center',
                        backdropFilter: 'blur(8px)'
                    }}>
                        <p style={{
                            fontSize: '28px',
                            fontWeight: '700',
                            color: '#A855F7',
                            textShadow: '0 0 20px rgba(168,85,247,0.5)',
                            fontFamily: 'Courier New, monospace',
                            marginBottom: '4px'
                        }}>
                            {stat.value}
                        </p>
                        <p style={{
                            fontSize: '9px',
                            color: 'var(--text-muted)',
                            letterSpacing: '1.5px',
                            textTransform: 'uppercase'
                        }}>
                            {stat.label}
                        </p>
                    </div>
                ))}
            </div>

            <div style={{
                background: 'rgba(22,22,22,0.8)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '32px',
                backdropFilter: 'blur(8px)'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px'
                }}>
                    <p className="section-title" style={{ marginBottom: 0 }}>overall progress</p>
                    <p style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: '#A855F7',
                        fontFamily: 'Courier New, monospace'
                    }}>
                        {readPercent}%
                    </p>
                </div>
                <div style={{
                    width: '100%',
                    height: '6px',
                    background: 'var(--border)',
                    borderRadius: '3px',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        height: '100%',
                        width: `${readPercent}%`,
                        background: 'linear-gradient(to right, #7C3AED, #A855F7)',
                        boxShadow: '0 0 10px rgba(168,85,247,0.6)',
                        borderRadius: '3px',
                        transition: 'width 1s ease'
                    }} />
                </div>
                <p style={{
                    fontSize: '10px',
                    color: 'var(--text-muted)',
                    letterSpacing: '1px',
                    marginTop: '8px'
                }}>
                    {totalRead} of {totalPosts} posts read
                </p>
            </div>

            <div style={{ marginBottom: '32px' }}>
                <p className="section-title" style={{ marginBottom: '16px' }}>by subject</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {subjectStats.map(s => (
                        <div key={s.subject} style={{
                            background: 'rgba(22,22,22,0.8)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            padding: '16px',
                            backdropFilter: 'blur(8px)'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '10px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{
                                        fontSize: '9px',
                                        background: 'rgba(124,58,237,0.15)',
                                        border: '1px solid rgba(124,58,237,0.3)',
                                        color: 'var(--accent-light)',
                                        padding: '2px 8px',
                                        borderRadius: '2px',
                                        letterSpacing: '1.5px',
                                        textTransform: 'uppercase'
                                    }}>
                                        {s.subject}
                                    </span>
                                    <span style={{
                                        fontSize: '10px',
                                        color: 'var(--text-muted)',
                                        letterSpacing: '1px'
                                    }}>
                                        {s.read}/{s.total} posts
                                    </span>
                                </div>
                                <span style={{
                                    fontSize: '16px',
                                    fontWeight: '700',
                                    color: s.percent === 100 ? '#FF3CAC' : '#A855F7',
                                    fontFamily: 'Courier New, monospace',
                                    textShadow: s.percent === 100
                                        ? '0 0 10px rgba(255,60,172,0.6)'
                                        : '0 0 10px rgba(168,85,247,0.5)'
                                }}>
                                    {s.percent}%
                                </span>
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
                                    width: `${s.percent}%`,
                                    background: s.percent === 100
                                        ? 'linear-gradient(to right, #FF3CAC, #FF85D4)'
                                        : 'linear-gradient(to right, #7C3AED, #A855F7)',
                                    boxShadow: s.percent === 100
                                        ? '0 0 8px rgba(255,60,172,0.5)'
                                        : '0 0 8px rgba(168,85,247,0.5)',
                                    borderRadius: '2px',
                                    transition: 'width 1s ease'
                                }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
                <p className="section-title" style={{ marginBottom: '16px' }}>by chapter</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {sourceStats.map(s => (
                        <div
                            key={s.source}
                            style={{
                                background: 'rgba(22,22,22,0.8)',
                                border: '1px solid var(--border)',
                                borderRadius: '8px',
                                padding: '14px 16px',
                                backdropFilter: 'blur(8px)',
                                cursor: 'pointer',
                                transition: 'border-color 0.2s ease'
                            }}
                            onClick={() => navigate('/feed', { state: { filterSource: s.source } })}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                        >
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '8px'
                            }}>
                                <p style={{
                                    fontSize: '11px',
                                    color: 'var(--accent-light)',
                                    letterSpacing: '0.5px',
                                    flex: 1,
                                    marginRight: '12px'
                                }}>
                                    ▓ {s.source.length > 40 ? s.source.slice(0, 40) + '...' : s.source}
                                </p>
                                <span style={{
                                    fontSize: '14px',
                                    fontWeight: '700',
                                    color: s.percent === 100 ? '#FF3CAC' : '#A855F7',
                                    fontFamily: 'Courier New, monospace',
                                    flexShrink: 0,
                                    textShadow: s.percent === 100
                                        ? '0 0 10px rgba(255,60,172,0.6)'
                                        : '0 0 10px rgba(168,85,247,0.5)'
                                }}>
                                    {s.percent}%
                                </span>
                            </div>
                            <div style={{
                                width: '100%',
                                height: '3px',
                                background: 'var(--border)',
                                borderRadius: '2px',
                                overflow: 'hidden',
                                marginBottom: '6px'
                            }}>
                                <div style={{
                                    height: '100%',
                                    width: `${s.percent}%`,
                                    background: s.percent === 100
                                        ? 'linear-gradient(to right, #FF3CAC, #FF85D4)'
                                        : 'linear-gradient(to right, #7C3AED, #A855F7)',
                                    borderRadius: '2px',
                                    transition: 'width 1s ease'
                                }} />
                            </div>
                            <p style={{
                                fontSize: '9px',
                                color: 'var(--text-muted)',
                                letterSpacing: '1px'
                            }}>
                                {s.read}/{s.total} posts read · click to study
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {bookmarkedPosts.length > 0 && (
                <div style={{ marginBottom: '32px' }}>
                    <p className="section-title" style={{ marginBottom: '16px' }}>
                        bookmarked ({bookmarkedPosts.length})
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {bookmarkedPosts.map(post => (
                            <div
                                key={post._id}
                                onClick={() => navigate('/feed', { state: { startAtId: post._id, filterSource: post.source } })}
                                style={{
                                    background: 'rgba(22,22,22,0.8)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '8px',
                                    padding: '12px 16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    backdropFilter: 'blur(8px)'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = 'var(--accent-primary)'
                                    e.currentTarget.style.background = 'rgba(124,58,237,0.08)'
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = 'var(--border)'
                                    e.currentTarget.style.background = 'rgba(22,22,22,0.8)'
                                }}
                            >
                                <div>
                                    <p style={{
                                        fontSize: '13px',
                                        color: 'var(--text-primary)',
                                        letterSpacing: '0.3px',
                                        marginBottom: '4px'
                                    }}>
                                        {post.title}
                                    </p>
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
                                <span style={{ color: '#FF3CAC', fontSize: '16px' }}>★</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    )
}

export default Stats