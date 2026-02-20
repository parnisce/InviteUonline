import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero section-padding">
        <div className="container hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-text"
          >
            <span className="badge">New: AI-Powered RSVP Designer 🚀</span>
            <h1 className="hero-title">
              Create <span className="gradient-text">Beautiful RSVP</span> <br />
              Pages in Seconds
            </h1>
            <p className="hero-subtitle">
              The all-in-one platform to manage your event invitations. Simple, elegant, and completely customizable. Join 10,000+ hosts making their events unforgettable.
            </p>
            <div className="hero-actions">
              <Link to="/contact" className="btn btn-primary btn-lg">
                Create Your Page <Zap size={20} />
              </Link>
              <Link to="/features" className="btn btn-outline btn-lg">
                View Features
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-image-container"
          >
            <div className="hero-image glass-card">
              <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800" alt="Event Preview" />
            </div>
            <div className="hero-stats glass-card animate-float">
              <div className="stat-item">
                <span className="stat-val">5k+</span>
                <span className="stat-label">Events Daily</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="trust">
        <div className="container">
          <p className="trust-title">Trusted by leading event planners worldwide</p>
          <div className="trust-logos">
            <span className="logo-placeholder">EVENTFUL</span>
            <span className="logo-placeholder">GATHER</span>
            <span className="logo-placeholder">VOWS</span>
            <span className="logo-placeholder">CELEBRATE</span>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="features-preview section-padding">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose InviteU?</h2>
            <p className="section-subtitle">Everything you need to manage your guest list effortlessly.</p>
          </div>

          <div className="features-grid">
            <div className="feature-card glass-card">
              <div className="feature-icon"><Sparkles /></div>
              <h3>Stunning Designs</h3>
              <p>Choose from hundreds of premium templates designed by professionals.</p>
            </div>
            <div className="feature-card glass-card">
              <div className="feature-icon"><Zap /></div>
              <h3>Instant Updates</h3>
              <p>Get real-time notifications when guests RSVP or change their details.</p>
            </div>
            <div className="feature-card glass-card">
              <div className="feature-icon"><Shield /></div>
              <h3>Secure & Private</h3>
              <p>Your guest list and event details are encrypted and password protected.</p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .hero {
          padding-top: 160px;
          min-height: 90vh;
          display: flex;
          align-items: center;
        }

        .hero-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 4rem;
          align-items: center;
        }

        @media (min-width: 1024px) {
          .hero-content {
            grid-template-columns: 1.2fr 1fr;
          }
        }

        .badge {
          background: var(--glass);
          padding: 0.5rem 1rem;
          border-radius: 2rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--primary);
          border: 1px solid var(--border);
          display: inline-block;
          margin-bottom: 1.5rem;
        }

        .hero-title {
          font-size: clamp(2.5rem, 5vw, 4.5rem);
          margin-bottom: 1.5rem;
          line-height: 1.1;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--text-muted);
          margin-bottom: 2.5rem;
          max-width: 600px;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .btn-lg {
          padding: 1rem 2rem;
          font-size: 1.1rem;
        }

        .hero-image-container {
          position: relative;
        }

        .hero-image {
          padding: 1rem;
          transform: rotate(2deg);
        }

        .hero-image img {
          width: 100%;
          border-radius: 0.5rem;
          display: block;
        }

        .hero-stats {
          position: absolute;
          bottom: -20px;
          right: -20px;
          padding: 1.5rem;
          z-index: 2;
        }

        .stat-val {
          display: block;
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--primary);
        }

        .stat-label {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .trust {
          padding: 3rem 0;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }

        .trust-title {
          text-align: center;
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-bottom: 2rem;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .trust-logos {
          display: flex;
          justify-content: center;
          gap: 4rem;
          flex-wrap: wrap;
          opacity: 0.5;
        }

        .logo-placeholder {
          font-weight: 900;
          font-size: 1.5rem;
          color: var(--text-muted);
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-title {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .section-subtitle {
          color: var(--text-muted);
          font-size: 1.1rem;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          padding: 2.5rem;
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-10px);
          border-color: var(--primary);
        }

        .feature-icon {
          width: 60px;
          height: 60px;
          background: rgba(99, 102, 241, 0.1);
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          margin-bottom: 1.5rem;
        }

        .feature-card h3 {
          margin-bottom: 1rem;
        }

        .feature-card p {
          color: var(--text-muted);
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;
