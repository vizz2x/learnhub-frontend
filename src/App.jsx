import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation, Navigate, useParams } from 'react-router-dom'
import NavBar from './NavBar'
import LandingPage from './LandingPage'
import StudentDashboard from './StudentDashboard'
import MyCoursesPage from './MyCoursesPage'
import AssignmentsPage from './AssignmentsPage'
import ProgressPage from './ProgressPage'
import RecommendationsPage from './RecommendationsPage'
import ProfilePage from './ProfilePage'
import CourseDetail from './CourseDetail'
import AssignmentList from './AssignmentList'
import TeacherDashboard from './TeacherDashboard'

// ── Auth state stored in sessionStorage so refresh keeps you logged in ──
function getStoredAuth() {
  try {
    return {
      token: sessionStorage.getItem('lh_token') || null,
      isTeacher: sessionStorage.getItem('lh_is_teacher') === 'true',
      isStudent: sessionStorage.getItem('lh_is_student') === 'true',
      username: sessionStorage.getItem('lh_username') || '',
    }
  } catch { return { token: null, isTeacher: false, isStudent: false, username: '' } }
}

function storeAuth({ token, isTeacher, isStudent, username }) {
  sessionStorage.setItem('lh_token', token)
  sessionStorage.setItem('lh_is_teacher', isTeacher)
  sessionStorage.setItem('lh_is_student', isStudent)
  sessionStorage.setItem('lh_username', username)
}

