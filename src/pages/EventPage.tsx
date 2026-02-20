import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, CheckCircle, AlertCircle, Loader2, Send, Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import WeddingTemplate from './WeddingTemplate';

const EventPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState<any>(null);

    const [rsvpData, setRsvpData] = useState({ name: '', email: '', status: 'attending', guests: 1, notes: '' });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data, error } = await supabase.from('events').select('*').eq('slug', slug).single();
                if (error) throw error;
                setEvent(data);
                calculateTimeLeft(data.event_date);
                const timer = setInterval(() => calculateTimeLeft(data.event_date), 1000);
                return () => clearInterval(timer);
            } catch (err: any) {
                setError(err.message === 'JSON object requested, multiple (or no) rows returned' ? 'Event not found' : err.message);
            } finally { setLoading(false); }
        };
        if (slug) fetchEvent();
    }, [slug]);

    const calculateTimeLeft = (dateStr: string) => {
        const diff = +new Date(dateStr) - +new Date();
        if (diff > 0) setTimeLeft({
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((diff / 1000 / 60) % 60),
            seconds: Math.floor((diff / 1000) % 60),
        });
    };

    const handleRSVP = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const { error: rsvpError } = await supabase.from('rsvps').insert({
                event_id: event.id, name: rsvpData.name, email: rsvpData.email,
                status: rsvpData.status, guests_count: rsvpData.guests, dietary_notes: rsvpData.notes
            });
            if (rsvpError) throw rsvpError;
            setSubmitted(true);
        } catch (err: any) { alert(err.message); }
        finally { setSubmitting(false); }
    };

    if (loading) return (
        <div className="ep-center">
            <Loader2 className="ep-spin" size={48} color="#8b5e3c" />
            <p style={{ color: '#9c7a5c', marginTop: '1rem' }}>Loading your invitation...</p>
        </div>
    );
    if (error || !event) return (
        <div className="ep-center">
            <AlertCircle size={64} color="#ef4444" />
            <h1 style={{ marginTop: '1rem' }}>Event Not Found</h1>
            <p style={{ color: '#64748b' }}>This link may be broken or the event has been removed.</p>
            <a href="/" style={{ marginTop: '1.5rem', display: 'inline-block', padding: '0.75rem 2rem', background: '#8b5e3c', color: 'white', borderRadius: '0.75rem', fontWeight: 700, textDecoration: 'none' }}>Go Home</a>
        </div>
    );

    const eventDate = new Date(event.event_date);
    const details = event.event_details || {};
    const theme = event.theme_color || '#8b5e3c';

    // Wedding Template
    if (event.event_type === 'Wedding') return <WeddingTemplate event={event} timeLeft={timeLeft} />;

    // ─── Default / Birthday Template ───
    return (
        <div className="public-event-page" style={{ '--theme': theme } as any}>
            {event.event_type === 'Birthday' && <div className="birthday-pattern" />}
            <header className="event-hero">
                <div className="event-banner-container">
                    {event.banner_url
                        ? <motion.img initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.5 }} src={event.banner_url} alt={event.title} className="event-banner-img" />
                        : <div className="event-banner-placeholder" style={{ background: `linear-gradient(135deg, ${theme}, #fff)` }} />}
                </div>
                <div className="event-hero-overlay">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="event-header-card glass-card">
                        <span className="event-type-badge">{event.event_type}</span>
                        <h1 className="event-title">{event.title}</h1>
                        <div className="event-quick-info">
                            <div className="info-item"><Calendar size={18} /> {eventDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                            <div className="info-item"><Clock size={18} /> {eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                            <div className="info-item"><MapPin size={18} /> {event.location}</div>
                        </div>
                    </motion.div>
                </div>
            </header>

            <section className="event-body container">
                <div className="event-grid">
                    <div className="event-details">
                        <div className="birthday-welcome card">
                            <h2>Celebrating {event.title}</h2>
                            <p>Join us for a day of joy, celebration, and creating wonderful memories together.</p>
                        </div>
                        {details.itinerary?.length > 0 && details.itinerary[0].activity && (
                            <div className="itinerary-section card">
                                <div className="section-header"><Clock size={24} /><h2>Program of Events</h2></div>
                                <div className="timeline">
                                    {details.itinerary.map((item: any, i: number) => (
                                        <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="timeline-item">
                                            <div className="time-col">{item.time}</div>
                                            <div className="dot-col"><div className="timeline-dot" /></div>
                                            <div className="activity-col">{item.activity}</div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="card">
                            <div className="section-header"><MapPin size={24} /><h2>Venue</h2></div>
                            <p>{event.location}</p>
                            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`} target="_blank" rel="noreferrer" className="map-link">View on Google Maps →</a>
                        </div>
                    </div>

                    <aside className="rsvp-sidebar">
                        <div className={`rsvp-card glass-card ${submitted ? 'success' : ''}`}>
                            {submitted ? (
                                <div className="rsvp-success-state">
                                    <CheckCircle size={60} className="success-icon" />
                                    <h2>Response Saved!</h2>
                                    <p>Thank you! We can't wait to see you.</p>
                                    <button className="btn btn-outline" onClick={() => setSubmitted(false)}>Update RSVP</button>
                                </div>
                            ) : (
                                <form onSubmit={handleRSVP} className="rsvp-form">
                                    <h3>Confirm Attendance</h3>
                                    <div className="form-group">
                                        <label>Full Name</label>
                                        <input type="text" required placeholder="Enter your name" value={rsvpData.name} onChange={e => setRsvpData({ ...rsvpData, name: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label>Email Address</label>
                                        <input type="email" placeholder="For updates" value={rsvpData.email} onChange={e => setRsvpData({ ...rsvpData, email: e.target.value })} />
                                    </div>
                                    <div className="status-toggle">
                                        <button type="button" className={`status-btn ${rsvpData.status === 'attending' ? 'active' : ''}`} onClick={() => setRsvpData({ ...rsvpData, status: 'attending' })}>Attending</button>
                                        <button type="button" className={`status-btn ${rsvpData.status === 'declined' ? 'active' : ''}`} onClick={() => setRsvpData({ ...rsvpData, status: 'declined' })}>Declined</button>
                                    </div>
                                    {rsvpData.status === 'attending' && (
                                        <div className="form-group">
                                            <label>Number of People</label>
                                            <select value={rsvpData.guests} onChange={e => setRsvpData({ ...rsvpData, guests: parseInt(e.target.value) })}>
                                                {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'People'}</option>)}
                                            </select>
                                        </div>
                                    )}
                                    <div className="form-group">
                                        <label>Special Notes</label>
                                        <textarea placeholder="Allergies or messages?" rows={2} value={rsvpData.notes} onChange={e => setRsvpData({ ...rsvpData, notes: e.target.value })} />
                                    </div>
                                    <button className="btn btn-primary rsvp-submit" style={{ background: theme }} disabled={submitting}>
                                        {submitting ? 'Saving...' : <> Confirm RSVP <Send size={18} /></>}
                                    </button>
                                </form>
                            )}
                        </div>
                    </aside>
                </div>
            </section>

            <footer className="event-footer">
                <p>Created by <a href="https://inviteuonline.vercel.app/" target="_blank" rel="noreferrer">inviteuonline.vercel.app</a></p>
                <div className="footer-links"><Heart size={14} /> Made with Love</div>
            </footer>

            <style>{`
        .ep-center { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; text-align: center; padding: 2rem; }
        .ep-spin { animation: ep-spin-kf 1s linear infinite; }
        @keyframes ep-spin-kf { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .public-event-page { min-height: 100vh; background: #f8fafc; padding-bottom: 5rem; color: #1e293b; }
        .birthday-pattern { position: fixed; inset: 0; opacity: 0.04; pointer-events: none; z-index: 0; background-image: radial-gradient(#064e3b 0.5px, transparent 0.5px); background-size: 20px 20px; }
        .event-hero { position: relative; height: 65vh; min-height: 450px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .event-banner-container { position: absolute; inset: 0; overflow: hidden; }
        .event-banner-img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.5); }
        .event-banner-placeholder { width: 100%; height: 100%; }
        .event-hero-overlay { position: relative; z-index: 10; width: 100%; max-width: 900px; padding: 2rem; }
        .event-header-card { padding: 3.5rem 2rem; text-align: center; background: rgba(255,255,255,0.95); backdrop-filter: blur(12px); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.1); border-radius: 2rem; }
        .event-type-badge { display: inline-block; padding: 0.5rem 2rem; background: var(--theme); color: white; border-radius: 2rem; font-weight: 800; font-size: 0.8rem; text-transform: uppercase; margin-bottom: 1.5rem; letter-spacing: 2px; }
        .event-title { font-size: clamp(2rem, 6vw, 4rem); color: #0f172a; margin-bottom: 2rem; font-weight: 900; }
        .event-quick-info { display: flex; justify-content: center; gap: 2.5rem; flex-wrap: wrap; color: #334155; font-weight: 700; }
        .info-item { display: flex; align-items: center; gap: 0.6rem; }
        .info-item svg { color: var(--theme); }
        .event-body { margin-top: -80px; position: relative; z-index: 20; padding-bottom: 5rem; }
        .event-grid { display: grid; grid-template-columns: 2fr 1.2fr; gap: 3rem; align-items: start; }
        @media (max-width: 900px) { .event-grid { grid-template-columns: 1fr; } .event-body { margin-top: 2rem; } }
        .card { background: white; padding: 3rem; border-radius: 1.5rem; border: 1px solid #f1f5f9; margin-bottom: 2.5rem; box-shadow: 0 4px 15px rgba(0,0,0,0.03); }
        .section-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; color: var(--theme); }
        .section-header h2 { font-size: 1.6rem; font-weight: 900; color: #0f172a; margin: 0; }
        .birthday-welcome h2 { font-size: 2rem; margin-bottom: 1rem; }
        .birthday-welcome p { font-size: 1.1rem; line-height: 1.8; color: #475569; }
        .timeline-item { display: grid; grid-template-columns: 80px 40px 1fr; align-items: center; margin-bottom: 2rem; }
        .time-col { font-weight: 800; color: var(--theme); text-align: right; font-size: 0.9rem; }
        .dot-col { display: flex; justify-content: center; }
        .timeline-dot { width: 12px; height: 12px; border-radius: 50%; background: var(--theme); border: 3px solid white; box-shadow: 0 0 0 3px var(--theme); }
        .activity-col { font-weight: 700; color: #1e293b; background: #f8fafc; padding: 0.75rem 1.25rem; border-radius: 0.75rem; }
        .map-link { color: var(--theme); font-weight: 700; text-decoration: none; display: inline-block; margin-top: 0.75rem; }
        .rsvp-card { padding: 2.5rem; background: white; border: 1px solid #e2e8f0; position: sticky; top: 100px; border-radius: 1.5rem; }
        .rsvp-card h3 { font-size: 1.5rem; margin-bottom: 1.5rem; font-weight: 900; }
        .form-group { margin-bottom: 1.25rem; }
        .form-group label { display: block; font-size: 0.75rem; font-weight: 700; color: #475569; margin-bottom: 0.4rem; text-transform: uppercase; letter-spacing: 1px; }
        .form-group input, .form-group select, .form-group textarea { width: 100%; border: 1px solid #e2e8f0; padding: 0.85rem 1rem; border-radius: 0.75rem; background: #f8fafc; font-size: 0.95rem; transition: 0.2s; box-sizing: border-box; font-family: inherit; }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus { outline: none; border-color: var(--theme); background: white; }
        .status-toggle { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.25rem; }
        .status-btn { padding: 1rem; border-radius: 0.75rem; border: 1px solid #e2e8f0; background: white; font-weight: 700; color: #64748b; cursor: pointer; transition: 0.2s; font-family: inherit; }
        .status-btn.active { background: var(--theme); color: white; border-color: var(--theme); }
        .rsvp-submit { width: 100%; justify-content: center; padding: 1rem; font-size: 1rem; font-weight: 800; display: flex; align-items: center; gap: 0.5rem; border: none; color: white; border-radius: 0.75rem; cursor: pointer; }
        .rsvp-success-state { text-align: center; padding: 2rem 0; }
        .success-icon { color: #10b981; margin-bottom: 1.5rem; }
        .event-footer { text-align: center; padding: 4rem 0; color: #94a3b8; }
        .event-footer a { color: #1e293b; text-decoration: none; font-weight: 700; }
        .footer-links { display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 0.75rem; }
      `}</style>
        </div>
    );
};

export default EventPage;
