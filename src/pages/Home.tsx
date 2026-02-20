import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Sparkles, PencilLine, Share2, ClipboardCheck, Layout as LayoutIcon, CreditCard, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const steps = [
    { icon: <PencilLine />, title: 'Pick A Design', desc: 'Choose from our elegant templates or message us for a custom design tailored to your event.' },
    { icon: <LayoutIcon />, title: 'Match Your Invitation', desc: 'Seamlessly align your digital invitation with your paper invitations for a cohesive look.' },
    { icon: <ClipboardCheck />, title: 'Customized in 2 Minutes', desc: 'Quick and easy personalization. Add your details, photos, and event information effortlessly.' },
    { icon: <Share2 />, title: 'Custom Web Address', desc: 'Get a memorable URL like romeo-juliet.inviteu.online for your guests to easily access.' },
    { icon: <CreditCard />, title: 'Continue to Payment', desc: 'Simple and secure checkout to finalize your beautiful RSVP website.' },
    { icon: <Send />, title: 'Share Your Invitation', desc: 'Send your unique link to guests via email, text, or social media and start collecting RSVPs.' },
  ];

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
            <span className="badge">Digital Invitations Made Simple ✨</span>
            <h1 className="hero-title">
              Create an RSVP link, <span className="gradient-text">share once</span>, <br />
              track guest responses
            </h1>
            <p className="hero-subtitle">
              Create stunning RSVP websites for weddings and events. Send online invitations, track guest responses, and manage everything in one place.
            </p>
            <div className="hero-actions">
              <Link to="/create" className="btn btn-primary btn-lg">
                Create Your RSVP
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
              <img src="https://images.unsplash.com/photo-1519222970733-f546218fa6d7?auto=format&fit=crop&q=80&w=800" alt="Happy Event" />
              <div className="floating-badge badge-create">Create an Event</div>
              <div className="floating-badge badge-share">Share the RSVP Link</div>
              <div className="floating-badge badge-track">Track Responses</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Proof Section */}
      <section className="proof-section">
        <div className="container">
          <motion.div
            className="proof-box"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Approved By 10,000+ Happy Couples</h2>
            <p>Get your custom address like: <span className="highlight-text">romeo-juliet.inviteu.online</span></p>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">How It Works</span>
            <h2 className="section-title">Six Simple <span className="gradient-text">Steps</span></h2>
          </div>

          <div className="steps-grid">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                className="step-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="step-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="features-preview section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Why Choose Us</span>
            <h2 className="section-title">Everything you need</h2>
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
          padding-top: 140px;
          min-height: 80vh;
          display: flex;
          align-items: center;
          background: linear-gradient(to bottom, #f0fdf4 0%, #ffffff 100%);
        }

        .hero-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 4rem;
          align-items: center;
        }

        @media (min-width: 1024px) {
          .hero-content {
            grid-template-columns: 1fr 1fr;
          }
        }

        .badge {
          color: #b45309;
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 1rem;
          display: block;
        }

        .hero-title {
          font-size: clamp(2rem, 5vw, 3.5rem);
          margin-bottom: 1.5rem;
          line-height: 1.2;
          color: #0f172a;
        }

        .hero-subtitle {
          font-size: 1.1rem;
          color: var(--text-muted);
          margin-bottom: 2.5rem;
          max-width: 550px;
        }

        .btn-lg {
          padding: 1rem 2.5rem;
          font-size: 1.1rem;
          border-radius: 0.4rem;
        }

        .hero-image-container {
          position: relative;
        }

        .hero-image {
          padding: 0;
          overflow: hidden;
          border-radius: 2rem;
        }

        .hero-image img {
          width: 100%;
          display: block;
          border-radius: 2rem;
        }

        .floating-badge {
          position: absolute;
          background: #ccfbf1;
          color: #115e59;
          padding: 0.6rem 1.2rem;
          border-radius: 2rem;
          font-weight: 600;
          font-size: 0.9rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .badge-create { top: 10%; left: -5%; }
        .badge-share { top: 50%; right: -5%; }
        .badge-track { bottom: 10%; left: 0%; }

        .proof-section {
          background: #f0fdf4;
          padding: 4rem 0;
          text-align: center;
        }

        .proof-box h2 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .proof-box p {
          color: var(--text-muted);
          font-size: 1.1rem;
        }

        .highlight-text {
          color: var(--primary);
          font-weight: 600;
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-tag {
           color: #f97316;
           font-weight: 600;
           text-transform: uppercase;
           letter-spacing: 1px;
           font-size: 0.85rem;
           margin-bottom: 0.5rem;
           display: block;
        }

        .section-title {
          font-size: 2.5rem;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 4rem 2rem;
        }

        .step-card {
          text-align: left;
        }

        .step-icon {
          color: var(--primary);
          margin-bottom: 1.5rem;
        }

        .step-icon svg {
          width: 32px;
          height: 32px;
          stroke-width: 1.5px;
        }

        .step-card h3 {
          font-size: 1.2rem;
          margin-bottom: 1rem;
          color: #0d9488;
        }

        .step-card p {
          color: var(--text-muted);
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .features-preview {
          background: #fdfdfd;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          padding: 2.5rem;
          background: white;
          border: 1px solid #f1f5f9;
        }

        .feature-icon {
          width: 50px;
          height: 50px;
          background: #f0fdf4;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          margin-bottom: 1.5rem;
        }

        .feature-card h3 {
          margin-bottom: 1rem;
          font-size: 1.2rem;
        }

        .feature-card p {
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};

export default Home;
