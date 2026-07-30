import { useState, useEffect } from 'react'
import TeacherLessonViewer from './TeacherLessonViewer'
import TeacherAssignments from './TeacherAssignments'
import apiFetch from './api'

function TeacherCourseDetail({ token, courseId, onBack }) {
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeLessonId, setActiveLessonId] = useState(null)
  const [showAssignments, setShowAssignments] = useState(false)

  useEffect(() => {
    fetchCourse()
  }, [courseId])

  async function fetchCourse() {
    setLoading(true)
    try {
      const response = await apiFetch(`/courses/${courseId}?token=${token}`)
      if (!response.ok) { setLoading(false); return }
      const data = await response.json()
      setCourse(data)
      setLoading(false)
    } catch (error) {
      console.log('Network error:', error)
      setLoading(false)
    }
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

  if (activeLessonId) {
    return (
      <div className="page-content">
        <button style={backBtn} onClick={() => setActiveLessonId(null)}>
          ← Back to {course?.title}
        </button>
        <TeacherLessonViewer
          token={token}
          lessonId={activeLessonId}
          onBack={() => setActiveLessonId(null)}
          hideBackButton={true}
        />
      </div>
    )
  }

  if (showAssignments) {
    return (
      <div className="page-content">
        <TeacherAssignments
          token={token}
          courseId={courseId}
          onBack={() => setShowAssignments(false)}
        />
      </div>
    )
  }



  if (loading) return <p style={{ padding: 'var(--space-3)' }}>Loading...</p>
  if (!course) return <p style={{ padding: 'var(--space-3)' }}>Course not found.</p>

  return (
    <div className="page-content page-forward">
      <button style={backBtn} onClick={onBack}>
        ← My Courses
      </button>

      <div style={{ marginBottom: 'var(--space-3)' }}>
        <h2 style={{ marginBottom: '4px' }}>{course.title}</h2>
        <p style={{ color: '#6b7280', margin: 0 }}>{course.description}</p>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
        <button style={primaryBtn} onClick={() => setShowAssignments(true)}>
          📝 Manage Assignments
        </button>
      </div>

      <div className="panel">
        <h3>Course Content</h3>
        {course.modules.map((module) => (
          <div key={module.id} style={{ marginBottom: 'var(--space-2)' }}>
            <div style={{
              fontFamily: 'var(--font-label)', fontSize: '0.75rem',
              textTransform: 'uppercase', letterSpacing: '0.05em',
              color: 'var(--green)', marginBottom: '8px', fontWeight: 600
            }}>
              {module.title}
            </div>
            {module.lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="course-row"
                style={{ cursor: 'pointer' }}
                onClick={() => setActiveLessonId(lesson.id)}
              >
                <div className="course-row__icon" style={{ fontSize: '1rem' }}>
                  {lesson.title.toLowerCase().includes('video') ? '🎬' : '📄'}
                </div>
                <div className="course-row__info">
                  <div className="course-row__title">{lesson.title}</div>
                </div>
                <div style={{ color: '#9ca3af', fontSize: '0.85rem' }}>→</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default TeacherCourseDetail