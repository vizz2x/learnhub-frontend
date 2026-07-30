import { useState, useEffect } from 'react'
import apiFetch from './api'
import { letterGrade } from './gradeUtils'

function ProgressPage({ token }) {
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [gamification, setGamification] = useState(null)

  useEffect(() => {
    fetchProgress()
  }, [token])

  async function fetchProgress() {
    setLoading(true)
    try {
      const [progressRes, gamRes] = await Promise.all([
        apiFetch(`/student/progress?token=${token}`),
        apiFetch(`/student/gamification?token=${token}`)
      ])
      if (progressRes.ok) setProgress(await progressRes.json())
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
        <p style={{ color: '#6b7280', marginTop: 'var(--space-2)' }}>Loading your progress...</p>
      </div>
    )
  }

  const avgGrade = progress?.average_grade ?? null
  const assignmentsCompleted = progress?.assignments_completed ?? 0
  const gradeInfo = avgGrade !== null ? letterGrade(avgGrade) : null

  const owlyFeedback = () => {
    if (avgGrade === null) return { msg: "Complete your first assignment and Owly will tell you how you're doing! 🌟", emoji: '🦉' }
    if (avgGrade >= 70) return { msg: "You're doing AMAZING! Keep up this fantastic work! 🎉", emoji: '🏆' }
    if (avgGrade >= 60) return { msg: "Great work! You're getting better every day! Keep pushing! 💪", emoji: '⭐' }
    if (avgGrade >= 50) return { msg: "Good effort! Ask Owly for help if anything is tricky — that's what I'm here for! 🦉", emoji: '💡' }
    return { msg: "Don't give up! Every mistake is a lesson. Owly believes in you! 💪", emoji: '🤗' }
  }
  const feedback = owlyFeedback()

  const courseIcons = ['🧠', '💡', '🔢', '📖', '🎨', '🌍']
  const courseColors = [
    'linear-gradient(135deg, #e8f5e9, #d1fae5)',
    'linear-gradient(135deg, #fef3c7, #fde68a)',
    'linear-gradient(135deg, #dbeafe, #bfdbfe)',
    'linear-gradient(135deg, #ede9fe, #ddd6fe)',
    'linear-gradient(135deg, #fce7f3, #fbcfe8)',
    'linear-gradient(135deg, #d1fae5, #a7f3d0)',
  ]

  return (
    <div style={{ padding: 'var(--space-3) var(--space-4) 120px', background: '#f8fffe', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ marginBottom: 'var(--space-3)' }}>
        <h2 style={{ margin: '0 0 4px 0', fontSize: '1.6rem' }}>My Progress 📈</h2>
        <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9rem' }}>
          See how far you've come — every lesson counts! 🌟
        </p>
      </div>

      {/* Owly feedback banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--green) 0%, #0f3d28 100%)',
        borderRadius: '20px', padding: 'var(--space-3)',
        marginBottom: 'var(--space-3)',
        display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', right: '-20px', top: '-20px',
          width: '120px', height: '120px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)', pointerEvents: 'none'
        }} />
        <div style={{ fontSize: '3.5rem', flexShrink: 0 }}>{feedback.emoji}</div>
        <div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginBottom: '4px', fontWeight: 600 }}>
            🦉 OWLY SAYS
          </div>
          <p style={{ color: 'white', margin: 0, fontSize: '1rem', fontWeight: 500, lineHeight: 1.5 }}>
            {feedback.msg}
          </p>
        </div>
      </div>

      {/* Top stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 'var(--space-2)', marginBottom: 'var(--space-3)'
      }}>

        {/* Average grade */}
        <div style={{
          background: 'white', borderRadius: '20px', padding: 'var(--space-3)',
          border: '1px solid #f3f4f6', textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎯</div>
          {avgGrade !== null ? (
            <>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 700, color: gradeInfo.color, lineHeight: 1 }}>
                {gradeInfo.grade}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#6b7280', marginTop: '4px' }}>
                {avgGrade}% Average
              </div>
            </>
          ) : (
            <>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: '#d1d5db', lineHeight: 1 }}>--</div>
              <div style={{ fontSize: '0.82rem', color: '#6b7280', marginTop: '4px' }}>No grades yet</div>
            </>
          )}
          <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: '4px', fontWeight: 600 }}>AVERAGE GRADE</div>
        </div>

        {/* Assignments completed */}
        <div style={{
          background: 'white', borderRadius: '20px', padding: 'var(--space-3)',
          border: '1px solid #f3f4f6', textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>✅</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 700, color: 'var(--green)', lineHeight: 1 }}>
            {assignmentsCompleted}
          </div>
          <div style={{ fontSize: '0.82rem', color: '#6b7280', marginTop: '4px' }}>
            {assignmentsCompleted === 1 ? 'assignment' : 'assignments'}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: '4px', fontWeight: 600 }}>COMPLETED</div>
        </div>

        {/* Streak — now real data */}
        <div style={{
          background: 'white', borderRadius: '20px', padding: 'var(--space-3)',
          border: '1px solid #f3f4f6', textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
            {(gamification?.current_streak ?? 0) > 0 ? '🔥' : '⭐'}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 700, color: 'var(--gold-dark)', lineHeight: 1 }}>
            {gamification?.current_streak ?? 0}
          </div>
          <div style={{ fontSize: '0.82rem', color: '#6b7280', marginTop: '4px' }}>
            day{(gamification?.current_streak ?? 0) !== 1 ? 's' : ''} in a row
          </div>
          <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: '4px', fontWeight: 600 }}>CURRENT STREAK</div>
        </div>
      </div>

      {/* Points + badges row */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 'var(--space-2)', marginBottom: 'var(--space-3)'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
          borderRadius: '20px', padding: 'var(--space-3)',
          border: '1px solid #fcd34d', textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⭐</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 700, color: '#92400e', lineHeight: 1 }}>
            {gamification?.total_points ?? 0}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#b45309', marginTop: '4px', fontWeight: 600 }}>TOTAL POINTS</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #ede9fe, #ddd6fe)',
          borderRadius: '20px', padding: 'var(--space-3)',
          border: '1px solid #c4b5fd', textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🏆</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 700, color: '#7c3aed', lineHeight: 1 }}>
            {gamification?.badge_count ?? 0}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#6d28d9', marginTop: '4px', fontWeight: 600 }}>BADGES EARNED</div>
        </div>
      </div>

      {/* Badges */}
          <div className="panel" style={{ marginBottom: 'var(--space-2)' }}>
            <h3 style={{ margin: '0 0 var(--space-2) 0', fontSize: '0.95rem', color: 'var(--ink)' }}>
              🏆 My Badges
            </h3>
            {(!gamification?.badges || gamification.badges.length === 0) ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-2)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🔒</div>
                <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
                  Complete lessons to earn your first badge! You can do it! 💪
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {gamification.badges.map((badge) => (
                  <div key={badge.id} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '10px', background: '#f9fafb', borderRadius: '12px'
                  }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '12px',
                      background: '#fef3c7', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0
                    }}>
                      {badge.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--ink)' }}>
                        {badge.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                        {badge.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

      {/* Course progress */}
      <div style={{ marginBottom: 'var(--space-3)' }}>
        <h3 style={{ margin: '0 0 var(--space-2) 0', fontSize: '1.1rem', color: 'var(--ink)' }}>
          📚 Course Progress
        </h3>

        {(!progress?.courses || progress.courses.length === 0) && (
          <div style={{
            background: 'white', borderRadius: '20px', padding: 'var(--space-4)',
            textAlign: 'center', border: '2px dashed #d1fae5'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-1)' }}>🎒</div>
            <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9rem' }}>
              Enroll in a course to start tracking your progress!
            </p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {progress?.courses?.map((course, index) => {
            const gradeData = course.average_grade !== null ? letterGrade(course.average_grade) : null
            return (
              <div key={course.course_id} style={{
                background: 'white', borderRadius: '20px',
                overflow: 'hidden', border: '1px solid #f3f4f6',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
              }}>
                {/* Course header */}
                <div style={{
                  background: courseColors[index % courseColors.length],
                  padding: 'var(--space-2) var(--space-3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '12px',
                      background: 'rgba(255,255,255,0.6)',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '1.4rem'
                    }}>
                      {courseIcons[index % courseIcons.length]}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--ink)', fontSize: '0.95rem' }}>
                        {course.title}
                      </div>
                      {course.teacher_name && (
                        <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                          👩‍🏫 {course.teacher_name}
                        </div>
                      )}
                    </div>
                  </div>
                  {gradeData && (
                    <div style={{
                      background: 'rgba(255,255,255,0.8)', borderRadius: '12px',
                      padding: '8px 14px', textAlign: 'center'
                    }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: gradeData.color, lineHeight: 1 }}>
                        {gradeData.grade}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '2px' }}>
                        {course.average_grade}%
                      </div>
                    </div>
                  )}
                </div>

                {/* Course stats */}
                <div style={{ padding: 'var(--space-2) var(--space-3) var(--space-3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.82rem', color: '#6b7280' }}>
                      📖 {course.lessons_completed} of {course.total_lessons} lessons done
                    </span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: course.progress_percentage === 100 ? 'var(--gold-dark)' : 'var(--green)' }}>
                      {course.progress_percentage}%
                    </span>
                  </div>
                  <div style={{ height: '12px', background: '#f3f4f6', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: '999px',
                      width: `${course.progress_percentage}%`,
                      background: course.progress_percentage === 100
                        ? 'linear-gradient(90deg, var(--gold), #f59e0b)'
                        : 'linear-gradient(90deg, var(--green), #34d399)',
                      transition: 'width 0.6s ease'
                    }} />
                  </div>
                  {course.progress_percentage === 100 && (
                    <div style={{
                      marginTop: '10px', textAlign: 'center',
                      color: 'var(--gold-dark)', fontWeight: 700, fontSize: '0.88rem'
                    }}>
                      🎉 Course Complete! Amazing work!
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Coming soon placeholders */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
        <div style={{
          background: 'white', borderRadius: '20px', padding: 'var(--space-3)',
          border: '1px dashed #e5e7eb', textAlign: 'center', opacity: 0.7
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📊</div>
          <h3 style={{ fontSize: '0.95rem', color: 'var(--ink)', margin: '0 0 6px 0' }}>Weekly Performance</h3>
          <p style={{ fontSize: '0.82rem', color: '#9ca3af', margin: 0 }}>Charts coming after pilot launch!</p>
        </div>
        <div style={{
          background: 'white', borderRadius: '20px', padding: 'var(--space-3)',
          border: '1px dashed #e5e7eb', textAlign: 'center', opacity: 0.7
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🏆</div>
          <h3 style={{ fontSize: '0.95rem', color: 'var(--ink)', margin: '0 0 6px 0' }}>Leaderboard</h3>
          <p style={{ fontSize: '0.82rem', color: '#9ca3af', margin: 0 }}>See how you rank against classmates — coming soon!</p>
        </div>
      </div>
    </div>
  )
}

export default ProgressPage