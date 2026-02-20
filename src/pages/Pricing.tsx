import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
    {
        name: 'Starter',
        icon: <Zap size={22} />,
        monthlyPrice: 0,
        annualPrice: 0,
        color: '#6366f1',
        desc: 'Perfect for personal events and one-off celebrations.',
        features: [
            '3 RSVP pages',
            'Up to 50 guests per event',
            'Default templates',
            'Shareable link',
            'Email notifications',
            'CSV export',
        ],
        notIncluded: ['Custom domain', 'Remove branding', 'Priority support'],
        cta: 'Get Started Free',
        popular: false,
    },
    {
        name: 'Pro',
        icon: <Star size={22} />,
        monthlyPrice: 19,
        annualPrice: 14,
        color: '#8b5cf6',
        desc: 'For frequent hosts who want beautiful, branded experiences.',
        features: [
            'Unlimited RSVP pages',
            'Up to 500 guests per event',
            'All premium templates',
            'Custom domain',
            'Remove InviteU branding',
            'Real-time analytics',
            'Email invitations',
            'Priority support',
        ],
        notIncluded: ['Dedicated account manager'],
        cta: 'Start Pro Trial',
        popular: true,
    },
    {
        name: 'Business',
        icon: <Star size={22} />,
        monthlyPrice: 49,
        annualPrice: 39,
        color: '#ec4899',
        desc: 'For event companies, agencies and professional planners.',
        features: [
            'Everything in Pro',
            'Unlimited guests per event',
            'Team collaboration',
            'API access',
            'Dedicated account manager',
            'Custom branding kit',
            'White-label option',
            'SLA uptime guarantee',
        ],
        notIncluded: [],
        cta: 'Contact Sales',
        popular: false,
    },
];

