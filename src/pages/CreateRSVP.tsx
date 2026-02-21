import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Cake, Heart, ShieldAlert, Baby, GraduationCap, Users,
    ArrowRight, ArrowLeft, Upload, Check, Globe, CreditCard,
    Loader2, AlertCircle, Plus, Trash2, Camera
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
            itinerary: [{ time: '', label: '', desc: '' }],
            gallery: [],
            // Wedding-specific
            partner1: '',
            partner2: '',
            hashtag: '',
            welcomeMessage: '',
            story: '',
            colorMotif: ['#c8a97e', '#e8d5b7'],
            dressCode: '',
            parkingNote: '',
            giftNote: '',
            saveTheDateBanner: '',

            // Entourage
            entourage: {
                parents: '',
                principalSponsorsMale: [],
                principalSponsorsFemale: [],
                principalSponsorsSolo: '',
                bestMen: [],
                matronsOfHonor: [],
                candleSponsors: [],
                veilSponsors: [],
                cordSponsors: [],
                bibleSponsors: [],
                groomsmen: [],
                bridesmaids: [],
                flowerGirls: [],
                ringBearers: [],
                coinBearers: []
            },

            // Venues
            ceremonyVenue: '',
            ceremonyAddress: '',
            ceremonyTime: '',
            ceremonyMapUrl: '',
            receptionVenue: '',
            receptionAddress: '',
            receptionTime: '',
            receptionMapUrl: '',

            // Finer Details
            attireGuide: '',
            giftGuide: '',
            snapShare: '',

            // Backgrounds (color or url)
            heroBgType: 'image', heroBgValue: '',
            entourageBgType: 'color', entourageBgValue: '#faf5ee',
            detailsBgType: 'color', detailsBgValue: '#fffaf5',
            eventsBgType: 'color', eventsBgValue: '#faf5ee',
            finerBgType: 'color', finerBgValue: '#fffaf5',
            rsvpBgType: 'color', rsvpBgValue: '#fdf6ee',
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

    const updateEntourage = (key: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            details: {
                ...prev.details,
                entourage: { ...prev.details.entourage, [key]: value }
            }
        }));
    };

    const updateBackground = (section: string, type: 'image' | 'color', value: string) => {
        setFormData((prev: any) => ({
            ...prev,
            details: {
                ...prev.details,
                [`${section}BgType`]: type,
                [`${section}BgValue`]: value
            }
        }));
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

    const addItineraryItem = () => updateDetail('itinerary', [...formData.details.itinerary, { time: '', label: '', desc: '' }]);
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
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(s => (
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

                        {/* STEP 2: Basic Info */}
                        {step === 2 && (
                            <motion.div key="step2" className="builder-step" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                                <div className="step-header">
                                    <button className="back-btn" onClick={prevStep}><ArrowLeft size={20} /></button>
                                    <h2 className="builder-title">Basic Information</h2>
                                </div>
                                <div className="form-content">
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
                                    <div className="form-group">
                                        <label>Main Banner Image</label>
                                        <div className="mini-upload" style={{ width: '100%', height: '120px' }}>
                                            {design.banner ? (
                                                <img src={design.banner} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.6rem' }} alt="banner" />
                                            ) : (
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}><Upload size={20} /> <span>Upload Banner</span></div>
                                            )}
                                            <input type="file" onChange={handleBannerUpload} />
                                        </div>
                                    </div>
                                    <button className="btn btn-primary submit-btn" onClick={() => {
                                        if (eventType === 'Wedding') nextStep();
                                        else setStep(5); // Jump to Venues/Itinerary for others
                                    }} disabled={!formData.title || !formData.date}>
                                        Next Step <ArrowRight size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 3: Couple & Story (Wedding Only) */}
                        {step === 3 && eventType === 'Wedding' && (
                            <motion.div key="step3" className="builder-step" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                                <div className="step-header">
                                    <button className="back-btn" onClick={prevStep}><ArrowLeft size={20} /></button>
                                    <h2 className="builder-title">Couple & Love Story</h2>
                                </div>
                                <div className="form-content">
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
                                    <div className="form-group">
                                        <label>Wedding Hashtag</label>
                                        <input type="text" placeholder="e.g. #CarloAndJanine" value={formData.details.hashtag} onChange={e => updateDetail('hashtag', e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Welcome Message</label>
                                        <textarea rows={3} placeholder="Introduction to your guests..." value={formData.details.welcomeMessage} onChange={e => updateDetail('welcomeMessage', e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Our Story</label>
                                        <textarea rows={5} placeholder="How you met, your journey, etc..." value={formData.details.story} onChange={e => updateDetail('story', e.target.value)} />
                                    </div>
                                    <button className="btn btn-primary submit-btn" onClick={nextStep}>
                                        Next: Wedding Entourage <ArrowRight size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 4: Entourage (Wedding Only) */}
                        {step === 4 && eventType === 'Wedding' && (
                            <motion.div key="step4" className="builder-step" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                                <div className="step-header">
                                    <button className="back-btn" onClick={prevStep}><ArrowLeft size={20} /></button>
                                    <h2 className="builder-title">Wedding Entourage</h2>
                                </div>
                                <div className="form-content entourage-form">
                                    <div className="form-group">
                                        <label>Parents</label>
                                        <textarea rows={2} placeholder="Sovereign of the Ceremony..." value={formData.details.entourage.parents} onChange={e => updateEntourage('parents', e.target.value)} />
                                    </div>

                                    <div className="entourage-grid">
                                        <div className="ent-column">
                                            <label className="section-label">Principal Sponsors</label>
                                            <p className="hint-text">Separate names with commas</p>
                                            <textarea rows={3} placeholder="Mr. Juan, Mr. Jose..." value={formData.details.entourage.principalSponsorsMale.join(', ')} onChange={e => updateEntourage('principalSponsorsMale', e.target.value.split(',').map(n => n.trim()))} />
                                            <textarea rows={3} placeholder="Mrs. Juana, Ms. Maria..." value={formData.details.entourage.principalSponsorsFemale.join(', ')} onChange={e => updateEntourage('principalSponsorsFemale', e.target.value.split(',').map(n => n.trim()))} />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Best Men</label>
                                            <input type="text" placeholder="Names comma separated" value={formData.details.entourage.bestMen.join(', ')} onChange={e => updateEntourage('bestMen', e.target.value.split(',').map(n => n.trim()))} />
                                        </div>
                                        <div className="form-group">
                                            <label>Matrons of Honor</label>
                                            <input type="text" placeholder="Names comma separated" value={formData.details.entourage.matronsOfHonor.join(', ')} onChange={e => updateEntourage('matronsOfHonor', e.target.value.split(',').map(n => n.trim()))} />
                                        </div>
                                    </div>

                                    <div className="form-section-divider"><span>Secondary Sponsors</span></div>
                                    <div className="form-row">
                                        <div className="form-group"><label>Candle</label><input type="text" value={formData.details.entourage.candleSponsors.join(', ')} onChange={e => updateEntourage('candleSponsors', e.target.value.split(',').map(n => n.trim()))} /></div>
                                        <div className="form-group"><label>Veil</label><input type="text" value={formData.details.entourage.veilSponsors.join(', ')} onChange={e => updateEntourage('veilSponsors', e.target.value.split(',').map(n => n.trim()))} /></div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group"><label>Cord</label><input type="text" value={formData.details.entourage.cordSponsors.join(', ')} onChange={e => updateEntourage('cordSponsors', e.target.value.split(',').map(n => n.trim()))} /></div>
                                        <div className="form-group"><label>Bible</label><input type="text" value={formData.details.entourage.bibleSponsors.join(', ')} onChange={e => updateEntourage('bibleSponsors', e.target.value.split(',').map(n => n.trim()))} /></div>
                                    </div>

                                    <div className="form-section-divider"><span>Party</span></div>
                                    <div className="form-row">
                                        <div className="form-group"><label>Groomsmen</label><textarea value={formData.details.entourage.groomsmen.join(', ')} onChange={e => updateEntourage('groomsmen', e.target.value.split(',').map(n => n.trim()))} /></div>
                                        <div className="form-group"><label>Bridesmaids</label><textarea value={formData.details.entourage.bridesmaids.join(', ')} onChange={e => updateEntourage('bridesmaids', e.target.value.split(',').map(n => n.trim()))} /></div>
                                    </div>

                                    <button className="btn btn-primary submit-btn" onClick={nextStep}>Next step <ArrowRight size={18} /></button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 5: Venues & Program */}
                        {step === 5 && (
                            <motion.div key="step5" className="builder-step" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                                <div className="step-header">
                                    <button className="back-btn" onClick={prevStep}><ArrowLeft size={20} /></button>
                                    <h2 className="builder-title">Venues & Program</h2>
                                </div>
                                <div className="form-content">
                                    <div className="form-section-divider"><span>Ceremony</span></div>
                                    <div className="form-group"><label>Venue Name</label><input type="text" value={formData.details.ceremonyVenue} onChange={e => updateDetail('ceremonyVenue', e.target.value)} /></div>
                                    <div className="form-group"><label>Address</label><input type="text" value={formData.details.ceremonyAddress} onChange={e => updateDetail('ceremonyAddress', e.target.value)} /></div>
                                    <div className="form-row">
                                        <div className="form-group"><label>Time</label><input type="text" placeholder="e.g. 3:00 PM" value={formData.details.ceremonyTime} onChange={e => updateDetail('ceremonyTime', e.target.value)} /></div>
                                        <div className="form-group"><label>Map Link</label><input type="text" placeholder="Google Maps URL" value={formData.details.ceremonyMapUrl} onChange={e => updateDetail('ceremonyMapUrl', e.target.value)} /></div>
                                    </div>

                                    <div className="form-section-divider"><span>Reception</span></div>
                                    <div className="form-group"><label>Venue Name</label><input type="text" value={formData.details.receptionVenue} onChange={e => updateDetail('receptionVenue', e.target.value)} /></div>
                                    <div className="form-group"><label>Address</label><input type="text" value={formData.details.receptionAddress} onChange={e => updateDetail('receptionAddress', e.target.value)} /></div>
                                    <div className="form-row">
                                        <div className="form-group"><label>Time</label><input type="text" placeholder="e.g. 6:00 PM" value={formData.details.receptionTime} onChange={e => updateDetail('receptionTime', e.target.value)} /></div>
                                        <div className="form-group"><label>Map Link</label><input type="text" placeholder="Google Maps URL" value={formData.details.receptionMapUrl} onChange={e => updateDetail('receptionMapUrl', e.target.value)} /></div>
                                    </div>

                                    <div className="form-section-divider"><span>Order of Events</span></div>
                                    <div className="dynamic-section">
                                        <div className="section-title-row">
                                            <label>Timeline</label>
                                            <button className="add-btn-small" onClick={addItineraryItem}><Plus size={14} /> Add Event</button>
                                        </div>
                                        {formData.details.itinerary.map((item: any, idx: number) => (
                                            <div key={idx} className="itinerary-row-wedding">
                                                <input type="text" placeholder="T" value={item.time} onChange={e => updateItineraryItem(idx, 'time', e.target.value)} style={{ width: 80 }} />
                                                <input type="text" placeholder="Label (e.g. We Do)" value={item.label} onChange={e => updateItineraryItem(idx, 'label', e.target.value)} />
                                                <input type="text" placeholder="Desc (e.g. Ceremony)" value={item.desc} onChange={e => updateItineraryItem(idx, 'desc', e.target.value)} />
                                                {formData.details.itinerary.length > 1 && <button className="remove-itinerary-btn" onClick={() => removeItineraryItem(idx)}><Trash2 size={14} /></button>}
                                            </div>
                                        ))}
                                    </div>
                                    <button className="btn btn-primary submit-btn" onClick={nextStep}>Next step <ArrowRight size={18} /></button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 6: Finer Details & Background Customization */}
                        {step === 6 && (
                            <motion.div key="step6" className="builder-step" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                                <div className="step-header">
                                    <button className="back-btn" onClick={prevStep}><ArrowLeft size={20} /></button>
                                    <h2 className="builder-title">Finer Details & Section Backgrounds</h2>
                                </div>
                                <div className="form-content">
                                    <div className="form-group"><label>👗 Attire Guide</label><textarea rows={3} value={formData.details.attireGuide} onChange={e => updateDetail('attireGuide', e.target.value)} /></div>
                                    <div className="form-group"><label>🎁 Gift Guide</label><textarea rows={3} value={formData.details.giftNote} onChange={e => updateDetail('giftNote', e.target.value)} /></div>
                                    <div className="form-group"><label>📸 Snap & Share Note</label><textarea rows={3} value={formData.details.snapShare} onChange={e => updateDetail('snapShare', e.target.value)} /></div>

                                    <div className="form-section-divider"><span>Section Backgrounds</span></div>
                                    <p className="hint-text mb-4">Users can select color or upload image background for each section.</p>

                                    {['Hero', 'Entourage', 'Details', 'Events', 'Finer', 'RSVP'].map((section) => (
                                        <div key={section} className="bg-setter-row">
                                            <label className="section-label">{section} Section</label>
                                            <div className="bg-options">
                                                <button className={`bg-opt ${formData.details[`${section.toLowerCase()}BgType`] === 'color' ? 'active' : ''}`} onClick={() => updateBackground(section.toLowerCase(), 'color', formData.details[`${section.toLowerCase()}BgValue`] || '#ffffff')}>Color</button>
                                                <button className={`bg-opt ${formData.details[`${section.toLowerCase()}BgType`] === 'image' ? 'active' : ''}`} onClick={() => updateBackground(section.toLowerCase(), 'image', '')}>Image</button>
                                            </div>
                                            {formData.details[`${section.toLowerCase()}BgType`] === 'color' ? (
                                                <input type="color" value={formData.details[`${section.toLowerCase()}BgValue`] || '#ffffff'} onChange={(e) => updateBackground(section.toLowerCase(), 'color', e.target.value)} className="color-input-mini" />
                                            ) : (
                                                <div className="mini-upload">
                                                    <Upload size={14} />
                                                    <input type="file" onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (!file) return;
                                                        const path = `bg-${section.toLowerCase()}/${Date.now()}-${file.name}`;
                                                        const { error: upErr } = await supabase.storage.from('event-assets').upload(path, file);
                                                        if (!upErr) {
                                                            const { data } = supabase.storage.from('event-assets').getPublicUrl(path);
                                                            updateBackground(section.toLowerCase(), 'image', data.publicUrl);
                                                        }
                                                    }} />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    <button className="btn btn-primary submit-btn" onClick={nextStep}>Next step <ArrowRight size={18} /></button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 7: Style & Gallery (Original Step 3 mapping) */}
                        {step === 7 && (
                            <motion.div key="step7" className="builder-step" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                                <div className="step-header">
                                    <button className="back-btn" onClick={prevStep}><ArrowLeft size={20} /></button>
                                    <h2 className="builder-title">Style & Gallery</h2>
                                </div>
                                <div className="form-content">
                                    <div className="form-group">
                                        <label>Main Photo Gallery</label>
                                        <div className="gallery-upload-container">
                                            <div className="gallery-preview-grid">
                                                {formData.details.gallery.map((url: string, i: number) => (
                                                    <div key={i} className="gallery-preview-item">
                                                        <img src={url} alt={`Gallery ${i}`} />
                                                        <button className="del-photo" onClick={() => updateDetail('gallery', formData.details.gallery.filter((_: any, idx: number) => idx !== i))}><Trash2 size={12} /></button>
                                                    </div>
                                                ))}
                                                {formData.details.gallery.length < 12 && (
                                                    <div className="gallery-add-box"><Camera size={20} /><input type="file" multiple accept="image/*" onChange={handleGalleryUpload} /></div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Color Motif Selection</label>
                                        <div className="motif-color-grid">
                                            {WEDDING_MOTIF_COLORS.map(color => (
                                                <button key={color} className={`motif-swatch ${formData.details.colorMotif.includes(color) ? 'selected' : ''}`} style={{ background: color }} onClick={() => toggleMotifColor(color)} />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Accent Color</label>
                                        <div className="color-picker-grid">
                                            {['#c8a97e', '#b5887a', '#a8c5a0', '#9db4c0', '#c4b7d7', '#8b7355'].map(c => (
                                                <button key={c} className={`color-dot ${design.themeColor === c ? 'active' : ''}`} style={{ background: c }} onClick={() => setDesign({ ...design, themeColor: c })} />
                                            ))}
                                        </div>
                                    </div>
                                    <button className="btn btn-primary submit-btn" onClick={nextStep}>Next: URL & Publish <ArrowRight size={18} /></button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 8: URL & Review (Original Step 4/5 mapping) */}
                        {step === 8 && (
                            <motion.div key="step8" className="builder-step" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                                <div className="step-header">
                                    <button className="back-btn" onClick={prevStep}><ArrowLeft size={20} /></button>
                                    <h2 className="builder-title">Final Review & URL</h2>
                                </div>
                                <div className="url-builder" style={{ marginBottom: '2rem' }}>
                                    <div className="url-input-group">
                                        <span className="url-prefix">inviteuonline.vercel.app/</span>
                                        <input type="text" placeholder="your-event-url" value={slug} onChange={e => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))} />
                                    </div>
                                </div>
                                <div className="checkout-grid">
                                    <div className="order-summary glass-card">
                                        <h3>{formData.title}</h3>
                                        <p className="summary-date">{formData.date} at {formData.time}</p>
                                        <p className="summary-loc">{formData.location}</p>
                                        <div className="summary-badge" style={{ background: design.themeColor + '20', color: design.themeColor }}>{eventType} Template</div>
                                    </div>
                                    <div className="payment-section">
                                        <div className="price-row total"><span>Total Publication Fee</span><span>$19.00</span></div>
                                        <button className="btn btn-primary submit-btn" onClick={handleFinalPublish} disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : <><CreditCard size={18} /> Publish Now</>}</button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 9: Success */}
                        {step === 9 && (
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

        .form-section-divider { display: flex; align-items: center; gap: 1rem; margin: 2rem 0 1rem; color: #94a3b8; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
        .form-section-divider::after { content: ''; flex: 1; height: 1px; background: #eaeff5; }
        
        .entourage-form textarea { width: 100%; border-radius: 0.75rem; border: 1px solid #e2e8f0; padding: 1rem; font-size: 0.95rem; margin-top: 0.5rem; }
        .itinerary-row-wedding { display: grid; grid-template-columns: 100px 1fr 1fr 36px; gap: 0.75rem; margin-bottom: 0.75rem; align-items: center; }
        .itinerary-row-wedding input { padding: 0.75rem 1rem !important; font-size: 0.9rem !important; }
        .remove-itinerary-btn { background: #fee2e2; color: #ef4444; border: none; width: 36px; height: 36px; border-radius: 0.6rem; display: flex; align-items: center; justify-content: center; cursor: pointer; }

        .bg-setter-row { display: flex; align-items: center; gap: 1rem; padding: 1.25rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 1rem; margin-bottom: 0.75rem; }
        .bg-options { display: flex; gap: 0.4rem; }
        .bg-opt { padding: 0.5rem 0.75rem; border-radius: 0.5rem; border: 1px solid #e2e8f0; background: white; font-size: 0.75rem; font-weight: 700; cursor: pointer; transition: 0.2s; }
        .bg-opt.active { background: #10b981; color: white; border-color: #10b981; }
        .color-input-mini { width: 36px; height: 36px; border: 3px solid white; border-radius: 50%; padding: 0; cursor: pointer; box-shadow: 0 0 0 1px #e2e8f0; }
        .mini-upload { position: relative; width: 36px; height: 36px; background: white; border: 1px solid #e2e8f0; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; color: #64748b; }
        .mini-upload input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }

        .section-label { min-width: 110px; font-weight: 800; color: #334155; font-size: 0.85rem; text-transform: uppercase; }
        .hint-text { font-size: 0.8rem; color: #64748b; margin-bottom: 0.5rem; font-style: italic; }

        .motif-color-grid { display: flex; gap: 0.5rem; flex-wrap: wrap; margin: 1rem 0; }
        .motif-swatch { width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; cursor: pointer; box-shadow: 0 0 0 1px #e2e8f0; }
        .motif-swatch.selected { box-shadow: 0 0 0 2px #0f172a; transform: scale(1.1); }

        .gallery-preview-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 1rem; margin-top: 1rem; }
        .gallery-preview-item { aspect-ratio: 1; border-radius: 0.75rem; overflow: hidden; position: relative; }
        .gallery-preview-item img { width: 100%; height: 100%; object-fit: cover; }
        .del-photo { position: absolute; inset: 0; background: rgba(239, 68, 68, 0.85); color: white; border: none; opacity: 0; transition: 0.2s; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .gallery-preview-item:hover .del-photo { opacity: 1; }
        .gallery-add-box { aspect-ratio: 1; border: 2px dashed #cbd5e1; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; color: #94a3b8; position: relative; transition: 0.2s; }
        .gallery-add-box:hover { border-color: var(--primary); color: var(--primary); }
        .gallery-add-box input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }

        .url-builder { max-width: 500px; margin: 0 auto; text-align: center; }
        .url-input-group { display: flex; align-items: center; background: #f1f5f9; border-radius: 0.75rem; border: 1px solid #e2e8f0; overflow: hidden; margin-bottom: 1rem; }
        .url-prefix { padding: 0 1.25rem; color: #64748b; font-weight: 700; border-right: 1px solid #eaeff5; height: 48px; display: flex; align-items: center; white-space: nowrap; font-size: 0.85rem; }
        .url-input-group input { border: none !important; background: transparent !important; flex: 1; height: 48px; padding: 0 1rem !important; }
        
        .checkout-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; max-width: 900px; margin: 0 auto; }
        @media (max-width: 800px) { .checkout-grid { grid-template-columns: 1fr; } .itinerary-row-wedding { grid-template-columns: 1fr; gap: 0.5rem; } .bg-setter-row { flex-direction: column; align-items: flex-start; } }

        .order-summary { padding: 2rem; background: #fff; border: 1px solid #e2e8f0; }
        .order-summary h3 { font-size: 1.5rem; color: #0f172a; margin-bottom: 0.5rem; }
        .summary-date { font-weight: 600; color: #64748b; }
        .summary-loc { margin-bottom: 1.5rem; color: #94a3b8; }
        .summary-badge { display: inline-block; padding: 0.4rem 1rem; border-radius: 2rem; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; }
        .price-row { display: flex; justify-content: space-between; padding: 1rem 0; font-weight: 700; color: #475569; }
        .price-row.total { font-size: 1.4rem; font-weight: 900; color: #0f172a; }
        
        .success-step { text-align: center; padding: 4rem 0; }
        .success-icon-bg { width: 90px; height: 90px; background: #dcfce7; color: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 2.5rem; }
        .live-link-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 1.25rem 2rem; border-radius: 1rem; display: inline-flex; align-items: center; gap: 1.5rem; margin-bottom: 3rem; font-weight: 700; font-size: 0.9rem; }
        .copy-link { color: var(--primary); background: transparent; border: none; font-weight: 800; cursor: pointer; }
        
        .submit-btn { width: 100%; height: 56px; margin-top: 1rem; font-size: 1rem; font-weight: 800; border-radius: 1rem; display: flex; align-items: center; justify-content: center; gap: 0.75rem; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
};

export default CreateRSVP;
