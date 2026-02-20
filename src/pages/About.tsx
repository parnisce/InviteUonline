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
                <div className="container" style={{ textAlign: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="section-tag">Our Story</span>
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
                            src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800"
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
                        <div className="stats-mini">
                            {stats.map(s => (
                                <div key={s.label} className="mini-stat">
                                    <span className="mini-val">{s.value}</span>
                                    <span className="mini-lbl">{s.label}</span>
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
                        <span className="section-tag">The People</span>
                        <h2 className="section-title">Meet the Team</h2>
                    </div>
                    <div className="team-grid">
                        {team.map((member, i) => (
                            <motion.div
                                key={member.name}
                                className="team-card"
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
          padding-top: 120px;
          background: #f0fdf4;
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

        .about-title {
          font-size: clamp(2rem, 4vw, 3.5rem);
          margin: 1.5rem 0;
          color: #0f172a;
        }

        .about-subtitle {
          color: var(--text-muted);
          font-size: 1.1rem;
          line-height: 1.8;
          max-width: 800px;
          margin: 0 auto;
        }

        .mission-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
        }

        @media (max-width: 900px) { .mission-grid { grid-template-columns: 1fr; } }

        .mission-img {
          width: 100%;
          border-radius: 2rem;
          object-fit: cover;
          height: 500px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
        }

        .mission-text h2 {
          font-size: 2.5rem;
          margin-bottom: 1.5rem;
          color: #064e3b;
        }

        .mission-text p {
          color: var(--text-muted);
          font-size: 1.1rem;
          line-height: 1.8;
          margin-bottom: 3rem;
        }

        .stats-mini {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        @media (max-width: 480px) { .stats-mini { grid-template-columns: 1fr; } }

        .mini-stat {
          display: flex;
          flex-direction: column;
        }

        .mini-val {
          font-size: 2rem;
          font-weight: 800;
          color: var(--primary);
        }

        .mini-lbl {
          font-size: 0.9rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 3rem;
        }

        .team-card {
          text-align: left;
        }

        .team-avatar {
          width: 100%;
          height: 300px;
          border-radius: 1.5rem;
          object-fit: cover;
          margin-bottom: 1.5rem;
        }

        .team-card h3 { font-size: 1.3rem; margin-bottom: 0.5rem; color: #064e3b; }

        .team-role {
          color: var(--primary);
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 1rem;
          display: block;
        }

        .team-bio { color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; }
      `}</style>
        </div>
    );
};

export default About;
