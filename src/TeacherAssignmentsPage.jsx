import { useState, useEffect } from 'react'
import apiFetch from './api'

function TeacherAssignmentsPage({ token }) {
  const [pending, setPending] = useState([])
  const [loading, setLoading] = useState(true)
  const [gradingItem, setGradingItem] = useState(null)
  const [points, setPoints] = useState('')
  const [feedback, setFeedback] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchPending()
  }, [token])

  async function fetchPending() {
    setLoading(true)
    try {
      const response = await apiFetch(`/teacher/pending-grades?token=${token}`)
      if (!response.ok) { setLoading(false); return }
      const data = await response.json()
      setPending(data)
      setLoading(false)
    } catch (error) {
      console.log('Network error:', error)
      setLoading(false)
    }
  }

  async function handleSubmitGrade(event) {
    event.preventDefault()
    setMessage('')
    setSubmitting(true)
    try {
      const response = await apiFetch(`/grades/create?token=${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submission_id: gradingItem.submission_id,
          points_earned: parseFloat(points),
          feedback: feedback,
        }),
      })
      if (!response.ok) {
        const err = await response.json()
        setMessage(err.detail || 'Failed to save grade.')
        setSubmitting(false)
        return
      }
      setMessage('Grade saved!')
      setSubmitting(false)
      setTimeout(() => {
        setGradingItem(null)
        setPoints('')
        setFeedback('')
        setMessage('')
        fetchPending()
      }, 1000)
    } catch (error) {
      setMessage('Network error. Please try again.')
      setSubmitting(false)
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    })
  }

  const backBtn = {
    background: 'none', border: 'none', color: 'var(--green)',
    fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600,
    textTransform: 'none', letterSpacing: 'normal',
    padding: '0 0 var(--space-2) 0', cursor: 'pointer', margin: 0, display: 'block'
  }

  if (gradingItem) {
    return (
      <div className="page-content page-forward">
        <button style={backBtn} onClick={() => { setGradingItem(null); setPoints(''); setFeedback(''); setMessage('') }}>
          ← Back to Assignments
        </button>

        <div className="panel" style={{ marginBottom: 'var(--space-2)' }}>
          <h2 style={{ marginBottom: '4px' }}>{gradingItem.assignment_title}</h2>
          <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: 'var(--space-2)' }}>
            {gradingItem.course_title} · {gradingItem.points_possible} pts possible
          </div>
          {gradingItem.description && (
            <div style={{ marginBottom: 'var(--space-2)' }}>
              <div style={{ fontFamily: 'var(--font-label)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--green)', marginBottom: '6px', fontWeight: 600 }}>Question</div>
              <p style={{ margin: 0 }}>{gradingItem.description}</p>
            </div>
          )}
        </div>

        <div className="panel" style={{ marginBottom: 'var(--space-2)', borderLeft: '4px solid var(--ink)' }}>
          <div style={{ fontFamily: 'var(--font-label)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink)', marginBottom: '8px', fontWeight: 600 }}>
            {gradingItem.student_name}'s Answer
          </div>
          <p style={{ margin: '0 0 6px 0' }}>{gradingItem.content}</p>
          <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>
            Submitted {formatDate(gradingItem.submitted_at)}
          </div>
        </div>

        <div className="panel">
          <h3 style={{ marginBottom: 'var(--space-2)' }}>Enter Grade</h3>
          <form onSubmit={handleSubmitGrade}>
            <div style={{ marginBottom: 'var(--space-2)' }}>
              <label style={{ fontFamily: 'var(--font-label)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink)', marginBottom: '6px', display: 'block', fontWeight: 600 }}>
                Points Earned (out of {gradingItem.points_possible})
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max={gradingItem.points_possible}
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                required
                style={{ maxWidth: '200px' }}
              />
            </div>
            <div style={{ marginBottom: 'var(--space-2)' }}>
              <label style={{ fontFamily: 'var(--font-label)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink)', marginBottom: '6px', display: 'block', fontWeight: 600 }}>
                Feedback
              </label>
              <textarea
                rows="4"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Write feedback for the student..."
                style={{ width: '100%', maxWidth: '100%' }}
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              style={{
                background: 'var(--green)', color: 'white', border: 'none',
                padding: '10px 24px', borderRadius: '8px',
                fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600,
                textTransform: 'none', letterSpacing: 'normal',
                cursor: submitting ? 'not-allowed' : 'pointer', margin: 0,
                opacity: submitting ? 0.7 : 1
              }}
            >
              {submitting ? 'Saving...' : 'Save Grade'}
            </button>
          </form>
          {message && (
            <p style={{
              marginTop: '12px', padding: '10px 14px', borderRadius: '8px',
              background: message.includes('saved') ? '#d1fae5' : '#fee2e2',
              color: message.includes('saved') ? '#065f46' : '#991b1b',
              fontSize: '0.9rem'
            }}>
              {message}
            </p>
          )}
        </div>
      </div>
    )
  }

  if (loading) return <p style={{ padding: 'var(--space-3)' }}>Loading...</p>

  return (
    <div className="page-content page-forward">
      <h2>Assignments to Grade</h2>
      <p style={{ color: '#6b7280', marginTop: '-12px', marginBottom: 'var(--space-3)' }}>
        {pending.length} submission{pending.length !== 1 ? 's' : ''} waiting
      </p>

      {pending.length === 0 && (
        <div className="panel" style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-1)' }}>🎉</div>
          <p style={{ fontWeight: 600, color: 'var(--ink)', margin: '0 0 4px 0', fontSize: '1.05rem' }}>All caught up!</p>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>No submissions waiting to be graded.</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        {pending.map((item) => (
          <div
            key={item.submission_id}
            className="panel"
            style={{
              cursor: 'pointer',
              borderLeft: '4px solid var(--gold)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}
            onClick={() => setGradingItem(item)}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '4px' }}>
                {item.assignment_title}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                {item.course_title} · {item.student_name} · Submitted {formatDate(item.submitted_at)}
              </div>
            </div>
            <button style={{
              background: 'var(--green)', color: 'white', border: 'none',
              padding: '8px 16px', borderRadius: '8px',
              fontFamily: 'var(--font-body)', fontSize: '0.85rem', fontWeight: 600,
              textTransform: 'none', letterSpacing: 'normal',
              cursor: 'pointer', margin: 0, whiteSpace: 'nowrap'
            }}>
              Grade →
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TeacherAssignmentsPage