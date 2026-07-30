import { useState, useEffect } from 'react'
import ProgressTicks from './ProgressTicks'
import apiFetch from './api'

function TeacherStudentProgress({ token, courseId, onBack }) {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStudents()
  }, [courseId])

  async function fetchStudents() {
    setLoading(true)
    try {
      const response = await apiFetch(`/courses/${courseId}/students?token=${token}`)

      if (!response.ok) {
        console.log('Failed to load students, status:', response.status)
        setLoading(false)
        return
      }

      const data = await response.json()
      setStudents(data)
      setLoading(false)
    } catch (error) {
      console.log('Network error:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <div>
      <button onClick={onBack}>Back to Course</button>
      <h2>Student Progress</h2>
      {students.length === 0 && <p>No students enrolled yet.</p>}
      <ul>
        {students.map((student) => (
          <li key={student.user_id} className="nb-card">
            <div className="nb-card__spine nb-card__spine--ink"></div>
            <div className="nb-card__body">
              <div className="nb-card__title-btn" style={{ cursor: 'default' }}>
                {student.full_name || student.username}
              </div>
              <ProgressTicks percentage={student.progress_percentage} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TeacherStudentProgress