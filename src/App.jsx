import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './pages/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Practice from './pages/Practice';
import Assessments from './pages/Assessments';
import Resources from './pages/Resources';
import Profile from './pages/Profile';
import JDAnalyzer from './pages/JDAnalyzer';
import Results from './pages/Results';
import History from './pages/History';
import TestChecklist from './pages/TestChecklist';
import ShipPage from './pages/ShipPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<DashboardLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="practice" element={<Practice />} />
          <Route path="assessments" element={<Assessments />} />
          <Route path="resources" element={<Resources />} />
          <Route path="profile" element={<Profile />} />
          <Route path="analyzer" element={<JDAnalyzer />} />
          <Route path="results" element={<Results />} />
          <Route path="history" element={<History />} />
        </Route>
        {/* Test Checklist Routes */}
        <Route path="/prp/07-test" element={<TestChecklist />} />
        <Route path="/prp/08-ship" element={<ShipPage />} />
      </Routes>
    </Router>
  );
}

export default App;
