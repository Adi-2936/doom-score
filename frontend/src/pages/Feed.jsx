import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PostCard from '../components/PostCard'
import ChatBot from '../components/ChatBot'

function Feed() {
    const location = useLocation()
    const navigate = useNavigate()
    const posts = location.state?.posts || []
    const [activePost, setActivePost] = useState(null)

    if (posts.length === 0) {
        return (
            <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <p className="section-title">error</p>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>no posts found</p>
                <button className="btn-ghost" onClick={() => navigate('/')}>
                    back to upload
                </button>
            </div>
        )
    }

    return (
        <div style={{ height: '100vh', overflowY: 'scroll', scrollSnapType: 'y mandatory' }}>
            {posts.map((post, index) => (
                <PostCard
                    key={index}
                    post={post}
                    index={index}
                    total={posts.length}
                    onAskBot={() => setActivePost(post)}
                />
            ))}
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