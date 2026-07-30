import { useState, useEffect } from 'react'
import apiFetch from './api'

function TeacherLessonViewer({ token, lessonId, onBack, hideBackButton = false }) {
  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLesson()
  }, [lessonId])

  async function fetchLesson() {
    setLoading(true)
    try {
      const response = await apiFetch(`/lessons/${lessonId}?token=${token}`)

      if (!response.ok) {
        console.log('Failed to load lesson, status:', response.status)
        setLoading(false)
        return
      }

      const data = await response.json()
      setLesson(data)
      setLoading(false)
    } catch (error) {
      console.log('Network error:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return <p>Loading...</p>
  }

  if (!lesson) {
    return (
      <div>
        {!hideBackButton && <button onClick={onBack} style={{
        background: 'none', border: 'none', color: 'var(--green)',
        fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600,
        textTransform: 'none', letterSpacing: 'normal',
        padding: '0 0 var(--space-2) 0', cursor: 'pointer', margin: 0, display: 'block'
      }}>← Back to Course</button>}
        <p>Lesson not found.</p>
      </div>
    )
  }

  function getEmbedUrl(youtubeUrl) {
    const videoId = youtubeUrl.split('v=')[1]
    return `https://www.youtube.com/embed/${videoId}`
  }

  return (
    <div>
      {!hideBackButton && <button onClick={onBack} style={{
        background: 'none', border: 'none', color: 'var(--green)',
        fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600,
        textTransform: 'none', letterSpacing: 'normal',
        padding: '0 0 var(--space-2) 0', cursor: 'pointer', margin: 0, display: 'block'
      }}>← Back to Course</button>}
      <h2>{lesson.title}</h2>

      {lesson.content_type === 'video' && lesson.content_data && (
        <div>
          {lesson.content_data.summary && <p>{lesson.content_data.summary}</p>}
          <div style={{
            position: 'relative',
            paddingBottom: '56.25%',
            height: 0,
            overflow: 'hidden',
            borderRadius: 'var(--radius)',
            marginBottom: 'var(--space-2)'
          }}>
            <iframe
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none'
              }}
              src={getEmbedUrl(lesson.content_data.video_url)}
              title={lesson.title}
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {lesson.content_type !== 'video' && lesson.content_data && (
        <div>
          {lesson.content_data.summary && <p>{lesson.content_data.summary}</p>}
          <p>{lesson.content_data.body}</p>
        </div>
      )}
    </div>
  )
}

export default TeacherLessonViewer