function clearAuth() {
  sessionStorage.removeItem('lh_token')
  sessionStorage.removeItem('lh_is_teacher')
  sessionStorage.removeItem('lh_is_student')
  sessionStorage.removeItem('lh_username')
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

export default function App() {
  const stored = getStoredAuth()
  const [token, setToken] = useState(stored.token)
  const [isTeacher, setIsTeacher] = useState(stored.isTeacher)
  const [isStudent, setIsStudent] = useState(stored.isStudent)
  const [username, setUsername] = useState(stored.username)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  const navigate = useNavigate()
  const location = useLocation()

  async function handleSubmit(event) {
    event.preventDefault()
    setLoginError('')
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!response.ok) {
        setLoginError('Invalid email or password. Please try again.')
        return
      }
      const data = await response.json()
      const auth = {
        token: data.token,
        isTeacher: data.is_teacher,
        isStudent: data.is_student,
        username: data.username,
      }
      setToken(auth.token)
      setIsTeacher(auth.isTeacher)
      setIsStudent(auth.isStudent)
      setUsername(auth.username)
      storeAuth(auth)

      // Route after login
      if (auth.isTeacher && auth.isStudent) {
        navigate('/choose-role')
      } else if (auth.isTeacher) {
        navigate('/teacher')
      } else {
        navigate('/dashboard')
      }
    } catch (error) {
      setLoginError('Network error. Please try again.')
    }
  }

  function handleLogout() {
    clearAuth()
    setToken(null)
    setEmail('')
    setPassword('')
    setIsTeacher(false)
    setIsStudent(false)
    setUsername('')
    navigate('/')
  }

  // ── STUDENT NAV ──
  function StudentShell({ children, currentPage }) {
    return (
      <div className="app-shell">
        <NavBar
          username={username}
          currentPage={currentPage}
          onNavigate={(page) => {
            const map = {
              'Dashboard': '/dashboard',
              'My Courses': '/courses',
              'Assignments': '/assignments',
              'Progress': '/progress',
              'Explore': '/explore',
              'Profile': '/profile',
            }
            if (map[page]) navigate(map[page])
          }}
          onLogout={handleLogout}
          token={token}
          pages={['Dashboard', 'My Courses', 'Assignments', 'Progress', 'Explore']}
        />
        {children}
      </div>
    )
  }

  // ── PROTECTED ROUTE ──
  function RequireAuth({ children, role }) {
    if (!token) return <Navigate to="/login" replace />
    if (role === 'teacher' && !isTeacher) return <Navigate to="/dashboard" replace />
    if (role === 'student' && isTeacher && !isStudent) return <Navigate to="/teacher" replace />
    return children
  }

  return (
    <Routes>

      {/* ── PUBLIC ── */}
      <Route path="/" element={
        token
          ? <Navigate to={isTeacher && !isStudent ? '/teacher' : '/dashboard'} replace />
          : <LandingPage onGetStarted={() => navigate('/login')} />
      } />

      <Route path="/login" element={
        token
          ? <Navigate to={isTeacher && !isStudent ? '/teacher' : '/dashboard'} replace />
          : (
            <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              {/* Left panel */}
              <div style={{
                background: 'linear-gradient(160deg, var(--green) 0%, #0f3d28 100%)',
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                padding: '60px 56px', position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '320px', height: '320px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '240px', height: '240px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '60px' }}>
                    <div style={{ width: '44px', height: '44px', background: 'rgba(255,255,255,0.15)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>📚</div>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'white' }}>LearnHub</span>
                  </div>
                  <div style={{ fontSize: '5rem', marginBottom: '24px' }}>🦉</div>
                  <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 700, color: 'white', margin: '0 0 16px 0', lineHeight: 1.2, borderBottom: 'none', padding: 0 }}>
                    Learning made simple.
                  </h1>
                  <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem', lineHeight: 1.6, margin: 0, maxWidth: '360px' }}>
                    Your all-in-one platform for lessons, assignments, and real-time AI tutoring — built for Nigerian kids.
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
              <div style={{ background: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '60px 56px', minHeight: '100vh' }}>
                <div style={{ maxWidth: '380px', width: '100%' }}>
                  <h2 style={{ fontSize: '1.8rem', marginBottom: '8px', color: 'var(--ink)' }}>Welcome back</h2>
                  <p style={{ color: '#6b7280', marginBottom: '32px', fontSize: '0.95rem' }}>Sign in to continue your learning journey</p>
                  <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 'var(--space-2)' }}>
                      <label style={{ fontFamily: 'var(--font-label)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink)', marginBottom: '6px', display: 'block', fontWeight: 600 }}>Email Address</label>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@school.edu.ng" style={{ maxWidth: '100%', width: '100%' }} required />
                    </div>
                    <div style={{ marginBottom: 'var(--space-3)' }}>
                      <label style={{ fontFamily: 'var(--font-label)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink)', marginBottom: '6px', display: 'block', fontWeight: 600 }}>Password</label>
                      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" style={{ maxWidth: '100%', width: '100%' }} required />
                    </div>
                    {loginError && (
                      <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px 14px', borderRadius: '8px', fontSize: '0.88rem', marginBottom: 'var(--space-2)' }}>
                        {loginError}
                      </div>
                    )}
                    <button type="submit" style={{ width: '100%', background: 'var(--green)', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 600, textTransform: 'none', letterSpacing: 'normal', cursor: 'pointer', margin: 0 }}>
                      Sign In →
                    </button>
                  </form>
                  <p style={{ textAlign: 'center', marginTop: 'var(--space-3)', fontSize: '0.85rem', color: '#6b7280' }}>
                    New student? Contact your school administrator to get access.
                  </p>
                  <div style={{ marginTop: '48px', paddingTop: 'var(--space-2)', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'center' }}>
                    <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>Powered by LearnHub LMS · Built for Nigerian Kids</span>
                  </div>
                </div>
              </div>
            </div>
          )
      } />

      {/* ── ROLE CHOICE ── */}
      <Route path="/choose-role" element={
        !token ? <Navigate to="/login" replace /> : (
          <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' }}>
            <div style={{ background: 'white', padding: 'var(--space-4)', borderRadius: '16px', border: '1px solid #e5e7eb', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-2)' }}>👋</div>
              <h2 style={{ marginBottom: '8px' }}>Welcome back, {username}!</h2>
              <p style={{ color: '#6b7280', marginBottom: 'var(--space-3)' }}>You have both a teacher and student account. How would you like to continue?</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                <button onClick={() => navigate('/teacher')} style={{ background: 'var(--ink)', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: 600, textTransform: 'none', letterSpacing: 'normal', cursor: 'pointer', margin: 0 }}>
                  🏫 Continue as Teacher
                </button>
                <button onClick={() => navigate('/dashboard')} style={{ background: 'var(--green)', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: 600, textTransform: 'none', letterSpacing: 'normal', cursor: 'pointer', margin: 0 }}>
                  👨‍🎓 Continue as Student
                </button>
              </div>
            </div>
          </div>
        )
      } />

      {/* ── TEACHER ── */}
      <Route path="/teacher/*" element={
        <RequireAuth role="teacher">
          <TeacherDashboard token={token} onLogout={handleLogout} username={username} />
        </RequireAuth>
      } />

      {/* ── STUDENT ── */}
      <Route path="/dashboard" element={
        <RequireAuth>
          <StudentShell currentPage="Dashboard">
            <StudentDashboard token={token} onNavigateToCourse={(id) => navigate(`/courses/${id}`)} />
          </StudentShell>
        </RequireAuth>
      } />

      <Route path="/courses" element={
        <RequireAuth>
          <StudentShell currentPage="My Courses">
            <MyCoursesPage token={token} onNavigateToCourse={(id) => navigate(`/courses/${id}`)} />
          </StudentShell>
        </RequireAuth>
      } />

      <Route path="/courses/:courseId" element={
        <RequireAuth>
          <StudentShell currentPage="My Courses">
            <CourseDetailWrapper token={token} username={username} />
          </StudentShell>
        </RequireAuth>
      } />

      <Route path="/assignments" element={
        <RequireAuth>
          <StudentShell currentPage="Assignments">
            <AssignmentsPage token={token} onSelectAssignment={(courseId) => navigate(`/assignments/${courseId}`)} />
          </StudentShell>
        </RequireAuth>
      } />

      <Route path="/assignments/:courseId" element={
        <RequireAuth>
          <StudentShell currentPage="Assignments">
            <AssignmentListWrapper token={token} />
          </StudentShell>
        </RequireAuth>
      } />

      <Route path="/progress" element={
        <RequireAuth>
          <StudentShell currentPage="Progress">
            <ProgressPage token={token} />
          </StudentShell>
        </RequireAuth>
      } />

      <Route path="/explore" element={
        <RequireAuth>
          <StudentShell currentPage="Explore">
            <RecommendationsPage token={token} onNavigateToCourse={(id) => navigate(`/courses/${id}`)} />
          </StudentShell>
        </RequireAuth>
      } />

      <Route path="/profile" element={
        <RequireAuth>
          <StudentShell currentPage="Profile">
            <ProfilePage token={token} username={username} onBack={() => navigate(-1)} />
          </StudentShell>
        </RequireAuth>
      } />

      {/* ── FALLBACK ── */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  )
}

// ── Wrappers that read URL params ──
function CourseDetailWrapper({ token, username }) {
  const navigate = useNavigate()
  const { courseId } = useParams()
  return (
    <CourseDetail
      token={token}
      courseId={parseInt(courseId)}
      onBack={() => navigate('/courses')}
    />
  )
}

function AssignmentListWrapper({ token }) {
  const navigate = useNavigate()
  const { courseId } = useParams()
  return (
    <div style={{ padding: 'var(--space-3) var(--space-4) 120px' }}>
      <AssignmentList
        token={token}
        courseId={parseInt(courseId)}
        onBack={() => navigate('/assignments')}
      />
    </div>
  )
}/ /   r o u t e r   e n a b l e d  
 