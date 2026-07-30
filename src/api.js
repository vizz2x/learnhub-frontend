const API_BASE = 'https://learnhub-lms-production-249d.up.railway.app'


async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, options)

  if (response.status === 401) {
    alert('Your session has expired. Please log in again.')
    window.location.reload()
    throw new Error('Session expired')
  }

  return response
}

export default apiFetch