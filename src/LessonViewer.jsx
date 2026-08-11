import { useState, useEffect } from 'react'
import apiFetch from './api'
import BadgeCelebration from './BadgeCelebration'

function LessonViewer({ token, lessonId, onBack, hideBackButton = false }) {
  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [marking, setMarking] = useState(false)
  const [justCompleted, setJustCompleted] = useState(false)
  const [newBadges, setNewBadges] = useState([])
  const [showBadgeCelebration, setShowBadgeCelebration] = useState(false)
  const [showAssignmentReminder, setShowAssignmentReminder] = useState(false)

  useEffect(() => {
    fetchLesson()
    setJustCompleted(false)
  }, [lessonId])

  async function fetchLesson() {
    setLoading(true)
    try {
      const response = await apiFetch(`/lessons/${lessonId}?token=${token}`)
      if (!response.ok) { setLoading(false); return }
      const data = await response.json()
      setLesson(data)
      setLoading(false)
    } catch (error) {
      console.log('Network error:', error)
      setLoading(false)
    }
  }

  async function handleMarkComplete() {
    setMarking(true)
    try {
      const response = await apiFetch(`/lessons/${lessonId}/complete?token=${token}`, {
        method: 'POST',
      })
      if (!response.ok) { setMarking(false); return }
      const data = await response.json()
      setJustCompleted(true)
      setMarking(false)
      if (data.badges_earned && data.badges_earned.length > 0) {
        setNewBadges(data.badges_earned)
        setShowBadgeCelebration(true)
      }
      await fetchLesson()
    } catch (error) {
      console.log('Network error:', error)
      setMarking(false)
    }
  }

  function getEmbedUrl(youtubeUrl) {
    if (!youtubeUrl) return ''
    const videoId = youtubeUrl.split('v=')[1]?.split('&')[0]
    return `https://www.youtube.com/embed/${videoId}`
  }

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', animation: 'characterBounce 1s ease-in-out infinite' }}>🦉</div>
        <p style={{ color: '#6b7280', marginTop: 'var(--space-2)' }}>Loading your lesson...</p>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div style={{ padding: 'var(--space-3)' }}>
        {!hideBackButton && (
          <button onClick={onBack} style={{
            background: 'none', border: 'none', color: 'var(--green)',
            fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600,
            textTransform: 'none', letterSpacing: 'normal',
            padding: '0 0 var(--space-2) 0', cursor: 'pointer', margin: 0, display: 'block'
          }}>← Back</button>
        )}
        <div style={{ textAlign: 'center', padding: 'var(--space-3)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>😕</div>
          <p style={{ color: '#6b7280' }}>Oops! Owly couldn't find this lesson. Try going back!</p>
        </div>
      </div>
    )
  }

  const isVideo = lesson.content_type === 'video'

  return (
    <div style={{ padding: 'var(--space-2)' }}>
      {!hideBackButton && (
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: 'var(--green)',
          fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600,
          textTransform: 'none', letterSpacing: 'normal',
          padding: '0 0 var(--space-2) 0', cursor: 'pointer', margin: 0, display: 'block'
        }}>← Back</button>
      )}

      {/* Lesson header */}
      <div style={{ marginBottom: 'var(--space-3)' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: isVideo ? '#fef3c7' : '#e8f5e9',
          borderRadius: '999px', padding: '4px 12px',
          fontSize: '0.75rem', fontWeight: 700,
          color: isVideo ? '#92400e' : 'var(--green)',
          marginBottom: '10px',
          textTransform: 'uppercase', letterSpacing: '0.05em'
        }}>
          {isVideo ? '🎬 Video Lesson' : '📄 Reading Lesson'}
        </div>
        <h2 style={{ margin: '0 0 var(--space-1) 0', fontSize: '1.6rem', color: 'var(--ink)', lineHeight: 1.2 }}>
          {lesson.title}
        </h2>
        {lesson.duration_minutes && (
          <div style={{ fontSize: '0.82rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '6px' }}>
            ⏱️ About {lesson.duration_minutes} minutes
          </div>
        )}
      </div>

      {/* Summary */}
      {lesson.content_data?.summary && (
        <div style={{
          background: 'linear-gradient(135deg, #e8f5e9, #d1fae5)',
          borderRadius: '16px', padding: 'var(--space-2) var(--space-3)',
          marginBottom: 'var(--space-3)',
          display: 'flex', alignItems: 'flex-start', gap: '12px'
        }}>
          <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>🦉</div>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
              What You'll Learn
            </div>
            <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--charcoal)', lineHeight: 1.6 }}>
              {lesson.content_data.summary}
            </p>
          </div>
        </div>
      )}

      {/* Video */}
      {isVideo && lesson.content_data?.video_url && (
        <div style={{ marginBottom: 'var(--space-3)' }}>
          <div style={{
            position: 'relative', paddingBottom: '56.25%',
            height: 0, overflow: 'hidden',
            borderRadius: '16px', marginBottom: 'var(--space-1)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
          }}>
            <iframe
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none', borderRadius: '16px' }}
              src={getEmbedUrl(lesson.content_data.video_url)}
              title={lesson.title}
              allowFullScreen
            />
          </div>
          <p style={{ fontSize: '0.78rem', color: '#9ca3af', textAlign: 'center', margin: 0 }}>
            🎬 Watch the full video before marking as complete!
          </p>
        </div>
      )}

      {/* Text content */}
      {!isVideo && lesson.content_data?.body && (
        <div style={{
          background: 'white', borderRadius: '16px',
          padding: 'var(--space-3)', marginBottom: 'var(--space-3)',
          border: '1px solid #f3f4f6',
          lineHeight: 1.8, fontSize: '0.95rem', color: 'var(--charcoal)'
        }}>
          {lesson.content_data.body}
        </div>
      )}

      {/* Completion section */}
      <div style={{
        background: lesson.is_completed ? 'linear-gradient(135deg, #e8f5e9, #d1fae5)' : 'white',
        borderRadius: '20px', padding: 'var(--space-3)',
        border: lesson.is_completed ? '2px solid var(--green)' : '2px dashed #e5e7eb',
        textAlign: 'center'
      }}>
        {lesson.is_completed || justCompleted ? (
          <div>
            <div style={{ fontSize: '4rem', marginBottom: '10px', animation: justCompleted ? 'characterBounce 0.5s ease-in-out 3' : 'none' }}>
              🎉
            </div>
            <h3 style={{ color: 'var(--green)', margin: '0 0 8px 0', fontSize: '1.2rem' }}>
              {justCompleted ? 'Amazing! You finished this lesson!' : 'Lesson Complete! ✅'}
            </h3>
            <p style={{ color: '#6b7280', margin: 0, fontSize: '0.88rem' }}>
              {justCompleted
                ? "Owly is so proud of you! You're getting smarter every day! ⭐"
                : "You've already completed this lesson. Great work! 💪"}
            </p>
            {justCompleted && (
              <div style={{
                marginTop: 'var(--space-2)', display: 'inline-flex',
                alignItems: 'center', gap: '8px',
                background: 'var(--gold)', color: 'var(--ink)',
                borderRadius: '999px', padding: '6px 16px',
                fontSize: '0.85rem', fontWeight: 700
              }}>
                ⭐ +10 points earned!
              </div>
            )}
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🦉</div>
            <h3 style={{ color: 'var(--ink)', margin: '0 0 8px 0', fontSize: '1.1rem' }}>
              Done with this lesson?
            </h3>
            <p style={{ color: '#6b7280', margin: '0 0 var(--space-2) 0', fontSize: '0.88rem' }}>
              Mark it complete to earn points and track your progress!
            </p>
            <button
              onClick={handleMarkComplete}
              disabled={marking}
              style={{
                background: marking ? '#e5e7eb' : 'var(--green)',
                color: marking ? '#9ca3af' : 'white',
                border: 'none', padding: '14px 32px', borderRadius: '14px',
                fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 700,
                textTransform: 'none', letterSpacing: 'normal',
                cursor: marking ? 'not-allowed' : 'pointer',
                margin: 0, transition: 'all 0.2s',
                display: 'inline-flex', alignItems: 'center', gap: '8px'
              }}
            >
              {marking ? '🦉 Saving...' : '✅ Mark as Complete! +10 pts'}
            </button>
          </div>
        )}
      </div>

      {/* Badge celebration popup */}
      {showBadgeCelebration && (
        <BadgeCelebration
          badges={newBadges}
          onClose={() => {
            setShowBadgeCelebration(false)
            setNewBadges([])
          }}
        />
      )}
    </div>
  )
}

export default LessonViewer