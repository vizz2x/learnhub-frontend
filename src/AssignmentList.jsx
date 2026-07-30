import { useState, useEffect } from 'react'
import apiFetch from './api'

function AssignmentList({ token, courseId, onBack }) {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeAssignment, setActiveAssignment] = useState(null)
  const [content, setContent] = useState('')
  const [submitMessage, setSubmitMessage] = useState('')
  const [mySubmission, setMySubmission] = useState(null)
  const [checkingSubmission, setCheckingSubmission] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchAssignments()
  }, [courseId])

  async function fetchAssignments() {
    setLoading(true)
    try {
      const response = await apiFetch(`/assignments/course/${courseId}?token=${token}`)
      if (!response.ok) { setLoading(false); return }
      const data = await response.json()
      setAssignments(data)
      setLoading(false)
    } catch (error) {
      console.log('Network error:', error)
      setLoading(false)
    }
  }

  async function checkMySubmission(assignmentId) {
    setCheckingSubmission(true)
    try {
      const response = await apiFetch(`/assignments/${assignmentId}/my-submission?token=${token}`)
      if (response.status === 404) { setMySubmission(null); setCheckingSubmission(false); return }
      if (!response.ok) { setCheckingSubmission(false); return }
      const data = await response.json()
      setMySubmission(data)
      setCheckingSubmission(false)
    } catch (error) {
      setCheckingSubmission(false)
    }
  }

  function openAssignment(assignment) {
    setActiveAssignment(assignment)
    setMySubmission(null)
    setSubmitMessage('')
    setContent('')
    checkMySubmission(assignment.id)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitMessage('')
    setSubmitting(true)
    try {
      const response = await apiFetch(`/submissions/create?token=${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignment_id: activeAssignment.id,
          content: content,
          submission_type: 'text',
        }),
      })
      if (!response.ok) {
        const err = await response.json()
        setSubmitMessage(err.detail || 'Something went wrong. Try again!')
        setSubmitting(false)
        return
      }
      setSubmitMessage('success')
      setContent('')
      setSubmitting(false)
      checkMySubmission(activeAssignment.id)
    } catch (error) {
      setSubmitMessage('Network error. Please try again!')
      setSubmitting(false)
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return 'No due date'
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    })
  }

  function getDueUrgency(dueDate) {
    if (!dueDate) return null
    const diffDays = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24))
    if (diffDays < 0) return { label: '⚠️ Overdue!', color: '#fee2e2', text: '#991b1b' }
    if (diffDays <= 1) return { label: '🔴 Due very soon!', color: '#fee2e2', text: '#991b1b' }
    if (diffDays <= 3) return { label: '🟡 Due soon!', color: '#fef3c7', text: '#92400e' }
    return null
  }

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', animation: 'characterBounce 1s ease-in-out infinite' }}>🦉</div>
        <p style={{ color: '#6b7280', marginTop: 'var(--space-2)' }}>Loading assignments...</p>
      </div>
    )
  }

  // ── ASSIGNMENT DETAIL VIEW ──
  if (activeAssignment) {
    const urgency = getDueUrgency(activeAssignment.due_date)
    const isGraded = mySubmission?.status === 'graded'
    const isSubmitted = mySubmission?.status === 'submitted'

    return (
      <div style={{ padding: 'var(--space-3) var(--space-4) 120px', background: '#f8fffe', minHeight: '100vh' }}>
        <button onClick={() => { setActiveAssignment(null); setSubmitMessage('') }} style={{
          background: 'none', border: 'none', color: 'var(--green)',
          fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600,
          textTransform: 'none', letterSpacing: 'normal',
          padding: '0 0 var(--space-2) 0', cursor: 'pointer', margin: 0, display: 'block'
        }}>← Back to Assignments</button>

        {/* Assignment card */}
        <div style={{
          background: 'white', borderRadius: '24px', overflow: 'hidden',
          border: '1px solid #f3f4f6', boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          marginBottom: 'var(--space-2)'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #e8f5e9, #d1fae5)',
            padding: 'var(--space-3)',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
              <div>
                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📝</div>
                <h2 style={{ margin: '0 0 6px 0', fontSize: '1.4rem', color: 'var(--ink)' }}>
                  {activeAssignment.title}
                </h2>
                <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', fontSize: '0.82rem', color: '#6b7280' }}>
                  <span>⭐ {activeAssignment.points_possible} points</span>
                  <span>📅 Due {formatDate(activeAssignment.due_date)}</span>
                </div>
              </div>
              {urgency && (
                <div style={{
                  background: urgency.color, color: urgency.text,
                  borderRadius: '12px', padding: '8px 14px',
                  fontSize: '0.82rem', fontWeight: 700, whiteSpace: 'nowrap'
                }}>
                  {urgency.label}
                </div>
              )}
            </div>
          </div>

          <div style={{ padding: 'var(--space-3)' }}>
            {/* Question */}
            {activeAssignment.description && (
              <div style={{
                background: '#f9fafb', borderRadius: '16px',
                padding: 'var(--space-2) var(--space-3)', marginBottom: 'var(--space-2)',
                borderLeft: '4px solid var(--green)'
              }}>
                <div style={{
                  fontFamily: 'var(--font-label)', fontSize: '0.72rem',
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                  color: 'var(--green)', marginBottom: '8px', fontWeight: 700
                }}>
                  🤔 Your Question
                </div>
                <p style={{ margin: 0, fontSize: '1rem', color: 'var(--ink)', lineHeight: 1.6, fontWeight: 500 }}>
                  {activeAssignment.description}
                </p>
              </div>
            )}

            {/* Instructions */}
            {activeAssignment.instructions && (
              <div style={{ marginBottom: 'var(--space-2)', fontSize: '0.9rem', color: '#6b7280' }}>
                <strong>📋 Instructions:</strong> {activeAssignment.instructions}
              </div>
            )}
          </div>
        </div>

        {/* Checking state */}
        {checkingSubmission && (
          <div style={{ textAlign: 'center', padding: 'var(--space-2)', color: '#6b7280', fontSize: '0.9rem' }}>
            🦉 Owly is checking your submission...
          </div>
        )}

        {/* Submission result */}
        {!checkingSubmission && mySubmission && (
          <div style={{
            background: 'white', borderRadius: '20px', padding: 'var(--space-3)',
            border: `2px solid ${isGraded ? 'var(--green)' : '#3b82f6'}`,
            marginBottom: 'var(--space-2)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-2)' }}>
              <div style={{ fontSize: '2rem' }}>{isGraded ? '✅' : '⏳'}</div>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--ink)', fontSize: '1rem' }}>
                  {isGraded ? 'Your assignment has been graded!' : 'Your answer has been submitted!'}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#6b7280' }}>
                  {isGraded ? 'See how you did below 👇' : 'Your teacher will grade it soon. Great job submitting! 🌟'}
                </div>
              </div>
            </div>

            {/* Student's answer */}
            <div style={{
              background: '#f9fafb', borderRadius: '12px',
              padding: 'var(--space-2)', marginBottom: isGraded ? 'var(--space-2)' : 0
            }}>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                Your Answer
              </div>
              <p style={{ margin: 0, color: 'var(--charcoal)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {mySubmission.content}
              </p>
            </div>

            {/* Grade result */}
            {isGraded && mySubmission.points_earned !== null && (
              <div style={{
                background: 'linear-gradient(135deg, #e8f5e9, #d1fae5)',
                borderRadius: '16px', padding: 'var(--space-2) var(--space-3)',
                display: 'flex', alignItems: 'center', gap: 'var(--space-2)'
              }}>
                <div style={{ fontSize: '3rem' }}>🏆</div>
                <div>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: '1.8rem',
                    fontWeight: 700, color: 'var(--green)', lineHeight: 1
                  }}>
                    {mySubmission.points_earned} / {activeAssignment.points_possible}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#6b7280', marginTop: '2px' }}>
                    points earned
                  </div>
                </div>
                {mySubmission.feedback && (
                  <div style={{
                    flex: 1, background: 'white', borderRadius: '12px',
                    padding: 'var(--space-1) var(--space-2)'
                  }}>
                    <div style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600, marginBottom: '4px' }}>
                      🦉 TEACHER'S FEEDBACK
                    </div>
                    <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--charcoal)', lineHeight: 1.5, fontStyle: 'italic' }}>
                      "{mySubmission.feedback}"
                    </p>
                  </div>
                )}
              </div>
            )}

            {isGraded && (
              <p style={{ margin: 'var(--space-1) 0 0', textAlign: 'center', color: '#6b7280', fontSize: '0.82rem' }}>
                This assignment has been graded and cannot be resubmitted.
              </p>
            )}
          </div>
        )}

        {/* Submit form */}
        {!checkingSubmission && !isGraded && !isSubmitted && (
          <div style={{
            background: 'white', borderRadius: '20px', padding: 'var(--space-3)',
            border: '1px solid #f3f4f6', boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--space-2)' }}>
              <div style={{ fontSize: '1.8rem' }}>🦉</div>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--ink)', fontSize: '0.95rem' }}>
                  Write your answer below!
                </div>
                <div style={{ fontSize: '0.82rem', color: '#6b7280' }}>
                  Take your time and do your best. Owly believes in you! 💪
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <textarea
                rows="6"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type your answer here... Don't worry, there's no wrong way to try! 🌟"
                style={{ width: '100%', maxWidth: '100%', marginBottom: 'var(--space-2)', fontSize: '0.95rem' }}
              />
              <button
                type="submit"
                disabled={submitting || !content.trim()}
                style={{
                  background: content.trim() ? 'var(--green)' : '#e5e7eb',
                  color: content.trim() ? 'white' : '#9ca3af',
                  border: 'none', padding: '14px 28px', borderRadius: '12px',
                  fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 700,
                  textTransform: 'none', letterSpacing: 'normal',
                  cursor: submitting || !content.trim() ? 'not-allowed' : 'pointer',
                  margin: 0, transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: '8px'
                }}
              >
                {submitting ? '🦉 Submitting...' : '🚀 Submit My Answer!'}
              </button>
            </form>

            {submitMessage && submitMessage !== 'success' && (
              <div style={{
                marginTop: 'var(--space-2)', padding: '12px 16px', borderRadius: '12px',
                background: '#fee2e2', color: '#991b1b', fontSize: '0.9rem'
              }}>
                ⚠️ {submitMessage}
              </div>
            )}
          </div>
        )}

        {/* Success celebration */}
        {submitMessage === 'success' && (
          <div style={{
            background: 'linear-gradient(135deg, #e8f5e9, #d1fae5)',
            borderRadius: '20px', padding: 'var(--space-3)',
            textAlign: 'center', border: '2px solid var(--green)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '10px', animation: 'characterBounce 0.5s ease-in-out 3' }}>🎉</div>
            <h3 style={{ color: 'var(--green)', margin: '0 0 8px 0' }}>Amazing! You submitted it!</h3>
            <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9rem' }}>
              Your teacher will grade it soon. In the meantime, keep learning! You're a star! ⭐
            </p>
          </div>
        )}
      </div>
    )
  }

  // ── ASSIGNMENT LIST VIEW ──
  return (
    <div style={{ padding: 'var(--space-3) var(--space-4) 120px', background: '#f8fffe', minHeight: '100vh' }}>
      <button onClick={onBack} style={{
        background: 'none', border: 'none', color: 'var(--green)',
        fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600,
        textTransform: 'none', letterSpacing: 'normal',
        padding: '0 0 var(--space-2) 0', cursor: 'pointer', margin: 0, display: 'block'
      }}>← Back to Course</button>

      <h2 style={{ margin: '0 0 var(--space-3) 0', fontSize: '1.6rem' }}>📝 Assignments</h2>

      {assignments.length === 0 && (
        <div style={{
          background: 'white', borderRadius: '24px', padding: 'var(--space-4)',
          textAlign: 'center', border: '2px dashed #d1fae5', maxWidth: '400px', margin: '0 auto'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: 'var(--space-1)', animation: 'characterBounce 2s ease-in-out infinite' }}>🦉</div>
          <h3 style={{ color: 'var(--ink)', marginBottom: '8px' }}>No assignments yet!</h3>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>
            Your teacher hasn't posted any assignments yet. Check back soon!
          </p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {assignments.map((assignment) => {
          const urgency = getDueUrgency(assignment.due_date)
          return (
            <div
              key={assignment.id}
              onClick={() => openAssignment(assignment)}
              style={{
                background: 'white', borderRadius: '20px',
                padding: 'var(--space-3)', cursor: 'pointer',
                border: '1px solid #f3f4f6',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                transition: 'transform 0.15s, box-shadow 0.15s',
                display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                borderLeft: '4px solid var(--gold)'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)' }}
            >
              <div style={{
                width: '52px', height: '52px', borderRadius: '14px',
                background: '#fef3c7', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '1.8rem', flexShrink: 0
              }}>
                📝
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--ink)', marginBottom: '4px' }}>
                  {assignment.title}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#6b7280', display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                  <span>⭐ {assignment.points_possible} pts</span>
                  <span>📅 {formatDate(assignment.due_date)}</span>
                </div>
                {urgency && (
                  <div style={{
                    marginTop: '6px', display: 'inline-flex', alignItems: 'center',
                    background: urgency.color, color: urgency.text,
                    padding: '2px 10px', borderRadius: '999px',
                    fontSize: '0.75rem', fontWeight: 700
                  }}>
                    {urgency.label}
                  </div>
                )}
              </div>
              <div style={{ color: '#9ca3af', fontSize: '1.4rem' }}>→</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AssignmentList