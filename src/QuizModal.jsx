import { useState, useEffect } from 'react'
import apiFetch from './api'

function QuizModal({ token, lessonId, onPassed, onClose }) {
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [answers, setAnswers] = useState({})
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [noQuiz, setNoQuiz] = useState(false)

  useEffect(() => {
    fetchQuiz()
  }, [lessonId])

  async function fetchQuiz() {
    setLoading(true)
    try {
      const response = await apiFetch(`/quiz/lesson/${lessonId}?token=${token}`)
      if (response.status === 404) {
        setNoQuiz(true)
        setLoading(false)
        onPassed() // No quiz — allow completion
        return
      }
      if (!response.ok) { setLoading(false); return }
      const data = await response.json()

      // Check if already passed
      const attemptRes = await apiFetch(`/quiz/attempt/${lessonId}?token=${token}`)
      if (attemptRes.ok) {
        const attempt = await attemptRes.json()
        if (attempt.passed) {
          onPassed()
          return
        }
      }

      setQuiz(data)
      setLoading(false)
    } catch (error) {
      console.log('Network error:', error)
      setNoQuiz(true)
      setLoading(false)
      onPassed()
    }
  }

  function handleAnswer(questionId, answer) {
    setAnswers(prev => ({ ...prev, [String(questionId)]: answer }))
  }

  async function handleSubmit() {
    setSubmitting(true)
    try {
      const response = await apiFetch(`/quiz/submit?token=${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quiz_id: quiz.id,
          answers,
        }),
      })
      if (!response.ok) {
        setSubmitting(false)
        return
      }
      const data = await response.json()
      setResult(data)
      setSubmitting(false)
      if (data.passed) {
        setTimeout(() => onPassed(), 2000)
      }
    } catch (error) {
      setSubmitting(false)
    }
  }

  function resetQuiz() {
    setAnswers({})
    setCurrentQuestion(0)
    setResult(null)
  }

  if (loading) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{
          background: 'white', borderRadius: '24px', padding: 'var(--space-4)',
          textAlign: 'center', maxWidth: '400px', width: '90%'
        }}>
          <div style={{ fontSize: '4rem', animation: 'characterBounce 1s ease-in-out infinite' }}>🦉</div>
          <p style={{ color: '#6b7280', marginTop: 'var(--space-2)' }}>Loading your quiz...</p>
        </div>
      </div>
    )
  }

  if (noQuiz || !quiz) return null

  const question = quiz.questions[currentQuestion]
  const totalQuestions = quiz.questions.length
  const allAnswered = quiz.questions.every(q => answers[String(q.id)] !== undefined)

  // ── RESULT SCREEN ──
  if (result) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{
          background: 'white', borderRadius: '24px', padding: 'var(--space-4)',
          maxWidth: '420px', width: '90%', textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}>
          <div style={{ fontSize: '5rem', marginBottom: 'var(--space-2)', animation: 'characterBounce 0.5s ease-in-out 3' }}>
            {result.passed ? '🎉' : '😮'}
          </div>

          <h2 style={{
            color: result.passed ? 'var(--green)' : 'var(--ink)',
            margin: '0 0 8px 0', fontSize: '1.5rem'
          }}>
            {result.passed ? 'You passed! Amazing!' : 'Not quite yet...'}
          </h2>

          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '3rem',
            fontWeight: 700, color: result.passed ? 'var(--green)' : 'var(--red-pen)',
            margin: 'var(--space-1) 0'
          }}>
            {Math.round(result.score)}%
          </div>

          <p style={{ color: '#6b7280', margin: '0 0 var(--space-3) 0', fontSize: '0.95rem', lineHeight: 1.5 }}>
            {result.message}
          </p>

          {result.needs_review && (
            <div style={{
              background: '#ede9fe', borderRadius: '12px', padding: '10px 16px',
              marginBottom: 'var(--space-2)', fontSize: '0.85rem', color: '#7c3aed'
            }}>
              ✍️ Your short answer will be reviewed by your teacher.
            </div>
          )}

          {result.passed ? (
            <p style={{ color: 'var(--green)', fontSize: '0.9rem', fontWeight: 600 }}>
              🦉 Owly says: Brilliant work! Unlocking next lesson...
            </p>
          ) : (
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={resetQuiz}
                style={{
                  background: 'var(--green)', color: 'white', border: 'none',
                  padding: '12px 24px', borderRadius: '12px',
                  fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: 700,
                  textTransform: 'none', letterSpacing: 'normal', cursor: 'pointer', margin: 0
                }}
              >
                🔄 Try Again!
              </button>
              <button
                onClick={onClose}
                style={{
                  background: 'none', color: '#6b7280', border: '1px solid #e5e7eb',
                  padding: '12px 24px', borderRadius: '12px',
                  fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: 500,
                  textTransform: 'none', letterSpacing: 'normal', cursor: 'pointer', margin: 0
                }}
              >
                Review Lesson
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── QUIZ SCREEN ──
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white', borderRadius: '24px',
        maxWidth: '500px', width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, var(--green), #0f3d28)',
          padding: 'var(--space-3)',
          display: 'flex', alignItems: 'center', gap: '12px'
        }}>
          <div style={{ fontSize: '2.5rem' }}>🦉</div>
          <div style={{ flex: 1 }}>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Quick Quiz
            </div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>
              {quiz.title}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>Question</div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>
              {currentQuestion + 1} / {totalQuestions}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: '4px', background: 'rgba(0,0,0,0.1)' }}>
          <div style={{
            height: '100%',
            width: `${((currentQuestion + 1) / totalQuestions) * 100}%`,
            background: 'var(--gold)',
            transition: 'width 0.3s ease'
          }} />
        </div>

        {/* Question */}
        <div style={{ padding: 'var(--space-3)' }}>
          <p style={{ fontSize: '1.05rem', color: 'var(--ink)', fontWeight: 600, lineHeight: 1.6, marginBottom: 'var(--space-3)', margin: '0 0 var(--space-3) 0' }}>
            {question.question_text}
          </p>

          {/* Multiple choice */}
          {question.question_type === 'multiple_choice' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['A', 'B', 'C', 'D'].map(opt => {
                const optValue = question[`option_${opt.toLowerCase()}`]
                if (!optValue) return null
                const isSelected = answers[String(question.id)] === opt
                return (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(question.id, opt)}
                    style={{
                      background: isSelected ? '#e8f5e9' : '#f9fafb',
                      border: isSelected ? '2px solid var(--green)' : '2px solid #e5e7eb',
                      borderRadius: '12px', padding: '12px 16px',
                      display: 'flex', alignItems: 'center', gap: '12px',
                      cursor: 'pointer', textAlign: 'left', width: '100%',
                      fontFamily: 'var(--font-body)', fontSize: '0.95rem',
                      textTransform: 'none', letterSpacing: 'normal', margin: 0,
                      transition: 'all 0.15s'
                    }}
                  >
                    <span style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      background: isSelected ? 'var(--green)' : '#e5e7eb',
                      color: isSelected ? 'white' : '#6b7280',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: '0.85rem', flexShrink: 0
                    }}>{opt}</span>
                    <span style={{ color: isSelected ? 'var(--green)' : 'var(--ink)', fontWeight: isSelected ? 600 : 400 }}>
                      {optValue}
                    </span>
                  </button>
                )
              })}
            </div>
          )}

          {/* True / False */}
          {question.question_type === 'true_false' && (
            <div style={{ display: 'flex', gap: '12px' }}>
              {['True', 'False'].map(opt => {
                const isSelected = answers[String(question.id)] === opt
                return (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(question.id, opt)}
                    style={{
                      flex: 1, padding: '16px',
                      background: isSelected ? (opt === 'True' ? '#e8f5e9' : '#fee2e2') : '#f9fafb',
                      border: isSelected ? `2px solid ${opt === 'True' ? 'var(--green)' : 'var(--red-pen)'}` : '2px solid #e5e7eb',
                      borderRadius: '12px', cursor: 'pointer',
                      fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 700,
                      color: isSelected ? (opt === 'True' ? 'var(--green)' : 'var(--red-pen)') : '#6b7280',
                      textTransform: 'none', letterSpacing: 'normal', margin: 0,
                      transition: 'all 0.15s'
                    }}
                  >
                    {opt === 'True' ? '✅ True' : '❌ False'}
                  </button>
                )
              })}
            </div>
          )}

          {/* Short answer */}
          {question.question_type === 'short_answer' && (
            <div>
              <div style={{ background: '#ede9fe', borderRadius: '10px', padding: '8px 14px', marginBottom: '10px', fontSize: '0.82rem', color: '#7c3aed' }}>
                ✍️ Write your answer below. Your teacher will review it.
              </div>
              <textarea
                rows="4"
                value={answers[String(question.id)] || ''}
                onChange={e => handleAnswer(question.id, e.target.value)}
                placeholder="Type your answer here..."
                style={{ width: '100%', maxWidth: '100%', fontSize: '0.95rem' }}
              />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{
          padding: 'var(--space-2) var(--space-3) var(--space-3)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <button
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            style={{
              background: 'none', color: currentQuestion === 0 ? '#d1d5db' : 'var(--green)',
              border: 'none', fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600,
              textTransform: 'none', letterSpacing: 'normal',
              cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer', padding: 0, margin: 0
            }}
          >
            ← Previous
          </button>

          {currentQuestion < totalQuestions - 1 ? (
            <button
              onClick={() => setCurrentQuestion(prev => prev + 1)}
              disabled={!answers[String(question.id)]}
              style={{
                background: answers[String(question.id)] ? 'var(--green)' : '#e5e7eb',
                color: answers[String(question.id)] ? 'white' : '#9ca3af',
                border: 'none', padding: '10px 20px', borderRadius: '10px',
                fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600,
                textTransform: 'none', letterSpacing: 'normal',
                cursor: answers[String(question.id)] ? 'pointer' : 'not-allowed', margin: 0
              }}
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || submitting}
              style={{
                background: allAnswered ? 'var(--green)' : '#e5e7eb',
                color: allAnswered ? 'white' : '#9ca3af',
                border: 'none', padding: '10px 24px', borderRadius: '10px',
                fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: 700,
                textTransform: 'none', letterSpacing: 'normal',
                cursor: allAnswered ? 'pointer' : 'not-allowed', margin: 0,
                opacity: submitting ? 0.7 : 1
              }}
            >
              {submitting ? '🦉 Checking...' : '🎯 Submit Answers!'}
            </button>
          )}
        </div>

        {/* Question dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', paddingBottom: 'var(--space-2)' }}>
          {quiz.questions.map((q, i) => (
            <div
              key={i}
              onClick={() => setCurrentQuestion(i)}
              style={{
                width: '10px', height: '10px', borderRadius: '50%',
                background: i === currentQuestion ? 'var(--green)' : answers[String(q.id)] ? 'var(--gold)' : '#e5e7eb',
                cursor: 'pointer', transition: 'background 0.15s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default QuizModal