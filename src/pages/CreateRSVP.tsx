import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Cake, Heart, ShieldAlert, Baby, GraduationCap, Users,
    ArrowRight, ArrowLeft, Upload, Check, Globe, CreditCard,
    Send, Sparkles, Image as ImageIcon, Layout as LayoutIcon
} from 'lucide-react';

type EventType = 'Birthday' | 'Wedding' | 'Private Event' | 'Baby Shower' | 'Graduation' | 'Reunion' | null;

const CreateRSVP: React.FC = () => {
    const [step, setStep] = useState(1);
    const [eventType, setEventType] = useState<EventType>(null);
    const [formData, setFormData] = useState<any>({});
    const [design, setDesign] = useState({ banner: '', themeColor: '#10b981' });
    const [slug, setSlug] = useState('');
    const [isPaid, setIsPaid] = useState(false);

    // Step 1: Event Types
    const eventTypes = [
        { name: 'Birthday', icon: <Cake /> },
        { name: 'Wedding', icon: <Heart /> },
        { name: 'Private Event', icon: <ShieldAlert /> },
        { name: 'Baby Shower', icon: <Baby /> },
        { name: 'Graduation', icon: <GraduationCap /> },
        { name: 'Reunion', icon: <Users /> },
    ];

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const handleEventTypeSelect = (type: EventType) => {
        setEventType(type);
        nextStep();
    };

    return (
        <div className="create-rsvp-page section-padding">
            <div className="container">
                {/* Progress Bar */}
                <div className="step-progress">
                    {[1, 2, 3, 4, 5, 6].map(s => (
                        <div key={s} className={`progress-segment ${step >= s ? 'active' : ''}`}>
                            <span className="segment-dot"></span>
                            <span className="segment-label">Step {s}</span>
                        </div>
                    ))}
                </div>

                <div className="builder-container glass-card">
                    <AnimatePresence mode="wait">

                        {/* STEP 1: SELECT EVENT */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="builder-step"
                            >
                                <h2 className="builder-title">What are we celebrating?</h2>
                                <p className="builder-subtitle">Select your event type to get started with the perfect template.</p>
                                <div className="type-grid">
                                    {eventTypes.map(t => (
                                        <button
                                            key={t.name}
                                            className={`type-card ${eventType === t.name ? 'selected' : ''}`}
                                            onClick={() => handleEventTypeSelect(t.name as EventType)}
                                        >
                                            <div className="type-icon">{t.icon}</div>
                                            <span>{t.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 2: FILL FORM */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="builder-step"
                            >
                                <div className="step-header">
                                    <button className="back-btn" onClick={prevStep}><ArrowLeft size={20} /></button>
                                    <h2 className="builder-title">{eventType} Details</h2>
                                </div>
                                <div className="form-content">
                                    <div className="form-group">
                                        <label>Event Name</label>
                                        <input type="text" placeholder={`e.g. ${eventType} of Aria`} value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Date</label>
                                            <input type="date" value={formData.date || ''} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                                        </div>
                                        <div className="form-group">
                                            <label>Time</label>
                                            <input type="time" value={formData.time || ''} onChange={e => setFormData({ ...formData, time: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Location / Venue</label>
                                        <input type="text" placeholder="Enter full address" value={formData.location || ''} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                                    </div>
                                    {eventType === 'Wedding' && (
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Partner 1 Name</label>
                                                <input type="text" placeholder="Full Name" />
                                            </div>
                                            <div className="form-group">
                                                <label>Partner 2 Name</label>
                                                <input type="text" placeholder="Full Name" />
                                            </div>
                                        </div>
                                    )}
                                    <button className="btn btn-primary submit-btn" onClick={nextStep}>
                                        Continue to Design <ArrowRight size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 3: CUSTOMIZE DESIGN */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="builder-step"
                            >
                                <div className="step-header">
                                    <button className="back-btn" onClick={prevStep}><ArrowLeft size={20} /></button>
                                    <h2 className="builder-title">Customize Design</h2>
                                </div>
                                <div className="design-grid">
                                    <div className="design-controls">
                                        <div className="form-group">
                                            <label>Upload Banner Image</label>
                                            <div className="upload-box">
                                                <Upload size={30} />
                                                <p>Click to upload or drag and drop</p>
                                                <span>JPG, PNG up to 5MB</span>
                                                <input type="file" className="file-input" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Theme Color</label>
                                            <div className="color-picker-grid">
                                                {['#10b981', '#f59e0b', '#ef4444', '#6366f1', '#ec4899', '#8b5cf6'].map(c => (
                                                    <button
                                                        key={c}
                                                        className={`color-dot ${design.themeColor === c ? 'active' : ''}`}
                                                        style={{ background: c }}
                                                        onClick={() => setDesign({ ...design, themeColor: c })}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <button className="btn btn-primary submit-btn" onClick={nextStep}>
                                            Next: Custom URL <ArrowRight size={18} />
                                        </button>
                                    </div>
                                    <div className="design-preview">
                                        <div className="preview-window">
                                            <span className="window-tag">Live Preview</span>
                                            <div className="mock-rsvp">
                                                <div className="mock-banner" style={{ background: design.themeColor + '20' }}>
                                                    {design.banner ? <img src={design.banner} alt="Banner" /> : <ImageIcon size={40} />}
                                                </div>
                                                <div className="mock-content">
                                                    <div className="mock-title">{formData.title || 'Your Event Title'}</div>
                                                    <div className="mock-meta">{formData.date || 'Event Date'} • {formData.location || 'Venue Location'}</div>
                                                    <div className="mock-btn" style={{ background: design.themeColor }}>RSVP Now</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 4: CUSTOM WEB ADDRESS */}
                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="builder-step"
                            >
                                <div className="step-header">
                                    <button className="back-btn" onClick={prevStep}><ArrowLeft size={20} /></button>
                                    <h2 className="builder-title">Secure Your URL</h2>
                                </div>
                                <div className="url-builder">
                                    <div className="url-input-group">
                                        <span className="url-prefix">inviteu.online/</span>
                                        <input
                                            type="text"
                                            placeholder="your-event-name"
                                            value={slug}
                                            onChange={e => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                                        />
                                    </div>
                                    <p className="url-hint">Guests will visit this link to RSVP. Keep it simple and memorable!</p>

                                    <div className="save-account-note">
                                        <Sparkles className="spark-icon" />
                                        <div>
                                            <p><strong>Note:</strong> To save your RSVP and get this link, you'll need to create an account in the next step.</p>
                                        </div>
                                    </div>

                                    <button className="btn btn-primary submit-btn" onClick={nextStep}>
                                        Save & Continue <ArrowRight size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 5: REGISTRATION & PAYMENT */}
                        {step === 5 && (
                            <motion.div
                                key="step5"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="builder-step"
                            >
                                <div className="step-header">
                                    <button className="back-btn" onClick={prevStep}><ArrowLeft size={20} /></button>
                                    <h2 className="builder-title">Finalize Your RSVP</h2>
                                </div>
                                <div className="checkout-grid">
                                    <div className="auth-section">
                                        <h3>Create Your Account</h3>
                                        <p>Manage your guest list and RSVPs anytime.</p>
                                        <div className="form-group">
                                            <label>Email Address</label>
                                            <input type="email" placeholder="you@example.com" />
                                        </div>
                                        <div className="form-group">
                                            <label>Set Password</label>
                                            <input type="password" placeholder="Min. 8 characters" />
                                        </div>
                                    </div>
                                    <div className="payment-section">
                                        <div className="order-summary">
                                            <h4>Order Summary</h4>
                                            <div className="order-row">
                                                <span>Premium RSVP Page</span>
                                                <span>$19.00</span>
                                            </div>
                                            <div className="order-total">
                                                <span>Total</span>
                                                <span>$19.00</span>
                                            </div>
                                        </div>
                                        <button className="btn btn-primary submit-btn" onClick={() => { setIsPaid(true); nextStep(); }}>
                                            <CreditCard size={18} /> Pay & Publish
                                        </button>
                                        <p className="secure-text">🔒 Secure payment via Stripe</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 6: SHARE */}
                        {step === 6 && (
                            <motion.div
                                key="step6"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="builder-step success-step"
                            >
                                <div className="success-icon-bg">
                                    <Check size={40} />
                                </div>
                                <h2 className="builder-title">{isPaid ? 'Your RSVP is LIVE! 🎉' : 'RSVP Saved as Draft'}</h2>
                                <p className="builder-subtitle">Congratulations! Your website is published and ready for guests.</p>

                                <div className="live-link-box">
                                    <Globe size={20} />
                                    <span>inviteu.online/{slug || 'my-event'}</span>
                                    <button className="copy-link">Copy</button>
                                </div>

                                <div className="share-actions">
                                    <button className="btn btn-outline share-btn"><Send size={18} /> Share via Email</button>
                                    <button className="btn btn-primary share-btn"><LayoutIcon size={18} /> Go to Dashboard</button>
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </div>

            <style>{`
        .create-rsvp-page {
          padding-top: 120px;
          min-height: 100vh;
          background: #f8fafc;
        }

        .step-progress {
          display: flex;
          justify-content: space-between;
          margin-bottom: 3rem;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .progress-segment {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          position: relative;
          flex: 1;
        }

        .progress-segment:not(:last-child)::after {
          content: '';
          position: absolute;
          top: 8px;
          left: 50%;
          width: 100%;
          height: 2px;
          background: #e2e8f0;
          z-index: 0;
        }

        .progress-segment.active::after { background: var(--primary); }

        .segment-dot {
          width: 18px;
          height: 18px;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 50%;
          z-index: 1;
        }

        .active .segment-dot { background: var(--primary); border-color: var(--primary); }

        .segment-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
        }

        .active .segment-label { color: var(--primary); }

        .builder-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 3.5rem;
          background: white;
          min-height: 500px;
        }

        .builder-title { font-size: 2rem; color: #064e3b; margin-bottom: 0.5rem; }
        .builder-subtitle { color: var(--text-muted); margin-bottom: 2.5rem; }

        .type-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 1.5rem;
        }

        .type-card {
          padding: 2rem 1rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          transition: all 0.3s;
        }

        .type-card:hover { border-color: var(--primary); transform: translateY(-4px); background: #f0fdf4; }
        .type-card.selected { border-color: var(--primary); background: #f0fdf4; }

        .type-icon { color: var(--primary); }
        .type-icon svg { width: 32px; height: 32px; }

        .step-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
        .back-btn { background: #f1f5f9; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--text-muted); }

        .form-content { display: flex; flex-direction: column; gap: 1.5rem; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        
        .form-group label { display: block; font-size: 0.85rem; font-weight: 700; color: #475569; margin-bottom: 0.5rem; text-transform: uppercase; }
        .form-group input { width: 100%; padding: 0.85rem 1rem; border-radius: 0.5rem; border: 1px solid #e2e8f0; background: #f8fafc; font-size: 1rem; }
        .form-group input:focus { border-color: var(--primary); outline: none; background: white; }

        .design-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 3rem; }
        .upload-box { border: 2px dashed #e2e8f0; border-radius: 1rem; padding: 2rem; text-align: center; color: var(--text-muted); position: relative; }
        .upload-box p { font-weight: 600; margin-top: 0.5rem; }
        .upload-box span { font-size: 0.75rem; }
        .file-input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }

        .color-picker-grid { display: flex; gap: 0.75rem; margin-top: 0.5rem; }
        .color-dot { width: 32px; height: 32px; border-radius: 50%; border: 2px solid transparent; }
        .color-dot.active { border-color: #000; scale: 1.1; }

        .preview-window { background: #f1f5f9; border-radius: 1rem; padding: 1.5rem; position: relative; }
        .window-tag { position: absolute; top: 1rem; right: 1rem; background: #1e293b; color: white; padding: 0.2rem 0.6rem; border-radius: 2rem; font-size: 0.7rem; font-weight: 600; }
        .mock-rsvp { background: white; border-radius: 0.75rem; overflow: hidden; box-shadow: 0 10px 15px -10px rgba(0,0,0,0.1); }
        .mock-banner { height: 120px; display: flex; align-items: center; justify-content: center; color: #94a3b8; }
        .mock-content { padding: 1.5rem; text-align: center; }
        .mock-title { font-weight: 800; font-size: 1.2rem; margin-bottom: 0.5rem; }
        .mock-meta { font-size: 0.8rem; color: #94a3b8; margin-bottom: 1.5rem; }
        .mock-btn { color: white; padding: 0.6rem; border-radius: 0.4rem; font-size: 0.85rem; font-weight: 600; }

        .url-input-group { display: flex; align-items: center; background: #f1f5f9; border-radius: 0.5rem; border: 1px solid #e2e8f0; overflow: hidden; }
        .url-prefix { padding: 0 1rem; color: #94a3b8; font-weight: 600; border-right: 1px solid #e2e8f0; }
        .url-builder input { border: none !important; background: transparent !important; }

        .save-account-note { display: flex; gap: 1rem; background: #f0fdf4; border: 1px solid #dcfce7; padding: 1.25rem; border-radius: 0.75rem; margin-top: 2rem; color: #166534; font-size: 0.95rem; }
        .spark-icon { color: var(--primary); flex-shrink: 0; }

        .checkout-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; }
        .auth-section h3 { margin-bottom: 0.5rem; color: #064e3b; }
        .auth-section p { font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.5rem; }

        .payment-section { background: #f8fafc; padding: 2rem; border-radius: 1rem; border: 1px solid #e2e8f0; }
        .order-summary { margin-bottom: 2rem; }
        .order-row { display: flex; justify-content: space-between; margin-bottom: 0.5rem; color: var(--text-muted); }
        .order-total { display: flex; justify-content: space-between; font-weight: 800; font-size: 1.2rem; color: #0f172a; border-top: 1px solid #e2e8f0; padding-top: 1rem; margin-top: 1rem; }
        .secure-text { text-align: center; margin-top: 1rem; font-size: 0.75rem; color: #94a3b8; }

        .success-step { text-align: center; display: flex; flex-direction: column; align-items: center; padding: 3rem 0; }
        .success-icon-bg { width: 80px; height: 80px; background: #dcfce7; color: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 2rem; }
        .live-link-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 1rem 1.5rem; border-radius: 0.75rem; display: flex; align-items: center; gap: 1rem; margin: 2rem 0; font-weight: 600; color: #0f172a; }
        .copy-link { color: var(--primary); background: transparent; font-weight: 700; font-size: 0.9rem; }
        .share-actions { display: flex; gap: 1rem; width: 100%; justify-content: center; }
        .share-btn { flex: 1; max-width: 250px; }

        @media (max-width: 768px) {
          .design-grid, .checkout-grid { grid-template-columns: 1fr; }
          .form-row { grid-template-columns: 1fr; }
          .builder-container { padding: 2rem; }
          .share-actions { flex-direction: column; align-items: center; }
        }
      `}</style>
        </div>
    );
};

export default CreateRSVP;
