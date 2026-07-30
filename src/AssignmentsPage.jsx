import { useState, useEffect } from 'react'
import apiFetch from './api'
import AssignmentList from './AssignmentList'

function AssignmentsPage({ token, onSelectAssignment }) {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchAssignments()
  }, [token])

  async function fetchAssignments() {
    setLoading(true)
    try {
      const response = await apiFetch(`/student/assignments?token=${token}`)
      if (!response.ok) { setLoading(false); return }
      const data = await response.json()
      setAssignments(data)
      setLoading(false)
    } catch (error) {
      console.log('Network error:', error)
      setLoading(false)
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return 'No due date'
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    })
  }

  function getDueInfo(dueDate, status) {
    if (status === 'graded') return null
    if (!dueDate) return null
    const now = new Date()
    const due = new Date(dueDate)
    const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24))
    if (diffDays < 0) return { label: 'Overdue!', color: '#fee2e2', text: '#991b1b', icon: '⚠️' }
    if (diffDays === 0) return { label: 'Due Today!', color: '#fee2e2', text: '#991b1b', icon: '🔴' }
    if (diffDays === 1) return { label: 'Due Tomorrow!', color: '#fef3c7', text: '#92400e', icon: '🟡' }
    if (diffDays <= 7) return { label: `Due in ${diffDays} days`, color: '#dbeafe', text: '#1d4ed8', icon: '🔵' }
    return null
  }

  function getStatusDisplay(status) {
    switch (status) {
      case 'graded': return { label: '✅ Graded!', bg: '#d1fae5', color: '#065f46' }
      case 'submitted': return { label: '⏳ Submitted', bg: '#dbeafe', color: '#1d4ed8' }
      default: return { label: '📝 To Do', bg: '#f3f4f6', color: '#6b7280' }
    }
  }

  const filtered = filter === 'all' ? assignments : assignments.filter(a => a.status === filter)

  const pendingCount = assignments.filter(a => a.status === 'not started').length
  const submittedCount = assignments.filter(a => a.status === 'submitted').length
  const gradedCount = assignments.filter(a => a.status === 'graded').length

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', animation: 'characterBounce 1s ease-in-out infinite' }}>🦉</div>
        <p style={{ color: '#6b7280', marginTop: 'var(--space-2)' }}>Loading your assignments...</p>
      </div>
    )
  }

  return (
    <div style={{ padding: 'var(--space-3) var(--space-4) 120px', background: '#f8fffe', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ marginBottom: 'var(--space-3)' }}>
        <h2 style={{ margin: '0 0 4px 0', fontSize: '1.6rem' }}>My Assignments 📝</h2>
        <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9rem' }}>
          {pendingCount > 0
            ? `You have ${pendingCount} assignment${pendingCount > 1 ? 's' : ''} waiting! Let's get them done! 💪`
            : gradedCount > 0
            ? "All caught up! Owly is proud of you! 🦉⭐"
            : "No assignments yet. Check back soon!"}
        </p>
      </div>

      {/* Stats row */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 'var(--space-2)', marginBottom: 'var(--space-3)'
      }}>
        {[
          { icon: '📝', count: pendingCount, label: 'To Do', bg: '#fef3c7', color: '#92400e' },
          { icon: '⏳', count: submittedCount, label: 'Submitted', bg: '#dbeafe', color: '#1d4ed8' },
          { icon: '✅', count: gradedCount, label: 'Graded', bg: '#d1fae5', color: '#065f46' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: 'white', borderRadius: '16px', padding: 'var(--space-2)',
            border: '1px solid #f3f4f6', textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: stat.bg, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '1.4rem', margin: '0 auto var(--space-1)'
            }}>
              {stat.icon}
            </div>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: '1.8rem',
              fontWeight: 700, color: stat.color, lineHeight: 1
            }}>
              {stat.count}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '4px', fontWeight: 500 }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: 'var(--space-2)', flexWrap: 'wrap' }}>
        {[
          { key: 'all', label: '🗂️ All' },
          { key: 'not started', label: '📝 To Do' },
          { key: 'submitted', label: '⏳ Submitted' },
          { key: 'graded', label: '✅ Graded' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              background: filter === f.key ? 'var(--green)' : 'white',
              color: filter === f.key ? 'white' : '#6b7280',
              border: filter === f.key ? 'none' : '1px solid #e5e7eb',
              padding: '8px 16px', borderRadius: '999px',
              fontSize: '0.85rem', cursor: 'pointer',
              fontFamily: 'var(--font-body)', textTransform: 'none',
              letterSpacing: 'normal',
              fontWeight: filter === f.key ? 600 : 400,
              margin: 0, transition: 'all 0.15s'
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div style={{
          background: 'white', borderRadius: '24px', padding: 'var(--space-4)',
          textAlign: 'center', border: '2px dashed #d1fae5', maxWidth: '400px', margin: '0 auto'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: 'var(--space-1)' }}>🦉</div>
          <h3 style={{ color: 'var(--ink)', marginBottom: '8px' }}>Nothing here!</h3>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>
            {filter === 'all'
              ? "Your teacher hasn't posted any assignments yet. Check back soon!"
              : `No assignments in this category. Try a different filter!`}
          </p>
        </div>
      )}

      {/* Assignment cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {filtered.map((assignment) => {
          const dueInfo = getDueInfo(assignment.due_date, assignment.status)
          const statusDisplay = getStatusDisplay(assignment.status)

          return (
            <div
              key={assignment.id}
              onClick={() => onSelectAssignment(assignment.course_id)}
              style={{
                background: 'white', borderRadius: '20px',
                padding: 'var(--space-3)', cursor: 'pointer',
                border: '1px solid #f3f4f6',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                transition: 'transform 0.15s, box-shadow 0.15s',
                display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                borderLeft: `4px solid ${assignment.status === 'graded' ? 'var(--green)' : assignment.status === 'submitted' ? '#3b82f6' : 'var(--gold)'}`
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)' }}
            >
              {/* Icon */}
              <div style={{
                width: '52px', height: '52px', borderRadius: '14px',
                background: assignment.status === 'graded' ? '#d1fae5' : assignment.status === 'submitted' ? '#dbeafe' : '#fef3c7',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.6rem', flexShrink: 0
              }}>
                {assignment.status === 'graded' ? '✅' : assignment.status === 'submitted' ? '⏳' : '📝'}
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--ink)', marginBottom: '4px' }}>
                  {assignment.title}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: dueInfo ? '6px' : 0 }}>
                  📚 {assignment.course_title} · ⭐ {assignment.points_possible} pts · 📅 {formatDate(assignment.due_date)}
                </div>
                {dueInfo && (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    background: dueInfo.color, color: dueInfo.text,
                    padding: '2px 10px', borderRadius: '999px',
                    fontSize: '0.75rem', fontWeight: 700
                  }}>
                    {dueInfo.icon} {dueInfo.label}
                  </span>
                )}
              </div>

              {/* Status badge */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                <span style={{
                  background: statusDisplay.bg, color: statusDisplay.color,
                  padding: '4px 12px', borderRadius: '999px',
                  fontSize: '0.78rem', fontWeight: 700, whiteSpace: 'nowrap'
                }}>
                  {statusDisplay.label}
                </span>
                <span style={{ color: '#9ca3af', fontSize: '1rem' }}>→</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Owly tip */}
      {assignments.length > 0 && (
        <div style={{
          marginTop: 'var(--space-3)', background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
          borderRadius: '16px', padding: 'var(--space-2) var(--space-3)',
          border: '1px solid #fcd34d',
          display: 'flex', alignItems: 'center', gap: 'var(--space-2)'
        }}>
          <div style={{ fontSize: '2rem', flexShrink: 0 }}>🦉</div>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#92400e', lineHeight: 1.5 }}>
            <strong>Owly's tip:</strong>{' '}
            {pendingCount > 0
              ? "Start with the assignment due soonest! Breaking it into small steps makes it easier. You've got this! 🌟"
              : "Great job staying on top of your assignments! You're a star student! ⭐"}
          </p>
        </div>
      )}
    </div>
  )
}

export default AssignmentsPage