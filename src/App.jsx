import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import AddMealPage from './components/AddMealPage';
import HistoryPage from './components/HistoryPage';
import NutritionPage from './components/NutritionPage';
import AdminPanel from './components/AdminPanel';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Authentication routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/admin" element={<AdminPanel />} />

        {/* Main app routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-meal" element={<AddMealPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/nutrition" element={<NutritionPage />} />
        
        {/* Catch all route - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
