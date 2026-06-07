import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../api/client'
import { useAuthStore } from '../store/auth'
import { Button } from '../components/ui/Button'

export function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await login({ email, password })
      setAuth(res.token, res.user)
      navigate('/problems')
    } catch (err: any) {
      setError(err?.response?.data?.error ?? 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold mb-2">Login</h1>
      {error ? <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block">
          <div className="text-sm font-medium text-gray-700">Email</div>
          <input className="mt-1 w-full rounded border border-gray-200 bg-white px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="block">
          <div className="text-sm font-medium text-gray-700">Password</div>
          <input type="password" className="mt-1 w-full rounded border border-gray-200 bg-white px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <Button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
      <div className="mt-4 text-sm text-gray-600">
        No account? <Link className="text-blue-700 hover:underline" to="/register">Register</Link>
      </div>
    </div>
  )
}

