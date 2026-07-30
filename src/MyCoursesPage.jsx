import { useState, useEffect } from 'react'
import apiFetch from './api'
import CourseBrowse from './CourseBrowse'

function MyCoursesPage({ token, onNavigateToCourse }) {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showBrowse, setShowBrowse] = useState(false)

  useEffect(() => {
    fetchCourses()
  }, [token])

  async function fetchCourses() {
    setLoading(true)
    try {
      const response = await apiFetch(`/dashboard?token=${token}`)
      if (!response.ok) { setLoading(false); return }
      const data = await response.json()
      setCourses(data.courses)
      setLoading(false)
    } catch (error) {
      console.log('Network error:', error)
      setLoading(false)
    }
  }

  const courseColors = [
    { bg: '#e8f5e9', icon: '#1F5C3F', card: 'linear-gradient(135deg, #e8f5e9, #d1fae5)' },
    { bg: '#fef3c7', icon: '#92400e', card: 'linear-gradient(135deg, #fef3c7, #fde68a)' },
    { bg: '#dbeafe', icon: '#1d4ed8', card: 'linear-gradient(135deg, #dbeafe, #bfdbfe)' },
    { bg: '#ede9fe', icon: '#7c3aed', card: 'linear-gradient(135deg, #ede9fe, #ddd6fe)' },
    { bg: '#fce7f3', icon: '#be185d', card: 'linear-gradient(135deg, #fce7f3, #fbcfe8)' },
    { bg: '#d1fae5', icon: '#047857', card: 'linear-gradient(135deg, #d1fae5, #a7f3d0)' },
  ]

  const courseIcons = ['🧠', '💡', '🔢', '📖', '🎨', '🌍']

  if (showBrowse) {
    return (
      <div style={{ padding: 'var(--space-3) var(--space-4) 120px' }}>
        <button onClick={() => { setShowBrowse(false); fetchCourses() }} style={{
          background: 'none', border: 'none', color: 'var(--green)',
          fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600,
          textTransform: 'none', letterSpacing: 'normal',
          padding: '0 0 var(--space-2) 0', cursor: 'pointer', margin: 0, display: 'block'
        }}>← Back to My Courses</button>
        <h2 style={{ marginBottom: 'var(--space-3)' }}>🎒 Find a New Course</h2>
        <CourseBrowse token={token} />
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', animation: 'characterBounce 1s ease-in-out infinite' }}>🦉</div>
        <p style={{ color: '#6b7280', marginTop: 'var(--space-2)' }}>Loading your courses...</p>
      </div>
    )
  }

  return (
    <div style={{ padding: 'var(--space-3) var(--space-4) 120px', background: '#f8fffe', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
        <div>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '1.6rem' }}>My Courses 📚</h2>
          <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9rem' }}>
            {courses.length === 0
              ? "You haven't joined any courses yet!"
              : `You're enrolled in ${courses.length} course${courses.length > 1 ? 's' : ''}. Keep going! 💪`}
          </p>
        </div>
        <button
          onClick={() => setShowBrowse(true)}
          style={{
            background: 'var(--green)', color: 'white', border: 'none',
            padding: '12px 20px', borderRadius: '12px',
            fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600,
            textTransform: 'none', letterSpacing: 'normal', cursor: 'pointer', margin: 0,
            display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          + Find New Courses
        </button>
      </div>

      {/* Empty state */}
      {courses.length === 0 && (
        <div style={{
          background: 'white', borderRadius: '24px', padding: 'var(--space-4)',
          textAlign: 'center', border: '2px dashed #d1fae5',
          maxWidth: '480px', margin: '0 auto'
        }}>
          <div style={{ fontSize: '5rem', marginBottom: 'var(--space-2)', animation: 'characterBounce 2s ease-in-out infinite' }}>🦉</div>
          <h3 style={{ color: 'var(--ink)', marginBottom: '10px' }}>Owly is waiting for you!</h3>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.6, margin: '0 0 var(--space-3) 0' }}>
            You haven't joined any courses yet. Pick one that sounds interesting and let's start learning! Every expert was once a beginner. 🌟
          </p>
          <button
            onClick={() => setShowBrowse(true)}
            style={{
              background: 'var(--green)', color: 'white', border: 'none',
              padding: '14px 28px', borderRadius: '12px',
              fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 600,
              textTransform: 'none', letterSpacing: 'normal', cursor: 'pointer', margin: 0
            }}
          >
            Pick My First Course! 🚀
          </button>
        </div>
      )}

      {/* Course grid */}
      {courses.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-2)' }}>
          {courses.map((course, index) => {
            const colors = courseColors[index % courseColors.length]
            const icon = courseIcons[index % courseIcons.length]
            const isComplete = course.progress === 100
            const isNew = course.progress === 0

            return (
              <div
                key={course.id}
                onClick={() => onNavigateToCourse(course.id)}
                style={{
                  background: 'white', borderRadius: '24px',
                  overflow: 'hidden', cursor: 'pointer',
                  border: '1px solid #f3f4f6',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)' }}
              >
                {/* Card header */}
                <div style={{
                  background: colors.card,
                  padding: 'var(--space-3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                  <div style={{
                    width: '64px', height: '64px', borderRadius: '18px',
                    background: 'rgba(255,255,255,0.6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2.2rem'
                  }}>
                    {icon}
                  </div>
                  {isComplete && (
                    <div style={{
                      background: 'var(--gold)', color: 'var(--ink)',
                      borderRadius: '999px', padding: '4px 12px',
                      fontSize: '0.78rem', fontWeight: 700
                    }}>
                      ✨ Complete!
                    </div>
                  )}
                  {isNew && (
                    <div style={{
                      background: 'var(--green)', color: 'white',
                      borderRadius: '999px', padding: '4px 12px',
                      fontSize: '0.78rem', fontWeight: 700
                    }}>
                      🆕 New!
                    </div>
                  )}
                  {!isComplete && !isNew && (
                    <div style={{
                      background: 'rgba(255,255,255,0.8)', color: 'var(--ink)',
                      borderRadius: '999px', padding: '4px 12px',
                      fontSize: '0.78rem', fontWeight: 700
                    }}>
                      🔥 In Progress
                    </div>
                  )}
                </div>

                {/* Card body */}
                <div style={{ padding: 'var(--space-2) var(--space-3) var(--space-3)' }}>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: 'var(--ink)' }}>
                    {course.title}
                  </h3>
                  {course.teacher_name && (
                    <div style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: 'var(--space-2)' }}>
                      👩‍🏫 {course.teacher_name}
                    </div>
                  )}

                  {/* Progress */}
                  <div style={{ marginBottom: 'var(--space-2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.78rem', color: '#6b7280', fontWeight: 500 }}>Progress</span>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: isComplete ? 'var(--gold-dark)' : 'var(--green)' }}>
                        {course.progress}%
                      </span>
                    </div>
                    <div style={{ height: '10px', background: '#f3f4f6', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: '999px',
                        width: `${course.progress}%`,
                        background: isComplete
                          ? 'linear-gradient(90deg, var(--gold), #f59e0b)'
                          : 'linear-gradient(90deg, var(--green), #34d399)',
                        transition: 'width 0.6s ease'
                      }} />
                    </div>
                  </div>

                  <button style={{
                    width: '100%',
                    background: isComplete ? 'var(--gold)' : 'var(--green)',
                    color: isComplete ? 'var(--ink)' : 'white',
                    border: 'none', padding: '12px', borderRadius: '12px',
                    fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: 700,
                    textTransform: 'none', letterSpacing: 'normal', cursor: 'pointer', margin: 0
                  }}>
                    {isNew ? '🚀 Start Learning!' : isComplete ? '✨ Review Course' : '▶ Continue Learning'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Owly encouragement */}
      {courses.length > 0 && (
        <div style={{
          marginTop: 'var(--space-3)', background: 'white',
          borderRadius: '16px', padding: 'var(--space-2) var(--space-3)',
          border: '1px solid #f3f4f6',
          display: 'flex', alignItems: 'center', gap: 'var(--space-2)'
        }}>
          <div style={{ fontSize: '2rem', flexShrink: 0 }}>🦉</div>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#6b7280', lineHeight: 1.5 }}>
            <strong style={{ color: 'var(--ink)' }}>Owly says:</strong>{' '}
            {courses.every(c => c.progress === 100)
              ? "Wow, you've completed all your courses! You're incredible! Try a new one! 🌟"
              : "Every lesson you finish makes you smarter! Keep going — you're doing amazing! 💪"}
          </p>
        </div>
      )}
    </div>
  )
}

export default MyCoursesPage