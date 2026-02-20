import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Rocket } from 'lucide-react';

interface NavbarProps {
    children: React.ReactNode;
}

const Layout: React.FC<NavbarProps> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Features', path: '/features' },
        { name: 'Pricing', path: '/pricing' },
        { name: 'About', path: '/about' },
        { name: 'FAQ', path: '/faq' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <div className="layout">
            <nav className={`navbar ${scrolled ? 'nav-scrolled' : ''}`}>
                <div className="container nav-content">
                    <Link to="/" className="logo">
                        <Rocket className="logo-icon" />
                        <span>InviteU</span>
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
                        <Link to="/contact" className="btn btn-primary">Get Started</Link>
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
                        <Link to="/contact" className="btn btn-primary" onClick={() => setIsOpen(false)}>Get Started</Link>
                    </div>
                )}
            </nav>

            <main>{children}</main>

            <footer className="footer section-padding">
                <div className="container footer-grid">
                    <div className="footer-brand">
                        <div className="logo">
                            <Rocket className="logo-icon" />
                            <span>InviteU</span>
                        </div>
                        <p>Create stunning RSVP pages in minutes. Perfect for weddings, parties, and corporate events.</p>
                    </div>
                    <div className="footer-links">
                        <h4>Product</h4>
                        <Link to="/features">Features</Link>
                        <Link to="/pricing">Pricing</Link>
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
        }

        .nav-scrolled {
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(12px);
          padding: 1rem 0;
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
          color: white;
        }

        .logo-icon {
          color: var(--primary);
        }

        .nav-desktop {
          display: none;
          align-items: center;
          gap: 2rem;
        }

        @media (min-width: 768px) {
          .nav-desktop {
            display: flex;
          }
        }

        .nav-link {
          font-weight: 500;
          color: var(--text-muted);
        }

        .nav-link:hover, .nav-link.active {
          color: white;
        }

        .nav-mobile-toggle {
          background: transparent;
          color: white;
          font-size: 2rem;
        }

        @media (min-width: 768px) {
          .nav-mobile-toggle {
            display: none;
          }
        }

        .nav-mobile {
          position: fixed;
          top: 70px;
          left: 1.5rem;
          right: 1.5rem;
          background: var(--bg-soft);
          padding: 2rem;
          border-radius: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          border: 1px solid var(--border);
          z-index: 1001;
        }

        .nav-mobile-link {
          font-size: 1.1rem;
          font-weight: 600;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 3rem;
          border-top: 1px solid var(--border);
          padding-top: 4rem;
        }

        .footer-brand p {
          color: var(--text-muted);
          margin-top: 1rem;
          max-width: 300px;
        }

        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .footer-links h4 {
          margin-bottom: 0.5rem;
        }

        .footer-links a {
          color: var(--text-muted);
        }

        .footer-links a:hover {
          color: var(--primary);
        }

        .footer-bottom {
          margin-top: 4rem;
          padding-top: 2rem;
          border-top: 1px solid var(--border);
          text-align: center;
          color: var(--text-muted);
          font-size: 0.9rem;
        }
      `}</style>
        </div>
    );
};

export default Layout;
