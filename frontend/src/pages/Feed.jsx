import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import PostCard from '../components/PostCard'
import ChatBot from '../components/ChatBot'

function Feed() {
    const navigate = useNavigate()
    const location = useLocation()
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [activePost, setActivePost] = useState(null)
    const startAtId = location.state?.startAtId || null
    const filterSource = location.state?.filterSource || null
    const filterSubject = location.state?.filterSubject || null

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/posts')
                let fetched = response.data.posts

                if (filterSource) {
                    fetched = fetched.filter(p => p.source === filterSource)
                } else if (filterSubject) {
                    fetched = fetched.filter(p => p.subject === filterSubject)
                }

                setPosts(fetched)
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        }
        fetchPosts()
    }, [])

    useEffect(() => {
        if (!loading && startAtId && posts.length > 0) {
            const index = posts.findIndex(p => p._id === startAtId)
            if (index !== -1) {
                setTimeout(() => {
                    const el = document.getElementById(`post-${startAtId}`)
                    if (el) el.scrollIntoView({ behavior: 'instant' })
                }, 100)
            }
        }
    }, [loading, startAtId, posts])

    if (loading) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <p className="text-glow" style={{ fontSize: '14px', letterSpacing: '3px' }}>
                    loading feed...
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
                <p className="section-title">no posts found</p>
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
        <div style={{ position: 'relative' }}>

            {(filterSource || filterSubject) && (
                <div style={{
                    position: 'fixed',
                    top: '16px',
                    right: '16px',
                    zIndex: 100,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'rgba(16,16,16,0.9)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    padding: '8px 14px'
                }}>
                    <span style={{
                        fontSize: '10px',
                        color: 'var(--accent-light)',
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        maxWidth: '200px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}>
                        ▓ {filterSource ? filterSource.slice(0, 25) + '...' : filterSubject}
                    </span>
                    <button
                        onClick={() => navigate('/feed')}
                        style={{
                            background: 'transparent',
                            color: 'var(--text-muted)',
                            fontSize: '12px',
                            padding: '0',
                            letterSpacing: '1px'
                        }}
                    >
                        ✕ clear
                    </button>
                </div>
            )}

            <div style={{ height: '100vh', overflowY: 'scroll', scrollSnapType: 'y mandatory' }}>
                {posts.map((post, index) => (
                    <div id={`post-${post._id}`} key={post._id}>
                        <PostCard
                            post={post}
                            index={index}
                            total={posts.length}
                            onAskBot={() => setActivePost(post)}
                        />
                    </div>
                ))}
            </div>

            {activePost && (
                <ChatBot
                    post={activePost}
                    onClose={() => setActivePost(null)}
                />
            )}

        </div>
    )
}

export default Feed