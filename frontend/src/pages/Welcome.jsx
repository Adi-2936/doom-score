import { useNavigate } from 'react-router-dom'

function Welcome() {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('doomscore_user') || '{}')

    const features = [
        {
            icon: '▲',
            title: 'Upload your PDFs',
            desc: 'Drop in any study material — lecture notes, textbooks, assignments. Each PDF gets its own subject tag.'
        },
        {
            icon: '▓',
            title: 'Scroll your feed',
            desc: 'AI breaks your PDFs into bite-sized posts. Scroll through them like Instagram — one topic at a time.'
        },
        {
            icon: '◈',
            title: 'Study by chapter',
            desc: 'Use the library to filter posts by subject or chapter. Launch a focused feed for any topic.'
        },
        {
            icon: '⬡',
            title: 'Ask DoomBot',
            desc: 'Confused by a topic? Tap "ask doombot" on any post and get an instant explanation.'
        },
        {
            icon: '◉',
            title: 'Track your progress',
            desc: 'See how much of each subject you\'ve covered. Bookmark posts to revisit later.'
        }
    ]

    return (
        <div className="page" style={{ maxWidth: '560px' }}>

            <div style={{ marginBottom: '48px' }}>
                <p className="section-title">welcome</p>
                <h1 style={{ fontSize: '36px', letterSpacing: '3px', lineHeight: '1.1', marginBottom: '8px' }}>
                    hey, <span className="text-glow">{user.name || 'there'}</span>
                </h1>
                <div className="divider-accent" style={{ marginTop: '16px' }} />
                <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '13px',
                    marginTop: '14px',
                    letterSpacing: '0.5px',
                    lineHeight: '1.7'
                }}>
                    DoomScore turns your boring study PDFs into an addictive scrollable feed — powered by AI.
                    Here's how it works:
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '48px' }}>
                {features.map((f, i) => (
                    <div
                        key={i}
                        className="fade-in"
                        style={{
                            background: 'rgba(22,22,22,0.8)',
                            border: '1px solid var(--border)',
                            borderRadius: '10px',
                            padding: '16px 18px',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '16px',
                            backdropFilter: 'blur(8px)',
                            animationDelay: `${i * 0.1}s`,
                            animationFillMode: 'both'
                        }}
                    >
                        <div style={{
                            width: '36px',
                            height: '36px',
                            background: 'rgba(124,58,237,0.15)',
                            border: '1px solid rgba(124,58,237,0.3)',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            fontSize: '16px',
                            color: '#A855F7'
                        }}>
                            {f.icon}
                        </div>
                        <div>
                            <p style={{
                                fontSize: '13px',
                                fontWeight: '500',
                                color: 'var(--text-primary)',
                                letterSpacing: '0.5px',
                                marginBottom: '4px',
                                fontFamily: 'Courier New, monospace'
                            }}>
                                {f.title}
                            </p>
                            <p style={{
                                fontSize: '12px',
                                color: 'var(--text-secondary)',
                                lineHeight: '1.6',
                                letterSpacing: '0.3px'
                            }}>
                                {f.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <button
                className="btn-primary"
                onClick={() => navigate('/')}
                style={{ width: '100%' }}
            >
                ▓ start uploading
            </button>

        </div>
    )
}

export default Welcome