import { useState, useEffect } from 'react'
import GradingForm from './GradingForm'
import CreateAssignmentForm from './CreateAssignmentForm'
import apiFetch from './api'

function TeacherAssignments({ token, courseId, onBack }) {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeAssignment, setActiveAssignment] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [submissionsLoading, setSubmissionsLoading] = useState(false)
  const [gradingSubmission, setGradingSubmission] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingAssignment, setEditingAssignment] = useState(null)

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

  async function viewSubmissions(assignment) {
    setActiveAssignment(assignment)
    setSubmissionsLoading(true)
    try {
      const response = await apiFetch(`/assignments/${assignment.id}/submissions?token=${token}`)
      if (!response.ok) { setSubmissionsLoading(false); return }
      const data = await response.json()
      setSubmissions(data)
      setSubmissionsLoading(false)
    } catch (error) {
      console.log('Network error:', error)
      setSubmissionsLoading(false)
    }
  }

  function handleBackFromGrading() {
    setGradingSubmission(null)
    viewSubmissions(activeAssignment)
  }

  function handleAssignmentCreated() {
    setShowCreateForm(false)
    fetchAssignments()
  }

  const backBtn = {
    background: 'none', border: 'none', color: 'var(--green)',
    fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600,
    textTransform: 'none', letterSpacing: 'normal',
    padding: '0 0 var(--space-2) 0', cursor: 'pointer', margin: 0, display: 'block'
  }

  const primaryBtn = {
    background: 'var(--green)', color: 'white', border: 'none',
    padding: '10px 20px', borderRadius: '8px',
    fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600,
    textTransform: 'none', letterSpacing: 'normal', cursor: 'pointer', margin: 0
  }

  if (showCreateForm || editingAssignment) {
    return (
      <CreateAssignmentForm
        token={token}
        courseId={courseId}
        onBack={() => { setShowCreateForm(false); setEditingAssignment(null) }}
        onCreated={() => { setShowCreateForm(false); setEditingAssignment(null); fetchAssignments() }}
        assignment={editingAssignment}
      />
    )
  }

  if (gradingSubmission) {
    return (
      <GradingForm
        token={token}
        submission={gradingSubmission}
        assignment={activeAssignment}
        onBack={handleBackFromGrading}
      />
    )
  }

  if (activeAssignment) {
    return (
      <div>
        <button style={backBtn} onClick={() => setActiveAssignment(null)}>
          ← Back to Assignments
        </button>
        <h3 style={{ marginBottom: 'var(--space-2)' }}>
          {activeAssignment.title} — Submissions
        </h3>

        {submissionsLoading && <p style={{ color: '#6b7280' }}>Loading...</p>}

        {!submissionsLoading && submissions.length === 0 && (
          <div className="panel" style={{ textAlign: 'center', padding: 'var(--space-3)', color: '#6b7280' }}>
            <p style={{ margin: 0 }}>No submissions yet.</p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className="panel"
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                borderLeft: `4px solid ${sub.points_earned !== null ? 'var(--green)' : 'var(--gold)'}`
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '4px' }}>
                  Student #{sub.student_id}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                  {sub.status}
                  {sub.is_late && ' · Late submission'}
                  {sub.points_earned !== null && ` · Graded: ${sub.points_earned} pts`}
                </div>
                {sub.content && (
                  <div style={{
                    marginTop: '6px', fontSize: '0.85rem', color: '#374151',
                    background: '#f9fafb', padding: '6px 10px', borderRadius: '6px'
                  }}>
                    "{sub.content}"
                  </div>
                )}
              </div>
              <button
                onClick={() => setGradingSubmission(sub)}
                style={{
                  ...primaryBtn,
                  background: sub.points_earned !== null ? 'var(--ink)' : 'var(--green)',
                  marginLeft: 'var(--space-2)',
                  whiteSpace: 'nowrap',
                  padding: '8px 16px',
                  fontSize: '0.85rem'
                }}
              >
                {sub.points_earned !== null ? 'Edit Grade' : 'Grade →'}
              </button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (loading) return <p style={{ padding: 'var(--space-2)', color: '#6b7280' }}>Loading...</p>

  return (
    <div>
      <button style={backBtn} onClick={onBack}>
        ← Back to Course
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
        <h2 style={{ margin: 0 }}>Assignments</h2>
        <button style={primaryBtn} onClick={() => setShowCreateForm(true)}>
          + Create Assignment
        </button>
      </div>

      {assignments.length === 0 && (
        <div className="panel" style={{ textAlign: 'center', padding: 'var(--space-4)', color: '#6b7280' }}>
          <p style={{ margin: '0 0 var(--space-2) 0' }}>No assignments yet.</p>
          <button style={primaryBtn} onClick={() => setShowCreateForm(true)}>
            Create your first assignment
          </button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        {assignments.map((assignment) => (
          <div
            key={assignment.id}
            className="panel"
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              borderLeft: '4px solid var(--gold)'
            }}
          >
            <div
              style={{ flex: 1, cursor: 'pointer' }}
              onClick={() => viewSubmissions(assignment)}
            >
              <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '4px' }}>
                {assignment.title}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                {assignment.points_possible} pts
                {assignment.due_date && ` · Due ${new Date(assignment.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={() => setEditingAssignment(assignment)}
                style={{
                  background: 'none', border: '1px solid #e5e7eb', color: '#6b7280',
                  padding: '6px 12px', borderRadius: '8px',
                  fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 500,
                  textTransform: 'none', letterSpacing: 'normal', cursor: 'pointer', margin: 0
                }}
              >
                Edit
              </button>
              <div
                style={{ color: '#9ca3af', fontSize: '1.2rem', cursor: 'pointer' }}
                onClick={() => viewSubmissions(assignment)}
              >→</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TeacherAssignments