import { Routes, Route, Navigate } from 'react-router-dom'
import { EdpLoadingProvider } from './contexts/EdpLoadingContext'
import { LayoutLoadingProvider } from './contexts/LayoutLoadingContext'
import { NotificationProvider } from './contexts/NotificationContext'

// Pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import PortaJusantePage from './pages/PortaJusantePage'
import PortaMontantePage from './pages/PortaMontantePage'
import EnchimentoPage from './pages/EnchimentoPage'

// API routes (now handled as Express-like middleware for Vite)
import './api/routes'

function App() {
  return (
    <NotificationProvider>
      <EdpLoadingProvider>
        <LayoutLoadingProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/porta_jusante" element={<PortaJusantePage />} />
            <Route path="/porta_montante" element={<PortaMontantePage />} />
            <Route path="/enchimento" element={<EnchimentoPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </LayoutLoadingProvider>
      </EdpLoadingProvider>
    </NotificationProvider>
  )
}

export default App