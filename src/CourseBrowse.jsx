import { useState, useEffect } from 'react'
import apiFetch from './api'

function CourseBrowse({ token }) {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(null)
  const [enrolled, setEnrolled] = useState(null)

  useEffect(() => {
    fetchAvailableCourses()
  }, [token])

  async function fetchAvailableCourses() {
    setLoading(true)
    try {
      const response = await apiFetch(`/courses/available?token=${token}`)
      if (!response.ok) { setLoading(false); return }
      const data = await response.json()
      setCourses(data)
      setLoading(false)
    } catch (error) {
      console.log('Network error:', error)
      setLoading(false)
    }
  }

  async function handleEnroll(courseId) {
    setEnrolling(courseId)
    try {
      const response = await apiFetch(`/courses/${courseId}/enroll?token=${token}`, {
        method: 'POST'
      })
      if (!response.ok) {
        setEnrolling(null)
        return
      }
      setEnrolled(courseId)
      setEnrolling(null)
      fetchAvailableCourses()
    } catch (error) {
      setEnrolling(null)
    }
  }

  if (loading) return <p style={{ color: '#6b7280' }}>Loading available courses...</p>

  if (courses.length === 0) {
    return (
      <p style={{ color: '#6b7280' }}>
        You're enrolled in all available courses.
      </p>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      {courses.map((course) => (
        <div key={course.id} className="panel" style={{ borderLeft: '4px solid var(--gold)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--ink)', marginBottom: '4px' }}>
                {course.title}
              </div>
              {course.short_description && (
                <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '8px' }}>
                  {course.short_description}
                </div>
              )}
              <div style={{ display: 'flex', gap: 'var(--space-2)', fontSize: '0.82rem', color: '#6b7280' }}>
                {course.difficulty_level && <span>📊 {course.difficulty_level}</span>}
                {course.credits && <span>🎓 {course.credits} credits</span>}
              </div>
            </div>
            <button
              onClick={() => handleEnroll(course.id)}
              disabled={enrolling === course.id || enrolled === course.id}
              style={{
                background: enrolled === course.id ? '#d1fae5' : 'var(--green)',
                color: enrolled === course.id ? '#065f46' : 'white',
                border: 'none', padding: '10px 20px', borderRadius: '8px',
                fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600,
                textTransform: 'none', letterSpacing: 'normal',
                cursor: enrolling === course.id ? 'not-allowed' : 'pointer',
                margin: 0, whiteSpace: 'nowrap', flexShrink: 0, marginLeft: 'var(--space-2)'
              }}
            >
              {enrolled === course.id ? '✓ Enrolled' : enrolling === course.id ? 'Enrolling...' : 'Enroll'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CourseBrowse