import { useNavigate, useLocation } from 'react-router-dom'

function NavBar() {
    const navigate = useNavigate()
    const location = useLocation()

    const tabs = [
        { path: '/', label: 'Upload', icon: '▲' },
        { path: '/feed', label: 'Feed', icon: '▓' },
        { path: '/library', label: 'Library', icon: '◈' },
        { path: '/stats', label: 'Stats', icon: '◉' },
    ]

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100vh',
            width: '90px',
            background: 'rgba(10, 10, 10, 0.55)',
            backdropFilter: 'blur(16px)',
            borderRight: '1px solid #222222',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: '32px',
            paddingBottom: '32px',
            zIndex: 200,
            gap: '8px'
        }}>

            {tabs.map(tab => {
                const active = location.pathname === tab.path
                return (
                    <button
                        key={tab.path}
                        onClick={() => navigate(tab.path)}
                        style={{
                            background: active ? 'rgba(124, 58, 237, 0.15)' : 'transparent',
                            border: `1px solid ${active ? 'rgba(124,58,237,0.4)' : 'transparent'}`,
                            borderRadius: '10px',
                            width: '68px',
                            height: '60px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            position: 'relative'
                        }}
                        onMouseEnter={e => {
                            if (!active) e.currentTarget.style.background = 'rgba(124,58,237,0.08)'
                        }}
                        onMouseLeave={e => {
                            if (!active) e.currentTarget.style.background = 'transparent'
                        }}
                    >
                        {active && (
                            <div style={{
                                position: 'absolute',
                                left: '-1px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '2px',
                                height: '28px',
                                background: '#A855F7',
                                borderRadius: '0 2px 2px 0',
                                boxShadow: '0 0 8px rgba(168,85,247,0.8)'
                            }} />
                        )}
                        <span style={{
                            fontSize: '18px',
                            color: active ? '#A855F7' : '#555555',
                            textShadow: active ? '0 0 10px rgba(168,85,247,0.8)' : 'none',
                            transition: 'all 0.2s ease'
                        }}>
                            {tab.icon}
                        </span>
                        <span style={{
                            fontSize: '9px',
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                            color: active ? '#A855F7' : '#555555',
                            fontFamily: 'Courier New, monospace',
                            transition: 'all 0.2s ease'
                        }}>
                            {tab.label}
                        </span>
                    </button>
                )
            })}

        </div>
    )
}

export default NavBar