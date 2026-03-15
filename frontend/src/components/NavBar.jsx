import { useNavigate, useLocation } from 'react-router-dom'

function NavBar({ onLogout }) {
    const navigate = useNavigate()
    const location = useLocation()

    const tabs = [
        { path: '/', label: 'Upload', icon: '▲' },
        { path: '/feed', label: 'Feed', icon: '▓' },
        { path: '/library', label: 'Library', icon: '◈' },
        { path: '/stats', label: 'Stats', icon: '◉' },
    ]

    return (
        <>
            <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 90px;
          background: rgba(10, 10, 10, 0.45);
          backdrop-filter: blur(16px);
          border-right: 1px solid #222222;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 32px 0;
          z-index: 200;
          gap: 8px;
        }

        .nav-btn {
          background: transparent;
          border: 1px solid transparent;
          border-radius: 10px;
          width: 68px;
          height: 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }

        .nav-btn.active {
          background: rgba(124, 58, 237, 0.15);
          border-color: rgba(124, 58, 237, 0.4);
        }

        .nav-btn:not(.active):hover {
          background: rgba(124, 58, 237, 0.08);
        }

        .nav-indicator {
          position: absolute;
          left: -1px;
          top: 50%;
          transform: translateY(-50%);
          width: 2px;
          height: 28px;
          background: #A855F7;
          border-radius: 0 2px 2px 0;
          box-shadow: 0 0 8px rgba(168, 85, 247, 0.8);
        }

        .nav-icon {
          font-size: 18px;
          transition: all 0.2s ease;
        }

        .nav-label {
          font-size: 9px;
          letter-spacing: 1px;
          text-transform: uppercase;
          font-family: 'Courier New', monospace;
          transition: all 0.2s ease;
        }

        .nav-btn.active .nav-icon,
        .nav-btn.active .nav-label {
          color: #A855F7;
          text-shadow: 0 0 10px rgba(168, 85, 247, 0.8);
        }

        .nav-btn:not(.active) .nav-icon,
        .nav-btn:not(.active) .nav-label {
          color: #555555;
        }

        .logout-btn {
          background: transparent;
          border: 1px solid transparent;
          border-radius: 10px;
          width: 68px;
          height: 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: auto;
        }

        .logout-btn:hover {
          background: rgba(255, 60, 172, 0.08);
          border-color: rgba(255, 60, 172, 0.3);
        }

        .logout-btn:hover .logout-icon,
        .logout-btn:hover .logout-label {
          color: #FF3CAC;
          text-shadow: 0 0 10px rgba(255, 60, 172, 0.6);
        }

        .logout-icon {
          font-size: 18px;
          color: #555555;
          transition: all 0.2s ease;
        }

        .logout-label {
          font-size: 9px;
          letter-spacing: 1px;
          text-transform: uppercase;
          font-family: 'Courier New', monospace;
          color: #555555;
          transition: all 0.2s ease;
        }

        .main-content {
          margin-left: 90px;
        }

        @media (max-width: 768px) {
          .navbar {
            top: auto;
            bottom: 0;
            left: 0;
            right: 0;
            height: 64px;
            width: 100%;
            flex-direction: row;
            justify-content: space-around;
            padding: 0;
            border-right: none;
            border-top: 1px solid #222222;
          }

          .nav-btn {
            width: 60px;
            height: 52px;
            border-radius: 8px;
          }

          .nav-indicator {
            left: 50%;
            top: -1px;
            bottom: auto;
            transform: translateX(-50%);
            width: 28px;
            height: 2px;
            border-radius: 0 0 2px 2px;
          }

          .logout-btn {
            width: 60px;
            height: 52px;
            margin-top: 0;
          }

          .main-content {
            margin-left: 0;
            margin-bottom: 64px;
          }
        }
      `}</style>

            <div className="navbar">
                {tabs.map(tab => {
                    const active = location.pathname === tab.path
                    return (
                        <button
                            key={tab.path}
                            onClick={() => navigate(tab.path)}
                            className={`nav-btn ${active ? 'active' : ''}`}
                        >
                            {active && <div className="nav-indicator" />}
                            <span className="nav-icon">{tab.icon}</span>
                            <span className="nav-label">{tab.label}</span>
                        </button>
                    )
                })}

                <button className="logout-btn" onClick={onLogout} title="Logout">
                    <span className="logout-icon">⏻</span>
                    <span className="logout-label">logout</span>
                </button>
            </div>
        </>
    )
}

export default NavBar