import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ArrowLeft, Save, Loader2, AlertCircle,
    MapPin, Calendar, Clock, Plus, Trash2, Upload
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const EditRSVP: React.FC = () => {
    const { slug: urlSlug } = useParams<{ slug: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [eventType, setEventType] = useState<string>('');

    const [formData, setFormData] = useState<any>({
        title: '',
        date: '',
        time: '',
        location: '',
        description: '',
        theme_color: '#10b981',
        banner_url: '',
        details: {
            itinerary: [{ time: '', label: '', desc: '' }],
            gallery: [],
            partner1: '',
            partner2: '',
            hashtag: '',
            welcomeMessage: '',
            story: '',
            colorMotif: [],
            dressCode: '',
            parkingNote: '',
            giftNote: '',
            saveTheDateBanner: '',
            entourage: {
                parents: '', principalSponsorsMale: [], principalSponsorsFemale: [], bestMen: [], matronsOfHonor: [],
                candleSponsors: [], veilSponsors: [], cordSponsors: [], bibleSponsors: [], groomsmen: [], bridesmaids: []
            },
            ceremonyVenue: '', ceremonyAddress: '', ceremonyTime: '', ceremonyMapUrl: '',
            receptionVenue: '', receptionAddress: '', receptionTime: '', receptionMapUrl: '',
            attireGuide: '', snapShare: '',
            heroBgType: 'image', heroBgValue: '', entourageBgType: 'color', entourageBgValue: '',
            detailsBgType: 'color', detailsBgValue: '', eventsBgType: 'color', eventsBgValue: '',
            finerBgType: 'color', finerBgValue: '', rsvpBgType: 'color', rsvpBgValue: '',
        }
    });

    useEffect(() => {
        const fetchEvent = async () => {
            if (!user || !urlSlug) return;

            try {
                const { data, error } = await supabase
                    .from('events')
                    .select('*')
                    .eq('slug', urlSlug)
                    .eq('user_id', user.id)
                    .single();

                if (error) throw error;

                setEventType(data.event_type);
                const d = data.event_details || {};
                const ent = d.entourage || {};

                setFormData({
                    title: data.title,
                    date: data.event_date.split('T')[0],
                    time: data.event_date.split('T')[1]?.substring(0, 5) || '12:00',
                    location: data.location,
                    description: data.description || '',
                    theme_color: data.theme_color,
                    banner_url: data.banner_url || '',
                    details: {
                        itinerary: d.itinerary || [{ time: '', label: '', desc: '' }],
                        gallery: d.gallery || [],
                        partner1: d.partner1 || '',
                        partner2: d.partner2 || '',
                        hashtag: d.hashtag || '',
                        welcomeMessage: d.welcomeMessage || '',
                        story: d.story || '',
                        colorMotif: d.colorMotif || [],
                        dressCode: d.dressCode || '',
                        parkingNote: d.parkingNote || '',
                        giftNote: d.giftNote || '',
                        saveTheDateBanner: d.saveTheDateBanner || '',
                        entourage: {
                            parents: ent.parents || '',
                            principalSponsorsMale: ent.principalSponsorsMale || [],
                            principalSponsorsFemale: ent.principalSponsorsFemale || [],
                            bestMen: ent.bestMen || [],
                            matronsOfHonor: ent.matronsOfHonor || [],
                            candleSponsors: ent.candleSponsors || [],
                            veilSponsors: ent.veilSponsors || [],
                            cordSponsors: ent.cordSponsors || [],
                            bibleSponsors: ent.bibleSponsors || [],
                            groomsmen: ent.groomsmen || [],
                            bridesmaids: ent.bridesmaids || [],
                            flowerGirls: ent.flowerGirls || [],
                            ringBearers: ent.ringBearers || [],
                            coinBearers: ent.coinBearers || []
                        },
                        ceremonyVenue: d.ceremonyVenue || '', ceremonyAddress: d.ceremonyAddress || '', ceremonyTime: d.ceremonyTime || '', ceremonyMapUrl: d.ceremonyMapUrl || '',
                        receptionVenue: d.receptionVenue || '', receptionAddress: d.receptionAddress || '', receptionTime: d.receptionTime || '', receptionMapUrl: d.receptionMapUrl || '',
                        attireGuide: d.attireGuide || '', snapShare: d.snapShare || '',
                        heroBgType: d.heroBgType || 'image', heroBgValue: d.heroBgValue || '',
                        entourageBgType: d.entourageBgType || 'color', entourageBgValue: d.entourageBgValue || '',
                        detailsBgType: d.detailsBgType || 'color', detailsBgValue: d.detailsBgValue || '',
                        eventsBgType: d.eventsBgType || 'color', eventsBgValue: d.eventsBgValue || '',
                        finerBgType: d.finerBgType || 'color', finerBgValue: d.finerBgValue || '',
                        rsvpBgType: d.rsvpBgType || 'color', rsvpBgValue: d.rsvpBgValue || '',
                    }
                });
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [user, urlSlug]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const { error: updateError } = await supabase
                .from('events')
                .update({
                    title: formData.title,
                    event_date: `${formData.date}T${formData.time}`,
                    location: formData.location,
                    description: formData.description,
                    theme_color: formData.theme_color,
                    banner_url: formData.banner_url,
                    event_details: formData.details
                })
                .eq('slug', urlSlug)
                .eq('user_id', user?.id);

            if (updateError) throw updateError;
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSaving(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `banners/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('event-assets')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('event-assets').getPublicUrl(filePath);
            setFormData({ ...formData, banner_url: data.publicUrl });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const addItineraryItem = () => {
        const items = [...formData.details.itinerary, { time: '', label: '', desc: '' }];
        setFormData({ ...formData, details: { ...formData.details, itinerary: items } });
    };

    const updateItineraryItem = (index: number, field: string, value: string) => {
        const items = [...formData.details.itinerary];
        items[index][field] = value;
        setFormData({ ...formData, details: { ...formData.details, itinerary: items } });
    };

    const removeItineraryItem = (index: number) => {
        const items = formData.details.itinerary.filter((_: any, i: number) => i !== index);
        setFormData({ ...formData, details: { ...formData.details, itinerary: items } });
    };

    const updateEntourage = (key: string, value: any) => {
        setFormData({
            ...formData,
            details: {
                ...formData.details,
                entourage: { ...formData.details.entourage, [key]: value }
            }
        });
    };

    const updateBackground = (section: string, type: 'image' | 'color', value: string) => {
        setFormData({
            ...formData,
            details: {
                ...formData.details,
                [`${section}BgType`]: type,
                [`${section}BgValue`]: value
            }
        });
    };

    const updateDetail = (key: string, value: any) => {
        setFormData({
            ...formData,
            details: { ...formData.details, [key]: value }
        });
    };

    if (loading) return (
        <div className="edit-loading">
            <Loader2 className="animate-spin" size={40} color="#10b981" />
            <p>Loading event details...</p>
        </div>
    );

    return (
        <div className="edit-rsvp-page section-padding">
            <div className="container max-w-3xl">
                <header className="edit-header">
                    <Link to="/dashboard" className="back-link"><ArrowLeft size={18} /> Back to Dashboard</Link>
                    <h1>Edit Your Event</h1>
                    <div className="template-type-indicator" style={{ background: formData.theme_color + '20', color: formData.theme_color }}>
                        {eventType} Template active
                    </div>
                </header>

                {error && (
                    <div className="error-banner">
                        <AlertCircle size={20} /> {error}
                    </div>
                )}

                <form onSubmit={handleUpdate} className="edit-grid">
                    <div className="edit-form-main glass-card">
                        <section className="edit-section">
                            <h3>Basic Information</h3>
                            <div className="form-group">
                                <label>Event Title</label>
                                <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label><Calendar size={14} /> Date</label>
                                    <input type="date" required value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label><Clock size={14} /> Time</label>
                                    <input type="time" required value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label><MapPin size={14} /> Location</label>
                                <input type="text" required value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                            </div>
                        </section>

                        <section className="edit-section">
                            <h3>Program / Itinerary</h3>
                            <div className="itinerary-edit-list">
                                {formData.details.itinerary.map((item: any, idx: number) => (
                                    <div key={idx} className="itinerary-row-edit" style={{ gridTemplateColumns: '80px 1fr 1fr 44px' }}>
                                        <input type="text" placeholder="Time" value={item.time} onChange={e => updateItineraryItem(idx, 'time', e.target.value)} />
                                        <input type="text" placeholder="Label" value={item.label} onChange={e => updateItineraryItem(idx, 'label', e.target.value)} />
                                        <input type="text" placeholder="Desc" value={item.desc} onChange={e => updateItineraryItem(idx, 'desc', e.target.value)} />
                                        <button type="button" className="remove-btn" onClick={() => removeItineraryItem(idx)}><Trash2 size={16} /></button>
                                    </div>
                                ))}
                                <button type="button" className="add-btn-outline" onClick={addItineraryItem}><Plus size={16} /> Add Program Item</button>
                            </div>
                        </section>

                        {eventType === 'Wedding' && (
                            <>
                                <section className="edit-section">
                                    <h3>💍 Wedding Details</h3>
                                    <div className="form-row">
                                        <div className="form-group"><label>Partner 1 (Bride)</label><input type="text" value={formData.details.partner1} onChange={e => setFormData({ ...formData, details: { ...formData.details, partner1: e.target.value } })} /></div>
                                        <div className="form-group"><label>Partner 2 (Groom)</label><input type="text" value={formData.details.partner2} onChange={e => setFormData({ ...formData, details: { ...formData.details, partner2: e.target.value } })} /></div>
                                    </div>
                                    <div className="form-group"><label>Hashtag</label><input type="text" value={formData.details.hashtag} onChange={e => setFormData({ ...formData, details: { ...formData.details, hashtag: e.target.value } })} /></div>
                                    <div className="form-group"><label>Welcome Message</label><textarea rows={3} value={formData.details.welcomeMessage} onChange={e => setFormData({ ...formData, details: { ...formData.details, welcomeMessage: e.target.value } })} /></div>
                                    <div className="form-group"><label>Love Story</label><textarea rows={5} value={formData.details.story} onChange={e => setFormData({ ...formData, details: { ...formData.details, story: e.target.value } })} /></div>
                                </section>

                                <section className="edit-section">
                                    <h3>👥 Wedding Entourage</h3>
                                    <div className="form-group"><label>Parents</label><textarea rows={2} value={formData.details.entourage.parents} onChange={e => updateEntourage('parents', e.target.value)} /></div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Principal Sponsors (Male)</label>
                                            <textarea rows={3} placeholder="Comma separated" value={formData.details.entourage.principalSponsorsMale.join(', ')} onChange={e => updateEntourage('principalSponsorsMale', e.target.value.split(',').map(n => n.trim()))} />
                                        </div>
                                        <div className="form-group">
                                            <label>Principal Sponsors (Female)</label>
                                            <textarea rows={3} placeholder="Comma separated" value={formData.details.entourage.principalSponsorsFemale.join(', ')} onChange={e => updateEntourage('principalSponsorsFemale', e.target.value.split(',').map(n => n.trim()))} />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group"><label>Best Men</label><input type="text" value={formData.details.entourage.bestMen.join(', ')} onChange={e => updateEntourage('bestMen', e.target.value.split(',').map(n => n.trim()))} /></div>
                                        <div className="form-group"><label>Matrons of Honor</label><input type="text" value={formData.details.entourage.matronsOfHonor.join(', ')} onChange={e => updateEntourage('matronsOfHonor', e.target.value.split(',').map(n => n.trim()))} /></div>
                                    </div>

                                    <div className="edit-subheader">Secondary Sponsors</div>
                                    <div className="form-row">
                                        <div className="form-group"><label>Candle</label><input type="text" value={formData.details.entourage.candleSponsors.join(', ')} onChange={e => updateEntourage('candleSponsors', e.target.value.split(',').map(n => n.trim()))} /></div>
                                        <div className="form-group"><label>Veil</label><input type="text" value={formData.details.entourage.veilSponsors.join(', ')} onChange={e => updateEntourage('veilSponsors', e.target.value.split(',').map(n => n.trim()))} /></div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group"><label>Cord</label><input type="text" value={formData.details.entourage.cordSponsors.join(', ')} onChange={e => updateEntourage('cordSponsors', e.target.value.split(',').map(n => n.trim()))} /></div>
                                        <div className="form-group"><label>Bible</label><input type="text" value={formData.details.entourage.bibleSponsors.join(', ')} onChange={e => updateEntourage('bibleSponsors', e.target.value.split(',').map(n => n.trim()))} /></div>
                                    </div>

                                    <div className="edit-subheader">Party</div>
                                    <div className="form-row">
                                        <div className="form-group"><label>Groomsmen</label><textarea value={formData.details.entourage.groomsmen.join(', ')} onChange={e => updateEntourage('groomsmen', e.target.value.split(',').map(n => n.trim()))} /></div>
                                        <div className="form-group"><label>Bridesmaids</label><textarea value={formData.details.entourage.bridesmaids.join(', ')} onChange={e => updateEntourage('bridesmaids', e.target.value.split(',').map(n => n.trim()))} /></div>
                                    </div>
                                </section>

                                <section className="edit-section">
                                    <h3>📍 Venues</h3>
                                    <div className="edit-subheader">Ceremony</div>
                                    <div className="form-group"><label>Venue</label><input type="text" value={formData.details.ceremonyVenue} onChange={e => updateDetail('ceremonyVenue', e.target.value)} /></div>
                                    <div className="form-group"><label>Address</label><input type="text" value={formData.details.ceremonyAddress} onChange={e => updateDetail('ceremonyAddress', e.target.value)} /></div>
                                    <div className="form-row">
                                        <div className="form-group"><label>Time</label><input type="text" value={formData.details.ceremonyTime} onChange={e => updateDetail('ceremonyTime', e.target.value)} /></div>
                                        <div className="form-group"><label>Map URL</label><input type="text" value={formData.details.ceremonyMapUrl} onChange={e => updateDetail('ceremonyMapUrl', e.target.value)} /></div>
                                    </div>

                                    <div className="edit-subheader">Reception</div>
                                    <div className="form-group"><label>Venue</label><input type="text" value={formData.details.receptionVenue} onChange={e => updateDetail('receptionVenue', e.target.value)} /></div>
                                    <div className="form-group"><label>Address</label><input type="text" value={formData.details.receptionAddress} onChange={e => updateDetail('receptionAddress', e.target.value)} /></div>
                                    <div className="form-row">
                                        <div className="form-group"><label>Time</label><input type="text" value={formData.details.receptionTime} onChange={e => updateDetail('receptionTime', e.target.value)} /></div>
                                        <div className="form-group"><label>Map URL</label><input type="text" value={formData.details.receptionMapUrl} onChange={e => updateDetail('receptionMapUrl', e.target.value)} /></div>
                                    </div>
                                </section>

                                <section className="edit-section">
                                    <h3>🎨 Section Backgrounds</h3>
                                    <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>Customize the background of each page section.</p>
                                    {['Hero', 'Entourage', 'Details', 'Events', 'Finer', 'RSVP'].map(section => (
                                        <div key={section} className="bg-edit-row">
                                            <span style={{ fontWeight: 700, minWidth: 100 }}>{section}</span>
                                            <div className="bg-type-toggle">
                                                <button type="button" className={formData.details[`${section.toLowerCase()}BgType`] === 'color' ? 'active' : ''} onClick={() => updateBackground(section.toLowerCase(), 'color', formData.details[`${section.toLowerCase()}BgValue`] || '#ffffff')}>Color</button>
                                                <button type="button" className={formData.details[`${section.toLowerCase()}BgType`] === 'image' ? 'active' : ''} onClick={() => updateBackground(section.toLowerCase(), 'image', '')}>Image</button>
                                            </div>
                                            {formData.details[`${section.toLowerCase()}BgType`] === 'color' ? (
                                                <input type="color" className="color-mini" value={formData.details[`${section.toLowerCase()}BgValue`] || '#ffffff'} onChange={e => updateBackground(section.toLowerCase(), 'color', e.target.value)} />
                                            ) : (
                                                <div className="mini-upload-edit">
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
                                </section>

                                <section className="edit-section">
                                    <h3>✨ Finer Details</h3>
                                    <div className="form-group"><label>Attire Guide</label><textarea rows={3} value={formData.details.attireGuide} onChange={e => updateDetail('attireGuide', e.target.value)} /></div>
                                    <div className="form-group"><label>Gift Guide / Note</label><textarea rows={3} value={formData.details.giftNote} onChange={e => updateDetail('giftNote', e.target.value)} /></div>
                                    <div className="form-group"><label>Snap & Share Note</label><textarea rows={3} value={formData.details.snapShare} onChange={e => updateDetail('snapShare', e.target.value)} /></div>
                                </section>
                            </>
                        )}
                    </div>

                    <div className="edit-sidebar">
                        <div className="sidebar-card glass-card">
                            <h3>Design & Style</h3>
                            <div className="form-group">
                                <label>Banner Image</label>
                                <div className="banner-edit-preview">
                                    <img src={formData.banner_url || 'https://via.placeholder.com/300x150'} alt="Preview" />
                                    <div className="replace-overlay">
                                        <Upload size={18} />
                                        <input type="file" onChange={handleBannerUpload} />
                                    </div>
                                </div>
                            </div>
                            {eventType === 'Wedding' && (
                                <div className="form-group">
                                    <label>Save The Date Background</label>
                                    <div className="banner-edit-preview">
                                        <img src={formData.details.saveTheDateBanner || 'https://via.placeholder.com/300x150'} alt="STD Preview" />
                                        <div className="replace-overlay">
                                            <Upload size={18} />
                                            <input
                                                type="file"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;
                                                    setSaving(true);
                                                    try {
                                                        const path = `std-banners/${user?.id}/${Date.now()}-${file.name}`;
                                                        const { error: upErr } = await supabase.storage.from('event-assets').upload(path, file);
                                                        if (upErr) throw upErr;
                                                        const { data: { publicUrl } } = supabase.storage.from('event-assets').getPublicUrl(path);
                                                        setFormData({ ...formData, details: { ...formData.details, saveTheDateBanner: publicUrl } });
                                                    } catch (err: any) {
                                                        setError(err.message);
                                                    } finally {
                                                        setSaving(false);
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="form-group">
                                <label>Theme Color</label>
                                <div className="color-picker-grid">
                                    {['#064e3b', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#ec4899', '#8b5cf6'].map(c => (
                                        <button key={c} type="button" className={`color-dot ${formData.theme_color === c ? 'active' : ''}`} style={{ background: c }} onClick={() => setFormData({ ...formData, theme_color: c })} />
                                    ))}
                                </div>
                            </div>
                            <div className="edit-action-btns">
                                <button type="submit" className="btn btn-primary w-full" disabled={saving}>
                                    {saving ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Save Changes</>}
                                </button>
                                <Link to="/dashboard" className="btn btn-outline w-full">Cancel</Link>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <style>{`
        .edit-rsvp-page { padding-top: 100px; min-height: 100vh; background: #f8fafc; padding-bottom: 5rem; }
        .edit-loading { height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; }
        
        .max-w-3xl { max-width: 1000px; margin: 0 auto; }
        .edit-header { margin-bottom: 2.5rem; }
        .edit-header h1 { font-size: 2.5rem; color: #0f172a; margin: 0.5rem 0; font-weight: 900; }
        .back-link { display: inline-flex; align-items: center; gap: 0.5rem; color: #64748b; font-weight: 600; text-decoration: none; }
        .template-type-indicator { display: inline-block; padding: 0.5rem 1rem; border-radius: 2rem; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; }

        .edit-grid { display: grid; grid-template-columns: 1fr 340px; gap: 2rem; align-items: start; }
        @media (max-width: 900px) { .edit-grid { grid-template-columns: 1fr; } }

        .edit-section { margin-bottom: 3.5rem; }
        .edit-section h3 { font-size: 1.4rem; color: #0f172a; margin-bottom: 1.5rem; padding-bottom: 0.75rem; border-bottom: 2px solid #f1f5f9; font-weight: 800; }
        .edit-subheader { font-size: 0.8rem; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin: 2rem 0 1rem; padding-left: 0.5rem; border-left: 3px solid #e2e8f0; }
        
        .edit-form-main { padding: 3.5rem; background: white; border-radius: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .form-group { margin-bottom: 1.5rem; }
        .form-group label { display: block; font-size: 0.8rem; font-weight: 800; color: #475569; margin-bottom: 0.6rem; text-transform: uppercase; letter-spacing: 0.5px; }
        .form-group input, .form-group textarea { width: 100%; padding: 0.9rem 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0; background: #f8fafc; font-size: 1rem; transition: 0.2s; }
        .form-group input:focus, .form-group textarea:focus { border-color: #10b981; background: white; outline: none; box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1); }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }

        .itinerary-row-edit { display: grid; gap: 0.75rem; margin-bottom: 0.75rem; align-items: center; }
        .remove-btn { height: 44px; border-radius: 0.75rem; border: none; background: #fee2e2; color: #ef4444; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .add-btn-outline { width: 100%; padding: 1rem; border: 2px dashed #cbd5e1; border-radius: 0.75rem; background: transparent; color: #64748b; font-weight: 700; cursor: pointer; margin-top: 1rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }

        .bg-edit-row { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.75rem; margin-bottom: 0.75rem; }
        .bg-type-toggle { display: flex; background: #e2e8f0; padding: 0.25rem; border-radius: 0.5rem; }
        .bg-type-toggle button { border: none; padding: 0.3rem 0.75rem; border-radius: 0.4rem; font-size: 0.75rem; font-weight: 700; cursor: pointer; background: transparent; color: #64748b; transition: 0.2s; }
        .bg-type-toggle button.active { background: white; color: #0f172a; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .color-mini { width: 32px; height: 32px; border: 2px solid white; border-radius: 50%; padding: 0; cursor: pointer; box-shadow: 0 0 0 1px #cbd5e1; }
        .mini-upload-edit { position: relative; width: 32px; height: 32px; background: white; border: 1px solid #cbd5e1; border-radius: 0.4rem; display: flex; align-items: center; justify-content: center; color: #64748b; }
        .mini-upload-edit input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }

        .sidebar-card { padding: 2rem; position: sticky; top: 100px; background: white; border-radius: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .sidebar-card h3 { font-size: 1.25rem; margin-bottom: 1.5rem; font-weight: 800; border-bottom: 2px solid #f1f5f9; padding-bottom: 0.75rem; }
        .banner-edit-preview { height: 160px; border-radius: 1rem; overflow: hidden; position: relative; background: #f1f5f9; margin-bottom: 1rem; }
        .banner-edit-preview img { width: 100%; height: 100%; object-fit: cover; }
        .replace-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; opacity: 0; transition: 0.2s; cursor: pointer; font-size: 0.8rem; font-weight: 700; gap: 0.5rem; }
        .banner-edit-preview:hover .replace-overlay { opacity: 1; }
        .replace-overlay input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }

        .color-picker-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(32px, 1fr)); gap: 0.75rem; }
        .color-dot { width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; cursor: pointer; box-shadow: 0 0 0 1px #e2e8f0; transition: 0.2s; }
        .color-dot.active { transform: scale(1.25); box-shadow: 0 0 0 2px #0f172a; }
        
        .edit-action-btns { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 2rem; }
        .btns-stack { display: flex; flex-direction: column; gap: 0.75rem; }
        
        .error-banner { background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; padding: 1.25rem; border-radius: 1rem; margin-bottom: 2rem; display: flex; align-items: center; gap: 0.75rem; font-weight: 600; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
};

export default EditRSVP;
