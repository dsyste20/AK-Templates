import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SiteProvider } from './contexts/SiteContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MijnWebsitePage from './pages/MijnWebsitePage';
import PublicerenPage from './pages/PublicerenPage';
import MijnAccountPage from './pages/MijnAccountPage';
import BuilderPage from './pages/BuilderPage';
import SinglePageSite from './pages/SinglePageSite';
import MultiPageSite from './pages/MultiPageSite';
import TemplateBuilderPage from './pages/TemplateBuilderPage';
import PublicSitePage from "./pages/PublicSitePage.jsx";
import './App.css';

function App() {
  return (
    <SiteProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/mijn-website" element={<ProtectedRoute><MijnWebsitePage /></ProtectedRoute>} />
          <Route path="/publiceren" element={<ProtectedRoute><PublicerenPage /></ProtectedRoute>} />
          <Route path="/mijn-account" element={<ProtectedRoute><MijnAccountPage /></ProtectedRoute>} />
          <Route path="/builder" element={<ProtectedRoute><BuilderPage /></ProtectedRoute>} />
          <Route path="/preview" element={<ProtectedRoute><SinglePageSite /></ProtectedRoute>} />
          <Route path="/preview-multi/*" element={<ProtectedRoute><MultiPageSite /></ProtectedRoute>} />
          
          {/* Template builder routes */}
          <Route path="/templates/builder" element={<ProtectedRoute><TemplateBuilderPage /></ProtectedRoute>} />
          <Route path="/templates/builder/:id" element={<ProtectedRoute><TemplateBuilderPage /></ProtectedRoute>} />
          <Route path="/w/:slug" element={<PublicSitePage />} />

        </Routes>
      </Router>
    </SiteProvider>
  );
}

export default App;
