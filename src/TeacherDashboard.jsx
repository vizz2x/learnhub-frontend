import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import NavBar from './NavBar'
import TeacherCoursesPage from './TeacherCoursesPage'
import TeacherAssignmentsPage from './TeacherAssignmentsPage'
import TeacherStudentsPage from './TeacherStudentsPage'
import ProfilePage from './ProfilePage'

function TeacherDashboard({ token, onLogout, username }) {
  const navigate = useNavigate()

  const currentPage = () => {
    const path = window.location.pathname
    if (path.includes('/teacher/assignments')) return 'Assignments'
    if (path.includes('/teacher/students')) return 'Students'
    return 'Courses'
  }

  return (
    <div className="app-shell">
      <NavBar
        username={username}
        currentPage={currentPage()}
        onNavigate={(page) => {
          const map = {
            'Courses':     '/teacher/courses',
            'Assignments': '/teacher/assignments',
            'Students':    '/teacher/students',
            'Profile':     '/teacher/profile',
          }
          if (map[page]) navigate(map[page])
        }}
        onLogout={onLogout}
        isTeacher={true}
        pages={['Courses', 'Assignments', 'Students']}
        token={token}
      />
      <Routes>
        <Route path="/" element={<Navigate to="/teacher/courses" replace />} />
        <Route path="/courses/*" element={<TeacherCoursesPage token={token} />} />
        <Route path="/assignments" element={<TeacherAssignmentsPage token={token} />} />
        <Route path="/students" element={<TeacherStudentsPage token={token} />} />
        <Route path="/profile" element={<ProfilePage token={token} username={username} onBack={() => navigate('/teacher/courses')} />} />
      </Routes>
    </div>
  )
}

export default TeacherDashboard