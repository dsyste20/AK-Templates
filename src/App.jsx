import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SiteProvider } from './contexts/SiteContext';
import BuilderPage from './pages/BuilderPage';
import SinglePageSite from './pages/SinglePageSite';
import MultiPageSite from './pages/MultiPageSite';
import './App.css';

function App() {
  return (
    <SiteProvider>
      <Router>
        <Routes>
          <Route path="/" element={<BuilderPage />} />
          <Route path="/preview" element={<SinglePageSite />} />
          <Route path="/preview-multi/*" element={<MultiPageSite />} />
        </Routes>
      </Router>
    </SiteProvider>
  );
}

export default App;