const Pricing: React.FC = () => {
    const [annual, setAnnual] = useState(false);

    return (
        <div className="pricing-page">
            <section className="pricing-hero section-padding">
                <div className="container" style={{ textAlign: 'center' }}>
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <span className="badge">Transparent Pricing 💰</span>
                        <h1 className="pricing-title">
                            Simple Plans,<br />
                            <span className="gradient-text">No Surprises</span>
                        </h1>
                        <p className="pricing-subtitle">
                            Start free, scale when you're ready. All plans include unlimited page views and guest RSVPs at your chosen tier.
                        </p>

                        {/* Toggle */}
                        <div className="billing-toggle">
                            <span className={!annual ? 'toggle-active' : ''}>Monthly</span>
                            <button className="toggle-switch" onClick={() => setAnnual(!annual)}>
                                <span className={`toggle-knob ${annual ? 'toggled' : ''}`} />
                            </button>
                            <span className={annual ? 'toggle-active' : ''}>Annual <span className="save-badge">Save 25%</span></span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Plans */}
            <section className="plans-section">
                <div className="container plans-grid">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={plan.name}
                            className={`plan-card glass-card ${plan.popular ? 'plan-popular' : ''}`}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.12 }}
                        >
                            {plan.popular && <div className="popular-badge">Most Popular</div>}

                            <div className="plan-header">
                                <div className="plan-icon" style={{ background: `${plan.color}20`, color: plan.color }}>
                                    {plan.icon}
                                </div>
                                <h3 className="plan-name">{plan.name}</h3>
                                <p className="plan-desc">{plan.desc}</p>
                            </div>

                            <div className="plan-price">
                                {plan.monthlyPrice === 0 ? (
                                    <span className="price-amount">Free</span>
                                ) : (
                                    <>
                                        <span className="price-amount">
                                            ${annual ? plan.annualPrice : plan.monthlyPrice}
                                        </span>
                                        <span className="price-period">/mo</span>
                                        {annual && <span className="billed-note">billed annually</span>}
                                    </>
                                )}
                            </div>

                            <Link
                                to="/contact"
                                className="btn plan-cta"
                                style={{ background: plan.popular ? plan.color : 'transparent', borderColor: plan.color, color: plan.popular ? 'white' : plan.color, border: '1.5px solid' }}
                            >
                                {plan.cta}
                            </Link>

                            <ul className="feature-list">
                                {plan.features.map(f => (
                                    <li key={f} className="feature-item included">
                                        <Check size={16} style={{ color: '#10b981' }} /> {f}
                                    </li>
                                ))}
                                {plan.notIncluded.map(f => (
                                    <li key={f} className="feature-item excluded">
                                        <span className="x-mark">✕</span> {f}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* FAQ note */}
            <section className="pricing-note section-padding">
                <div className="container" style={{ textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)' }}>
                        Have questions about which plan is right for you?{' '}
                        <Link to="/faq" style={{ color: 'var(--primary)' }}>Read our FAQ</Link> or{' '}
                        <Link to="/contact" style={{ color: 'var(--primary)' }}>contact our team</Link>.
                    </p>
                </div>
            </section>

            <style>{`
        .pricing-page { padding-top: 80px; }

        .pricing-hero {
          padding-top: 120px;
          background: radial-gradient(ellipse at top, rgba(99,102,241,0.12), transparent 60%);
        }

        .pricing-title {
          font-size: clamp(2rem, 4vw, 3.5rem);
          margin: 1.5rem 0;
        }

        .pricing-subtitle {
          color: var(--text-muted);
          font-size: 1.1rem;
          max-width: 550px;
          margin: 0 auto 2.5rem;
        }

        .billing-toggle {
          display: inline-flex;
          align-items: center;
          gap: 1rem;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-muted);
          background: var(--glass);
          padding: 0.6rem 1.5rem;
          border-radius: 2rem;
          border: 1px solid var(--border);
        }

        .toggle-active { color: white; }

        .toggle-switch {
          width: 48px;
          height: 26px;
          background: var(--primary);
          border-radius: 999px;
          position: relative;
          cursor: pointer;
          border: none;
          flex-shrink: 0;
        }

        .toggle-knob {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          transition: transform 0.3s;
          display: block;
        }

        .toggle-knob.toggled { transform: translateX(22px); }

        .save-badge {
          background: rgba(16,185,129,0.15);
          color: #10b981;
          padding: 0.2rem 0.5rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 700;
          margin-left: 0.3rem;
        }

        .plans-section { padding: 3rem 0 6rem; }

        .plans-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          align-items: start;
        }

        .plan-card {
          padding: 2.5rem;
          position: relative;
          transition: transform 0.3s;
        }

        .plan-card:hover { transform: translateY(-8px); }

        .plan-popular {
          border-color: var(--accent);
          transform: scale(1.03);
          background: rgba(139, 92, 246, 0.08);
        }

        .popular-badge {
          position: absolute;
          top: -14px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          padding: 0.35rem 1.25rem;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 700;
          white-space: nowrap;
        }

        .plan-header { margin-bottom: 2rem; }

        .plan-icon {
          width: 48px;
          height: 48px;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.2rem;
        }

        .plan-name { font-size: 1.4rem; margin-bottom: 0.5rem; }

        .plan-desc { color: var(--text-muted); font-size: 0.9rem; }

        .plan-price {
          margin-bottom: 2rem;
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
          flex-wrap: wrap;
        }

        .price-amount {
          font-size: 2.8rem;
          font-weight: 800;
          color: white;
        }

        .price-period { color: var(--text-muted); font-size: 1rem; }

        .billed-note {
          width: 100%;
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 0.2rem;
        }

        .plan-cta {
          width: 100%;
          justify-content: center;
          padding: 0.85rem;
          font-size: 1rem;
          border-radius: 0.5rem;
          margin-bottom: 2rem;
          display: block;
          text-align: center;
          font-weight: 700;
          transition: filter 0.2s, transform 0.2s;
        }

        .plan-cta:hover { filter: brightness(1.1); transform: translateY(-2px); }

        .feature-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.95rem;
        }

        .feature-item.excluded { color: var(--text-muted); text-decoration: line-through; }

        .x-mark { color: var(--text-muted); font-size: 0.9rem; }
      `}</style>
        </div>
    );
};

export default Pricing;
