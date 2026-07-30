import { useState, useEffect } from 'react'
import CourseBrowse from './CourseBrowse'
import CourseDetail from './CourseDetail'
import ProgressTicks from './ProgressTicks'
import apiFetch from './api'

function Dashboard({ token, onLogout }) {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showBrowse, setShowBrowse] = useState(false)
  const [activeCourseId, setActiveCourseId] = useState(null)

  useEffect(() => {
    fetchDashboard()
  }, [token])

  async function fetchDashboard() {
    setLoading(true)
    try {
      const response = await apiFetch(`/dashboard?token=${token}`)

      if (!response.ok) {
        console.log('Failed to load dashboard, status:', response.status)
        setLoading(false)
        return
      }

      const data = await response.json()
      setCourses(data.courses)
      setLoading(false)
    } catch (error) {
      console.log('Network error:', error)
      setLoading(false)
    }
  }

  function handleBackToDashboard() {
    setShowBrowse(false)
    setActiveCourseId(null)
    fetchDashboard()
  }

  if (activeCourseId) {
    return (
      <CourseDetail
        token={token}
        courseId={activeCourseId}
        onBack={handleBackToDashboard}
      />
    )
  }

  if (showBrowse) {
    return (
      <div className="page-forward">
        <button onClick={handleBackToDashboard}>Back to Dashboard</button>
        <CourseBrowse token={token} />
      </div>
    )
  }

  if (loading) {
    return <p>Loading...</p>
  }

 return (
    <div className="page-back">
      <h1>Dashboard</h1>
      <button onClick={onLogout}>Logout</button>
      <button onClick={() => setShowBrowse(true)}>Browse Courses</button>
      <h2>Your Courses</h2>
      {courses.length === 0 && <p>No courses yet.</p>}
      <ul>
        {courses.map((course) => (
          <li key={course.id} className="nb-card">
            <div className="nb-card__spine"></div>
           <div className="nb-card__body">
              <button className="nb-card__title-btn" onClick={() => setActiveCourseId(course.id)}>
                {course.title}
              </button>
              {course.teacher_name && (
                <div className="nb-card__meta">Teacher: {course.teacher_name}</div>
              )}
              <ProgressTicks percentage={course.progress} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Dashboard