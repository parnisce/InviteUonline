import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Cake, Heart, ShieldAlert, Baby, GraduationCap, Users,
    ArrowRight, ArrowLeft, Upload, Check, Globe, CreditCard,
    Image as ImageIcon,
    Loader2, AlertCircle, Plus, Trash2, Clock, Camera
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

type EventType = 'Birthday' | 'Wedding' | 'Private Event' | 'Baby Shower' | 'Graduation' | 'Reunion' | null;

interface ItineraryItem {
    time: string;
    activity: string;
}

const CreateRSVP: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [eventType, setEventType] = useState<EventType>(null);
    const [formData, setFormData] = useState<any>({
        title: '',
        date: '',
        time: '',
        location: '',
        details: {
            itinerary: [{ time: '', activity: '' }],
            gallery: [],
            partner1: '',
            partner2: '',
            story: ''
        }
    });
    const [design, setDesign] = useState({ banner: '', themeColor: '#10b981' });
    const [slug, setSlug] = useState('');
    const [isPaid, setIsPaid] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
        // Set default theme for birthday template as requested (green)
        if (type === 'Birthday') {
            setDesign(d => ({ ...d, themeColor: '#064e3b' }));
        }
        nextStep();
    };

    const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `banners/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('event-assets')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('event-assets').getPublicUrl(filePath);
            setDesign({ ...design, banner: data.publicUrl });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setLoading(true);
        try {
            const newUrls = [...formData.details.gallery];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `gallery/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('event-assets')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data } = supabase.storage.from('event-assets').getPublicUrl(filePath);
                newUrls.push(data.publicUrl);
            }
            setFormData({ ...formData, details: { ...formData.details, gallery: newUrls } });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const addItineraryItem = () => {
        const items = [...formData.details.itinerary, { time: '', activity: '' }];
        setFormData({ ...formData, details: { ...formData.details, itinerary: items } });
    };

    const updateItineraryItem = (index: number, field: keyof ItineraryItem, value: string) => {
        const items = [...formData.details.itinerary];
        items[index][field] = value;
        setFormData({ ...formData, details: { ...formData.details, itinerary: items } });
    };

    const removeItineraryItem = (index: number) => {
        const items = formData.details.itinerary.filter((_: any, i: number) => i !== index);
        setFormData({ ...formData, details: { ...formData.details, itinerary: items } });
    };

    const handleFinalPublish = async () => {
        if (!user) {
            setError("Please login to publish your event.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const { error: eventError } = await supabase.from('events').insert({
                user_id: user.id,
                event_type: eventType,
                title: formData.title,
                slug: slug,
                event_date: `${formData.date}T${formData.time}`,
                location: formData.location,
                banner_url: design.banner,
                theme_color: design.themeColor,
                is_published: true,
                payment_status: 'paid',
                event_details: formData.details
            });

            if (eventError) {
                if (eventError.code === '23505') throw new Error("This URL is already taken. Please try another one.");
                throw eventError;
            }

            setIsPaid(true);
            nextStep();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-rsvp-page section-padding">
            <div className="container">
                <div className="step-progress">
                    {[1, 2, 3, 4, 5, 6].map(s => (
                        <div key={s} className={`progress-segment ${step >= s ? 'active' : ''}`}>
                            <span className="segment-dot"></span>
                            <span className="segment-label">Step {s}</span>
                        </div>
                    ))}
                </div>

                <div className="builder-container glass-card">
                    {error && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="error-banner">
                            <AlertCircle size={20} /> {error}
                        </motion.div>
                    )}

                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div key="step1" className="builder-step">
                                <h2 className="builder-title">What are we celebrating?</h2>
                                <div className="type-grid">
                                    {eventTypes.map(t => (
                                        <button key={t.name} className={`type-card ${eventType === t.name ? 'selected' : ''}`} onClick={() => handleEventTypeSelect(t.name as EventType)}>
                                            <div className="type-icon">{t.icon}</div>
                                            <span>{t.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div key="step2" className="builder-step">
                                <div className="step-header">
                                    <button className="back-btn" onClick={prevStep}><ArrowLeft size={20} /></button>
                                    <h2 className="builder-title">{eventType} Details</h2>
                                </div>
                                <div className="form-content">
                                    <div className="form-group">
                                        <label>Event Name</label>
                                        <input type="text" placeholder={`e.g. ${eventType} of Aria`} value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Date</label>
                                            <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                                        </div>
                                        <div className="form-group">
                                            <label>Time</label>
                                            <input type="time" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Location / Venue</label>
                                        <input type="text" placeholder="Enter full address" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                                    </div>

                                    {(eventType === 'Birthday' || eventType === 'Wedding') && (
                                        <div className="dynamic-section">
                                            <div className="section-title-row">
                                                <label>Event Program / Itinerary</label>
                                                <button className="add-btn-small" onClick={addItineraryItem}><Plus size={14} /> Add Item</button>
                                            </div>
                                            {formData.details.itinerary.map((item: any, idx: number) => (
                                                <div key={idx} className="itinerary-row form-row">
                                                    <div className="form-group">
                                                        <input type="text" placeholder="Time (e.g. 5:00 PM)" value={item.time} onChange={e => updateItineraryItem(idx, 'time', e.target.value)} />
                                                    </div>
                                                    <div className="form-group relative">
                                                        <input type="text" placeholder="Activity (e.g. Dinner)" value={item.activity} onChange={e => updateItineraryItem(idx, 'activity', e.target.value)} />
                                                        {formData.details.itinerary.length > 1 && (
                                                            <button className="remove-btn-small" onClick={() => removeItineraryItem(idx)}><Trash2 size={14} /></button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {eventType === 'Wedding' && (
                                        <>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Partner 1 Name</label>
                                                    <input type="text" placeholder="Full Name" value={formData.details.partner1} onChange={e => setFormData({ ...formData, details: { ...formData.details, partner1: e.target.value } })} />
                                                </div>
                                                <div className="form-group">
                                                    <label>Partner 2 Name</label>
                                                    <input type="text" placeholder="Full Name" value={formData.details.partner2} onChange={e => setFormData({ ...formData, details: { ...formData.details, partner2: e.target.value } })} />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Our Story / Message</label>
                                                <textarea
                                                    placeholder="Share a short story with your guests..."
                                                    rows={3}
                                                    value={formData.details.story}
                                                    onChange={e => setFormData({ ...formData, details: { ...formData.details, story: e.target.value } })}
                                                    className="form-textarea"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Photo Gallery</label>
                                                <div className="gallery-upload-container">
                                                    <div className="gallery-preview-grid">
                                                        {formData.details.gallery.map((url: string, i: number) => (
                                                            <div key={i} className="gallery-preview-item">
                                                                <img src={url} alt={`Gallery ${i}`} />
                                                                <button className="del-photo" onClick={() => setFormData({ ...formData, details: { ...formData.details, gallery: formData.details.gallery.filter((_: any, idx: number) => idx !== i) } })}><Trash2 size={12} /></button>
                                                            </div>
                                                        ))}
                                                        <div className="gallery-add-box">
                                                            <Camera size={20} />
                                                            <input type="file" multiple onChange={handleGalleryUpload} />
                                                        </div>
                                                    </div>
                                                    <p className="upload-hint">Upload up to 6 high-quality photos for your gallery.</p>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <button className="btn btn-primary submit-btn" onClick={nextStep} disabled={!formData.title || !formData.date}>
                                        Next: Style & Design <ArrowRight size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div key="step3" className="builder-step">
                                <div className="step-header">
                                    <button className="back-btn" onClick={prevStep}><ArrowLeft size={20} /></button>
                                    <h2 className="builder-title">Customize Design</h2>
                                </div>
                                <div className="design-grid">
                                    <div className="design-controls">
                                        <div className="form-group">
                                            <label>Hero Banner Image</label>
                                            <div className="upload-box">
                                                {loading ? <Loader2 className="animate-spin" /> : <Upload size={30} />}
                                                <p>{loading ? 'Uploading...' : 'Click to upload banner'}</p>
                                                <input type="file" className="file-input" onChange={handleBannerUpload} disabled={loading} />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Template Theme Color</label>
                                            <div className="color-picker-grid">
                                                {['#064e3b', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#ec4899', '#8b5cf6'].map(c => (
                                                    <button key={c} className={`color-dot ${design.themeColor === c ? 'active' : ''}`} style={{ background: c }} onClick={() => setDesign({ ...design, themeColor: c })} />
                                                ))}
                                            </div>
                                            <p className="hint-text mt-2">Birthday: Recommended Dark Green (#064e3b)</p>
                                        </div>
                                        <button className="btn btn-primary submit-btn" onClick={nextStep}>
                                            Next: Choose URL <ArrowRight size={18} />
                                        </button>
                                    </div>
                                    <div className="design-preview">
                                        <div className="mock-rsvp glass-card">
                                            <div className="mock-banner" style={{ background: design.themeColor + '20' }}>
                                                {design.banner ? <img src={design.banner} alt="Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <ImageIcon size={40} />}
                                            </div>
                                            <div className="mock-content">
                                                <h3>{formData.title || 'Event Title'}</h3>
                                                <p>{formData.date || 'Date'} • {formData.location || 'Location'}</p>
                                                <div className="mock-btn" style={{ background: design.themeColor }}>RSVP</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div key="step4" className="builder-step">
                                <div className="step-header">
                                    <button className="back-btn" onClick={prevStep}><ArrowLeft size={20} /></button>
                                    <h2 className="builder-title">Secure Your URL</h2>
                                </div>
                                <div className="url-builder">
                                    <div className="url-input-group">
                                        <span className="url-prefix">inviteu.online/</span>
                                        <input type="text" placeholder="your-event-name" value={slug} onChange={e => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))} />
                                    </div>
                                    <p className="url-hint">Keep it simple and memorable!</p>
                                    <button className="btn btn-primary submit-btn" onClick={nextStep} disabled={!slug}>
                                        Review & Publish <ArrowRight size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 5 && (
                            <motion.div key="step5" className="builder-step">
                                <div className="step-header">
                                    <button className="back-btn" onClick={prevStep}><ArrowLeft size={20} /></button>
                                    <h2 className="builder-title">Final Review</h2>
                                </div>
                                <div className="checkout-grid">
                                    <div className="order-summary glass-card">
                                        <h3>{formData.title}</h3>
                                        <p className="summary-date">{formData.date} at {formData.time}</p>
                                        <p className="summary-loc">{formData.location}</p>
                                        <div className="summary-badge" style={{ background: design.themeColor + '20', color: design.themeColor }}>
                                            {eventType} Dedicated Template
                                        </div>
                                    </div>
                                    <div className="payment-section">
                                        <div className="price-row"><span>Publication Fee</span><span>$19.00</span></div>
                                        <div className="price-row total"><span>Total</span><span>$19.00</span></div>
                                        <button className="btn btn-primary submit-btn" onClick={handleFinalPublish} disabled={loading}>
                                            {loading ? <Loader2 className="animate-spin" /> : <><CreditCard size={18} /> Finalize & Publish</>}
                                        </button>
                                        <p className="secure-text">🔒 Secure payment with Stripe</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 6 && (
                            <motion.div key="step6" className="builder-step success-step">
                                <div className="success-icon-bg"><Check size={40} /></div>
                                <h2 className="builder-title">{isPaid ? "It's LIVE! 🎉" : 'RSVP Saved as Draft'}</h2>
                                <div className="live-link-box">
                                    <Globe size={20} />
                                    <span>inviteu.online/{slug}</span>
                                    <button className="copy-link" onClick={() => navigator.clipboard.writeText(`inviteu.online/${slug}`)}>Copy</button>
                                </div>
                                <div className="share-actions">
                                    <button className="btn btn-primary share-btn" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <style>{`
        .create-rsvp-page { padding-top: 120px; min-height: 100vh; background: #f8fafc; }
        .step-progress { display: flex; justify-content: space-between; margin-bottom: 3rem; max-width: 800px; margin: 0 auto; }
        .progress-segment { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; position: relative; flex: 1; }
        .progress-segment:not(:last-child)::after { content: ''; position: absolute; top: 8px; left: 50%; width: 100%; height: 2px; background: #e2e8f0; z-index: 0; }
        .progress-segment.active::after { background: var(--primary); }
        .segment-dot { width: 18px; height: 18px; background: white; border: 2px solid #e2e8f0; border-radius: 50%; z-index: 1; }
        .active .segment-dot { background: var(--primary); border-color: var(--primary); }
        .segment-label { font-size: 0.75rem; font-weight: 600; color: #94a3b8; text-transform: uppercase; }
        .active .segment-label { color: var(--primary); }
        .builder-container { max-width: 900px; margin: 0 auto; padding: 3.5rem; background: white; border-radius: 2rem; position: relative; }
        .error-banner { background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; padding: 1rem; border-radius: 0.75rem; margin-bottom: 2rem; display: flex; align-items: center; gap: 0.75rem; font-size: 0.9rem; }
        .builder-title { font-size: 2rem; color: #064e3b; margin-bottom: 2rem; text-align: center; }
        .type-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1.5rem; }
        .type-card { padding: 2.5rem 1rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 1.5rem; display: flex; flex-direction: column; align-items: center; gap: 1.25rem; transition: all 0.3s; cursor: pointer; }
        .type-card:hover, .type-card.selected { border-color: var(--primary); transform: translateY(-4px); background: #f0fdf4; }
        .type-icon { color: var(--primary); }
        .type-icon svg { width: 36px; height: 36px; }
        .step-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2.5rem; }
        .back-btn { background: #f1f5f9; border: none; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--text-muted); cursor: pointer; }
        .form-content { display: flex; flex-direction: column; gap: 1.5rem; max-width: 600px; margin: 0 auto; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .form-group label { display: block; font-size: 0.85rem; font-weight: 700; color: #475569; margin-bottom: 0.5rem; text-transform: uppercase; }
        .form-group input, .form-textarea { width: 100%; padding: 1rem 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0; background: #f8fafc; font-size: 1rem; outline: none; transition: 0.3s; }
        .form-group input:focus, .form-textarea:focus { border-color: var(--primary); background: white; box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1); }
        .dynamic-section { background: #f8fafc; padding: 1.5rem; border-radius: 1rem; border: 1px solid #e2e8f0; }
        .section-title-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .add-btn-small { background: #10b981; color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 0.5rem; font-size: 0.75rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; }
        .relative { position: relative; }
        .remove-btn-small { position: absolute; right: 0.75rem; top: 1rem; background: #fee2e2; color: #ef4444; border: none; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        
        .gallery-upload-container { background: #f1f5f9; padding: 1.5rem; border-radius: 1rem; }
        .gallery-preview-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 1rem; margin-bottom: 1rem; }
        .gallery-preview-item { height: 80px; border-radius: 0.5rem; overflow: hidden; position: relative; }
        .gallery-preview-item img { width: 100%; height: 100%; object-fit: cover; }
        .del-photo { position: absolute; inset: 0; background: rgba(239, 68, 68, 0.8); color: white; border: none; opacity: 0; transition: 0.2s; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .gallery-preview-item:hover .del-photo { opacity: 1; }
        .gallery-add-box { height: 80px; border: 2px dashed #cbd5e1; border-radius: 0.5rem; position: relative; display: flex; align-items: center; justify-content: center; color: #94a3b8; }
        .gallery-add-box input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
        .upload-hint { font-size: 0.75rem; color: #64748b; text-align: center; }

        .design-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: start; }
        .upload-box { border: 2px dashed #e2e8f0; border-radius: 1rem; padding: 2.5rem; text-align: center; color: var(--text-muted); position: relative; }
        .file-input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
        .color-picker-grid { display: flex; gap: 1rem; margin-top: 0.5rem; }
        .color-dot { width: 36px; height: 36px; border-radius: 50%; border: 3px solid white; cursor: pointer; box-shadow: 0 0 0 1px #e2e8f0; }
        .color-dot.active { box-shadow: 0 0 0 2px #000; transform: scale(1.1); }
        .hint-text { font-size: 0.8rem; color: #64748b; font-style: italic; }

        .design-preview { background: #f8fafc; padding: 2rem; border-radius: 1.5rem; }
        .mock-rsvp { background: white; border-radius: 1rem; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.05); }
        .mock-banner { height: 160px; display: flex; align-items: center; justify-content: center; color: #cbd5e1; }
        .mock-content { padding: 1.5rem; text-align: center; }
        .mock-content h3 { font-size: 1.25rem; margin-bottom: 0.5rem; color: #0f172a; }
        .mock-content p { font-size: 0.85rem; color: #64748b; margin-bottom: 1.5rem; }
        .mock-btn { color: white; padding: 0.75rem; border-radius: 0.5rem; font-weight: 700; font-size: 0.9rem; }
        
        .url-builder { max-width: 500px; margin: 0 auto; text-align: center; }
        .url-input-group { display: flex; align-items: center; background: #f1f5f9; border-radius: 0.75rem; border: 1px solid #e2e8f0; overflow: hidden; margin-bottom: 1rem; }
        .url-prefix { padding: 0 1.25rem; color: #64748b; font-weight: 700; border-right: 1px solid #e2e8f0; height: 100%; display: flex; align-items: center; }
        .url-builder input { border: none !important; background: transparent !important; flex: 1; }
        
        .checkout-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        .order-summary { padding: 2rem; background: #f0fdf4; border: 1px solid #dcfce7; }
        .order-summary h3 { font-size: 1.5rem; color: #064e3b; margin-bottom: 0.5rem; }
        .summary-date { font-weight: 600; color: #166534; }
        .summary-loc { margin-bottom: 1.5rem; color: #166534; opacity: 0.8; }
        .summary-badge { display: inline-block; padding: 0.4rem 1rem; border-radius: 2rem; font-size: 0.8rem; font-weight: 700; }
        
        .success-step { text-align: center; padding: 4rem 0; }
        .success-icon-bg { width: 90px; height: 90px; background: #dcfce7; color: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 2.5rem; }
        .live-link-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 1.25rem 2rem; border-radius: 1rem; display: inline-flex; align-items: center; gap: 1.5rem; margin-bottom: 3rem; font-weight: 700; }
        .copy-link { color: var(--primary); background: transparent; border: none; font-weight: 800; cursor: pointer; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
};

export default CreateRSVP;
