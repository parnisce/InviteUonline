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
                        <span className="section-tag">Get In Touch</span>
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
                                <a key={item.label} href={item.href} className="info-card">
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
                            <div className="success-state">
                                <CheckCircle size={60} className="success-icon" />
                                <h2>Message Sent!</h2>
                                <p>Thank you for reaching out. A member of our team will get back to you within 24 hours.</p>
                                <button className="btn btn-primary" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}>
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form className="contact-form" onSubmit={handleSubmit}>
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

        .contact-title { font-size: clamp(2.2rem, 4vw, 3.5rem); margin: 1.5rem 0; color: #0f172a; }

        .contact-subtitle { color: var(--text-muted); font-size: 1.1rem; }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1.6fr;
          gap: 5rem;
          align-items: start;
        }

        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr; }
        }

        .contact-info h2 { font-size: 2rem; margin-bottom: 1rem; color: #064e3b; }

        .contact-info > p {
          color: var(--text-muted);
          font-size: 1rem;
          line-height: 1.7;
          margin-bottom: 3rem;
        }

        .info-cards { display: flex; flex-direction: column; gap: 1rem; }

        .info-card {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1.5rem;
          background: #f8fafc;
          border-radius: 1rem;
          border: 1px solid #f1f5f9;
          transition: all 0.3s;
        }

        .info-card:hover {
          border-color: var(--primary);
          transform: translateX(8px);
          background: #f0fdf4;
        }

        .info-icon {
          width: 50px;
          height: 50px;
          background: white;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          flex-shrink: 0;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }

        .info-label {
          display: block;
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 0.2rem;
          font-weight: 500;
        }

        .info-value { font-size: 1rem; font-weight: 700; color: #0f172a; }

        .contact-social { margin-top: 3.5rem; }

        .contact-social h4 { margin-bottom: 1.25rem; color: #64748b; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; }

        .social-links { display: flex; gap: 1rem; flex-wrap: wrap; }

        .social-chip {
          padding: 0.5rem 1.25rem;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 2rem;
          font-size: 0.9rem;
          font-weight: 600;
          color: #475569;
          transition: all 0.3s;
        }

        .social-chip:hover { border-color: var(--primary); color: var(--primary); transform: translateY(-2px); }

        .contact-form {
          padding: 3.5rem;
          background: white;
          border-radius: 1.5rem;
          border: 1px solid #f1f5f9;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.03);
        }

        .contact-form h2 { font-size: 1.8rem; margin-bottom: 0.5rem; color: #064e3b; }

        .form-sub { color: #64748b; font-size: 0.95rem; margin-bottom: 2.5rem; }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        @media (max-width: 600px) { .form-row { grid-template-columns: 1fr; } }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          margin-bottom: 1.5rem;
        }

        .form-group label {
          font-size: 0.85rem;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 0.6rem;
          padding: 1rem 1.25rem;
          color: #1e293b;
          font-size: 1rem;
          font-family: inherit;
          outline: none;
          transition: all 0.3s;
          resize: vertical;
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: #94a3b8;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          border-color: var(--primary);
          background: white;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
        }

        .submit-btn {
          width: 100%;
          justify-content: center;
          padding: 1.15rem;
          font-size: 1.05rem;
          border-radius: 0.6rem;
          margin-top: 1rem;
        }

        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .success-state {
          padding: 5rem 3rem;
          text-align: center;
          background: white;
          border-radius: 1.5rem;
          border: 1px solid #dcfce7;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
        }

        .success-icon { color: #10b981; }

        .success-state h2 { font-size: 2.2rem; color: #064e3b; }

        .success-state p { color: #475569; font-size: 1.1rem; max-width: 400px; line-height: 1.7; }
      `}</style>
        </div>
    );
};

export default Contact;
