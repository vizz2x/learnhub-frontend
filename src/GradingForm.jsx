import { useState } from 'react'
import apiFetch from './api'
import { letterGrade } from './gradeUtils'

function GradingForm({ token, submission, assignment, onBack }) {
  const [pointsEarned, setPointsEarned] = useState(
    submission.points_earned !== null ? submission.points_earned : ''
  )
  const [feedback, setFeedback] = useState(submission.feedback || '')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmitGrade(event) {
    event.preventDefault()
    setMessage('')
    setSubmitting(true)
    try {
      const response = await apiFetch(`/grades/create?token=${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submission_id: submission.id,
          points_earned: parseFloat(pointsEarned),
          feedback: feedback,
        }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        setMessage(errorData.detail || 'Failed to save grade.')
        setSubmitting(false)
        return
      }
      setMessage('Grade saved successfully!')
      setSubmitting(false)
    } catch (error) {
      setMessage('Network error. Please try again.')
      setSubmitting(false)
    }
  }

  const backBtn = {
    background: 'none', border: 'none', color: 'var(--green)',
    fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600,
    textTransform: 'none', letterSpacing: 'normal',
    padding: '0 0 var(--space-2) 0', cursor: 'pointer', margin: 0, display: 'block'
  }

  const fieldLabel = {
    fontFamily: 'var(--font-label)', fontSize: '0.75rem', textTransform: 'uppercase',
    letterSpacing: '0.05em', color: 'var(--ink)', marginBottom: '6px',
    display: 'block', fontWeight: 600
  }

  const percentage = pointsEarned !== ''
    ? Math.round((parseFloat(pointsEarned) / assignment.points_possible) * 100)
    : null

  const gradeInfo = percentage !== null ? letterGrade(percentage) : null

  return (
    <div>
      <button style={backBtn} onClick={onBack}>← Back to Submissions</button>

      <div className="panel" style={{ marginBottom: 'var(--space-2)' }}>
        <h2 style={{ marginBottom: '4px' }}>{assignment.title}</h2>
        <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: 'var(--space-2)' }}>
          {assignment.points_possible} points possible
          {submission.is_late && (
            <span style={{
              marginLeft: '10px', background: '#fee2e2', color: '#991b1b',
              padding: '2px 8px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 600
            }}>
              Late submission
            </span>
          )}
        </div>

        {assignment.description && (
          <div style={{ marginBottom: 'var(--space-2)' }}>
            <div style={fieldLabel}>Question</div>
            <p style={{ margin: 0, lineHeight: 1.6 }}>{assignment.description}</p>
          </div>
        )}
      </div>

      <div className="panel" style={{ marginBottom: 'var(--space-2)', borderLeft: '4px solid var(--ink)' }}>
        <div style={fieldLabel}>Student #{submission.student_id}'s Answer</div>
        <p style={{ margin: 0, lineHeight: 1.7, fontSize: '0.95rem' }}>{submission.content}</p>
      </div>

      <div className="panel">
        <h3 style={{ marginBottom: 'var(--space-2)' }}>Enter Grade</h3>
        <form onSubmit={handleSubmitGrade}>

          <div style={{ marginBottom: 'var(--space-2)' }}>
            <label style={fieldLabel}>
              Points Earned (out of {assignment.points_possible})
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <input
                type="number"
                step="0.01"
                min="0"
                max={assignment.points_possible}
                value={pointsEarned}
                onChange={(e) => setPointsEarned(e.target.value)}
                required
                style={{ maxWidth: '160px', margin: 0 }}
              />
              {gradeInfo && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>{percentage}%</span>
                  <span style={{
                    fontFamily: 'var(--font-display)', fontSize: '1.4rem',
                    fontWeight: 700, color: gradeInfo.color
                  }}>
                    {gradeInfo.grade}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div style={{ marginBottom: 'var(--space-2)' }}>
            <label style={fieldLabel}>Feedback</label>
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
              padding: '12px 28px', borderRadius: '8px',
              fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: 600,
              textTransform: 'none', letterSpacing: 'normal',
              cursor: submitting ? 'not-allowed' : 'pointer',
              margin: 0, opacity: submitting ? 0.7 : 1
            }}
          >
            {submitting ? 'Saving...' : 'Save Grade'}
          </button>
        </form>

        {message && (
          <p style={{
            marginTop: '12px', padding: '10px 14px', borderRadius: '8px',
            background: message.includes('success') ? '#d1fae5' : '#fee2e2',
            color: message.includes('success') ? '#065f46' : '#991b1b',
            fontSize: '0.9rem', margin: '12px 0 0 0'
          }}>
            {message}
          </p>
        )}
      </div>
    </div>
  )
}

export default GradingForm