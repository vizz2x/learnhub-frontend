import { useState, useEffect } from 'react'
import apiFetch from './api'

function TeacherStudentsPage({ token }) {
  const [courses, setCourses] = useState([])
  const [students, setStudents] = useState({})
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState({})

  useEffect(() => {
    fetchAll()
  }, [token])

  async function fetchAll() {
    setLoading(true)
    try {
      const coursesRes = await apiFetch(`/teacher/courses?token=${token}`)
      if (!coursesRes.ok) { setLoading(false); return }
      const coursesData = await coursesRes.json()
      setCourses(coursesData.courses)

      const studentMap = {}
      for (const course of coursesData.courses) {
        const studentsRes = await apiFetch(`/courses/${course.id}/students?token=${token}`)
        if (studentsRes.ok) {
          studentMap[course.id] = await studentsRes.json()
        }
      }
      setStudents(studentMap)
      setLoading(false)
    } catch (error) {
      console.log('Network error:', error)
      setLoading(false)
    }
  }

  function toggleCourse(courseId) {
    setExpanded(prev => ({ ...prev, [courseId]: !prev[courseId] }))
  }

  if (loading) return <p style={{ padding: 'var(--space-3)' }}>Loading...</p>

  return (
    <div className="page-content page-forward">
      <h2>Students</h2>

      {courses.length === 0 && (
        <p style={{ color: '#6b7280' }}>No courses yet.</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        {courses.map((course) => {
          const courseStudents = students[course.id] || []
          const isOpen = expanded[course.id]

          return (
            <div key={course.id} style={{ border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', background: 'white' }}>

              <div
                onClick={() => toggleCourse(course.id)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: 'var(--space-2) var(--space-3)',
                  cursor: 'pointer', borderLeft: '4px solid var(--ink)',
                  background: isOpen ? '#f9fafb' : 'white',
                  transition: 'background 0.15s'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--ink)' }}>
                    {course.title}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#6b7280', marginTop: '2px' }}>
                    {courseStudents.length} student{courseStudents.length !== 1 ? 's' : ''} enrolled
                  </div>
                </div>
                <div style={{
                  fontSize: '0.85rem', color: '#6b7280',
                  transition: 'transform 0.2s',
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                }}>
                  ▼
                </div>
              </div>

              {isOpen && (
                <div style={{ borderTop: '1px solid #f3f4f6' }}>
                  {courseStudents.length === 0 && (
                    <div style={{ padding: 'var(--space-2) var(--space-3)', color: '#6b7280', fontSize: '0.9rem' }}>
                      No students enrolled yet.
                    </div>
                  )}
                  {courseStudents.map((student, index) => (
                    <div
                      key={student.user_id}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: 'var(--space-2) var(--space-3)',
                        borderBottom: index < courseStudents.length - 1 ? '1px solid #f3f4f6' : 'none',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '6px', fontSize: '0.95rem' }}>
                          {student.full_name || student.username}
                        </div>
                        <div className="progress-bar" style={{ width: '180px', marginBottom: '4px' }}>
                          <div
                            className="progress-bar__fill"
                            style={{ width: `${student.progress_percentage}%` }}
                          ></div>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                          {student.progress_percentage}% complete
                        </div>
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.3rem',
                        fontWeight: 700,
                        color: student.progress_percentage >= 70 ? 'var(--green)' : 'var(--gold-dark)',
                        marginLeft: 'var(--space-2)',
                        minWidth: '56px',
                        textAlign: 'right'
                      }}>
                        {student.progress_percentage}%
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TeacherStudentsPage