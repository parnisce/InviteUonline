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
            itinerary: [{ time: '', activity: '' }],
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
                setFormData({
                    title: data.title,
                    date: data.event_date.split('T')[0],
                    time: data.event_date.split('T')[1]?.substring(0, 5) || '12:00',
                    location: data.location,
                    description: data.description || '',
                    theme_color: data.theme_color,
                    banner_url: data.banner_url || '',
                    details: {
                        itinerary: data.event_details?.itinerary || [{ time: '', activity: '' }],
                        gallery: data.event_details?.gallery || [],
                        partner1: data.event_details?.partner1 || '',
                        partner2: data.event_details?.partner2 || '',
                        hashtag: data.event_details?.hashtag || '',
                        welcomeMessage: data.event_details?.welcomeMessage || '',
                        story: data.event_details?.story || '',
                        colorMotif: data.event_details?.colorMotif || [],
                        dressCode: data.event_details?.dressCode || '',
                        parkingNote: data.event_details?.parkingNote || '',
                        giftNote: data.event_details?.giftNote || '',
                        saveTheDateBanner: data.event_details?.saveTheDateBanner || '',
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
        const items = [...formData.details.itinerary, { time: '', activity: '' }];
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
                                    <div key={idx} className="itinerary-row-edit">
                                        <input type="text" placeholder="Time" value={item.time} onChange={e => updateItineraryItem(idx, 'time', e.target.value)} />
                                        <input type="text" placeholder="Activity" value={item.activity} onChange={e => updateItineraryItem(idx, 'activity', e.target.value)} />
                                        <button type="button" className="remove-btn" onClick={() => removeItineraryItem(idx)}><Trash2 size={16} /></button>
                                    </div>
                                ))}
                                <button type="button" className="add-btn-outline" onClick={addItineraryItem}><Plus size={16} /> Add Program Item</button>
                            </div>
                        </section>

                        {eventType === 'Wedding' && (
                            <section className="edit-section">
                                <h3>💍 Wedding Specifics</h3>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Partner 1 Name (Bride)</label>
                                        <input type="text" placeholder="e.g. Chuncie" value={formData.details.partner1} onChange={e => setFormData({ ...formData, details: { ...formData.details, partner1: e.target.value } })} />
                                    </div>
                                    <div className="form-group">
                                        <label>Partner 2 Name (Groom)</label>
                                        <input type="text" placeholder="e.g. Ryan" value={formData.details.partner2} onChange={e => setFormData({ ...formData, details: { ...formData.details, partner2: e.target.value } })} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>#️⃣ Wedding Hashtag</label>
                                    <input type="text" placeholder="e.g. #ChuInfinityAndBeJohn" value={formData.details.hashtag} onChange={e => setFormData({ ...formData, details: { ...formData.details, hashtag: e.target.value } })} />
                                    <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.4rem' }}>Shown on the hero banner of your wedding page.</p>
                                </div>
                                <div className="form-group">
                                    <label>Welcome Message</label>
                                    <textarea rows={3} placeholder="Opening message to your guests..." value={formData.details.welcomeMessage} onChange={e => setFormData({ ...formData, details: { ...formData.details, welcomeMessage: e.target.value } })} />
                                </div>
                                <div className="form-group">
                                    <label>Our Love Story</label>
                                    <textarea rows={4} placeholder="Tell guests how you met..." value={formData.details.story} onChange={e => setFormData({ ...formData, details: { ...formData.details, story: e.target.value } })} />
                                </div>
                                <div className="form-group">
                                    <label>👗 Dress Code</label>
                                    <input type="text" placeholder="e.g. Semi-formal, Earth tones preferred" value={formData.details.dressCode} onChange={e => setFormData({ ...formData, details: { ...formData.details, dressCode: e.target.value } })} />
                                </div>
                                <div className="form-group">
                                    <label>🚗 Parking / Travel Notes</label>
                                    <textarea rows={2} placeholder="e.g. Free parking at the church lot. Valet available at the reception." value={formData.details.parkingNote} onChange={e => setFormData({ ...formData, details: { ...formData.details, parkingNote: e.target.value } })} />
                                </div>
                                <div className="form-group">
                                    <label>🎁 Note on Gifts</label>
                                    <textarea rows={3} placeholder="e.g. Your presence is our greatest gift. If you wish to give..." value={formData.details.giftNote} onChange={e => setFormData({ ...formData, details: { ...formData.details, giftNote: e.target.value } })} />
                                </div>
                            </section>
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
        .edit-rsvp-page { padding-top: 120px; min-height: 100vh; background: #f8fafc; }
        .edit-loading { height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; }
        
        .max-w-3xl { max-width: 1000px; margin: 0 auto; }
        .edit-header { margin-bottom: 2.5rem; display: flex; flex-direction: column; gap: 1rem; }
        .edit-header h1 { font-size: 2.5rem; color: #0f172a; margin: 0; }
        .back-link { display: inline-flex; align-items: center; gap: 0.5rem; color: #64748b; font-weight: 600; text-decoration: none; }
        .template-type-indicator { display: inline-block; padding: 0.5rem 1rem; border-radius: 2rem; font-size: 0.8rem; font-weight: 800; text-transform: uppercase; align-self: flex-start; }

        .edit-grid { display: grid; grid-template-columns: 1fr 320px; gap: 2rem; align-items: start; }
        @media (max-width: 900px) { .edit-grid { grid-template-columns: 1fr; } }

        .edit-section { margin-bottom: 3rem; }
        .edit-section h3 { font-size: 1.25rem; color: #0f172a; margin-bottom: 1.5rem; padding-bottom: 0.75rem; border-bottom: 1px solid #e2e8f0; }
        
        .edit-form-main { padding: 3rem; }
        .form-group { margin-bottom: 1.5rem; }
        .form-group label { display: block; font-size: 0.8rem; font-weight: 800; color: #475569; margin-bottom: 0.5rem; text-transform: uppercase; }
        .form-group input, .form-group textarea { width: 100%; padding: 0.85rem 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0; background: #f8fafc; font-size: 1rem; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }

        .itinerary-row-edit { display: grid; grid-template-columns: 120px 1fr 44px; gap: 1rem; margin-bottom: 1rem; align-items: center; }
        .remove-btn { height: 44px; border-radius: 0.75rem; border: 1px solid #fee2e2; background: #fef2f2; color: #ef4444; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .add-btn-outline { width: 100%; padding: 1rem; border: 2px dashed #e2e8f0; border-radius: 0.75rem; background: transparent; color: #64748b; font-weight: 700; cursor: pointer; margin-top: 1rem; }

        .sidebar-card { padding: 2rem; position: sticky; top: 120px; }
        .banner-edit-preview { height: 160px; border-radius: 1rem; overflow: hidden; position: relative; }
        .banner-edit-preview img { width: 100%; height: 100%; object-fit: cover; }
        .replace-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.4); color: white; display: flex; align-items: center; justify-content: center; opacity: 0; transition: 0.2s; cursor: pointer; }
        .banner-edit-preview:hover .replace-overlay { opacity: 1; }
        .replace-overlay input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }

        .color-picker-grid { display: flex; gap: 0.75rem; flex-wrap: wrap; }
        .color-dot { width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; cursor: pointer; box-shadow: 0 0 0 1px #e2e8f0; }
        .color-dot.active { transform: scale(1.2); box-shadow: 0 0 0 2px #000; }
        
        .edit-action-btns { display: flex; flex-direction: column; gap: 1rem; margin-top: 2rem; }
        .w-full { width: 100%; justify-content: center; }
        
        .error-banner { background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; padding: 1rem; border-radius: 0.75rem; margin-bottom: 2rem; display: flex; align-items: center; gap: 0.75rem; font-size: 0.9rem; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
};

export default EditRSVP;
