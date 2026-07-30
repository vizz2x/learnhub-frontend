import { useState, useEffect } from 'react'
import apiFetch from './api'

function CreateAssignmentForm({ token, courseId, onBack, onCreated, assignment }) {
  const isEditing = !!assignment

  const [lessons, setLessons] = useState([])
  const [loadingLessons, setLoadingLessons] = useState(true)
  const [lessonId, setLessonId] = useState(assignment?.lesson_id || '')
  const [title, setTitle] = useState(assignment?.title || '')
  const [description, setDescription] = useState(assignment?.description || '')
  const [instructions, setInstructions] = useState(assignment?.instructions || '')
  const [assignmentType, setAssignmentType] = useState(assignment?.assignment_type || '')
  const [pointsPossible, setPointsPossible] = useState(assignment?.points_possible || 100)
  const [dueDate, setDueDate] = useState(
    assignment?.due_date ? assignment.due_date.slice(0, 16) : ''
  )
  const [allowLate, setAllowLate] = useState(assignment?.allow_late_submission || false)
  const [latePenalty, setLatePenalty] = useState(assignment?.late_penalty_percentage || 0)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchLessons()
  }, [courseId])

  async function fetchLessons() {
    setLoadingLessons(true)
    try {
      const response = await apiFetch(`/courses/${courseId}?token=${token}`)
      if (!response.ok) { setLoadingLessons(false); return }
      const data = await response.json()
      const allLessons = []
      data.modules.forEach((module) => {
        module.lessons.forEach((lesson) => allLessons.push(lesson))
      })
      setLessons(allLessons)
      if (!isEditing && allLessons.length > 0) setLessonId(allLessons[0].id)
      setLoadingLessons(false)
    } catch (error) {
      console.log('Network error:', error)
      setLoadingLessons(false)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    setSubmitting(true)

    try {
      const url = isEditing
        ? `/assignments/${assignment.id}?token=${token}`
        : `/assignments/create?token=${token}`
      const method = isEditing ? 'PUT' : 'POST'

      const response = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lesson_id: parseInt(lessonId),
          course_id: courseId,
          title,
          description,
          instructions,
          assignment_type: assignmentType,
          points_possible: parseFloat(pointsPossible),
          due_date: dueDate ? dueDate : null,
          allow_late_submission: allowLate,
          late_penalty_percentage: allowLate ? parseFloat(latePenalty) : 0,
        }),
      })

      if (!response.ok) {
        const err = await response.json()
        setMessage(err.detail || `Failed to ${isEditing ? 'update' : 'create'} assignment.`)
        setSubmitting(false)
        return
      }

      setSubmitting(false)
      onCreated()
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

  if (loadingLessons) return <p style={{ padding: 'var(--space-3)' }}>Loading...</p>

  return (
    <div>
      <button style={backBtn} onClick={onBack}>← Back to Assignments</button>
      <h2 style={{ marginBottom: 'var(--space-3)' }}>
        {isEditing ? 'Edit Assignment' : 'Create New Assignment'}
      </h2>

      {lessons.length === 0 && (
        <div className="panel" style={{ color: '#6b7280', textAlign: 'center' }}>
          <p style={{ margin: 0 }}>This course has no lessons yet.</p>
        </div>
      )}

      {lessons.length > 0 && (
        <div className="panel">
          <form onSubmit={handleSubmit}>

            <div style={{ marginBottom: 'var(--space-2)' }}>
              <label style={fieldLabel}>Attach to Lesson</label>
              <select
                value={lessonId}
                onChange={(e) => setLessonId(e.target.value)}
                style={{ maxWidth: '100%' }}
              >
                {lessons.map((lesson) => (
                  <option key={lesson.id} value={lesson.id}>{lesson.title}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 'var(--space-2)' }}>
              <label style={fieldLabel}>Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                autoComplete="off"
                placeholder="Assignment title"
                style={{ maxWidth: '100%' }}
              />
            </div>

            <div style={{ marginBottom: 'var(--space-2)' }}>
              <label style={fieldLabel}>Question / Description</label>
              <textarea
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                autoComplete="off"
                placeholder="What should students answer or do?"
                style={{ width: '100%', maxWidth: '100%' }}
              />
            </div>

            <div style={{ marginBottom: 'var(--space-2)' }}>
              <label style={fieldLabel}>Instructions</label>
              <textarea
                rows="2"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                autoComplete="off"
                placeholder="Any specific instructions for students"
                style={{ width: '100%', maxWidth: '100%' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
              <div>
                <label style={fieldLabel}>Assignment Type</label>
                <input
                  type="text"
                  value={assignmentType}
                  onChange={(e) => setAssignmentType(e.target.value)}
                  autoComplete="off"
                  placeholder="e.g. homework, essay"
                />
              </div>
              <div>
                <label style={fieldLabel}>Points Possible *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={pointsPossible}
                  onChange={(e) => setPointsPossible(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: 'var(--space-2)' }}>
              <label style={fieldLabel}>Due Date</label>
              <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={{ maxWidth: '300px' }}
              />
            </div>

            <div style={{ marginBottom: 'var(--space-2)' }}>
              <label style={{
                display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--charcoal)',
                textTransform: 'none', letterSpacing: 'normal'
              }}>
                <input
                  type="checkbox"
                  checked={allowLate}
                  onChange={(e) => setAllowLate(e.target.checked)}
                />
                Allow late submissions
              </label>
            </div>

            {allowLate && (
              <div style={{ marginBottom: 'var(--space-2)' }}>
                <label style={fieldLabel}>Late Penalty (%)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={latePenalty}
                  onChange={(e) => setLatePenalty(e.target.value)}
                  style={{ maxWidth: '160px' }}
                />
              </div>
            )}

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
              {submitting
                ? (isEditing ? 'Saving...' : 'Creating...')
                : (isEditing ? 'Save Changes' : 'Create Assignment')}
            </button>
          </form>

          {message && (
            <p style={{
              marginTop: '12px', padding: '10px 14px', borderRadius: '8px',
              background: '#fee2e2', color: '#991b1b', fontSize: '0.9rem'
            }}>
              {message}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default CreateAssignmentForm