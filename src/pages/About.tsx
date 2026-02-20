import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Globe, Award } from 'lucide-react';

const team = [
    {
        name: 'Aria Santos',
        role: 'CEO & Co-Founder',
        bio: 'Former event planner with 10+ years of experience turning celebrations into unforgettable moments.',
        img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    },
    {
        name: 'Marcus Lee',
        role: 'CTO & Co-Founder',
        bio: "Full-stack engineer passionate about building tools that make people's lives easier.",
        img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    },
    {
        name: 'Sofia Reyes',
        role: 'Head of Design',
        bio: 'Award-winning designer dedicated to creating beautiful, intuitive user experiences.',
        img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
    },
    {
        name: 'James Park',
        role: 'Head of Marketing',
        bio: 'Growth hacker with a passion for helping brands tell their story at scale.',
        img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    },
];

const stats = [
    { icon: <Users size={28} />, value: '50,000+', label: 'Events Created' },
    { icon: <Heart size={28} />, value: '2M+', label: 'Guests Managed' },
    { icon: <Globe size={28} />, value: '120+', label: 'Countries Served' },
    { icon: <Award size={28} />, value: '99%', label: 'Customer Satisfaction' },
];

const About: React.FC = () => {
    return (
        <div className="about-page">
            {/* Hero */}
            <section className="about-hero section-padding">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="about-hero-content"
                    >
                        <span className="badge">Our Story 💜</span>
                        <h1 className="about-title">
                            We Believe Every Event <br />
                            <span className="gradient-text">Deserves a Perfect Invite</span>
                        </h1>
                        <p className="about-subtitle">
                            InviteU was born from a simple frustration — creating beautiful event invitations should not require design skills or a big budget. We set out to build the world's most elegant RSVP platform.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stats */}
            <section className="stats-section">
                <div className="container stats-grid">
                    {stats.map((s, i) => (
                        <motion.div
                            key={s.label}
                            className="stat-card glass-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.15 }}
                        >
                            <div className="stat-icon">{s.icon}</div>
                            <div className="stat-value">{s.value}</div>
                            <div className="stat-lbl">{s.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Mission */}
            <section className="mission section-padding">
                <div className="container mission-grid">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=700"
                            alt="Team working"
                            className="mission-img"
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="mission-text"
                    >
                        <h2>Our Mission</h2>
                        <p>
                            We empower individuals and businesses to connect with their guests in the most beautiful, seamless way possible. Our platform strips away complexity, so you can focus on what truly matters — your event.
                        </p>
                        <div className="values-list">
                            {['Simplicity above complexity', 'Design that delights', 'Privacy by default', 'Customer-first always'].map(v => (
                                <div key={v} className="value-item">
                                    <span className="value-dot" />
                                    <span>{v}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Team */}
            <section className="team-section section-padding">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Meet the Team</h2>
                        <p className="section-subtitle">The passionate people building the future of event invitations.</p>
                    </div>
                    <div className="team-grid">
                        {team.map((member, i) => (
                            <motion.div
                                key={member.name}
                                className="team-card glass-card"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <img src={member.img} alt={member.name} className="team-avatar" />
                                <h3>{member.name}</h3>
                                <span className="team-role">{member.role}</span>
                                <p className="team-bio">{member.bio}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <style>{`
        .about-page { padding-top: 80px; }

        .about-hero {
          text-align: center;
          padding-top: 120px;
          background: radial-gradient(ellipse at top, rgba(99,102,241,0.12), transparent 60%);
        }

        .about-hero-content { max-width: 800px; margin: 0 auto; }

        .about-title {
          font-size: clamp(2rem, 4vw, 3.5rem);
          margin: 1.5rem 0;
        }

        .about-subtitle {
          color: var(--text-muted);
          font-size: 1.15rem;
          line-height: 1.8;
        }

        .stats-section { padding: 4rem 0; }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .stat-card {
          padding: 2.5rem 2rem;
          text-align: center;
          transition: transform 0.3s;
        }

        .stat-card:hover { transform: translateY(-6px); }

        .stat-icon {
          color: var(--primary);
          margin-bottom: 1rem;
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.5rem;
        }

        .stat-lbl { color: var(--text-muted); font-size: 0.9rem; }

        .mission-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
        }

        @media (max-width: 768px) { .mission-grid { grid-template-columns: 1fr; } }

        .mission-img {
          width: 100%;
          border-radius: 1.5rem;
          object-fit: cover;
          height: 400px;
          border: 1px solid var(--border);
        }

        .mission-text h2 {
          font-size: 2.2rem;
          margin-bottom: 1.5rem;
        }

        .mission-text p {
          color: var(--text-muted);
          font-size: 1.05rem;
          line-height: 1.8;
          margin-bottom: 2rem;
        }

        .values-list { display: flex; flex-direction: column; gap: 0.75rem; }

        .value-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 1rem;
        }

        .value-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--primary);
          flex-shrink: 0;
        }

        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 2rem;
        }

        .team-card {
          padding: 2.5rem 2rem;
          text-align: center;
          transition: transform 0.3s;
        }

        .team-card:hover { transform: translateY(-8px); border-color: var(--primary); }

        .team-avatar {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid var(--primary);
          margin: 0 auto 1.5rem;
          display: block;
        }

        .team-card h3 { font-size: 1.2rem; margin-bottom: 0.4rem; }

        .team-role {
          color: var(--primary);
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 1rem;
          display: block;
        }

        .team-bio { color: var(--text-muted); font-size: 0.9rem; line-height: 1.7; }
      `}</style>
        </div>
    );
};

export default About;
