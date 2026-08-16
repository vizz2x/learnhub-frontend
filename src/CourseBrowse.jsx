import { useState, useEffect } from 'react'
import apiFetch from './api'

function CourseBrowse({ token }) {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [enrollingId, setEnrollingId] = useState(null)
  const [justEnrolled, setJustEnrolled] = useState(null)
  const [enrollError, setEnrollError] = useState(null)

  useEffect(() => {
    fetchAvailableCourses()
  }, [token])

  async function fetchAvailableCourses() {
    setLoading(true)
    try {
      const response = await apiFetch(`/courses/available?token=${token}`)
      if (!response.ok) { setLoading(false); return }
      const data = await response.json()
      setCourses(data)
      setLoading(false)
    } catch (error) {
      console.log('Network error:', error)
      setLoading(false)
    }
  }

  async function handleEnroll(courseId) {
    setEnrollingId(courseId)
    setEnrollError(null)
    try {
      const response = await apiFetch(`/courses/${courseId}/enroll?token=${token}`, {
        method: 'POST'
      })
      if (!response.ok) {
        const err = await response.json()
        setEnrollError(err.detail || 'Cannot enroll right now.')
        setEnrollingId(null)
        return
      }
      setJustEnrolled(courseId)
      setEnrollingId(null)
      setTimeout(() => {
        setJustEnrolled(null)
        fetchAvailableCourses()
      }, 1500)
    } catch (error) {
      setEnrollError('Network error. Please try again.')
      setEnrollingId(null)
    }
  }

  const courseDetails = [
    { icon: '📐', color: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', tag: 'Maths & Logic', desc: 'Build strong number skills and learn to solve problems step by step!' },
    { icon: '📐', color: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', tag: 'Maths & Logic', desc: 'Explore shapes, patterns, and the logic behind the world around you!' },
    { icon: '🧠', color: 'linear-gradient(135deg, #e8f5e9, #d1fae5)', tag: 'Thinking Skills', desc: 'Learn to ask great questions and spot patterns in everyday life!' },
    { icon: '🔢', color: 'linear-gradient(135deg, #fef3c7, #fde68a)', tag: 'Problem Solving', desc: 'Tackle fun puzzles that make your brain stronger every day!' },
    { icon: '📖', color: 'linear-gradient(135deg, #ede9fe, #ddd6fe)', tag: 'Reading', desc: 'Explore amazing stories and build your reading superpowers!' },
    { icon: '🎨', color: 'linear-gradient(135deg, #fce7f3, #fbcfe8)', tag: 'Creativity', desc: 'Express yourself and discover the joy of creating something new!' },
  ]

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', animation: 'characterBounce 1s ease-in-out infinite' }}>🦉</div>
        <p style={{ color: '#6b7280', marginTop: 'var(--space-2)' }}>Finding courses for you...</p>
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
        <div style={{ fontSize: '4rem', marginBottom: 'var(--space-2)' }}>🎉</div>
        <h3 style={{ color: 'var(--ink)', marginBottom: '8px' }}>You're in all the courses!</h3>
        <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
          More courses coming soon. Keep learning! 🌟
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Enrollment error banner */}
      {enrollError && (
        <div style={{
          background: '#fef3c7', border: '2px solid var(--gold)',
          borderRadius: '16px', padding: 'var(--space-2) var(--space-3)',
          marginBottom: 'var(--space-2)',
          display: 'flex', alignItems: 'center', gap: '12px'
        }}>
          <div style={{ fontSize: '2rem', flexShrink: 0 }}>🦉</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, color: '#92400e', fontSize: '0.95rem', marginBottom: '2px' }}>
              Finish your current course first!
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#b45309', lineHeight: 1.5 }}>
              {enrollError} Complete it to unlock new courses! 💪
            </p>
          </div>
          <button
            onClick={() => setEnrollError(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#92400e', padding: 0, margin: 0, flexShrink: 0 }}
          >✕</button>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 'var(--space-2)'
      }}>
        {courses.map((course, index) => {
          const details = courseDetails[index % courseDetails.length]
          const isEnrolling = enrollingId === course.id
          const didEnroll = justEnrolled === course.id

          return (
            <div key={course.id} style={{
              background: 'white', borderRadius: '20px',
              overflow: 'hidden', border: '1px solid #f3f4f6',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)' }}
            >
              {/* Card top */}
              <div style={{
                background: details.color,
                padding: 'var(--space-2) var(--space-3)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
              }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '14px',
                  background: 'rgba(255,255,255,0.6)',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '2rem'
                }}>
                  {details.icon}
                </div>
                <span style={{
                  background: 'rgba(255,255,255,0.8)', color: 'var(--ink)',
                  borderRadius: '999px', padding: '4px 12px',
                  fontSize: '0.75rem', fontWeight: 700
                }}>
                  {details.tag}
                </span>
              </div>

              {/* Card body */}
              <div style={{ padding: 'var(--space-2) var(--space-3) var(--space-3)' }}>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', color: 'var(--ink)' }}>
                  {course.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#6b7280', lineHeight: 1.5, margin: '0 0 var(--space-2) 0' }}>
                  {details.desc}
                </p>
                <button
                  onClick={() => handleEnroll(course.id)}
                  disabled={isEnrolling || didEnroll}
                  style={{
                    width: '100%',
                    background: didEnroll ? '#d1fae5' : 'var(--green)',
                    color: didEnroll ? '#065f46' : 'white',
                    border: 'none', padding: '12px', borderRadius: '12px',
                    fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: 700,
                    textTransform: 'none', letterSpacing: 'normal',
                    cursor: isEnrolling || didEnroll ? 'not-allowed' : 'pointer',
                    margin: 0, transition: 'all 0.2s',
                    opacity: isEnrolling ? 0.7 : 1
                  }}
                >
                  {didEnroll ? '🎉 Joined! Let\'s go!' : isEnrolling ? 'Joining...' : '🚀 Join This Course!'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}