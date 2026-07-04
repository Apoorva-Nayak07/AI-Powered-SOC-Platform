import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import PrivateRoute from './components/PrivateRoute';
 
// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ExecutiveDashboard from './pages/ExecutiveDashboard';
import LiveMonitoring from './pages/LiveMonitoring';
import ThreatDetection from './pages/ThreatDetection';
import AlertsCenter from './pages/AlertsCenter';
import IncidentResponse from './pages/IncidentResponse';
import ThreatIntelligence from './pages/ThreatIntelligence';
import AttackMap from './pages/AttackMap';
import LogsExplorer from './pages/LogsExplorer';
import AIInsights from './pages/AIInsights';
import UserManagement from './pages/UserManagement';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <div className="App">
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'rgba(10, 14, 39, 0.95)',
                  color: '#fff',
                  border: '1px solid rgba(0, 212, 255, 0.3)',
                  backdropFilter: 'blur(10px)',
                },
                success: {
                  iconTheme: {
                    primary: '#00ff88',
                    secondary: '#0a0e27',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ff3864',
                    secondary: '#0a0e27',
                  },
                },
              }}
            />
            
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/executive" element={<PrivateRoute><ExecutiveDashboard /></PrivateRoute>} />
              <Route path="/monitoring" element={<PrivateRoute><LiveMonitoring /></PrivateRoute>} />
              <Route path="/threats" element={<PrivateRoute><ThreatDetection /></PrivateRoute>} />
              <Route path="/alerts" element={<PrivateRoute><AlertsCenter /></PrivateRoute>} />
              <Route path="/incidents" element={<PrivateRoute><IncidentResponse /></PrivateRoute>} />
              <Route path="/intelligence" element={<PrivateRoute><ThreatIntelligence /></PrivateRoute>} />
              <Route path="/attack-map" element={<PrivateRoute><AttackMap /></PrivateRoute>} />
              <Route path="/logs" element={<PrivateRoute><LogsExplorer /></PrivateRoute>} />
              <Route path="/ai-insights" element={<PrivateRoute><AIInsights /></PrivateRoute>} />
              <Route path="/users" element={<PrivateRoute><UserManagement /></PrivateRoute>} />
              <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
              <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
              
              {/* Redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
