import React from 'react';
import { motion } from 'framer-motion';
import {
    Palette, Bell, BarChart2, Lock, Globe, Smartphone,
    Mail, CalendarCheck, Sliders, Link2, Download, HeartHandshake
} from 'lucide-react';

const featureGroups = [
    {
        heading: 'Design & Customization',
        color: '#6366f1',
        features: [
            { icon: <Palette />, title: 'Premium Templates', desc: 'Over 200 designer-crafted templates for weddings, birthdays, corporate events, and more.' },
            { icon: <Sliders />, title: 'Drag & Drop Builder', desc: 'Customize every element — colors, fonts, layouts — without touching a line of code.' },
            { icon: <Globe />, title: 'Custom Domains', desc: 'Publish your RSVP page on your own domain for a truly personalized experience.' },
        ],
    },
    {
        heading: 'Guest Management',
        color: '#ec4899',
        features: [
            { icon: <Mail />, title: 'Email Invitations', desc: 'Send beautifully designed email invites directly from your dashboard with one click.' },
            { icon: <Bell />, title: 'Real-time Notifications', desc: 'Get instant alerts when guests RSVP, decline, or update their attendance.' },
            { icon: <BarChart2 />, title: 'Attendance Analytics', desc: 'Track who\'s coming, how many guests they\'re bringing, and dietary preferences.' },
        ],
    },
    {
        heading: 'Security & Access',
        color: '#10b981',
        features: [
            { icon: <Lock />, title: 'Password Protection', desc: 'Add a passcode to your event page to keep details exclusive to invited guests only.' },
            { icon: <CalendarCheck />, title: 'RSVP Deadlines', desc: 'Set automatic cut-off dates so your guest count is finalized well before the event.' },
            { icon: <HeartHandshake />, title: 'Plus-One Management', desc: 'Let guests add their plus-ones with optional approval required from the host.' },
        ],
    },
    {
        heading: 'Integrations & Export',
        color: '#f59e0b',
        features: [
            { icon: <Smartphone />, title: 'Mobile Responsive', desc: 'Every RSVP page looks perfect on all devices — phones, tablets, and desktops.' },
            { icon: <Link2 />, title: 'Shareable Links', desc: 'Share your RSVP page via a short link, QR code, or embed it on your own website.' },
            { icon: <Download />, title: 'Export to CSV / PDF', desc: 'Download your guest list as a spreadsheet or printed seating chart at any time.' },
        ],
    },
];

const Features: React.FC = () => {
    return (
        <div className="features-page">
            {/* Hero */}
            <section className="features-hero section-padding">
                <div className="container" style={{ textAlign: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="badge">Everything You Need ✨</span>
                        <h1 className="features-title">
                            Powerful Features,<br />
                            <span className="gradient-text">Zero Complexity</span>
                        </h1>
                        <p className="features-subtitle">
                            InviteU packs everything a modern event host needs into one elegant platform.
                            From design tools to guest analytics — we've got you covered.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Feature Groups */}
            {featureGroups.map((group, gi) => (
                <section key={group.heading} className="feature-group section-padding" style={{ background: gi % 2 !== 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                    <div className="container">
                        <motion.div
                            className="group-header"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="group-tag" style={{ color: group.color, borderColor: group.color }}>
                                {group.heading}
                            </span>
                        </motion.div>
                        <div className="group-grid">
                            {group.features.map((f, fi) => (
                                <motion.div
                                    key={f.title}
                                    className="feat-card glass-card"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: fi * 0.12 }}
                                >
                                    <div className="feat-icon" style={{ background: `${group.color}18`, color: group.color }}>
                                        {f.icon}
                                    </div>
                                    <h3>{f.title}</h3>
                                    <p>{f.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            ))}

            {/* CTA Banner */}
            <section className="features-cta section-padding">
                <div className="container">
                    <motion.div
                        className="cta-box glass-card"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2>Ready to Create Your First RSVP Page?</h2>
                        <p>Join thousands of event hosts who trust InviteU. Start for free — no credit card required.</p>
                        <a href="/contact" className="btn btn-primary btn-lg">Get Started Free</a>
                    </motion.div>
                </div>
            </section>

            <style>{`
        .features-page { padding-top: 80px; }

        .features-hero {
          padding-top: 120px;
          background: radial-gradient(ellipse at top, rgba(99,102,241,0.12), transparent 60%);
        }

        .features-title {
          font-size: clamp(2rem, 4vw, 3.5rem);
          margin: 1.5rem 0;
        }

        .features-subtitle {
          color: var(--text-muted);
          font-size: 1.15rem;
          max-width: 620px;
          margin: 0 auto;
          line-height: 1.8;
        }

        .group-header { margin-bottom: 2.5rem; }

        .group-tag {
          font-weight: 700;
          font-size: 1rem;
          padding: 0.4rem 1.2rem;
          border: 1.5px solid;
          border-radius: 2rem;
          display: inline-block;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .group-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }

        .feat-card {
          padding: 2.5rem;
          transition: transform 0.3s, border-color 0.3s;
        }

        .feat-card:hover { transform: translateY(-8px); }

        .feat-icon {
          width: 56px;
          height: 56px;
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .feat-card h3 { font-size: 1.1rem; margin-bottom: 0.75rem; }

        .feat-card p { color: var(--text-muted); font-size: 0.95rem; line-height: 1.7; }

        .cta-box {
          text-align: center;
          padding: 5rem 3rem;
          background: linear-gradient(135deg, rgba(99,102,241,0.15), rgba(236,72,153,0.1));
          border: 1px solid rgba(99,102,241,0.3);
        }

        .cta-box h2 { font-size: 2.2rem; margin-bottom: 1rem; }

        .cta-box p {
          color: var(--text-muted);
          font-size: 1.1rem;
          margin-bottom: 2.5rem;
        }

        .btn-lg {
          padding: 1rem 2.5rem;
          font-size: 1.05rem;
        }
      `}</style>
        </div>
    );
};

export default Features;
