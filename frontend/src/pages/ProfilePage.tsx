import { useEffect, useState } from 'react'
import { getAuthUser, updateProfile } from '../utils/profile'

export function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [username, setUsername] = useState('')
  const [leetcodeUsername, setLeetcodeUsername] = useState('')

  useEffect(() => {
    const u = getAuthUser()
    if (u) {
      setUsername(u.username)
      setLeetcodeUsername(u.leetcode_username ?? '')
    }
    setLoading(false)
  }, [])

  async function onSave(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await updateProfile({ username, leetcode_username: leetcodeUsername })
      window.location.reload()
    } catch (err: any) {
      setError(err?.response?.data?.error ?? 'Failed to update')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-2">Profile</h1>
      {error ? <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
      <form onSubmit={onSave} className="space-y-4 bg-white rounded border border-gray-200 p-4">
        <label className="block">
          <div className="text-sm font-medium text-gray-700">Username</div>
          <input className="mt-1 w-full rounded border border-gray-200 bg-white px-3 py-2" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label className="block">
          <div className="text-sm font-medium text-gray-700">LeetCode username</div>
          <input className="mt-1 w-full rounded border border-gray-200 bg-white px-3 py-2" value={leetcodeUsername} onChange={(e) => setLeetcodeUsername(e.target.value)} />
        </label>
        <button className="rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700" disabled={loading}>
          Save
        </button>
      </form>
    </div>
  )
}

