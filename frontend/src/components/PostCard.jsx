function PostCard({ post, index, total, onAskBot }) {
    const bgLetter = post.title.charAt(0).toUpperCase()

    const gradients = [
        'radial-gradient(circle at 20% 20%, #7C3AED22, transparent 60%)',
        'radial-gradient(circle at 80% 20%, #7C3AED22, transparent 60%)',
        'radial-gradient(circle at 20% 80%, #7C3AED22, transparent 60%)',
        'radial-gradient(circle at 80% 80%, #7C3AED22, transparent 60%)',
        'radial-gradient(circle at 50% 20%, #7C3AED22, transparent 60%)',
    ]

    const gradient = gradients[index % gradients.length]

    return (
        <div style={{
            height: '100vh',
            scrollSnapAlign: 'start',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0a0a0a',
            padding: '24px 16px'
        }}>

            <div style={{
                width: '100%',
                maxWidth: '400px',
                aspectRatio: '4/5',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '24px',
                overflow: 'hidden',
                background: '#111111',
                borderRadius: '16px',
                border: '1px solid #222222',
                boxShadow: '0 0 40px rgba(124, 58, 237, 0.1)',
            }}>

                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'linear-gradient(#7C3AED08 1px, transparent 1px), linear-gradient(90deg, #7C3AED08 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                    pointerEvents: 'none',
                    borderRadius: '16px'
                }} />

                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: gradient,
                    pointerEvents: 'none',
                    borderRadius: '16px'
                }} />

                <div style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    fontSize: '180px',
                    fontWeight: '900',
                    color: '#7C3AED',
                    opacity: 0.06,
                    lineHeight: 1,
                    pointerEvents: 'none',
                    fontFamily: 'Courier New, monospace',
                    userSelect: 'none'
                }}>
                    {bgLetter}
                </div>

                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '3px',
                    height: '100%',
                    background: 'linear-gradient(to bottom, #7C3AED, #A855F7, transparent)',
                    borderRadius: '16px 0 0 16px'
                }} />

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'relative',
                    zIndex: 2
                }}>
                    <span style={{
                        background: '#7C3AED22',
                        border: '1px solid #7C3AED55',
                        color: '#A855F7',
                        fontSize: '10px',
                        letterSpacing: '2px',
                        padding: '4px 10px',
                        borderRadius: '2px',
                        fontFamily: 'Courier New, monospace',
                        textTransform: 'uppercase'
                    }}>
                        {post.subject}
                    </span>
                    <span style={{
                        color: '#444',
                        fontSize: '11px',
                        letterSpacing: '2px',
                        fontFamily: 'Courier New, monospace'
                    }}>
                        {String(index + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
                    </span>
                </div>

                <div style={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '16px 0' }}>

                    <div style={{
                        width: '36px',
                        height: '2px',
                        background: '#7C3AED',
                        boxShadow: '0 0 8px #7C3AED88',
                        marginBottom: '16px'
                    }} />

                    <h2 style={{
                        fontSize: '26px',
                        fontWeight: '700',
                        letterSpacing: '0.5px',
                        lineHeight: '1.25',
                        marginBottom: '16px',
                        color: '#ffffff',
                        fontFamily: 'Courier New, monospace'
                    }}>
                        {post.title}
                    </h2>

                    <p style={{
                        fontSize: '14px',
                        color: '#999999',
                        lineHeight: '1.8',
                        letterSpacing: '0.2px',
                        fontFamily: 'Courier New, monospace'
                    }}>
                        {post.body}
                    </p>

                </div>

                <div style={{ position: 'relative', zIndex: 2 }}>
                    <p style={{
                        fontSize: '10px',
                        color: '#3a3a3a',
                        letterSpacing: '1px',
                        marginBottom: '14px',
                        fontFamily: 'Courier New, monospace'
                    }}>
                        ↳ {post.source}
                    </p>

                    <button
                        onClick={onAskBot}
                        style={{
                            width: '100%',
                            background: '#7C3AED',
                            color: '#ffffff',
                            border: 'none',
                            padding: '13px',
                            fontSize: '12px',
                            letterSpacing: '2px',
                            textTransform: 'uppercase',
                            borderRadius: '6px',
                            fontFamily: 'Courier New, monospace',
                            cursor: 'pointer',
                            boxShadow: '0 0 20px rgba(124, 58, 237, 0.4)',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={e => e.target.style.boxShadow = '0 0 30px rgba(124, 58, 237, 0.7)'}
                        onMouseLeave={e => e.target.style.boxShadow = '0 0 20px rgba(124, 58, 237, 0.4)'}
                    >
                        ▓ ask doombot
                    </button>
                </div>

            </div>

            {index < total - 1 && (
                <div style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: '#333333',
                    fontSize: '9px',
                    letterSpacing: '3px',
                    fontFamily: 'Courier New, monospace',
                    whiteSpace: 'nowrap'
                }}>
                    scroll ↓
                </div>
            )}

        </div>
    )
}

export default PostCard