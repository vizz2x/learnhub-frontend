
import { useState, useEffect } from 'react'
import LessonViewer from './LessonViewer'
import AssignmentList from './AssignmentList'
import ChatbotWidget from './ChatbotWidget'
import LeaderboardPanel from './LeaderboardPanel'
import apiFetch from './api'

function CourseDetail({ token, courseId, onBack }) {
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeLessonId, setActiveLessonId] = useState(null)
  const [showAssignments, setShowAssignments] = useState(false)
  const [navCollapsed, setNavCollapsed] = useState(false)

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

  const courseColors = [
    { bg: 'linear-gradient(135deg, #e8f5e9, #d1fae5)', accent: 'var(--green)' },
    { bg: 'linear-gradient(135deg, #fef3c7, #fde68a)', accent: 'var(--gold-dark)' },
    { bg: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', accent: '#1d4ed8' },
    { bg: 'linear-gradient(135deg, #ede9fe, #ddd6fe)', accent: '#7c3aed' },
  ]
  const colors = courseColors[courseId % courseColors.length]

  if (showAssignments) {
    return (
      <AssignmentList
        token={token}
        courseId={courseId}
        onBack={() => setShowAssignments(false)}
      />
    )
  }

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', animation: 'characterBounce 1s ease-in-out infinite' }}>🦉</div>
        <p style={{ color: '#6b7280', marginTop: 'var(--space-2)' }}>Loading your course...</p>
      </div>
    )
  }

  if (!course) {
    return (
      <div style={{ padding: 'var(--space-3) var(--space-4)' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--green)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'none', letterSpacing: 'normal', padding: '0 0 var(--space-2) 0', cursor: 'pointer', margin: 0, display: 'block' }}>← Back</button>
        <p style={{ color: '#6b7280' }}>Course not found.</p>
      </div>
    )
  }

  // ── LESSON VIEW ──
  if (activeLessonId) {
    return (
      <div style={{ padding: '0 var(--space-4)' }}>
        <button onClick={() => { setActiveLessonId(null); fetchCourse() }} style={{
          background: 'none', border: 'none', color: 'var(--green)',
          fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600,
          textTransform: 'none', letterSpacing: 'normal',
          padding: '12px 0', cursor: 'pointer', margin: 0,
        }}>
          ← Back to {course.title}
        </button>

        <div style={{
          display: 'grid',
          gridTemplateColumns: navCollapsed ? '1fr' : 'minmax(180px, 22%) 1fr',
          gap: 'var(--space-2)',
          minHeight: 'calc(100vh - 140px)',
          alignItems: 'start',
          transition: 'grid-template-columns 0.3s ease',
          position: 'relative',
        }}>
          {!navCollapsed && (
            <nav className="lesson-layout__nav" style={{ borderRadius: '16px' }}>
              <div style={{ fontWeight: 700, color: 'var(--ink)', fontSize: '0.9rem', marginBottom: 'var(--space-2)', paddingBottom: 'var(--space-1)', borderBottom: '2px solid #f3f4f6' }}>
                📚 Course Content
              </div>
              {course.modules.map((module) => (
                <div key={module.id} style={{ marginBottom: 'var(--space-2)' }}>
                  <div style={{ fontFamily: 'var(--font-label)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--green)', marginBottom: '8px', fontWeight: 700 }}>
                    {module.title}
                  </div>
                  {module.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className={`lesson-nav-item ${activeLessonId === lesson.id ? 'lesson-nav-item--active' : ''}`}
                      onClick={() => setActiveLessonId(lesson.id)}
                    >
                      <span className="lesson-nav-item__icon">
                        {lesson.title.toLowerCase().includes('video') ? '🎬' : '📄'}
                      </span>
                      <span style={{ fontSize: '0.88rem' }}>{lesson.title}</span>
                    </div>
                  ))}
                </div>
              ))}
            </nav>
          )}

          {!navCollapsed && (
            <button onClick={() => setNavCollapsed(true)} title="Collapse" style={{
              position: 'fixed', left: 'calc(22% + 60px)', top: '50%',
              transform: 'translateY(-50%)', width: '24px', height: '44px',
              background: 'white', border: '1px solid #e5e7eb',
              borderRadius: '0 8px 8px 0', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem', color: '#6b7280', padding: 0, margin: 0,
              zIndex: 50, boxShadow: '2px 0 6px rgba(0,0,0,0.08)',
              textTransform: 'none', letterSpacing: 'normal', fontFamily: 'var(--font-body)',
            }}>◀</button>
          )}

          {navCollapsed && (
            <button onClick={() => setNavCollapsed(false)} title="Expand" style={{
              position: 'fixed', left: '68px', top: '50%',
              transform: 'translateY(-50%)', width: '24px', height: '44px',
              background: 'white', border: '1px solid #e5e7eb',
              borderRadius: '0 8px 8px 0', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem', color: '#6b7280', padding: 0, margin: 0,
              zIndex: 50, boxShadow: '2px 0 6px rgba(0,0,0,0.08)',
              textTransform: 'none', letterSpacing: 'normal', fontFamily: 'var(--font-body)',
            }}>▶</button>
          )}

          <div className="lesson-layout__content" style={{ borderRadius: '16px' }}>
            <LessonViewer
              token={token}
              lessonId={activeLessonId}
              onBack={() => setActiveLessonId(null)}
              hideBackButton={true}
            />
          </div>
        </div>

        <ChatbotWidget token={token} courseId={courseId} lessonId={activeLessonId} />
      </div>
    )
  }

  // ── COURSE OVERVIEW ──
  const totalLessons = course.modules?.reduce((acc, m) => acc + m.lessons.length, 0) ?? 0

  return (
    <div style={{ padding: 'var(--space-3) var(--space-4) 120px', background: '#f8fffe', minHeight: '100vh' }}>
      <button onClick={onBack} style={{
        background: 'none', border: 'none', color: 'var(--green)',
        fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600,
        textTransform: 'none', letterSpacing: 'normal',
        padding: '0 0 var(--space-2) 0', cursor: 'pointer', margin: 0, display: 'block'
      }}>← My Courses</button>

      {/* Course hero */}
      <div style={{
        background: colors.bg, borderRadius: '24px',
        padding: 'var(--space-4)', marginBottom: 'var(--space-3)',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', right: '-20px', bottom: '-30px', fontSize: '8rem', opacity: 0.12, pointerEvents: 'none' }}>🧠</div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ margin: '0 0 6px 0', fontSize: '1.8rem', color: 'var(--ink)' }}>{course.title}</h2>
          {course.description && (
            <p style={{ color: '#6b7280', margin: '0 0 var(--space-2) 0', fontSize: '0.95rem', lineHeight: 1.6 }}>{course.description}</p>
          )}
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: colors.accent, lineHeight: 1 }}>{course.progress}%</div>
              <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '2px' }}>Progress</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: colors.accent, lineHeight: 1 }}>{totalLessons}</div>
              <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '2px' }}>Lessons</div>
            </div>
          </div>
          <div style={{ marginTop: 'var(--space-2)', maxWidth: '400px' }}>
            <div style={{ height: '10px', background: 'rgba(255,255,255,0.5)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: '999px', width: `${course.progress}%`, background: colors.accent, transition: 'width 0.6s ease' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="two-col">
        {/* Lessons panel */}
        <div style={{ background: 'white', borderRadius: '20px', padding: 'var(--space-3)', border: '1px solid #f3f4f6', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <h3 style={{ margin: '0 0 var(--space-2) 0', fontSize: '1.1rem', color: 'var(--ink)' }}>📚 Lessons</h3>
          {course.modules.map((module) => (
            <div key={module.id} style={{ marginBottom: 'var(--space-2)' }}>
              <div style={{ fontFamily: 'var(--font-label)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--green)', marginBottom: '10px', fontWeight: 700 }}>
                {module.title}
              </div>
              {module.lessons.map((lesson, i) => (
                <div
                  key={lesson.id}
                  onClick={() => setActiveLessonId(lesson.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                    padding: 'var(--space-1) var(--space-2)', borderRadius: '12px',
                    cursor: 'pointer', marginBottom: '6px', transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '10px',
                    background: i % 2 === 0 ? '#e8f5e9' : '#fef3c7',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.2rem', flexShrink: 0
                  }}>
                    {lesson.title.toLowerCase().includes('video') ? '🎬' : '📄'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--ink)' }}>{lesson.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '2px' }}>
                      {lesson.title.toLowerCase().includes('video') ? '🎬 Video lesson' : '📄 Reading lesson'}
                    </div>
                  </div>
                  <div style={{ background: 'var(--green)', color: 'white', borderRadius: '999px', padding: '4px 12px', fontSize: '0.75rem', fontWeight: 600 }}>
                    Start →
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>

          {/* Assignments CTA */}
          <div style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)', borderRadius: '20px', padding: 'var(--space-3)', border: '1px solid #fcd34d' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📝</div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: '#92400e' }}>Assignments</h3>
            <p style={{ color: '#b45309', fontSize: '0.85rem', margin: '0 0 var(--space-2) 0', lineHeight: 1.5 }}>
              Your teacher has set some challenges! Complete them to earn points! ⭐
            </p>
            <button onClick={() => setShowAssignments(true)} style={{
              width: '100%', background: '#92400e', color: 'white', border: 'none',
              padding: '12px', borderRadius: '12px', fontFamily: 'var(--font-body)',
              fontSize: '0.95rem', fontWeight: 700, textTransform: 'none',
              letterSpacing: 'normal', cursor: 'pointer', margin: 0
            }}>
              View Assignments →
            </button>
          </div>

          {/* Leaderboard */}
          <LeaderboardPanel token={token} courseId={courseId} />

          {/* Owly tip */}
          <div style={{ background: 'white', borderRadius: '20px', padding: 'var(--space-3)', border: '1px solid #f3f4f6', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ fontSize: '2.5rem', flexShrink: 0 }}>🦉</div>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--ink)', fontSize: '0.9rem', marginBottom: '6px' }}>Owly's Tip</div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.6 }}>
                  {course.progress === 0
                    ? "Start with the first lesson and take it one step at a time! Even small progress is amazing! 🌟"
                    : course.progress === 100
                    ? "WOW! You finished this course! You're a superstar! 🏆"
                    : "You're making great progress! Keep going — every lesson makes you smarter! 💪"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetail
