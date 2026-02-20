import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Calendar, MapPin, Clock, Users, CheckCircle,
    AlertCircle, Loader2, Send, Heart, Cake,
    Baby, GraduationCap, PartyPopper
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const EventPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // RSVP Form State
    const [rsvpData, setRsvpData] = useState({ name: '', email: '', status: 'attending', guests: 1, notes: '' });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data, error } = await supabase
                    .from('events')
                    .select('*')
                    .eq('slug', slug)
                    .single();

                if (error) throw error;
                setEvent(data);
            } catch (err: any) {
                setError(err.message === 'JSON object requested, multiple (or no) rows returned' ? 'Event not found' : err.message);
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchEvent();
    }, [slug]);

    const handleRSVP = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const { error: rsvpError } = await supabase.from('rsvps').insert({
                event_id: event.id,
                name: rsvpData.name,
                email: rsvpData.email,
                status: rsvpData.status,
                guests_count: rsvpData.guests,
                dietary_notes: rsvpData.notes
            });

            if (rsvpError) throw rsvpError;
            setSubmitted(true);
        } catch (err: any) {
            alert(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="event-loading">
            <Loader2 className="animate-spin" size={48} color="#10b981" />
            <p>Loading invitation...</p>
        </div>
    );

    if (error || !event) return (
        <div className="event-error">
            <AlertCircle size={64} color="#ef4444" />
            <h1>Oops! {error === 'Event not found' ? 'Event Not Found' : 'Something went wrong'}</h1>
            <p>The link might be broken or the event has been removed.</p>
            <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
    );

    const eventDate = new Date(event.event_date);

    return (
        <div className="public-event-page" style={{ '--theme': event.theme_color } as any}>
            {/* Hero / Banner */}
            <header className="event-hero">
                <div className="event-banner-container">
                    {event.banner_url ? (
                        <img src={event.banner_url} alt={event.title} className="event-banner-img" />
                    ) : (
                        <div className="event-banner-placeholder" style={{ background: `linear-gradient(135deg, ${event.theme_color}, #fff)` }} />
                    )}
                </div>
                <div className="event-hero-overlay">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="event-header-card glass-card"
                    >
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
                    {/* Main Content */}
                    <div className="event-details">
                        <div className="detail-section card">
                            <h2>About the Celebration</h2>
                            <p>{event.description || 'Join us for this special occasion! We look forward to celebrating with all our family and friends.'}</p>
                        </div>

                        {event.event_type === 'Wedding' && event.event_details?.partner1 && (
                            <div className="detail-section wedding-couple card">
                                <Heart className="couple-icon" size={32} />
                                <div className="couple-names">
                                    <span>{event.event_details.partner1}</span>
                                    <span className="ampersand">&</span>
                                    <span>{event.event_details.partner2}</span>
                                </div>
                                <p>Are getting married!</p>
                            </div>
                        )}

                        <div className="location-card card">
                            <div className="location-info">
                                <h3>Location</h3>
                                <p>{event.location}</p>
                                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`} target="_blank" rel="noreferrer" className="map-link">
                                    View on Google Maps →
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* RSVP Sidebar */}
                    <aside className="rsvp-sidebar">
                        <div className={`rsvp-card glass-card ${submitted ? 'success' : ''}`}>
                            {submitted ? (
                                <div className="rsvp-success-state">
                                    <CheckCircle size={60} className="success-icon" />
                                    <h2>Response Saved!</h2>
                                    <p>Thank you for letting us know. We can't wait to see you!</p>
                                    <button className="btn btn-outline" onClick={() => setSubmitted(false)}>Update RSVP</button>
                                </div>
                            ) : (
                                <form onSubmit={handleRSVP} className="rsvp-form">
                                    <h3>Will you be joining?</h3>
                                    <p className="rsvp-sub">Please respond by {new Date(eventDate.getTime() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>

                                    <div className="form-group">
                                        <label>Your Name</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Enter your full name"
                                            value={rsvpData.name}
                                            onChange={e => setRsvpData({ ...rsvpData, name: e.target.value })}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Email Address</label>
                                        <input
                                            type="email"
                                            placeholder="For updates & reminders"
                                            value={rsvpData.email}
                                            onChange={e => setRsvpData({ ...rsvpData, email: e.target.value })}
                                        />
                                    </div>

                                    <div className="status-toggle">
                                        <button
                                            type="button"
                                            className={`status-btn ${rsvpData.status === 'attending' ? 'active' : ''}`}
                                            onClick={() => setRsvpData({ ...rsvpData, status: 'attending' })}
                                        >
                                            I'm Coming
                                        </button>
                                        <button
                                            type="button"
                                            className={`status-btn ${rsvpData.status === 'declined' ? 'active' : ''}`}
                                            onClick={() => setRsvpData({ ...rsvpData, status: 'declined' })}
                                        >
                                            Can't Make It
                                        </button>
                                    </div>

                                    {rsvpData.status === 'attending' && (
                                        <div className="form-group animate-fade">
                                            <label>Number of Guests</label>
                                            <select value={rsvpData.guests} onChange={e => setRsvpData({ ...rsvpData, guests: parseInt(e.target.value) })}>
                                                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
                                            </select>
                                        </div>
                                    )}

                                    <div className="form-group">
                                        <label>Dietary Notes / Message</label>
                                        <textarea
                                            placeholder="Any allergies or special requests?"
                                            rows={3}
                                            value={rsvpData.notes}
                                            onChange={e => setRsvpData({ ...rsvpData, notes: e.target.value })}
                                        />
                                    </div>

                                    <button className="btn btn-primary rsvp-submit" style={{ background: event.theme_color }} disabled={submitting}>
                                        {submitting ? 'Saving...' : <>Submit RSVP <Send size={18} /></>}
                                    </button>
                                </form>
                            )}
                        </div>
                    </aside>
                </div>
            </section>

            <footer className="event-footer">
                <p>Created with <Heart size={14} fill="currentColor" /> by <Link to="/">InviteU.Online</Link></p>
            </footer>

            <style>{`
        .public-event-page {
          min-height: 100vh;
          background: #f8fafc;
          padding-bottom: 5rem;
        }

        .event-loading, .event-error {
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          text-align: center;
          padding: 2rem;
        }

        .event-hero {
          position: relative;
          height: 60vh;
          min-height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .event-banner-container {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .event-banner-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.6);
        }

        .event-banner-placeholder { width: 100%; height: 100%; opacity: 0.1; }

        .event-hero-overlay {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 800px;
          padding: 2rem;
        }

        .event-header-card {
          padding: 3rem;
          text-align: center;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
        }

        .event-type-badge {
          display: inline-block;
          padding: 0.5rem 1.25rem;
          background: var(--theme);
          color: white;
          border-radius: 2rem;
          font-weight: 800;
          font-size: 0.8rem;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
          box-shadow: 0 4px 10px -2px var(--theme);
        }

        .event-title { font-size: clamp(2rem, 5vw, 3.5rem); color: #0f172a; margin-bottom: 2rem; line-height: 1.1; font-weight: 800; }

        .event-quick-info {
          display: flex;
          justify-content: center;
          gap: 2rem;
          flex-wrap: wrap;
          color: #475569;
          font-weight: 600;
        }

        .info-item { display: flex; align-items: center; gap: 0.6rem; }
        .info-item svg { color: var(--theme); }

        .event-body { margin-top: -80px; position: relative; z-index: 20; }

        .event-grid {
          display: grid;
          grid-template-columns: 1.8fr 1.2fr;
          gap: 3rem;
          align-items: start;
        }

        @media (max-width: 900px) {
          .event-grid { grid-template-columns: 1fr; }
          .event-body { margin-top: 2rem; }
        }

        .card { background: white; padding: 2.5rem; border-radius: 1.5rem; border: 1px solid #e2e8f0; margin-bottom: 2rem; }

        .detail-section h2 { font-size: 1.8rem; color: #0f172a; margin-bottom: 1.25rem; }
        .detail-section p { color: #475569; line-height: 1.8; font-size: 1.1rem; }

        .wedding-couple { text-align: center; }
        .couple-icon { color: #ef4444; margin-bottom: 1rem; }
        .couple-names { font-size: 2.2rem; font-weight: 900; color: #0f172a; display: flex; flex-direction: column; line-height: 1.2; }
        .ampersand { font-size: 1.5rem; color: #94a3b8; font-weight: 400; margin: 0.5rem 0; }

        .location-info h3 { margin-bottom: 0.5rem; font-size: 1.25rem; }
        .map-link { color: var(--theme); font-weight: 700; text-decoration: none; display: block; margin-top: 1rem; }

        .rsvp-card { padding: 2.5rem; background: white; border: 1px solid #e2e8f0; position: sticky; top: 120px; }
        .rsvp-card h3 { font-size: 1.5rem; margin-bottom: 0.5rem; }
        .rsvp-sub { color: #64748b; font-size: 0.9rem; margin-bottom: 2rem; }

        .form-group { margin-bottom: 1.25rem; }
        .form-group label { display: block; font-size: 0.85rem; font-weight: 700; color: #475569; margin-bottom: 0.5rem; text-transform: uppercase; }
        .form-group input, .form-group select, .form-group textarea {
          width: 100%; border: 1px solid #e2e8f0; padding: 0.85rem 1rem; border-radius: 0.75rem; background: #f8fafc; font-size: 1rem;
        }

        .status-toggle { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem; }
        .status-btn {
          padding: 1rem 0.5rem; border-radius: 0.75rem; border: 1px solid #e2e8f0; background: white; font-weight: 700; color: #64748b; transition: 0.3s; cursor: pointer;
        }
        .status-btn.active { background: var(--theme); color: white; border-color: var(--theme); }

        .rsvp-submit { width: 100%; justify-content: center; padding: 1.15rem; font-size: 1.1rem; font-weight: 800; box-shadow: 0 10px 15px -10px var(--theme); }

        .rsvp-success-state { text-align: center; padding: 3rem 0; }
        .success-icon { color: #10b981; margin-bottom: 1.5rem; }
        .rsvp-success-state h2 { margin-bottom: 0.5rem; }

        .event-footer { text-align: center; padding: 4rem 0; color: #94a3b8; font-weight: 500; }
        .event-footer a { color: #475569; text-decoration: none; font-weight: 700; }
      `}</style>
        </div>
    );
};

export default EventPage;
