import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth'
import { Button } from './ui/Button'

export function Navbar() {
  const token = useAuthStore((s) => s.token)
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="font-semibold">LC Tracker</div>
          <nav className="hidden sm:flex items-center gap-4 text-sm">
            <Link className="text-gray-700 hover:text-gray-900" to="/problems">Problems</Link>
            <Link className="text-gray-700 hover:text-gray-900" to="/due">Due for review</Link>
            <Link className="text-gray-700 hover:text-gray-900" to="/goals">Goals</Link>
            <Link className="text-gray-700 hover:text-gray-900" to="/stats">Stats</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <div className="text-xs text-gray-500">Signed in</div>
            <div className="text-sm font-medium">{user?.username ?? 'User'}</div>
          </div>
          <Button
            variant="secondary"
            disabled={!token}
            onClick={() => {
              logout()
              navigate('/login')
            }}
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}

