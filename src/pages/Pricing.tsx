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
        color: '#14b8a6',
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
        color: '#10b981',
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
        color: '#047857',
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
                        <span className="section-tag">Pricing Plans</span>
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
            <section className="plans-section section-padding">
                <div className="container plans-grid">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={plan.name}
                            className={`plan-card ${plan.popular ? 'plan-popular' : ''}`}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.12 }}
                        >
                            {plan.popular && <div className="popular-badge">Most Popular</div>}

                            <div className="plan-header">
                                <div className="plan-icon" style={{ background: `${plan.color}10`, color: plan.color }}>
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
                                style={{
                                    background: plan.popular ? plan.color : 'transparent',
                                    borderColor: plan.color,
                                    color: plan.popular ? 'white' : plan.color,
                                    border: '2px solid'
                                }}
                            >
                                {plan.cta}
                            </Link>

                            <ul className="feature-list">
                                {plan.features.map(f => (
                                    <li key={f} className="feature-item included">
                                        <Check size={16} /> {f}
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

            <style>{`
        .pricing-page { padding-top: 80px; }

        .pricing-hero {
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

        .pricing-title {
          font-size: clamp(2rem, 4vw, 3.5rem);
          margin: 1.5rem 0;
          color: #0f172a;
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
          gap: 1.5rem;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-muted);
          background: white;
          padding: 0.6rem 2rem;
          border-radius: 999px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }

        .toggle-active { color: #064e3b; }

        .toggle-switch {
          width: 50px;
          height: 26px;
          background: var(--primary);
          border-radius: 999px;
          position: relative;
          cursor: pointer;
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

        .toggle-knob.toggled { transform: translateX(24px); }

        .save-badge {
          background: #dcfce7;
          color: #166534;
          padding: 0.2rem 0.6rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 700;
          margin-left: 0.4rem;
        }

        .plans-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2.5rem;
          align-items: start;
        }

        .plan-card {
          padding: 3rem 2.5rem;
          background: white;
          border: 1px solid #f1f5f9;
          border-radius: 1.5rem;
          position: relative;
          transition: all 0.3s;
        }

        .plan-card:hover { 
          transform: translateY(-8px); 
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
        }

        .plan-popular {
          border: 2px solid var(--primary);
          transform: scale(1.05);
        }

        .plan-popular:hover { transform: scale(1.05) translateY(-8px); }

        .popular-badge {
          position: absolute;
          top: -14px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--primary);
          color: white;
          padding: 0.4rem 1.5rem;
          border-radius: 999px;
          font-size: 0.85rem;
          font-weight: 700;
          white-space: nowrap;
        }

        .plan-header { margin-bottom: 2rem; }

        .plan-icon {
          width: 50px;
          height: 50px;
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .plan-name { font-size: 1.5rem; margin-bottom: 0.5rem; color: #064e3b; }

        .plan-desc { color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; }

        .plan-price {
          margin-bottom: 2rem;
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
        }

        .price-amount {
          font-size: 3rem;
          font-weight: 800;
          color: #0f172a;
        }

        .price-period { color: var(--text-muted); font-size: 1.1rem; }

        .billed-note {
          display: block;
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-top: 0.5rem;
        }

        .plan-cta {
          width: 100%;
          justify-content: center;
          padding: 1rem;
          font-size: 1rem;
          margin-bottom: 2.5rem;
          display: flex;
          font-weight: 700;
        }

        .feature-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 1rem;
          color: #334155;
        }

        .feature-item svg { color: var(--primary); flex-shrink: 0; }

        .feature-item.excluded { color: #94a3b8; }

        .x-mark { font-size: 1rem; color: #cbd5e1; }
      `}</style>
        </div>
    );
};

export default Pricing;
