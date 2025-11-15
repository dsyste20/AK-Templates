import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SiteProvider } from './contexts/SiteContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BuilderPage from './pages/BuilderPage';
import SinglePageSite from './pages/SinglePageSite';
import MultiPageSite from './pages/MultiPageSite';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <SiteProvider>
      <Router>
        <Routes>
          {/* Publieke routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Beschermde routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/builder" element={
            <ProtectedRoute>
              <BuilderPage />
            </ProtectedRoute>
          } />
          <Route path="/preview" element={
            <ProtectedRoute>
              <SinglePageSite />
            </ProtectedRoute>
          } />
          <Route path="/preview-multi/*" element={
            <ProtectedRoute>
              <MultiPageSite />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </SiteProvider>
  );
}

export default App;
