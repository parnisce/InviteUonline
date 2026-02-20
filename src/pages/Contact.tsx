import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

const contactInfo = [
    { icon: <Mail size={22} />, label: 'Email Us', value: 'hello@inviteu.online', href: 'mailto:hello@inviteu.online' },
    { icon: <Phone size={22} />, label: 'Call Us', value: '+1 (800) 123-4567', href: 'tel:+18001234567' },
    { icon: <MapPin size={22} />, label: 'Office', value: 'San Francisco, CA, USA', href: '#' },
    { icon: <MessageSquare size={22} />, label: 'Live Chat', value: 'Available Mon–Fri 9am–6pm', href: '#' },
];

const Contact: React.FC = () => {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        await new Promise(r => setTimeout(r, 1500));
        setLoading(false);
        setSubmitted(true);
    };

    return (
        <div className="contact-page">
            {/* Hero */}
            <section className="contact-hero section-padding">
                <div className="container" style={{ textAlign: 'center' }}>
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <span className="badge">Get In Touch 👋</span>
                        <h1 className="contact-title">
                            We'd Love to <br />
                            <span className="gradient-text">Hear From You</span>
                        </h1>
                        <p className="contact-subtitle">
                            Whether you have a question, feedback, or a partnership idea — our team is always ready to help.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <section className="contact-main section-padding" style={{ paddingTop: 0 }}>
                <div className="container contact-grid">
                    {/* Contact Info */}
                    <motion.div
                        className="contact-info"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2>Contact Information</h2>
                        <p>Reach out in the way that works best for you. We aim to respond to all messages within 24 hours.</p>

                        <div className="info-cards">
                            {contactInfo.map((item) => (
                                <a key={item.label} href={item.href} className="info-card glass-card">
                                    <div className="info-icon">{item.icon}</div>
                                    <div>
                                        <span className="info-label">{item.label}</span>
                                        <span className="info-value">{item.value}</span>
                                    </div>
                                </a>
                            ))}
                        </div>

                        <div className="contact-social">
                            <h4>Follow Us</h4>
                            <div className="social-links">
                                {['Twitter', 'Instagram', 'LinkedIn'].map(s => (
                                    <a key={s} href="#" className="social-chip">{s}</a>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        {submitted ? (
                            <div className="success-state glass-card">
                                <CheckCircle size={60} className="success-icon" />
                                <h2>Message Sent!</h2>
                                <p>Thank you for reaching out. A member of our team will get back to you within 24 hours.</p>
                                <button className="btn btn-primary" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}>
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form className="contact-form glass-card" onSubmit={handleSubmit}>
                                <h2>Send Us a Message</h2>
                                <p className="form-sub">Fill in the form below and we'll be in touch shortly.</p>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="name">Full Name *</label>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            placeholder="Your full name"
                                            value={form.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">Email Address *</label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="your@email.com"
                                            value={form.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="subject">Subject</label>
                                    <select id="subject" name="subject" value={form.subject} onChange={handleChange}>
                                        <option value="">Select a topic</option>
                                        <option value="general">General Inquiry</option>
                                        <option value="billing">Billing & Pricing</option>
                                        <option value="technical">Technical Support</option>
                                        <option value="partnership">Partnership</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="message">Message *</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={5}
                                        placeholder="Tell us how we can help..."
                                        value={form.message}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary submit-btn" disabled={loading}>
                                    {loading ? 'Sending...' : <>Send Message <Send size={18} /></>}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </section>

            <style>{`
        .contact-page { padding-top: 80px; }

        .contact-hero {
          padding-top: 120px;
          background: radial-gradient(ellipse at top, rgba(99,102,241,0.12), transparent 60%);
        }

        .contact-title { font-size: clamp(2rem, 4vw, 3.5rem); margin: 1.5rem 0; }

        .contact-subtitle { color: var(--text-muted); font-size: 1.1rem; }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1.6fr;
          gap: 4rem;
          align-items: start;
        }

        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr; }
        }

        .contact-info h2 { font-size: 1.8rem; margin-bottom: 1rem; }

        .contact-info > p {
          color: var(--text-muted);
          font-size: 0.95rem;
          line-height: 1.7;
          margin-bottom: 2rem;
        }

        .info-cards { display: flex; flex-direction: column; gap: 1rem; }

        .info-card {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1.25rem 1.5rem;
          transition: all 0.3s;
        }

        .info-card:hover {
          border-color: var(--primary);
          transform: translateX(6px);
        }

        .info-icon {
          width: 46px;
          height: 46px;
          background: rgba(99,102,241,0.12);
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          flex-shrink: 0;
        }

        .info-label {
          display: block;
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 0.2rem;
        }

        .info-value { font-size: 0.95rem; font-weight: 600; }

        .contact-social { margin-top: 2.5rem; }

        .contact-social h4 { margin-bottom: 1rem; color: var(--text-muted); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; }

        .social-links { display: flex; gap: 0.75rem; flex-wrap: wrap; }

        .social-chip {
          padding: 0.4rem 1rem;
          background: var(--glass);
          border: 1px solid var(--border);
          border-radius: 2rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-muted);
          transition: all 0.3s;
        }

        .social-chip:hover { border-color: var(--primary); color: var(--primary); }

        .contact-form {
          padding: 3rem;
        }

        .contact-form h2 { font-size: 1.8rem; margin-bottom: 0.5rem; }

        .form-sub { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 2rem; }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        @media (max-width: 600px) { .form-row { grid-template-columns: 1fr; } }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .form-group label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border);
          border-radius: 0.6rem;
          padding: 0.85rem 1.1rem;
          color: white;
          font-size: 0.95rem;
          font-family: inherit;
          outline: none;
          transition: border-color 0.3s;
          resize: vertical;
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: rgba(148,163,184,0.5);
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
        }

        .form-group select option { background: #1e293b; color: white; }

        .submit-btn {
          width: 100%;
          justify-content: center;
          padding: 1rem;
          font-size: 1rem;
          border-radius: 0.6rem;
        }

        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .success-state {
          padding: 4rem 3rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .success-icon { color: #10b981; }

        .success-state h2 { font-size: 2rem; }

        .success-state p { color: var(--text-muted); font-size: 1rem; max-width: 400px; }
      `}</style>
        </div>
    );
};

export default Contact;
