import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthGate } from './components/AuthGate'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ProfilePage } from './pages/ProfilePage'
import { ProblemsPage } from './pages/ProblemsPage'
import { DueForReviewPage } from './pages/DueForReviewPage'
import { GoalsPage } from './pages/GoalsPage'
import { StatsPage } from './pages/StatsPage'
import { Navbar } from './components/Navbar'
import { useAuthStore } from './store/auth'

export default function App() {
  const token = useAuthStore((s: any) => s.token)


  return (
    <div className="min-h-screen bg-gray-50">
      {token ? <Navbar /> : null}
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Routes>
          <Route path="/" element={token ? <Navigate to="/problems" replace /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/profile"
            element={
              <AuthGate>
                <ProfilePage />
              </AuthGate>
            }
          />
          <Route
            path="/problems"
            element={
              <AuthGate>
                <ProblemsPage />
              </AuthGate>
            }
          />
          <Route
            path="/due"
            element={
              <AuthGate>
                <DueForReviewPage />
              </AuthGate>
            }
          />
          <Route
            path="/goals"
            element={
              <AuthGate>
                <GoalsPage />
              </AuthGate>
            }
          />
          <Route
            path="/stats"
            element={
              <AuthGate>
                <StatsPage />
              </AuthGate>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

