import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ArrowLeft, Save, Loader2, AlertCircle,
    MapPin, Calendar, Clock
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const EditRSVP: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        date: '',
        time: '',
        location: '',
        description: '',
        theme_color: '#10b981',
        banner_url: ''
    });

    useEffect(() => {
        const fetchEvent = async () => {
            if (!user || !slug) return;

            try {
                const { data, error } = await supabase
                    .from('events')
                    .select('*')
                    .eq('slug', slug)
                    .eq('user_id', user.id)
                    .single();

                if (error) throw error;
                setFormData({
                    title: data.title,
                    date: data.event_date.split('T')[0],
                    time: data.event_date.split('T')[1]?.substring(0, 5) || '12:00',
                    location: data.location,
                    description: data.description || '',
                    theme_color: data.theme_color,
                    banner_url: data.banner_url || ''
                });
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [user, slug]);

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
                    theme_color: formData.theme_color
                })
                .eq('slug', slug)
                .eq('user_id', user?.id);

            if (updateError) throw updateError;
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="edit-loading">
            <Loader2 className="animate-spin" size={40} color="#10b981" />
            <p>Loading event details...</p>
        </div>
    );

    return (
        <div className="edit-rsvp-page section-padding">
            <div className="container max-w-2xl">
                <header className="edit-header">
                    <Link to="/dashboard" className="back-link"><ArrowLeft size={18} /> Back to Dashboard</Link>
                    <h1>Edit Your Event</h1>
                    <p>Update the details for <strong>{formData.title}</strong></p>
                </header>

                {error && (
                    <div className="error-banner">
                        <AlertCircle size={20} /> {error}
                    </div>
                )}

                <form onSubmit={handleUpdate} className="edit-form glass-card">
                    <div className="form-group">
                        <label>Event Title</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label><Calendar size={14} /> Date</label>
                            <input
                                type="date"
                                required
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label><Clock size={14} /> Time</label>
                            <input
                                type="time"
                                required
                                value={formData.time}
                                onChange={e => setFormData({ ...formData, time: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label><MapPin size={14} /> Location</label>
                        <input
                            type="text"
                            required
                            value={formData.location}
                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Description / About</label>
                        <textarea
                            rows={4}
                            placeholder="Tell your guests more about the event..."
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Theme Color</label>
                        <div className="color-picker-grid">
                            {['#10b981', '#f59e0b', '#ef4444', '#6366f1', '#ec4899', '#8b5cf6', '#0f172a'].map(c => (
                                <button
                                    key={c}
                                    type="button"
                                    className={`color-dot ${formData.theme_color === c ? 'active' : ''}`}
                                    style={{ background: c }}
                                    onClick={() => setFormData({ ...formData, theme_color: c })}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="edit-actions">
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : <><Save size={18} /> Save Changes</>}
                        </button>
                        <Link to="/dashboard" className="btn btn-outline">Cancel</Link>
                    </div>
                </form>
            </div>

            <style>{`
        .edit-rsvp-page { padding-top: 120px; min-height: 100vh; background: #f8fafc; }
        .edit-loading { height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; }
        
        .max-w-2xl { max-width: 700px; margin: 0 auto; }
        
        .edit-header { margin-bottom: 2.5rem; }
        .edit-header h1 { font-size: 2.2rem; color: #0f172a; margin-top: 1rem; margin-bottom: 0.5rem; }
        .edit-header p { color: #64748b; font-size: 1.1rem; }
        .back-link { display: inline-flex; align-items: center; gap: 0.5rem; color: #64748b; font-weight: 600; text-decoration: none; transition: 0.2s; }
        .back-link:hover { color: var(--primary); }

        .edit-form { padding: 2.5rem; display: flex; flex-direction: column; gap: 1.5rem; }
        
        .form-group label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; font-weight: 700; color: #475569; margin-bottom: 0.5rem; text-transform: uppercase; }
        .form-group input, .form-group textarea, .form-group select {
          width: 100%; padding: 0.85rem 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0; background: #f8fafc; font-size: 1rem; transition: 0.3s;
        }
        .form-group input:focus, .form-group textarea:focus { border-color: var(--primary); outline: none; background: white; box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1); }

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }

        .color-picker-grid { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 0.5rem; }
        .color-dot { width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; cursor: pointer; box-shadow: 0 0 0 1px #e2e8f0; transition: 0.2s; }
        .color-dot.active { transform: scale(1.2); box-shadow: 0 0 0 2px var(--primary); }

        .edit-actions { display: flex; gap: 1rem; margin-top: 1rem; }
        .edit-actions .btn { flex: 1; justify-content: center; }

        .error-banner { background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; padding: 1rem; border-radius: 0.75rem; margin-bottom: 2rem; display: flex; align-items: center; gap: 0.75rem; font-size: 0.9rem; }
        
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
};

export default EditRSVP;
