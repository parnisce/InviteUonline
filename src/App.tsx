import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import CreateRSVP from './pages/CreateRSVP';
import Dashboard from './pages/Dashboard';
import GuestList from './pages/GuestList';
import EditRSVP from './pages/EditRSVP';
import Login from './pages/Login';
import Register from './pages/Register';
import EventPage from './pages/EventPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Dynamic Event Route (Guest-facing) */}
            <Route path="/:slug" element={<EventPage />} />

            {/* Protected Routes (User-facing) */}
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <CreateRSVP />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/:slug/guests"
              element={
                <ProtectedRoute>
                  <GuestList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/:slug/edit"
              element={
                <ProtectedRoute>
                  <EditRSVP />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
