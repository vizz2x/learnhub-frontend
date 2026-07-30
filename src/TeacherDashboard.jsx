import { useState } from 'react'
import NavBar from './NavBar'
import TeacherCoursesPage from './TeacherCoursesPage'
import TeacherAssignmentsPage from './TeacherAssignmentsPage'
import TeacherStudentsPage from './TeacherStudentsPage'
import ProfilePage from './ProfilePage'

function TeacherDashboard({ token, onLogout, username }) {
  const [currentPage, setCurrentPage] = useState('Courses')

  function renderPage() {
    if (currentPage === 'Profile') {
      return (
        <ProfilePage
          token={token}
          username={username}
          onBack={() => setCurrentPage('Courses')}
        />
      )
    }
    if (currentPage === 'Courses') {
      return <TeacherCoursesPage token={token} />
    }
    if (currentPage === 'Assignments') {
      return <TeacherAssignmentsPage token={token} />
    }
    if (currentPage === 'Students') {
      return <TeacherStudentsPage token={token} />
    }
    return null
  }

  return (
    <div className="app-shell">
      <NavBar
        username={username}
        currentPage={currentPage}
        onNavigate={(page) => setCurrentPage(page)}
        onLogout={onLogout}
        isTeacher={true}
        pages={['Courses', 'Assignments', 'Students']}
        token={token}
      />
      {renderPage()}
    </div>
  )
}

export default TeacherDashboard