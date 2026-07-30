import { useState, useEffect } from 'react'
import apiFetch from './api'

function LeaderboardPanel({ token, courseId }) {
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [courseId])

  async function fetchLeaderboard() {
    try {
      const response = await apiFetch(`/courses/${courseId}/leaderboard?token=${token}`)
      if (!response.ok) { setLoading(false); return }
      const data = await response.json()
      setLeaders(data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const medals = ['🥇', '🥈', '🥉']

  return (
    <div style={{
      background: 'linear-gradient(135deg, #e8f5e9, #d1fae5)',
      borderRadius: '20px', padding: 'var(--space-3)',
      border: '1px solid #bbf7d0'
    }}>
      <h3 style={{ margin: '0 0 var(--space-2) 0', fontSize: '0.95rem', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        🏆 Course Leaderboard
      </h3>

      {loading && <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0 }}>Loading...</p>}

      {!loading && leaders.length === 0 && (
        <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0 }}>
          No scores yet — complete lessons to appear here!
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {leaders.map((leader, index) => (
          <div key={leader.user_id} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: index === 0 ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.5)',
            borderRadius: '12px', padding: '8px 12px'
          }}>
            <div style={{ fontSize: '1.4rem', flexShrink: 0, width: '28px', textAlign: 'center' }}>
              {index < 3 ? medals[index] : `${index + 1}.`}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--ink)' }}>
                {leader.username}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                {leader.progress}% complete
              </div>
            </div>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: '1rem',
              fontWeight: 700, color: 'var(--gold-dark)'
            }}>
              ⭐ {leader.points}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LeaderboardPanel