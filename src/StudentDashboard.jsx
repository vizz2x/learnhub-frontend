import { useState, useEffect } from 'react'
import apiFetch from './api'

function StudentDashboard({ token, onNavigateToCourse }) {
  const [summary, setSummary] = useState(null)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [gamification, setGamification] = useState(null)

  useEffect(() => {
    fetchAll()
  }, [token])

  async function fetchAll() {
    setLoading(true)
    try {
      const [summaryRes, dashRes, gamRes] = await Promise.all([
        apiFetch(`/student/summary?token=${token}`),
        apiFetch(`/dashboard?token=${token}`),
        apiFetch(`/student/gamification?token=${token}`)
      ])
      if (summaryRes.ok) setSummary(await summaryRes.json())
      if (dashRes.ok) {
        const d = await dashRes.json()
        setCourses(d.courses)
      }
      if (gamRes.ok) setGamification(await gamRes.json())
      setLoading(false)
    } catch (error) {
      console.log('Network error:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', animation: 'characterBounce 1s ease-in-out infinite' }}>🦉</div>
        <p style={{ color: '#6b7280', marginTop: 'var(--space-2)' }}>Loading your adventures...</p>
      </div>
    )
  }

  const firstName = (summary?.full_name || summary?.username || 'Superstar').split(' ')[0]
  const totalPoints = gamification?.total_points ?? 0
  const streak = gamification?.current_streak ?? 0
  const badges = gamification?.badge_count ?? 0

  const owlyMessages = [
    `Hey ${firstName}! Ready to learn something awesome today? 🌟`,
    `Welcome back, ${firstName}! Owly missed you! Let's go! 🚀`,
    `${firstName} is in the house! Time to get those brain muscles working! 💪`,
    `Hoot hoot! ${firstName} is back! You're doing amazing! 🦉`,
  ]
  const owlyMessage = owlyMessages[Math.floor(Math.random() * owlyMessages.length)]

  const dailyChallenges = [
    { icon: '🧠', text: 'Can you think of 5 words that mean "happy"?', subject: 'Verbal Reasoning' },
    { icon: '💡', text: 'If you had to choose between speed or strength, which would you pick and why?', subject: 'Critical Thinking' },
    { icon: '🔢', text: 'You have 24 hours in a day. How would you split it perfectly?', subject: 'Problem Solving' },
    { icon: '🌍', text: 'Name 3 things you can do to make your school a better place.', subject: 'Critical Thinking' },
  ]
  const dailyChallenge = dailyChallenges[new Date().getDay() % dailyChallenges.length]

  const courseIcons = ['🧠', '💡', '🔢', '📖', '🎨', '🌍']

  return (
    <div style={{ padding: 'var(--space-3) var(--space-4) 120px', background: '#f8fffe', minHeight: '100vh' }}>

      {/* ── OWLY WELCOME BANNER ── */}
      <div style={{
        background: 'linear-gradient(135deg, var(--green) 0%, #0f3d28 100%)',
        borderRadius: '20px',
        padding: 'var(--space-3) var(--space-4)',
        marginBottom: 'var(--space-3)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute', right: '-40px', top: '-40px',
          width: '200px', height: '200px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', right: '80px', bottom: '-60px',
          width: '160px', height: '160px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)', pointerEvents: 'none'
        }} />

        <div style={{
          fontSize: '5rem',
          animation: 'characterBounce 2.5s ease-in-out infinite',
          flexShrink: 0
        }}>
          🦉
        </div>

        <div style={{ flex: 1, zIndex: 1 }}>
          <h2 style={{
            color: 'white', margin: '0 0 6px 0',
            fontFamily: 'var(--font-display)', fontSize: '1.6rem',
            borderBottom: 'none', padding: 0
          }}>
            {owlyMessage}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', margin: 0, fontSize: '0.95rem' }}>
            {summary?.assignments_due_this_week > 0
              ? `You have ${summary.assignments_due_this_week} assignment${summary.assignments_due_this_week > 1 ? 's' : ''} due this week. Let's get them done! 💪`
              : "You're all caught up! Keep up the amazing work! ✨"}
          </p>
        </div>

        {/* Streak badge */}
        <div style={{
          background: 'rgba(255,255,255,0.15)',
          borderRadius: '16px',
          padding: 'var(--space-2) var(--space-2)',
          textAlign: 'center',
          flexShrink: 0,
          zIndex: 1,
          minWidth: '90px'
        }}>
          <div style={{ fontSize: '2rem' }}>{streak > 0 ? '🔥' : '⭐'}</div>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '1.6rem',
            fontWeight: 700, color: 'white', lineHeight: 1
          }}>
            {streak > 0 ? streak : totalPoints}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem', marginTop: '2px' }}>
            {streak > 0 ? 'Day Streak' : 'Points'}
          </div>
        </div>
      </div>

      {/* ── QUICK STATS ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 'var(--space-2)',
        marginBottom: 'var(--space-3)'
      }}>
        {[
          { icon: '📚', value: summary?.active_courses ?? 0, label: 'Courses', color: '#e8f5e9', accent: 'var(--green)' },
          { icon: '⭐', value: totalPoints, label: 'Points', color: '#fef3c7', accent: 'var(--gold-dark)' },
          { icon: '🏆', value: badges, label: 'Badges', color: '#ede9fe', accent: '#7c3aed' },
          { icon: '📝', value: summary?.pending_assignments ?? 0, label: 'To Do', color: '#fce7f3', accent: '#be185d' },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: 'white',
            borderRadius: '16px',
            padding: 'var(--space-2)',
            border: '1px solid #f3f4f6',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: stat.color, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '1.4rem',
              margin: '0 auto var(--space-1)'
            }}>
              {stat.icon}
            </div>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: '1.6rem',
              fontWeight: 700, color: stat.accent, lineHeight: 1
            }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '4px', fontWeight: 500 }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 'var(--space-3)' }}>

        {/* Left — My Courses */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--ink)' }}>
              📚 My Courses
            </h3>
          </div>

          {courses.length === 0 && (
            <div style={{
              background: 'white', borderRadius: '20px', padding: 'var(--space-4)',
              textAlign: 'center', border: '2px dashed #e5e7eb'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-1)' }}>🎒</div>
              <h3 style={{ color: 'var(--ink)', marginBottom: '8px' }}>No courses yet!</h3>
              <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: '0 0 var(--space-2) 0' }}>
                Head over to the Explore tab and pick a course you'd like to try!
              </p>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {courses.map((course, index) => (
              <div
                key={course.id}
                onClick={() => onNavigateToCourse(course.id)}
                style={{
                  background: 'white', borderRadius: '20px',
                  padding: 'var(--space-3)', cursor: 'pointer',
                  border: '1px solid #f3f4f6',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                  display: 'flex', alignItems: 'center', gap: 'var(--space-2)'
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)' }}
              >
                {/* Course icon */}
                <div style={{
                  width: '64px', height: '64px', borderRadius: '18px',
                  background: ['#e8f5e9', '#fef3c7', '#dbeafe', '#ede9fe', '#fce7f3', '#d1fae5'][index % 6],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2rem', flexShrink: 0
                }}>
                  {courseIcons[index % courseIcons.length]}
                </div>

                {/* Course info */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--ink)', marginBottom: '4px' }}>
                    {course.title}
                  </div>
                  {course.teacher_name && (
                    <div style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '8px' }}>
                      👩‍🏫 {course.teacher_name}
                    </div>
                  )}
                  {/* Progress bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      flex: 1, height: '8px', background: '#f3f4f6',
                      borderRadius: '999px', overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%', borderRadius: '999px',
                        width: `${course.progress}%`,
                        background: course.progress === 100
                          ? 'var(--gold)'
                          : 'var(--green)',
                        transition: 'width 0.4s ease'
                      }} />
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--green)', minWidth: '36px' }}>
                      {course.progress}%
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <button style={{
                  background: course.progress === 100 ? 'var(--gold)' : 'var(--green)',
                  color: 'white', border: 'none',
                  padding: '10px 18px', borderRadius: '10px',
                  fontFamily: 'var(--font-body)', fontSize: '0.85rem', fontWeight: 600,
                  textTransform: 'none', letterSpacing: 'normal',
                  cursor: 'pointer', margin: 0, whiteSpace: 'nowrap'
                }}>
                  {course.progress === 0 ? 'Start! 🚀' : course.progress === 100 ? 'Review ✨' : 'Continue →'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>

          {/* Daily challenge from Owly */}
          <div style={{
            background: 'linear-gradient(135deg, #ede9fe, #ddd6fe)',
            borderRadius: '20px', padding: 'var(--space-3)',
            border: '1px solid #c4b5fd'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--space-2)' }}>
              <div style={{ fontSize: '1.8rem' }}>🦉</div>
              <div>
                <div style={{ fontWeight: 700, color: '#4c1d95', fontSize: '0.9rem' }}>
                  Owly's Daily Challenge
                </div>
                <div style={{ fontSize: '0.75rem', color: '#7c3aed' }}>
                  {dailyChallenge.subject}
                </div>
              </div>
            </div>
            <div style={{ fontSize: '1.6rem', marginBottom: '10px', textAlign: 'center' }}>
              {dailyChallenge.icon}
            </div>
            <p style={{
              fontSize: '0.92rem', color: '#4c1d95', lineHeight: 1.6,
              margin: '0 0 var(--space-2) 0', fontWeight: 500, textAlign: 'center'
            }}>
              {dailyChallenge.text}
            </p>
            <button style={{
              width: '100%', background: '#7c3aed', color: 'white', border: 'none',
              padding: '10px', borderRadius: '10px', fontFamily: 'var(--font-body)',
              fontSize: '0.88rem', fontWeight: 600, textTransform: 'none',
              letterSpacing: 'normal', cursor: 'pointer', margin: 0
            }}>
              Accept Challenge! 🎯
            </button>
          </div>

          {/* Achievements placeholder */}
          <div style={{
            background: 'white', borderRadius: '20px', padding: 'var(--space-3)',
            border: '1px solid #f3f4f6', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <h3 style={{ margin: '0 0 var(--space-2) 0', fontSize: '0.95rem', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🏆 My Achievements
            </h3>

            {badges === 0 ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-2)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🔒</div>
                <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
                  Complete lessons to earn your first badge! You can do it! 💪
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {Array.from({ length: Math.min(badges, 8) }).map((_, i) => (
                  <div key={i} style={{
                    width: '48px', height: '48px', borderRadius: '12px',
                    background: '#fef3c7', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto'
                  }}>
                    🏅
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Overall progress */}
          <div style={{
            background: 'white', borderRadius: '20px', padding: 'var(--space-3)',
            border: '1px solid #f3f4f6', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <h3 style={{ margin: '0 0 var(--space-2) 0', fontSize: '0.95rem', color: 'var(--ink)' }}>
              📈 Overall Progress
            </h3>
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-2)' }}>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: '3rem',
                fontWeight: 700, color: 'var(--green)', lineHeight: 1
              }}>
                {summary?.overall_progress ?? 0}%
              </div>
              <div style={{ fontSize: '0.82rem', color: '#6b7280', marginTop: '4px' }}>
                across all courses
              </div>
            </div>
            <div style={{ height: '12px', background: '#f3f4f6', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: '999px',
                width: `${summary?.overall_progress ?? 0}%`,
                background: 'linear-gradient(90deg, var(--green), var(--gold))',
                transition: 'width 0.6s ease'
              }} />
            </div>
            {summary?.overall_progress === 100 && (
              <p style={{ textAlign: 'center', color: 'var(--gold-dark)', fontWeight: 700, fontSize: '0.88rem', margin: 'var(--space-1) 0 0' }}>
                🎉 Amazing! You've completed everything!
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default StudentDashboard