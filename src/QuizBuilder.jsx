import { useState, useEffect } from 'react'
import apiFetch from './api'

function QuizBuilder({ token, lesson, courseId, onBack }) {
  const [title, setTitle] = useState(`${lesson.title} — Quiz`)
  const [passPercentage, setPassPercentage] = useState(70)
  const [questions, setQuestions] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [existingQuiz, setExistingQuiz] = useState(null)

  useEffect(() => {
    checkExistingQuiz()
  }, [lesson.id])

  async function checkExistingQuiz() {
    try {
      const response = await apiFetch(`/quiz/lesson/${lesson.id}?token=${token}`)
      if (response.ok) {
        const data = await response.json()
        setExistingQuiz(data)
        setTitle(data.title)
        setPassPercentage(data.pass_percentage)
        // Pre-populate questions for editing
        setQuestions(data.questions.map(q => ({
          question_text: q.question_text,
          question_type: q.question_type,
          option_a: q.option_a || '',
          option_b: q.option_b || '',
          option_c: q.option_c || '',
          option_d: q.option_d || '',
          correct_answer: q.correct_answer || '',
          points: q.points,
          sequence_number: q.sequence_number,
        })))
      }
    } catch (error) {
      // No quiz exists yet — that's fine
    }
  }

  function addQuestion(type) {
    setQuestions(prev => [...prev, {
      question_text: '',
      question_type: type,
      option_a: type === 'true_false' ? 'True' : '',
      option_b: type === 'true_false' ? 'False' : '',
      option_c: '',
      option_d: '',
      correct_answer: '',
      points: 10,
      sequence_number: prev.length + 1,
    }])
  }

  function updateQuestion(index, field, value) {
    setQuestions(prev => prev.map((q, i) => i === index ? { ...q, [field]: value } : q))
  }

  function removeQuestion(index) {
    setQuestions(prev => prev.filter((_, i) => i !== index).map((q, i) => ({ ...q, sequence_number: i + 1 })))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (questions.length < 1) { setMessage('Add at least one question.'); return }
    if (questions.length > 5) { setMessage('Maximum 5 questions per quiz.'); return }

    setSubmitting(true)
    setMessage('')

    try {
      const response = await apiFetch(`/quiz/create?token=${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lesson_id: lesson.id,
          course_id: courseId,
          title,
          pass_percentage: passPercentage,
          questions,
        }),
      })
      if (!response.ok) {
        const err = await response.json()
        setMessage(err.detail || 'Failed to save quiz.')
        setSubmitting(false)
        return
      }
      setMessage('success')
      setSubmitting(false)
    } catch (error) {
      setMessage('Network error. Please try again.')
      setSubmitting(false)
    }
  }

  const backBtn = {
    background: 'none', border: 'none', color: 'var(--green)',
    fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600,
    textTransform: 'none', letterSpacing: 'normal',
    padding: '0 0 var(--space-2) 0', cursor: 'pointer', margin: 0, display: 'block'
  }

  const fieldLabel = {
    fontFamily: 'var(--font-label)', fontSize: '0.75rem', textTransform: 'uppercase',
    letterSpacing: '0.05em', color: 'var(--ink)', marginBottom: '6px',
    display: 'block', fontWeight: 600
  }

  const primaryBtn = {
    background: 'var(--green)', color: 'white', border: 'none',
    padding: '10px 20px', borderRadius: '8px',
    fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600,
    textTransform: 'none', letterSpacing: 'normal', cursor: 'pointer', margin: 0
  }

  if (message === 'success') {
    return (
      <div style={{ padding: 'var(--space-3) var(--space-4)' }}>
        <div style={{ background: '#d1fae5', borderRadius: '20px', padding: 'var(--space-4)', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: 'var(--space-1)' }}>🎉</div>
          <h3 style={{ color: 'var(--green)', marginBottom: '8px' }}>
            {existingQuiz ? 'Quiz Updated!' : 'Quiz Created!'}
          </h3>
          <p style={{ color: '#065f46', margin: '0 0 var(--space-2) 0' }}>
            Students will see this quiz after completing "{lesson.title}".
          </p>
          <button onClick={onBack} style={primaryBtn}>← Back to Course</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: 'var(--space-3) var(--space-4) 80px' }}>
      <button style={backBtn} onClick={onBack}>← Back to Course</button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-3)' }}>
        <div>
          <h2 style={{ margin: '0 0 4px 0' }}>
            {existingQuiz ? 'Edit Quiz' : 'Create Quiz'} — {lesson.title}
          </h2>
          <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9rem' }}>
            {existingQuiz ? 'Update the quiz for this lesson.' : 'Add a quiz students must pass before moving on.'}
            {' '}Max 5 questions. Students need {passPercentage}% to pass.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Quiz settings */}
        <div className="panel" style={{ marginBottom: 'var(--space-2)' }}>
          <h3 style={{ margin: '0 0 var(--space-2) 0', fontSize: '1rem' }}>Quiz Settings</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: 'var(--space-2)' }}>
            <div>
              <label style={fieldLabel}>Quiz Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                style={{ width: '100%', maxWidth: '100%' }}
              />
            </div>
            <div>
              <label style={fieldLabel}>Pass Percentage (%)</label>
              <input
                type="number"
                min="50"
                max="100"
                value={passPercentage}
                onChange={e => setPassPercentage(parseInt(e.target.value))}
                required
              />
            </div>
          </div>
        </div>

        {/* Questions */}
        {questions.map((q, index) => (
          <div key={index} className="panel" style={{
            marginBottom: 'var(--space-2)',
            borderLeft: `4px solid ${q.question_type === 'multiple_choice' ? 'var(--green)' : q.question_type === 'true_false' ? 'var(--gold)' : '#7c3aed'}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  background: q.question_type === 'multiple_choice' ? '#e8f5e9' : q.question_type === 'true_false' ? '#fef3c7' : '#ede9fe',
                  color: q.question_type === 'multiple_choice' ? 'var(--green)' : q.question_type === 'true_false' ? '#92400e' : '#7c3aed',
                  borderRadius: '999px', padding: '3px 10px', fontSize: '0.75rem', fontWeight: 700
                }}>
                  {q.question_type === 'multiple_choice' ? '📝 Multiple Choice' : q.question_type === 'true_false' ? '✅ True / False' : '✍️ Short Answer'}
                </span>
                <span style={{ fontSize: '0.82rem', color: '#6b7280' }}>Question {index + 1}</span>
              </div>
              <button
                type="button"
                onClick={() => removeQuestion(index)}
                style={{ background: 'none', border: 'none', color: 'var(--red-pen)', cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'var(--font-body)', textTransform: 'none', letterSpacing: 'normal', padding: 0, margin: 0, fontWeight: 600 }}
              >
                Remove
              </button>
            </div>

            <div style={{ marginBottom: 'var(--space-2)' }}>
              <label style={fieldLabel}>Question Text *</label>
              <textarea
                rows="2"
                value={q.question_text}
                onChange={e => updateQuestion(index, 'question_text', e.target.value)}
                placeholder="Enter your question here..."
                required
                style={{ width: '100%', maxWidth: '100%' }}
              />
            </div>

            {/* Multiple choice options */}
            {q.question_type === 'multiple_choice' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-1)', marginBottom: 'var(--space-2)' }}>
                {['a', 'b', 'c', 'd'].map(opt => (
                  <div key={opt}>
                    <label style={{ ...fieldLabel, color: q.correct_answer === opt.toUpperCase() ? 'var(--green)' : 'var(--ink)' }}>
                      Option {opt.toUpperCase()} {q.correct_answer === opt.toUpperCase() ? '✅ Correct' : ''}
                    </label>
                    <input
                      type="text"
                      value={q[`option_${opt}`]}
                      onChange={e => updateQuestion(index, `option_${opt}`, e.target.value)}
                      placeholder={`Option ${opt.toUpperCase()}`}
                      style={{ width: '100%', maxWidth: '100%', borderColor: q.correct_answer === opt.toUpperCase() ? 'var(--green)' : '' }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* True/False options */}
            {q.question_type === 'true_false' && (
              <div style={{ marginBottom: 'var(--space-2)' }}>
                <label style={fieldLabel}>Options</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ background: '#f9fafb', padding: '8px 16px', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--ink)' }}>True</div>
                  <div style={{ background: '#f9fafb', padding: '8px 16px', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--ink)' }}>False</div>
                </div>
              </div>
            )}

            {/* Short answer info */}
            {q.question_type === 'short_answer' && (
              <div style={{ background: '#ede9fe', borderRadius: '10px', padding: '10px 14px', marginBottom: 'var(--space-2)', fontSize: '0.85rem', color: '#7c3aed' }}>
                ✍️ Students will type a free-text answer. You'll review and mark it manually in the grading queue.
              </div>
            )}

            {/* Correct answer selector */}
            {q.question_type !== 'short_answer' && (
              <div style={{ marginBottom: 'var(--space-1)' }}>
                <label style={fieldLabel}>Correct Answer *</label>
                {q.question_type === 'multiple_choice' ? (
                  <select
                    value={q.correct_answer}
                    onChange={e => updateQuestion(index, 'correct_answer', e.target.value)}
                    required
                  >
                    <option value="">Select correct answer</option>
                    <option value="A">A — {q.option_a}</option>
                    <option value="B">B — {q.option_b}</option>
                    <option value="C">C — {q.option_c}</option>
                    <option value="D">D — {q.option_d}</option>
                  </select>
                ) : (
                  <select
                    value={q.correct_answer}
                    onChange={e => updateQuestion(index, 'correct_answer', e.target.value)}
                    required
                  >
                    <option value="">Select correct answer</option>
                    <option value="True">True</option>
                    <option value="False">False</option>
                  </select>
                )}
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <label style={{ ...fieldLabel, margin: 0 }}>Points:</label>
              <input
                type="number"
                min="1"
                max="20"
                value={q.points}
                onChange={e => updateQuestion(index, 'points', parseInt(e.target.value))}
                style={{ width: '80px' }}
              />
            </div>
          </div>
        ))}

        {/* Add question buttons */}
        {questions.length < 5 && (
          <div style={{ display: 'flex', gap: '10px', marginBottom: 'var(--space-3)', flexWrap: 'wrap' }}>
            <button type="button" onClick={() => addQuestion('multiple_choice')} style={{
              ...primaryBtn, background: 'var(--green)', display: 'flex', alignItems: 'center', gap: '6px'
            }}>
              + Multiple Choice
            </button>
            <button type="button" onClick={() => addQuestion('true_false')} style={{
              ...primaryBtn, background: 'var(--gold-dark)', display: 'flex', alignItems: 'center', gap: '6px'
            }}>
              + True / False
            </button>
            <button type="button" onClick={() => addQuestion('short_answer')} style={{
              ...primaryBtn, background: '#7c3aed', display: 'flex', alignItems: 'center', gap: '6px'
            }}>
              + Short Answer
            </button>
          </div>
        )}

        {questions.length === 0 && (
          <div style={{ background: '#f9fafb', borderRadius: '16px', padding: 'var(--space-3)', textAlign: 'center', marginBottom: 'var(--space-3)', border: '2px dashed #e5e7eb' }}>
            <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9rem' }}>
              No questions yet. Add between 1 and 5 questions using the buttons above.
            </p>
          </div>
        )}

        {/* Submit */}
        {questions.length > 0 && (
          <button
            type="submit"
            disabled={submitting}
            style={{
              ...primaryBtn,
              opacity: submitting ? 0.7 : 1,
              cursor: submitting ? 'not-allowed' : 'pointer',
              padding: '12px 28px', fontSize: '0.95rem'
            }}
          >
            {submitting ? 'Saving...' : existingQuiz ? '💾 Update Quiz' : '🎯 Save Quiz'}
          </button>
        )}

        {message && message !== 'success' && (
          <p style={{ marginTop: '12px', padding: '10px 14px', borderRadius: '8px', background: '#fee2e2', color: '#991b1b', fontSize: '0.9rem' }}>
            {message}
          </p>
        )}
      </form>
    </div>
  )
}

export default QuizBuilder