import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Rocket, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  children: React.ReactNode;
}

const Layout: React.FC<NavbarProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/features' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'About', path: '/about' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
  ];

  // Don't show standard navbar on public event pages (cleaner experience)
  const isPublicEventPage = location.pathname !== '/' &&
    !navLinks.some(l => l.path === location.pathname) &&
    !['/create', '/dashboard', '/login', '/register', '/terms'].includes(location.pathname);

  if (isPublicEventPage) {
    return <main>{children}</main>;
  }

  return (
    <div className="layout">
      <nav className={`navbar ${scrolled ? 'nav-scrolled' : ''}`}>
        <div className="container nav-content">
          <Link to="/" className="logo">
            <Rocket className="logo-icon" />
            <span className="logo-text">InviteU<span className="logo-dot">.Online</span></span>
          </Link>

          <div className="nav-desktop">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.name}
              </Link>
            ))}

            {user ? (
              <div className="nav-auth-group">
                <Link to="/dashboard" className="nav-link dashboard-link">
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
                <button onClick={handleSignOut} className="btn btn-outline-sm logout-btn">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <div className="nav-auth-group">
                <Link to="/login" className="nav-link login-text">Login</Link>
                <Link to="/create" className="btn btn-primary">Get Started</Link>
              </div>
            )}
          </div>

          <button className="nav-mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="nav-mobile animate-fade">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="nav-mobile-link"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <>
                <Link to="/dashboard" className="nav-mobile-link" onClick={() => setIsOpen(false)}>Dashboard</Link>
                <button onClick={handleSignOut} className="btn btn-primary">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-mobile-link" onClick={() => setIsOpen(false)}>Login</Link>
                <Link to="/register" className="btn btn-primary" onClick={() => setIsOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        )}
      </nav>

      <main>{children}</main>

      <footer className="footer section-padding">
        <div className="container footer-grid">
          <div className="footer-brand">
            <div className="logo">
              <Rocket className="logo-icon" />
              <span className="logo-text">InviteU<span className="logo-dot">.Online</span></span>
            </div>
            <p>Create stunning RSVP pages in minutes. Perfect for weddings, parties, and corporate events.</p>
          </div>
          <div className="footer-links">
            <h4>Product</h4>
            <Link to="/features">Features</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/create">RSVP Builder</Link>
          </div>
          <div className="footer-links">
            <h4>Company</h4>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="footer-links">
            <h4>Support</h4>
            <Link to="/faq">FAQ</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
        <div className="container footer-bottom">
          <p>&copy; {new Date().getFullYear()} InviteU. All rights reserved.</p>
        </div>
      </footer>

      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 1.5rem 0;
          transition: all 0.3s ease;
          background: transparent;
        }

        .nav-scrolled {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(12px);
          padding: 1rem 0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          border-bottom: 1px solid var(--border);
        }

        .nav-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.5rem;
          font-weight: 800;
          color: #064e3b;
          text-decoration: none;
        }

        .logo-text {
          font-family: 'Inter', sans-serif;
          letter-spacing: -1px;
        }

        .logo-dot { color: var(--primary); }
        .logo-icon { color: var(--primary); }

        .nav-desktop { display: none; align-items: center; gap: 2rem; }
        @media (min-width: 1024px) { .nav-desktop { display: flex; } }

        .nav-link {
          font-weight: 600; color: var(--text-muted); font-size: 0.95rem; text-decoration: none; transition: 0.3s;
        }

        .nav-link:hover, .nav-link.active { color: var(--primary); }

        .nav-auth-group {
          display: flex; align-items: center; gap: 1.5rem; padding-left: 1.5rem; border-left: 1px solid var(--border);
        }

        .dashboard-link {
          display: flex; align-items: center; gap: 0.5rem; color: #064e3b !important;
        }

        .btn-outline-sm {
          padding: 0.5rem 1rem; background: transparent; border: 1px solid var(--border); border-radius: 0.5rem; font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; gap: 0.4rem; cursor: pointer;
        }
        
        .logout-btn { color: #ef4444; }
        .logout-btn:hover { background: #fef2f2; border-color: #fecaca; }

        .nav-mobile-toggle { background: transparent; color: var(--text); border: none; cursor: pointer; }
        @media (min-width: 1024px) { .nav-mobile-toggle { display: none; } }

        .nav-mobile {
          position: fixed; top: 70px; left: 1.5rem; right: 1.5rem; background: white; padding: 2rem; border-radius: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; border: 1px solid var(--border); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); z-index: 1001;
        }

        .nav-mobile-link { font-size: 1.1rem; font-weight: 600; color: var(--text); text-decoration: none; }

        .footer { background-color: #f9fafb; border-top: 1px solid var(--border); }
        .footer-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 3rem; padding-top: 0; }

        .footer-brand p { color: var(--text-muted); margin-top: 1rem; max-width: 300px; font-size: 0.95rem; }
        .footer-links { display: flex; flex-direction: column; gap: 1rem; }

        .footer-links h4 { margin-bottom: 0.5rem; font-size: 1rem; color: #064e3b; text-transform: uppercase; letter-spacing: 1px; }

        .footer-links a { color: var(--text-muted); font-size: 0.95rem; text-decoration: none; }
        .footer-links a:hover { color: var(--primary); }

        .footer-bottom { margin-top: 4rem; padding-top: 2rem; border-top: 1px solid var(--border); text-align: center; color: var(--text-muted); font-size: 0.9rem; }
      `}</style>
    </div>
  );
};

export default Layout;
