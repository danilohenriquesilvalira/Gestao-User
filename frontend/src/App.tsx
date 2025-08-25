import { Routes, Route, Navigate } from 'react-router-dom'
import { EdpLoadingProvider } from './contexts/EdpLoadingContext'
import { LayoutLoadingProvider } from './contexts/LayoutLoadingContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { AuthProvider } from './contexts/AuthContext'

// Pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import CaldeiraEclusa from './pages/CaldeiraEclusa'
import PortaJusantePage from './pages/PortaJusantePage'
import PortaMontantePage from './pages/PortaMontantePage'
import EnchimentoPage from './pages/EnchimentoPage'
import UsuariosPage from './pages/UsuariosPage'
import TagsAdminPage from './pages/TagsAdminPage'

// API routes (now handled as Express-like middleware for Vite)
import './api/routes'

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <EdpLoadingProvider>
          <LayoutLoadingProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/caldeira-eclusa" element={<CaldeiraEclusa />} />
              <Route path="/porta_jusante" element={<PortaJusantePage />} />
              <Route path="/porta_montante" element={<PortaMontantePage />} />
              <Route path="/enchimento" element={<EnchimentoPage />} />
              <Route path="/usuarios" element={<UsuariosPage />} />
              <Route path="/tags-admin" element={<TagsAdminPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </LayoutLoadingProvider>
        </EdpLoadingProvider>
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App