import { useState } from 'react'
import NavBar from './NavBar'
import LandingPage from './LandingPage'
import StudentDashboard from './StudentDashboard'
import MyCoursesPage from './MyCoursesPage'
import AssignmentsPage from './AssignmentsPage'
import ProgressPage from './ProgressPage'
import RecommendationsPage from './RecommendationsPage'
import ProfilePage from './ProfilePage'
import Dashboard from './Dashboard'
import CourseDetail from './CourseDetail'
import TeacherDashboard from './TeacherDashboard'
import AssignmentList from './AssignmentList'

function App() {
  const [showLanding, setShowLanding] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState(null)
  const [isTeacher, setIsTeacher] = useState(false)
  const [isStudent, setIsStudent] = useState(false)
  const [chosenView, setChosenView] = useState(null)
  const [currentPage, setCurrentPage] = useState('Dashboard')
  const [activeCourseId, setActiveCourseId] = useState(null)
  const [activeAssignmentCourseId, setActiveAssignmentCourseId] = useState(null)
  const [username, setUsername] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
    })
      if (!response.ok) {
        console.log('Login failed, status:', response.status)
        return
      }
      const data = await response.json()
      setToken(data.token)
      setIsTeacher(data.is_teacher)
      setIsStudent(data.is_student)
      setUsername(data.username)
    } catch (error) {
      console.log('Network error:', error)
    }
  }

  function handleLogout() {
    setToken(null)
    setEmail('')
    setPassword('')
    setIsTeacher(false)
    setIsStudent(false)
    setChosenView(null)
    setCurrentPage('Dashboard')
    setActiveCourseId(null)
    setActiveAssignmentCourseId(null)
    setUsername('')
  }

  function handleNavigateToCourse(courseId) {
    setActiveCourseId(courseId)
    setCurrentPage('course')
  }

  // ── LANDING PAGE ──
  if (showLanding && !token) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />
  }

  // ── ROLE CHOICE ──
  if (token && isTeacher && isStudent && !chosenView) {
    return (
      <div className="page-forward" style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#f0f2f5'
      }}>
        <div style={{
          background: 'white', padding: 'var(--space-4)',
          borderRadius: '16px', border: '1px solid #e5e7eb',
          textAlign: 'center', maxWidth: '400px', width: '100%'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-2)' }}>👋</div>
          <h2 style={{ marginBottom: '8px' }}>Welcome back, {username}!</h2>
          <p style={{ color: '#6b7280', marginBottom: 'var(--space-3)' }}>
            You have both a teacher and student account. How would you like to continue?
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            <button
              onClick={() => setChosenView('teacher')}
              style={{
                background: 'var(--ink)', color: 'white', border: 'none',
                padding: '12px', borderRadius: '8px', fontFamily: 'var(--font-body)',
                fontSize: '0.95rem', fontWeight: 600, textTransform: 'none',
                letterSpacing: 'normal', cursor: 'pointer', margin: 0
              }}
            >
              🏫 Continue as Teacher
            </button>
            <button
              onClick={() => setChosenView('student')}
              style={{
                background: 'var(--green)', color: 'white', border: 'none',
                padding: '12px', borderRadius: '8px', fontFamily: 'var(--font-body)',
                fontSize: '0.95rem', fontWeight: 600, textTransform: 'none',
                letterSpacing: 'normal', cursor: 'pointer', margin: 0
              }}
            >
              👨‍🎓 Continue as Student
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── TEACHER SIDE ──
  if (token && (chosenView === 'teacher' || (isTeacher && !isStudent))) {
    return (
      <div className="app-shell">
        <TeacherDashboard
          token={token}
          onLogout={handleLogout}
          username={username}
        />
      </div>
    )
  }

  // ── STUDENT SIDE ──
  if (token && (chosenView === 'student' || isStudent)) {
    function renderPage() {
      if (currentPage === 'My Courses') {
        return <MyCoursesPage token={token} onNavigateToCourse={handleNavigateToCourse} />
      }
      if (currentPage === 'Assignments') {
        if (activeAssignmentCourseId) {
          return (
            <div className="page-content">
              <AssignmentList
                token={token}
                courseId={activeAssignmentCourseId}
                onBack={() => setActiveAssignmentCourseId(null)}
              />
            </div>
          )
        }
        return (
          <AssignmentsPage
            token={token}
            onSelectAssignment={(courseId) => setActiveAssignmentCourseId(courseId)}
          />
        )
      }
      if (currentPage === 'Progress') {
        return <ProgressPage token={token} />
      }
      if (currentPage === 'Explore') {
        return (
          <RecommendationsPage
            token={token}
            onNavigateToCourse={handleNavigateToCourse}
          />
        )
      }
      if (currentPage === 'Profile') {
        return (
          <ProfilePage
            token={token}
            username={username}
            onBack={() => setCurrentPage('Dashboard')}
          />
        )
      }
      if (currentPage === 'course' && activeCourseId) {
        return (
          <div className="page-content">
            <CourseDetail
              token={token}
              courseId={activeCourseId}
              onBack={() => {
                setActiveCourseId(null)
                setCurrentPage('My Courses')
              }}
            />
          </div>
        )
      }
      return (
        <StudentDashboard
          token={token}
          onNavigateToCourse={handleNavigateToCourse}
        />
      )
    }

    return (
      <div className="app-shell">
        <NavBar
          username={username}
          currentPage={currentPage}
          onNavigate={(page) => {
            setCurrentPage(page)
            setActiveCourseId(null)
            setActiveAssignmentCourseId(null)
          }}
          onLogout={handleLogout}
          token={token}
          pages={['Dashboard', 'My Courses', 'Assignments', 'Progress', 'Explore']}
        />
        {renderPage()}
      </div>
    )
  }

  // ── LOGIN FORM ──
  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
    }}>
      {/* Left panel — brand */}
      <div style={{
        background: 'linear-gradient(160deg, var(--green) 0%, #0f3d28 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px 56px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '320px', height: '320px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)'
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-60px',
          width: '240px', height: '240px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '60px' }}>
            <div style={{
              width: '44px', height: '44px', background: 'rgba(255,255,255,0.15)',
              borderRadius: '12px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '1.4rem'
            }}>📚</div>
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: '1.4rem',
              fontWeight: 700, color: 'white'
            }}>LearnHub</span>
          </div>

          <div style={{ fontSize: '5rem', marginBottom: '24px' }}>🦉</div>

          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: '2.4rem',
            fontWeight: 700, color: 'white', margin: '0 0 16px 0',
            lineHeight: 1.2, borderBottom: 'none', padding: 0
          }}>
            Learning made simple.
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem',
            lineHeight: 1.6, margin: 0, maxWidth: '360px'
          }}>
            Your all-in-one platform for lessons, assignments, and real-time AI tutoring — built for Nigerian secondary schools.
          </p>

          <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: '48px' }}>
            {[['📖', 'Interactive Lessons'], ['✅', 'Smart Grading'], ['🤖', 'AI Tutor']].map(([icon, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>{icon}</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', fontWeight: 600 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{
        background: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px 56px',
        minHeight: '100vh',
      }}>
        <div style={{ maxWidth: '380px', width: '100%' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '8px', color: 'var(--ink)' }}>
            Welcome back
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '32px', fontSize: '0.95rem' }}>
            Sign in to continue your learning journey
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 'var(--space-2)' }}>
              <label style={{
                fontFamily: 'var(--font-label)', fontSize: '0.75rem',
                textTransform: 'uppercase', letterSpacing: '0.05em',
                color: 'var(--ink)', marginBottom: '6px', display: 'block', fontWeight: 600
              }}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@school.edu.ng"
                style={{ maxWidth: '100%', width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: 'var(--space-3)' }}>
              <label style={{
                fontFamily: 'var(--font-label)', fontSize: '0.75rem',
                textTransform: 'uppercase', letterSpacing: '0.05em',
                color: 'var(--ink)', marginBottom: '6px', display: 'block', fontWeight: 600
              }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{ maxWidth: '100%', width: '100%' }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%', background: 'var(--green)', color: 'white',
                border: 'none', padding: '14px', borderRadius: '10px',
                fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 600,
                textTransform: 'none', letterSpacing: 'normal',
                cursor: 'pointer', margin: 0
              }}
            >
              Sign In →
            </button>
          </form>

          <p style={{
            textAlign: 'center', marginTop: 'var(--space-3)',
            fontSize: '0.85rem', color: '#6b7280'
          }}>
            New student? Contact your school administrator to get access.
          </p>

          <div style={{
            marginTop: '48px', paddingTop: 'var(--space-2)',
            borderTop: '1px solid #f3f4f6',
            display: 'flex', justifyContent: 'center'
          }}>
            <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
              Powered by LearnHub LMS · Built for Nigerian Schools
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App