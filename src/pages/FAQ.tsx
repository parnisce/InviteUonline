import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = ['All', 'Getting Started', 'Billing', 'Customization', 'Privacy'];

const faqs = [
    { q: 'How do I create my first RSVP page?', a: 'Simply sign up for a free account, click "Create Page", fill in your event details using our step-by-step form, choose a template, and publish. Your page will be live in minutes!', category: 'Getting Started' },
    { q: 'Do guests need an account to RSVP?', a: 'No! Guests can RSVP directly on your page without creating an account. They simply enter their name, email, and attendance status. It\'s that simple.', category: 'Getting Started' },
    { q: 'Can I collect meal preferences or dietary restrictions?', a: 'Yes! You can add custom questions to your RSVP form, including meal selections, dietary restrictions, song requests, or any other information you need from your guests.', category: 'Getting Started' },
    { q: 'Is there a free plan?', a: 'Absolutely. Our Starter plan is free forever and lets you create up to 3 RSVP pages with 50 guests each. No credit card required to sign up.', category: 'Billing' },
    { q: 'Can I cancel or downgrade my plan at any time?', a: 'Yes, you can cancel or change your plan anytime from your account settings. If you cancel a paid plan, you\'ll retain access until the end of your billing period.', category: 'Billing' },
    { q: 'Do you offer refunds?', a: 'We offer full refunds within 7 days of purchase if you\'re not satisfied. Contact our support team and we\'ll process it promptly.', category: 'Billing' },
    { q: 'Can I use my own domain name?', a: 'Yes! Pro and Business plans allow you to connect your custom domain so your RSVP page appears on yourname.com instead of inviteu.online.', category: 'Customization' },
    { q: 'Can I remove InviteU branding from my page?', a: 'White-label branding removal is available on the Pro plan and above. Your guests will see only your brand.', category: 'Customization' },
    { q: 'What types of events can I create pages for?', a: 'Any event imaginable! Weddings, birthday parties, corporate events, baby showers, graduation parties, holiday gatherings, conferences — InviteU works for them all.', category: 'Customization' },
    { q: 'Is my guest data private and secure?', a: 'Absolutely. All data is encrypted in transit (TLS) and at rest. We never sell your guest data to third parties. You own your data completely.', category: 'Privacy' },
    { q: 'Can I password-protect my RSVP page?', a: 'Yes! You can set a private password so only invited guests with the password can access your event page.', category: 'Privacy' },
    { q: 'How do I delete my account and event data?', a: 'You can delete your account and all associated data from your account settings at any time. We will permanently remove all your data within 30 days.', category: 'Privacy' },
];

const FAQ: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const filtered = activeCategory === 'All' ? faqs : faqs.filter(f => f.category === activeCategory);

    return (
        <div className="faq-page">
            {/* Hero */}
            <section className="faq-hero section-padding">
                <div className="container" style={{ textAlign: 'center' }}>
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <span className="section-tag">Help Center</span>
                        <h1 className="faq-title">
                            Frequently Asked<br />
                            <span className="gradient-text">Questions</span>
                        </h1>
                        <p className="faq-subtitle">
                            Can't find what you're looking for? <Link to="/contact" style={{ color: 'var(--primary)', fontWeight: '600' }}>Contact our team</Link> and we'll get back to you within 24 hours.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Categories */}
            <section className="faq-body section-padding" style={{ paddingTop: '0' }}>
                <div className="container">
                    <div className="cat-filters">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`cat-btn ${activeCategory === cat ? 'cat-active' : ''}`}
                                onClick={() => { setActiveCategory(cat); setOpenIndex(null); }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="faq-list">
                        {filtered.map((faq, i) => (
                            <motion.div
                                key={faq.q}
                                className="faq-item"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <button
                                    className={`faq-question ${openIndex === i ? 'active-q' : ''}`}
                                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                >
                                    <div className="faq-q-left">
                                        <HelpCircle size={18} className="faq-icon" />
                                        <span>{faq.q}</span>
                                    </div>
                                    <ChevronDown
                                        size={18}
                                        className={`faq-chevron ${openIndex === i ? 'rotated' : ''}`}
                                    />
                                </button>

                                <AnimatePresence>
                                    {openIndex === i && (
                                        <motion.div
                                            className="faq-answer"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="answer-content">
                                                <p>{faq.a}</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="faq-contact section-padding">
                <div className="container">
                    <motion.div
                        className="faq-cta"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2>Still Have Questions?</h2>
                        <p>Our friendly support team is available Monday–Friday, 9am–6pm.</p>
                        <Link to="/contact" className="btn btn-primary" style={{ padding: '0.85rem 2.5rem', fontSize: '1rem', borderRadius: '0.4rem' }}>
                            Contact Support
                        </Link>
                    </motion.div>
                </div>
            </section>

            <style>{`
        .faq-page { padding-top: 80px; }

        .faq-hero {
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

        .faq-title { font-size: clamp(2rem, 4vw, 3.5rem); margin: 1.5rem 0; color: #0f172a; }

        .faq-subtitle { color: var(--text-muted); font-size: 1.1rem; }

        .cat-filters {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-bottom: 3rem;
          justify-content: center;
        }

        .cat-btn {
          padding: 0.6rem 1.5rem;
          border-radius: 999px;
          border: 1px solid #e2e8f0;
          background: white;
          color: var(--text-muted);
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }

        .cat-btn:hover, .cat-active {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
        }

        .faq-list { display: flex; flex-direction: column; gap: 0.75rem; max-width: 800px; margin: 0 auto; }

        .faq-item { 
          border-radius: 1rem;
          overflow: hidden;
          background: white;
          border: 1px solid #f1f5f9;
        }

        .faq-question {
          width: 100%;
          background: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 2rem;
          font-size: 1.05rem;
          font-weight: 600;
          color: #0f172a;
          text-align: left;
          gap: 1rem;
          transition: background 0.2s;
        }

        .faq-question:hover {
          background: #f8fafc;
        }

        .active-q {
          background: #f0fdf4 !important;
          color: #064e3b;
        }

        .faq-q-left {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .faq-icon { color: var(--primary); flex-shrink: 0; }

        .faq-chevron { transition: transform 0.3s; flex-shrink: 0; color: #94a3b8; }

        .faq-chevron.rotated { transform: rotate(180deg); color: var(--primary); }

        .faq-answer {
          overflow: hidden;
        }

        .answer-content {
          padding: 0 2rem 2rem 4.5rem;
        }

        .faq-answer p {
          color: var(--text-muted);
          font-size: 1rem;
          line-height: 1.8;
        }

        .faq-cta {
          text-align: center;
          padding: 5rem 2rem;
          background: #f0fdf4;
          border-radius: 2rem;
        }

        .faq-cta h2 { font-size: 2.2rem; margin-bottom: 1rem; color: #064e3b; }

        .faq-cta p { color: var(--text-muted); margin-bottom: 2.5rem; font-size: 1.1rem; }
      `}</style>
        </div>
    );
};

export default FAQ;
