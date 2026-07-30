import { useState } from 'react'
import apiFetch from './api'

function ProfilePage({ token, username, onBack }) {
  const [fullName, setFullName] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fieldLabel = {
    fontFamily: 'var(--font-label)', fontSize: '0.75rem', textTransform: 'uppercase',
    letterSpacing: '0.05em', color: 'var(--ink)', marginBottom: '6px',
    display: 'block', fontWeight: 600
  }

  async function handleSave(event) {
    event.preventDefault()
    setMessage('')
    setSubmitting(true)
    try {
      const response = await apiFetch(`/auth/profile?token=${token}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName || null,
          current_password: currentPassword || null,
          new_password: newPassword || null,
        }),
      })
      if (!response.ok) {
        const err = await response.json()
        setMessage(err.detail || 'Failed to update profile.')
        setSubmitting(false)
        return
      }
      setMessage('Profile updated successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setSubmitting(false)
    } catch (error) {
      setMessage('Network error. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className="page-content page-forward">
      <button onClick={onBack} style={{
        background: 'none', border: 'none', color: 'var(--green)',
        fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600,
        textTransform: 'none', letterSpacing: 'normal',
        padding: '0 0 var(--space-2) 0', cursor: 'pointer', margin: 0, display: 'block'
      }}>← Back</button>

      <h2 style={{ marginBottom: 'var(--space-3)' }}>Edit Profile</h2>

      <div className="panel" style={{ maxWidth: '500px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
          marginBottom: 'var(--space-3)', paddingBottom: 'var(--space-2)',
          borderBottom: '1px solid #f3f4f6'
        }}>
          <div style={{
            width: '56px', height: '56px', background: 'var(--green)',
            borderRadius: '50%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: 'white', fontFamily: 'var(--font-label)',
            fontSize: '1.1rem', fontWeight: 600
          }}>
            {username ? username.slice(0, 2).toUpperCase() : 'LH'}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{username}</div>
            <div style={{ fontSize: '0.82rem', color: '#6b7280' }}>Registered account</div>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div style={{ marginBottom: 'var(--space-2)' }}>
            <label style={fieldLabel}>Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              autoComplete="off"
              style={{ maxWidth: '100%', width: '100%' }}
            />
          </div>

          <div style={{
            marginTop: 'var(--space-3)', paddingTop: 'var(--space-2)',
            borderTop: '1px solid #f3f4f6', marginBottom: 'var(--space-2)'
          }}>
            <h3 style={{ fontSize: '0.95rem', marginBottom: 'var(--space-2)' }}>Change Password</h3>
          </div>

          <div style={{ marginBottom: 'var(--space-2)' }}>
            <label style={fieldLabel}>Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              style={{ maxWidth: '100%', width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: 'var(--space-3)' }}>
            <label style={fieldLabel}>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              style={{ maxWidth: '100%', width: '100%' }}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              background: 'var(--green)', color: 'white', border: 'none',
              padding: '12px 28px', borderRadius: '8px',
              fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: 600,
              textTransform: 'none', letterSpacing: 'normal',
              cursor: submitting ? 'not-allowed' : 'pointer',
              margin: 0, opacity: submitting ? 0.7 : 1
            }}
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        {message && (
          <p style={{
            marginTop: '12px', padding: '10px 14px', borderRadius: '8px',
            background: message.includes('success') ? '#d1fae5' : '#fee2e2',
            color: message.includes('success') ? '#065f46' : '#991b1b',
            fontSize: '0.9rem', margin: '12px 0 0 0'
          }}>
            {message}
          </p>
        )}
      </div>
    </div>
  )
}

export default ProfilePage