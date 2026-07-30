import { useState, useEffect } from 'react'

function BadgeCelebration({ badges, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (!badges || badges.length === 0) return
    const timer = setTimeout(() => {
      if (currentIndex < badges.length - 1) {
        setCurrentIndex(prev => prev + 1)
      } else {
        setVisible(false)
        setTimeout(onClose, 300)
      }
    }, 3000)
    return () => clearTimeout(timer)
  }, [currentIndex, badges])

  if (!visible || !badges || badges.length === 0) return null

  const badge = badges[currentIndex]

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.5)',
      animation: 'fadeIn 0.3s ease'
    }}
      onClick={() => { setVisible(false); onClose() }}
    >
      <div style={{
        background: 'white', borderRadius: '28px',
        padding: 'var(--space-4)', textAlign: 'center',
        maxWidth: '340px', width: '90%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        animation: 'popupSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative'
      }}
        onClick={e => e.stopPropagation()}
      >
        {/* Confetti decoration */}
        <div style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '2rem' }}>
          🎊
        </div>

        <div style={{
          width: '100px', height: '100px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '3.5rem', margin: '0 auto var(--space-2)',
          boxShadow: '0 8px 24px rgba(232,163,61,0.3)',
          animation: 'characterBounce 0.6s ease-in-out 3'
        }}>
          {badge.icon}
        </div>

        <div style={{
          fontFamily: 'var(--font-label)', fontSize: '0.78rem',
          textTransform: 'uppercase', letterSpacing: '0.08em',
          color: 'var(--gold-dark)', marginBottom: '8px', fontWeight: 700
        }}>
          🦉 New Badge Unlocked!
        </div>

        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: '1.8rem',
          color: 'var(--ink)', margin: '0 0 8px 0'
        }}>
          {badge.name}
        </h2>

        <p style={{
          color: '#6b7280', fontSize: '0.95rem', lineHeight: 1.6,
          margin: '0 0 var(--space-3) 0'
        }}>
          {badge.description}
        </p>

        {badges.length > 1 && (
          <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginBottom: 'var(--space-2)' }}>
            {currentIndex + 1} of {badges.length} badges earned!
          </div>
        )}

        <button
          onClick={() => {
            if (currentIndex < badges.length - 1) {
              setCurrentIndex(prev => prev + 1)
            } else {
              setVisible(false)
              onClose()
            }
          }}
          style={{
            width: '100%', background: 'var(--green)', color: 'white',
            border: 'none', padding: '14px', borderRadius: '14px',
            fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 700,
            textTransform: 'none', letterSpacing: 'normal', cursor: 'pointer', margin: 0
          }}
        >
          {currentIndex < badges.length - 1 ? 'Next Badge! →' : '🎉 Awesome! Let\'s keep going!'}
        </button>

        <p style={{ fontSize: '0.78rem', color: '#d1d5db', margin: 'var(--space-1) 0 0' }}>
          Tap anywhere to dismiss
        </p>
      </div>
    </div>
  )
}

export default BadgeCelebration