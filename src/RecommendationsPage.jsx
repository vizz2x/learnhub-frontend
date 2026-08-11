import { useState, useEffect } from 'react'
import apiFetch from './api'

function RecommendationsPage({ token, onNavigateToCourse }) {
  const [available, setAvailable] = useState([])
  const [enrolled, setEnrolled] = useState([])
  const [loading, setLoading] = useState(true)
  const [enrollingId, setEnrollingId] = useState(null)
  const [justEnrolled, setJustEnrolled] = useState(null)

  useEffect(() => {
    fetchAll()
  }, [token])

  async function fetchAll() {
    setLoading(true)
    try {
      const [availRes, dashRes] = await Promise.all([
        apiFetch(`/courses/available?token=${token}`),
        apiFetch(`/dashboard?token=${token}`)
      ])
      if (availRes.ok) setAvailable(await availRes.json())
      if (dashRes.ok) {
        const d = await dashRes.json()
        setEnrolled(d.courses)
      }
      setLoading(false)
    } catch (error) {
      console.log('Network error:', error)
      setLoading(false)
    }
  }

  async function handleEnroll(courseId) {
    setEnrollingId(courseId)
    try {
      const response = await apiFetch(`/courses/${courseId}/enroll?token=${token}`, {
        method: 'POST'
      })
      if (!response.ok) { setEnrollingId(null); return }
      setJustEnrolled(courseId)
      setEnrollingId(null)
      setTimeout(() => {
        setJustEnrolled(null)
        fetchAll()
      }, 1500)
    } catch (error) {
      setEnrollingId(null)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', animation: 'characterBounce 1s ease-in-out infinite' }}>🦉</div>
        <p style={{ color: '#6b7280', marginTop: 'var(--space-2)' }}>Finding courses for you...</p>
      </div>
    )
  }

  const courseDetails = [
    { icon: '📐', color: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', tag: 'Maths & Logic', desc: 'Build strong number skills and learn to solve problems step by step!' },
    { icon: '📐', color: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', tag: 'Maths & Logic', desc: 'Explore shapes, patterns, and the logic behind the world around you!' },
    { icon: '🧠', color: 'linear-gradient(135deg, #e8f5e9, #d1fae5)', tag: 'Thinking Skills', desc: 'Learn to ask great questions and spot patterns in everyday life!' },
    { icon: '🔢', color: 'linear-gradient(135deg, #fef3c7, #fde68a)', tag: 'Problem Solving', desc: 'Tackle fun puzzles that make your brain stronger every day!' },
    { icon: '📖', color: 'linear-gradient(135deg, #ede9fe, #ddd6fe)', tag: 'Reading', desc: 'Explore amazing stories and build your reading superpowers!' },
    { icon: '🎨', color: 'linear-gradient(135deg, #fce7f3, #fbcfe8)', tag: 'Creativity', desc: 'Express yourself and discover the joy of creating something new!' },
  ]

  const topics = [
    { icon: '🧠', label: 'Thinking Skills', color: '#e8f5e9', text: '#065f46' },
    { icon: '📚', label: 'Reading', color: '#dbeafe', text: '#1d4ed8' },
    { icon: '🔢', label: 'Maths & Logic', color: '#fef3c7', text: '#92400e' },
    { icon: '✍️', label: 'Creative Writing', color: '#fce7f3', text: '#be185d' },
    { icon: '🗣️', label: 'English Language', color: '#ede9fe', text: '#7c3aed' },
    { icon: '💻', label: 'Technology', color: '#f0fdf4', text: '#065f46' },
    { icon: '🎨', label: 'Creativity', color: '#fff7ed', text: '#c2410c' },
    { icon: '🌍', label: 'World Skills', color: '#d1fae5', text: '#047857' },
  ]

  const careers = [
    { icon: '👨‍⚕️', label: 'Doctor / Nurse' },
    { icon: '👨‍💻', label: 'Tech Expert' },
    { icon: '👨‍🏫', label: 'Teacher' },
    { icon: '👨‍⚖️', label: 'Lawyer' },
    { icon: '🚀', label: 'Engineer' },
    { icon: '🎭', label: 'Creative Arts' },
  ]

  return (
    <div style={{ padding: 'var(--space-3) var(--space-4) 120px', background: '#f8fffe', minHeight: '100vh' }}>

      {/* Hero banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--green) 0%, #0f3d28 100%)',
        borderRadius: '24px', padding: 'var(--space-4)',
        marginBottom: 'var(--space-3)',
        display: 'grid', gridTemplateColumns: '1fr auto',
        gap: 'var(--space-3)', alignItems: 'center',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', right: '120px', top: '-40px',
          width: '200px', height: '200px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)', pointerEvents: 'none'
        }} />
        <div style={{ zIndex: 1 }}>
          <div style={{
            display: 'inline-block', background: 'rgba(255,255,255,0.15)',
            borderRadius: '999px', padding: '4px 14px',
            fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)',
            marginBottom: '12px'
          }}>
            🗺️ Explore LearnHub
          </div>
          <h2 style={{
            color: 'white', margin: '0 0 10px 0',
            fontFamily: 'var(--font-display)', fontSize: '1.8rem',
            lineHeight: 1.2, borderBottom: 'none', padding: 0
          }}>
            Find Your Learning Adventure! 🚀
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', margin: '0 0 var(--space-2) 0', fontSize: '0.95rem', lineHeight: 1.5 }}>
            Pick a course that sounds exciting and start earning points with Owly today!
          </p>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '10px', padding: '8px 14px',
            color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem'
          }}>
            💡 Personalized recommendations coming soon!
          </div>
        </div>
        <div style={{ fontSize: '6rem', animation: 'characterBounce 2.5s ease-in-out infinite', zIndex: 1 }}>
          🦉
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 'var(--space-3)' }}>

        {/* Left — available courses */}
        <div>
          <h3 style={{ margin: '0 0 var(--space-2) 0', fontSize: '1.1rem', color: 'var(--ink)' }}>
            🎯 Courses You Can Join
          </h3>

          {available.length === 0 ? (
            <div style={{
              background: 'white', borderRadius: '24px', padding: 'var(--space-4)',
              textAlign: 'center', border: '2px dashed #d1fae5',
              marginBottom: 'var(--space-3)'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: 'var(--space-1)' }}>🎉</div>
              <h3 style={{ color: 'var(--ink)', marginBottom: '8px' }}>You're in all the courses!</h3>
              <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
                Wow, you've joined everything available! More courses coming soon. Keep learning! 🌟
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
              {available.map((course, index) => {
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
                        width: '52px', height: '52px', borderRadius: '14px',
                        background: 'rgba(255,255,255,0.6)',
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: '1.8rem'
                      }}>
                        {details.icon}
                      </div>
                      <span style={{
                        background: 'rgba(255,255,255,0.8)', color: 'var(--ink)',
                        borderRadius: '999px', padding: '3px 10px',
                        fontSize: '0.72rem', fontWeight: 700
                      }}>
                        {details.tag}
                      </span>
                    </div>

                    {/* Card body */}
                    <div style={{ padding: 'var(--space-2) var(--space-3) var(--space-3)' }}>
                      <h3 style={{ margin: '0 0 6px 0', fontSize: '1rem', color: 'var(--ink)' }}>
                        {course.title}
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.5, margin: '0 0 var(--space-2) 0' }}>
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
          )}

          {/* Continue learning */}
          {enrolled.length > 0 && (
            <div>
              <h3 style={{ margin: '0 0 var(--space-2) 0', fontSize: '1.1rem', color: 'var(--ink)' }}>
                ▶️ Continue Where You Left Off
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                {enrolled.filter(c => c.progress < 100).map((course, index) => (
                  <div
                    key={course.id}
                    onClick={() => onNavigateToCourse(course.id)}
                    style={{
                      background: 'white', borderRadius: '16px',
                      padding: 'var(--space-2) var(--space-3)',
                      cursor: 'pointer', border: '1px solid #f3f4f6',
                      display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                      transition: 'transform 0.15s, box-shadow 0.15s',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)' }}
                  >
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '12px',
                      background: ['#e8f5e9', '#fef3c7', '#dbeafe'][index % 3],
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.4rem', flexShrink: 0
                    }}>
                      {['🧠', '💡', '🔢'][index % 3]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--ink)', marginBottom: '4px' }}>
                        {course.title}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ flex: 1, height: '6px', background: '#f3f4f6', borderRadius: '999px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${course.progress}%`, background: 'var(--green)', borderRadius: '999px' }} />
                        </div>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--green)' }}>{course.progress}%</span>
                      </div>
                    </div>
                    <button style={{
                      background: 'var(--green)', color: 'white', border: 'none',
                      padding: '8px 14px', borderRadius: '10px',
                      fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 600,
                      textTransform: 'none', letterSpacing: 'normal',
                      cursor: 'pointer', margin: 0, whiteSpace: 'nowrap'
                    }}>
                      Continue →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>

          {/* Browse by topic */}
          <div style={{
            background: 'white', borderRadius: '20px', padding: 'var(--space-3)',
            border: '1px solid #f3f4f6', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <h3 style={{ margin: '0 0 var(--space-2) 0', fontSize: '0.95rem', color: 'var(--ink)' }}>
              🏷️ Browse by Topic
            </h3>
            <p style={{ color: '#9ca3af', fontSize: '0.78rem', margin: '0 0 var(--space-1) 0' }}>
              Topic filtering coming soon!
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {topics.map(topic => (
                <div key={topic.label} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '8px 12px', borderRadius: '10px',
                  background: topic.color, opacity: 0.75, cursor: 'not-allowed'
                }}>
                  <span style={{ fontSize: '1.1rem' }}>{topic.icon}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: topic.text }}>{topic.label}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: topic.text, opacity: 0.7 }}>Soon</span>
                </div>
              ))}
            </div>
          </div>

          {/* What do you want to be? */}
          <div style={{
            background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
            borderRadius: '20px', padding: 'var(--space-3)',
            border: '1px solid #fcd34d'
          }}>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '0.95rem', color: '#92400e' }}>
              🎯 What do you want to be?
            </h3>
            <p style={{ color: '#b45309', fontSize: '0.78rem', margin: '0 0 var(--space-2) 0', lineHeight: 1.4 }}>
              Career-based course recommendations coming soon!
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              {careers.map(career => (
                <div key={career.label} style={{
                  background: 'rgba(255,255,255,0.5)', borderRadius: '10px',
                  padding: '8px', textAlign: 'center', cursor: 'not-allowed', opacity: 0.8
                }}>
                  <div style={{ fontSize: '1.3rem', marginBottom: '2px' }}>{career.icon}</div>
                  <div style={{ fontSize: '0.7rem', color: '#92400e', fontWeight: 600, lineHeight: 1.2 }}>{career.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Interest quiz placeholder */}
          <div style={{
            background: 'linear-gradient(135deg, #ede9fe, #ddd6fe)',
            borderRadius: '20px', padding: 'var(--space-3)',
            border: '1px solid #c4b5fd', textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>✨</div>
            <h3 style={{ color: '#4c1d95', margin: '0 0 8px 0', fontSize: '0.95rem' }}>
              Find the course for you
            </h3>
            <p style={{ color: '#7c3aed', fontSize: '0.82rem', margin: '0 0 var(--space-2) 0', lineHeight: 1.4 }}>
              Take a fun quiz and Owly will recommend the best courses just for you!
            </p>
            <button style={{
              background: '#7c3aed', color: 'white', border: 'none',
              padding: '10px 20px', borderRadius: '10px',
              fontFamily: 'var(--font-body)', fontSize: '0.85rem', fontWeight: 600,
              textTransform: 'none', letterSpacing: 'normal',
              cursor: 'not-allowed', margin: 0, opacity: 0.7, width: '100%'
            }}>
              🦉 Coming Soon!
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecommendationsPage