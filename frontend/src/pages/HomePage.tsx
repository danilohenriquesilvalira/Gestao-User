import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect to login page (equivalent to Next.js redirect)
    navigate('/login', { replace: true })
  }, [navigate])

  return null
}