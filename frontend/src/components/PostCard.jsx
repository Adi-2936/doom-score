function PostCard({ post, index, total, onAskBot }) {
    return (
        <div style={{
            height: '100vh',
            scrollSnapAlign: 'start',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '40px 24px',
            maxWidth: '600px',
            margin: '0 auto',
            position: 'relative'
        }}>

            <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="tag">{post.subject}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px', letterSpacing: '1px' }}>
                    {index + 1} / {total}
                </span>
            </div>

            <div className="divider-accent" style={{ marginBottom: '24px' }} />

            <h2 style={{
                fontSize: '28px',
                fontWeight: '700',
                letterSpacing: '2px',
                lineHeight: '1.2',
                marginBottom: '20px',
                color: 'var(--text-primary)'
            }}>
                {post.title}
            </h2>

            <p style={{
                fontSize: '15px',
                color: 'var(--text-secondary)',
                lineHeight: '1.8',
                letterSpacing: '0.5px',
                marginBottom: '32px'
            }}>
                {post.body}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px', letterSpacing: '1px' }}>
                    source: {post.source}
                </span>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn-primary" onClick={onAskBot}
                    style={{ flex: 1 }}>
                    ▓ ask bot
                </button>
            </div>

            {index < total - 1 && (
                <div style={{
                    position: 'absolute',
                    bottom: '32px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: 'var(--text-muted)',
                    fontSize: '11px',
                    letterSpacing: '2px',
                    animation: 'fadeIn 1s ease infinite alternate'
                }}>
                    scroll down ↓
                </div>
            )}

        </div>
    )
}

export default PostCard