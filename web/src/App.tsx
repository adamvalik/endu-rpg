import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { StravaProtectedRoute } from './components/StravaProtectedRoute'
import { AuthPage } from './pages/AuthPage'
import { StravaConnectPage } from './pages/StravaConnectPage'
import { StravaCallbackPage } from './pages/StravaCallbackPage'
import { HomePage } from './pages/HomePage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/strava/callback" element={<StravaCallbackPage />} />

          <Route
            path="/strava/connect"
            element={
              <ProtectedRoute>
                <StravaConnectPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <StravaProtectedRoute>
                  <HomePage />
                </StravaProtectedRoute>
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/home" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
