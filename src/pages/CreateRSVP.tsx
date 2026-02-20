import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Cake, Heart, ShieldAlert, Baby, GraduationCap, Users,
    ArrowRight, ArrowLeft, Upload, Check, Globe, CreditCard,
    Image as ImageIcon,
    Loader2, AlertCircle, Plus, Trash2, Camera, Palette
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

type EventType = 'Birthday' | 'Wedding' | 'Private Event' | 'Baby Shower' | 'Graduation' | 'Reunion' | null;


const WEDDING_MOTIF_COLORS = [
    '#c8a97e', '#d4a5a5', '#a8c5a0', '#9db4c0', '#c4b7d7',
    '#e8d5b7', '#b5cdd8', '#d4c5b0', '#f0e6d3', '#8b7355',
];

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
            // Common
            itinerary: [{ time: '', activity: '', location: '' }],
            gallery: [],
            // Wedding-specific
            partner1: '',
            partner2: '',
            welcomeMessage: '',
            story: '',
            colorMotif: ['#c8a97e', '#e8d5b7'],
            dressCode: '',
            parkingNote: '',
            giftNote: '',
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
        if (type === 'Birthday') setDesign(d => ({ ...d, themeColor: '#064e3b' }));
        if (type === 'Wedding') setDesign(d => ({ ...d, themeColor: '#c8a97e' }));
        nextStep();
    };

    const updateDetail = (key: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, details: { ...prev.details, [key]: value } }));
    };

    const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setLoading(true);
        try {
            const filePath = `banners/${Math.random()}.${file.name.split('.').pop()}`;
            const { error: uploadError } = await supabase.storage.from('event-assets').upload(filePath, file);
            if (uploadError) throw uploadError;
            const { data } = supabase.storage.from('event-assets').getPublicUrl(filePath);
            setDesign({ ...design, banner: data.publicUrl });
        } catch (err: any) { setError(err.message); }
        finally { setLoading(false); }
    };

    const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        setLoading(true);
        try {
            const newUrls = [...formData.details.gallery];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const filePath = `gallery/${Math.random()}.${file.name.split('.').pop()}`;
                const { error: uploadError } = await supabase.storage.from('event-assets').upload(filePath, file);
                if (uploadError) throw uploadError;
                const { data } = supabase.storage.from('event-assets').getPublicUrl(filePath);
                newUrls.push(data.publicUrl);
            }
            updateDetail('gallery', newUrls);
        } catch (err: any) { setError(err.message); }
        finally { setLoading(false); }
    };

    const addItineraryItem = () => updateDetail('itinerary', [...formData.details.itinerary, { time: '', activity: '', location: '' }]);
    const updateItineraryItem = (index: number, field: string, value: string) => {
        const items = [...formData.details.itinerary];
        items[index][field] = value;
        updateDetail('itinerary', items);
    };
    const removeItineraryItem = (index: number) => updateDetail('itinerary', formData.details.itinerary.filter((_: any, i: number) => i !== index));

    const toggleMotifColor = (color: string) => {
        const current: string[] = formData.details.colorMotif;
        if (current.includes(color)) {
            updateDetail('colorMotif', current.filter(c => c !== color));
        } else if (current.length < 5) {
            updateDetail('colorMotif', [...current, color]);
        }
    };

    const handleFinalPublish = async () => {
        if (!user) { setError("Please login to publish your event."); return; }
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
        } catch (err: any) { setError(err.message); }
        finally { setLoading(false); }
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
                        {/* STEP 1: Event Type */}
                        {step === 1 && (
                            <motion.div key="step1" className="builder-step" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
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

                        {/* STEP 2: Event Details (dynamic by type) */}
                        {step === 2 && (
                            <motion.div key="step2" className="builder-step" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                                <div className="step-header">
                                    <button className="back-btn" onClick={prevStep}><ArrowLeft size={20} /></button>
                                    <h2 className="builder-title">{eventType} Details</h2>
                                </div>
                                <div className="form-content">
                                    {/* Basic fields for all types */}
                                    <div className="form-group">
                                        <label>Event Name / Title</label>
                                        <input type="text" placeholder={eventType === 'Wedding' ? 'e.g. Carlo & Janine Wedding' : `e.g. ${eventType} of Aria`} value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
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
                                        <label>Main Venue / Location</label>
                                        <input type="text" placeholder="Enter full address" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                                    </div>

                                    {/* WEDDING-SPECIFIC FORM */}
                                    {eventType === 'Wedding' && (
                                        <>
                                            {/* Couple Names */}
                                            <div className="form-section-divider">
                                                <span>👫 Couple Details</span>
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Partner 1 Name</label>
                                                    <input type="text" placeholder="e.g. Carlo" value={formData.details.partner1} onChange={e => updateDetail('partner1', e.target.value)} />
                                                </div>
                                                <div className="form-group">
                                                    <label>Partner 2 Name</label>
                                                    <input type="text" placeholder="e.g. Janine" value={formData.details.partner2} onChange={e => updateDetail('partner2', e.target.value)} />
                                                </div>
                                            </div>

                                            {/* Welcome Message */}
                                            <div className="form-section-divider">
                                                <span>💌 Welcome To Our Wedding</span>
                                            </div>
                                            <div className="form-group">
                                                <label>Welcome Message</label>
                                                <textarea
                                                    className="form-textarea"
                                                    rows={3}
                                                    placeholder="e.g. We're so excited to share this day with you. Thank you for being part of our love story..."
                                                    value={formData.details.welcomeMessage}
                                                    onChange={e => updateDetail('welcomeMessage', e.target.value)}
                                                />
                                            </div>

                                            {/* Our Story */}
                                            <div className="form-section-divider">
                                                <span>📖 Our Love Story</span>
                                            </div>
                                            <div className="form-group">
                                                <label>Our Story</label>
                                                <textarea
                                                    className="form-textarea"
                                                    rows={4}
                                                    placeholder="Tell guests how you met, your journey, and what this day means to you..."
                                                    value={formData.details.story}
                                                    onChange={e => updateDetail('story', e.target.value)}
                                                />
                                            </div>

                                            {/* Order of Events / Itinerary */}
                                            <div className="form-section-divider">
                                                <span>🕊️ Order of Events</span>
                                            </div>
                                            <div className="dynamic-section">
                                                <div className="section-title-row">
                                                    <p className="hint-text">Add each part of your wedding day program</p>
                                                    <button className="add-btn-small" onClick={addItineraryItem}><Plus size={14} /> Add</button>
                                                </div>
                                                {formData.details.itinerary.map((item: any, idx: number) => (
                                                    <div key={idx} className="itinerary-row-wedding">
                                                        <input type="text" placeholder="Time (e.g. 3:00 PM)" value={item.time} onChange={e => updateItineraryItem(idx, 'time', e.target.value)} />
                                                        <input type="text" placeholder="Event (e.g. Ceremony)" value={item.activity} onChange={e => updateItineraryItem(idx, 'activity', e.target.value)} />
                                                        <input type="text" placeholder="Venue (optional)" value={item.location} onChange={e => updateItineraryItem(idx, 'location', e.target.value)} />
                                                        {formData.details.itinerary.length > 1 && (
                                                            <button className="remove-itinerary-btn" onClick={() => removeItineraryItem(idx)}><Trash2 size={14} /></button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Color Motif */}
                                            <div className="form-section-divider">
                                                <span><Palette size={16} /> Color Motif</span>
                                            </div>
                                            <div className="form-group">
                                                <label>Select up to 5 wedding colors</label>
                                                <div className="motif-color-grid">
                                                    {WEDDING_MOTIF_COLORS.map(color => (
                                                        <button
                                                            key={color}
                                                            className={`motif-swatch ${formData.details.colorMotif.includes(color) ? 'selected' : ''}`}
                                                            style={{ background: color }}
                                                            onClick={() => toggleMotifColor(color)}
                                                            title={color}
                                                        >
                                                            {formData.details.colorMotif.includes(color) && <Check size={14} color="white" />}
                                                        </button>
                                                    ))}
                                                </div>
                                                <div className="selected-motifs">
                                                    <p className="hint-text">Selected:&nbsp;
                                                        {formData.details.colorMotif.map((c: string) => (
                                                            <span key={c} style={{ display: 'inline-block', width: 16, height: 16, background: c, borderRadius: '50%', marginRight: 4 }} />
                                                        ))}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Dress Code */}
                                            <div className="form-section-divider">
                                                <span>👗 Dress Code</span>
                                            </div>
                                            <div className="form-group">
                                                <label>Dress Code Instructions</label>
                                                <textarea
                                                    className="form-textarea"
                                                    rows={2}
                                                    placeholder="e.g. We kindly request Formal Attire. Ladies, please avoid wearing white..."
                                                    value={formData.details.dressCode}
                                                    onChange={e => updateDetail('dressCode', e.target.value)}
                                                />
                                            </div>

                                            {/* Parking Note */}
                                            <div className="form-section-divider">
                                                <span>🚗 Parking Note</span>
                                            </div>
                                            <div className="form-group">
                                                <label>Travel & Parking Information</label>
                                                <textarea
                                                    className="form-textarea"
                                                    rows={3}
                                                    placeholder="e.g. Free parking is available at the venue. Valet service available for ₱150..."
                                                    value={formData.details.parkingNote}
                                                    onChange={e => updateDetail('parkingNote', e.target.value)}
                                                />
                                            </div>

                                            {/* Note on Gifts */}
                                            <div className="form-section-divider">
                                                <span>🎁 A Note on Gifts</span>
                                            </div>
                                            <div className="form-group">
                                                <label>Gift Message to Guests</label>
                                                <textarea
                                                    className="form-textarea"
                                                    rows={3}
                                                    placeholder="e.g. Your presence is the greatest gift! If you'd like to give something, a monetary gift or contribution to our honeymoon fund is deeply appreciated..."
                                                    value={formData.details.giftNote}
                                                    onChange={e => updateDetail('giftNote', e.target.value)}
                                                />
                                            </div>

                                            {/* Photo Gallery */}
                                            <div className="form-section-divider">
                                                <span>📸 Photo Gallery</span>
                                            </div>
                                            <div className="form-group">
                                                <label>Upload Wedding Photos (up to 6)</label>
                                                <div className="gallery-upload-container">
                                                    <div className="gallery-preview-grid">
                                                        {formData.details.gallery.map((url: string, i: number) => (
                                                            <div key={i} className="gallery-preview-item">
                                                                <img src={url} alt={`Gallery ${i}`} />
                                                                <button className="del-photo" onClick={() => updateDetail('gallery', formData.details.gallery.filter((_: any, idx: number) => idx !== i))}><Trash2 size={12} /></button>
                                                            </div>
                                                        ))}
                                                        {formData.details.gallery.length < 6 && (
                                                            <div className="gallery-add-box">
                                                                <Camera size={20} />
                                                                <input type="file" multiple accept="image/*" onChange={handleGalleryUpload} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    {loading && <p className="upload-hint">Uploading photos...</p>}
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* BIRTHDAY-SPECIFIC: Itinerary only */}
                                    {eventType === 'Birthday' && (
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

                                    <button className="btn btn-primary submit-btn" onClick={nextStep} disabled={!formData.title || !formData.date}>
                                        Next: Style & Design <ArrowRight size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 3: Design */}
                        {step === 3 && (
                            <motion.div key="step3" className="builder-step" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                                <div className="step-header">
                                    <button className="back-btn" onClick={prevStep}><ArrowLeft size={20} /></button>
                                    <h2 className="builder-title">Customize Design</h2>
                                </div>
                                <div className="design-grid">
                                    <div className="design-controls">
                                        <div className="form-group">
                                            <label>Hero Banner / Header Photo</label>
                                            <div className="upload-box">
                                                {design.banner ? <img src={design.banner} alt="Banner" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.75rem', position: 'absolute', inset: 0 }} /> : null}
                                                {loading ? <Loader2 className="animate-spin" /> : <Upload size={30} />}
                                                <p>{loading ? 'Uploading...' : design.banner ? 'Click to replace' : 'Click to upload banner'}</p>
                                                <input type="file" className="file-input" onChange={handleBannerUpload} disabled={loading} accept="image/*" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Template Accent Color</label>
                                            <div className="color-picker-grid">
                                                {(eventType === 'Wedding'
                                                    ? ['#c8a97e', '#b5887a', '#a8c5a0', '#9db4c0', '#c4b7d7', '#8b7355']
                                                    : ['#064e3b', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#ec4899', '#8b5cf6']
                                                ).map(c => (
                                                    <button key={c} className={`color-dot ${design.themeColor === c ? 'active' : ''}`} style={{ background: c }} onClick={() => setDesign({ ...design, themeColor: c })} />
                                                ))}
                                            </div>
                                            {eventType === 'Wedding' && <p className="hint-text mt-2">Wedding: Recommended warm gold tone</p>}
                                        </div>
                                        <button className="btn btn-primary submit-btn" onClick={nextStep}>
                                            Next: Choose URL <ArrowRight size={18} />
                                        </button>
                                    </div>
                                    <div className="design-preview">
                                        <div className="mock-rsvp glass-card">
                                            <div className="mock-banner" style={{ background: design.themeColor + '30', position: 'relative', overflow: 'hidden' }}>
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

                        {/* STEP 4: URL */}
                        {step === 4 && (
                            <motion.div key="step4" className="builder-step" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                                <div className="step-header">
                                    <button className="back-btn" onClick={prevStep}><ArrowLeft size={20} /></button>
                                    <h2 className="builder-title">Secure Your URL</h2>
                                </div>
                                <div className="url-builder">
                                    <div className="url-input-group">
                                        <span className="url-prefix">inviteuonline.vercel.app/</span>
                                        <input type="text" placeholder="your-event-name" value={slug} onChange={e => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))} />
                                    </div>
                                    <p className="url-hint">Keep it simple and memorable!</p>
                                    <button className="btn btn-primary submit-btn" onClick={nextStep} disabled={!slug}>
                                        Review & Publish <ArrowRight size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 5: Review & Payment */}
                        {step === 5 && (
                            <motion.div key="step5" className="builder-step" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
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
                                        {eventType === 'Wedding' && formData.details.colorMotif.length > 0 && (
                                            <div className="review-motif">
                                                <span>Color Motif:</span>
                                                {formData.details.colorMotif.map((c: string) => (
                                                    <span key={c} style={{ display: 'inline-block', width: 18, height: 18, background: c, borderRadius: '50%', marginLeft: 4 }} />
                                                ))}
                                            </div>
                                        )}
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

                        {/* STEP 6: Success */}
                        {step === 6 && (
                            <motion.div key="step6" className="builder-step success-step" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                                <div className="success-icon-bg"><Check size={40} /></div>
                                <h2 className="builder-title">{isPaid ? "It's LIVE! 🎉" : 'RSVP Saved as Draft'}</h2>
                                <div className="live-link-box">
                                    <Globe size={20} />
                                    <span>inviteuonline.vercel.app/{slug}</span>
                                    <button className="copy-link" onClick={() => navigator.clipboard.writeText(`inviteuonline.vercel.app/${slug}`)}>Copy</button>
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
        .step-progress { display: flex; justify-content: space-between; margin-bottom: 3rem; max-width: 800px; margin: 0 auto 3rem; }
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
        .back-btn { background: #f1f5f9; border: none; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--text-muted); cursor: pointer; flex-shrink: 0; }
        .form-content { display: flex; flex-direction: column; gap: 1.5rem; max-width: 650px; margin: 0 auto; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .form-group label { display: block; font-size: 0.85rem; font-weight: 700; color: #475569; margin-bottom: 0.5rem; text-transform: uppercase; }
        .form-group input, .form-textarea { width: 100%; padding: 1rem 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0; background: #f8fafc; font-size: 1rem; outline: none; transition: 0.3s; box-sizing: border-box; }
        .form-group input:focus, .form-textarea:focus { border-color: var(--primary); background: white; box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1); }
        .form-textarea { resize: vertical; font-family: inherit; }

        .form-section-divider { display: flex; align-items: center; gap: 1rem; color: #64748b; font-weight: 800; font-size: 0.95rem; padding: 0.5rem 0; border-bottom: 2px solid #f1f5f9; margin-top: 0.5rem; }

        .dynamic-section { background: #f8fafc; padding: 1.5rem; border-radius: 1rem; border: 1px solid #e2e8f0; }
        .section-title-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .add-btn-small { background: #10b981; color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 0.5rem; font-size: 0.75rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; }
        .relative { position: relative; }
        .remove-btn-small { position: absolute; right: 0.75rem; top: 1rem; background: #fee2e2; color: #ef4444; border: none; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; }

        .itinerary-row-wedding { display: grid; grid-template-columns: 120px 1fr 1fr 36px; gap: 0.75rem; margin-bottom: 0.75rem; align-items: center; }
        .itinerary-row-wedding input { padding: 0.75rem 1rem; border-radius: 0.6rem; border: 1px solid #e2e8f0; background: white; font-size: 0.9rem; }
        .remove-itinerary-btn { background: #fee2e2; color: #ef4444; border: none; width: 36px; height: 36px; border-radius: 0.6rem; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; }

        .motif-color-grid { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 0.5rem; }
        .motif-swatch { width: 40px; height: 40px; border-radius: 50%; border: 3px solid white; cursor: pointer; box-shadow: 0 0 0 1px #e2e8f0; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
        .motif-swatch.selected { box-shadow: 0 0 0 3px #0f172a; transform: scale(1.15); }
        .selected-motifs { margin-top: 0.75rem; display: flex; align-items: center; gap: 0.5rem; }
        
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
        .upload-box { border: 2px dashed #e2e8f0; border-radius: 1rem; padding: 2.5rem; text-align: center; color: var(--text-muted); position: relative; min-height: 140px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem; overflow: hidden; }
        .file-input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
        .color-picker-grid { display: flex; gap: 1rem; margin-top: 0.5rem; flex-wrap: wrap; }
        .color-dot { width: 36px; height: 36px; border-radius: 50%; border: 3px solid white; cursor: pointer; box-shadow: 0 0 0 1px #e2e8f0; }
        .color-dot.active { box-shadow: 0 0 0 2px #000; transform: scale(1.1); }
        .hint-text { font-size: 0.8rem; color: #64748b; font-style: italic; }
        .mt-2 { margin-top: 0.5rem; }

        .design-preview { background: #f8fafc; padding: 2rem; border-radius: 1.5rem; }
        .mock-rsvp { background: white; border-radius: 1rem; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.05); }
        .mock-banner { height: 160px; display: flex; align-items: center; justify-content: center; color: #cbd5e1; }
        .mock-content { padding: 1.5rem; text-align: center; }
        .mock-content h3 { font-size: 1.25rem; margin-bottom: 0.5rem; color: #0f172a; }
        .mock-content p { font-size: 0.85rem; color: #64748b; margin-bottom: 1.5rem; }
        .mock-btn { color: white; padding: 0.75rem; border-radius: 0.5rem; font-weight: 700; font-size: 0.9rem; }
        
        .url-builder { max-width: 500px; margin: 0 auto; text-align: center; }
        .url-input-group { display: flex; align-items: center; background: #f1f5f9; border-radius: 0.75rem; border: 1px solid #e2e8f0; overflow: hidden; margin-bottom: 1rem; }
        .url-prefix { padding: 0 1.25rem; color: #64748b; font-weight: 700; border-right: 1px solid #e2e8f0; height: 100%; display: flex; align-items: center; white-space: nowrap; font-size: 0.85rem; }
        .url-builder input { border: none !important; background: transparent !important; flex: 1; }
        
        .checkout-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        .order-summary { padding: 2rem; background: #f0fdf4; border: 1px solid #dcfce7; }
        .order-summary h3 { font-size: 1.5rem; color: #064e3b; margin-bottom: 0.5rem; }
        .summary-date { font-weight: 600; color: #166534; }
        .summary-loc { margin-bottom: 1.5rem; color: #166534; opacity: 0.8; }
        .summary-badge { display: inline-block; padding: 0.4rem 1rem; border-radius: 2rem; font-size: 0.8rem; font-weight: 700; }
        .review-motif { display: flex; align-items: center; gap: 0.5rem; margin-top: 1rem; font-size: 0.85rem; color: #475569; font-weight: 600; }
        .price-row { display: flex; justify-content: space-between; padding: 1rem 0; border-bottom: 1px solid #e2e8f0; font-weight: 600; }
        .price-row.total { font-size: 1.25rem; font-weight: 800; color: #0f172a; border-bottom: none; }
        .secure-text { text-align: center; font-size: 0.85rem; color: #64748b; margin-top: 1rem; }
        
        .success-step { text-align: center; padding: 4rem 0; }
        .success-icon-bg { width: 90px; height: 90px; background: #dcfce7; color: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 2.5rem; }
        .live-link-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 1.25rem 2rem; border-radius: 1rem; display: inline-flex; align-items: center; gap: 1.5rem; margin-bottom: 3rem; font-weight: 700; font-size: 0.9rem; }
        .copy-link { color: var(--primary); background: transparent; border: none; font-weight: 800; cursor: pointer; }
        .submit-btn { margin-top: 1rem; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
};

export default CreateRSVP;
