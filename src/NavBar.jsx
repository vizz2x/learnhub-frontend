import { useState, useRef, useEffect } from 'react'
import apiFetch from './api'

function NavBar({ username, currentPage, onNavigate, onLogout, isTeacher, pages, token }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const dropdownRef = useRef(null)
  const notifRef = useRef(null)
  const initials = username ? username.slice(0, 2).toUpperCase() : 'LH'
  const navPages = pages || ['Dashboard', 'My Courses', 'Assignments', 'Progress']

  useEffect(() => {
    if (!isTeacher && token) fetchNotifications()
  }, [token])

  async function fetchNotifications() {
    try {
      const response = await apiFetch(`/student/notifications?token=${token}`)
      if (!response.ok) return
      const data = await response.json()
      setNotifications(data)
      setUnreadCount(data.filter(n => !n.read).length)
    } catch (error) {
      console.log('Failed to fetch notifications:', error)
    }
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function formatTime(timestamp) {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    const now = new Date()
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  }

  const notifIconStyle = {
    background: 'none', border: 'none', cursor: 'pointer',
    padding: '8px', margin: '0 8px 0 0', position: 'relative',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.2rem', borderRadius: '8px',
    color: isTeacher ? 'rgba(255,255,255,0.8)' : '#6b7280',
  }

  return (
    <nav className={`navbar ${isTeacher ? 'navbar--teacher' : ''}`}>
      <div className="navbar__brand">
        <div className="navbar__logo">📚</div>
        <span className="navbar__brand-text">LearnHub</span>
      </div>

      <div className="navbar__nav">
        {navPages.map((page) => (
          <button
            key={page}
            className={`navbar__nav-btn ${currentPage === page ? 'navbar__nav-btn--active' : ''}`}
            onClick={() => onNavigate(page)}
          >
            {page}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {/* Notification bell — student only */}
        {!isTeacher && (
          <div ref={notifRef} style={{ position: 'relative' }}>
            <button
              style={notifIconStyle}
              onClick={() => { setNotifOpen(!notifOpen); setDropdownOpen(false) }}
              title="Notifications"
            >
              🔔
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute', top: '4px', right: '4px',
                  background: 'var(--red-pen)', color: 'white',
                  borderRadius: '50%', width: '16px', height: '16px',
                  fontSize: '0.65rem', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-label)'
                }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div style={{
                position: 'absolute', right: 0, top: '48px',
                background: 'white', border: '1px solid #e5e7eb',
                borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                width: '320px', zIndex: 200, overflow: 'hidden'
              }}>
                <div style={{
                  padding: '14px 16px', borderBottom: '1px solid #f3f4f6',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <span style={{ fontWeight: 600, color: 'var(--ink)', fontSize: '0.9rem' }}>
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span style={{
                      background: '#fee2e2', color: 'var(--red-pen)',
                      fontSize: '0.72rem', fontWeight: 600,
                      padding: '2px 8px', borderRadius: '999px'
                    }}>
                      {unreadCount} new
                    </span>
                  )}
                </div>

                <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
                  {notifications.length === 0 && (
                    <div style={{ padding: 'var(--space-3)', textAlign: 'center', color: '#6b7280', fontSize: '0.9rem' }}>
                      No notifications yet
                    </div>
                  )}
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid #f9fafb',
                        background: notif.read ? 'white' : '#f0fdf4',
                        display: 'flex', gap: '10px', alignItems: 'flex-start'
                      }}
                    >
                      <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>
                        {notif.type === 'grade' ? '✅' : notif.type === 'course' ? '📚' : '💡'}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--ink)', marginBottom: '2px' }}>
                          {notif.title}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '4px' }}>
                          {notif.body}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>
                          {formatTime(notif.timestamp)}
                        </div>
                      </div>
                      {!notif.read && (
                        <div style={{
                          width: '8px', height: '8px', borderRadius: '50%',
                          background: 'var(--green)', flexShrink: 0, marginTop: '4px'
                        }} />
                      )}
                    </div>
                  ))}
                </div>

                <div style={{
                  padding: '10px 16px', borderTop: '1px solid #f3f4f6',
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
                    More notification types coming soon
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Avatar dropdown */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            className="navbar__avatar"
            onClick={() => { setDropdownOpen(!dropdownOpen); setNotifOpen(false) }}
            title="Account"
          >
            {initials}
          </button>

          {dropdownOpen && (
            <div style={{
              position: 'absolute', right: 0, top: '48px',
              background: 'white', border: '1px solid #e5e7eb',
              borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              minWidth: '200px', zIndex: 200, overflow: 'hidden'
            }}>
              <div style={{
                padding: '14px 16px', borderBottom: '1px solid #f3f4f6',
                background: '#f9fafb'
              }}>
                <div style={{ fontWeight: 600, color: 'var(--ink)', fontSize: '0.9rem' }}>
                  {username}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '2px' }}>
                  {isTeacher ? 'Teacher' : 'Student'}
                </div>
              </div>

              <button
                onClick={() => { setDropdownOpen(false); onNavigate('Profile') }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  width: '100%', padding: '12px 16px', background: 'none',
                  border: 'none', cursor: 'pointer', fontSize: '0.9rem',
                  color: 'var(--charcoal)', fontFamily: 'var(--font-body)',
                  textTransform: 'none', letterSpacing: 'normal', fontWeight: 400,
                  margin: 0, textAlign: 'left'
                }}
              >
                👤 Edit Profile
              </button>

              <div style={{ height: '1px', background: '#f3f4f6' }} />

              <button
                onClick={() => { setDropdownOpen(false); onLogout() }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  width: '100%', padding: '12px 16px', background: 'none',
                  border: 'none', cursor: 'pointer', fontSize: '0.9rem',
                  color: 'var(--red-pen)', fontFamily: 'var(--font-body)',
                  textTransform: 'none', letterSpacing: 'normal', fontWeight: 600,
                  margin: 0, textAlign: 'left'
                }}
              >
                🚪 Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default NavBar