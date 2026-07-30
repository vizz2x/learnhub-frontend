import { useState, useEffect } from 'react'
import TeacherCourseDetail from './TeacherCourseDetail'
import apiFetch from './api'

function TeacherCoursesPage({ token }) {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCourseId, setActiveCourseId] = useState(null)

  useEffect(() => {
    fetchCourses()
  }, [token])

  async function fetchCourses() {
    setLoading(true)
    try {
      const response = await apiFetch(`/teacher/courses?token=${token}`)
      if (!response.ok) { setLoading(false); return }
      const data = await response.json()
      setCourses(data.courses)
      setLoading(false)
    } catch (error) {
      console.log('Network error:', error)
      setLoading(false)
    }
  }

  if (activeCourseId) {
    return (
      <TeacherCourseDetail
        token={token}
        courseId={activeCourseId}
        onBack={() => {
          setActiveCourseId(null)
          fetchCourses()
        }}
      />
    )
  }

  if (loading) return <p style={{ padding: 'var(--space-3)' }}>Loading...</p>

  return (
    <div className="page-content page-forward">
      <h2>My Courses</h2>
      {courses.length === 0 && (
        <p style={{ color: '#6b7280' }}>No courses yet.</p>
      )}
      {courses.map((course) => (
        <div
          key={course.id}
          className="panel"
          style={{
            cursor: 'pointer',
            marginBottom: 'var(--space-2)',
            borderLeft: '4px solid var(--ink)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
          onClick={() => setActiveCourseId(course.id)}
        >
          <div>
            <div style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--ink)', marginBottom: '4px' }}>
              {course.title}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
              {course.status}
            </div>
          </div>
          <div style={{ color: '#9ca3af', fontSize: '1.2rem' }}>→</div>
        </div>
      ))}
    </div>
  )
}

export default TeacherCoursesPage