import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Calendar, MapPin, Clock, CheckCircle,
    AlertCircle, Loader2, Send, Heart,
    Camera, Gift
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const EventPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState<any>(null);

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

                if (data.event_type === 'Wedding') {
                    calculateTimeLeft(data.event_date);
                    const timer = setInterval(() => calculateTimeLeft(data.event_date), 1000);
                    return () => clearInterval(timer);
                }
            } catch (err: any) {
                setError(err.message === 'JSON object requested, multiple (or no) rows returned' ? 'Event not found' : err.message);
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchEvent();
    }, [slug]);

    const calculateTimeLeft = (dateStr: string) => {
        const difference = +new Date(dateStr) - +new Date();
        if (difference > 0) {
            setTimeLeft({
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            });
        }
    };

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
    const details = event.event_details || {};

    return (
        <div className={`public-event-page template-${event.event_type?.toLowerCase().replace(' ', '-')}`} style={{ '--theme': event.theme_color } as any}>
            {/* Elegant Background Pattern for Birthday */}
            {event.event_type === 'Birthday' && <div className="birthday-pattern" />}

            {/* Hero / Banner */}
            <header className="event-hero">
                <div className="event-banner-container">
                    {event.banner_url ? (
                        <motion.img
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 1.5 }}
                            src={event.banner_url}
                            alt={event.title}
                            className="event-banner-img"
                        />
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
                        {/* WEDDING TEMPLATE: Gallery Section */}
                        {event.event_type === 'Wedding' && details.gallery?.length > 0 && (
                            <div className="template-section card photo-gallery-section">
                                <div className="section-header">
                                    <Camera size={24} />
                                    <h2>Our Gallery</h2>
                                </div>
                                <div className="wedding-photo-grid">
                                    {details.gallery.map((url: string, i: number) => (
                                        <motion.div
                                            key={i}
                                            whileHover={{ scale: 1.02 }}
                                            className={`gallery-img-wrapper ${i === 0 ? 'large' : ''}`}
                                        >
                                            <img src={url} alt={`Wedding ${i}`} />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* WEDDING TEMPLATE: Story & Couple */}
                        {event.event_type === 'Wedding' && (
                            <div className="template-section wedding-couple-intro card">
                                <div className="couple-names-large">
                                    <span>{details.partner1}</span>
                                    <span className="ampersand">&</span>
                                    <span>{details.partner2}</span>
                                </div>
                                <div className="divider-line" />
                                <p className="story-text">{details.story || "We're so excited to share our special day with you!"}</p>

                                {timeLeft && (
                                    <div className="wedding-countdown">
                                        <div className="count-item"><span>{timeLeft.days}</span><label>Days</label></div>
                                        <div className="count-item"><span>{timeLeft.hours}</span><label>Hrs</label></div>
                                        <div className="count-item"><span>{timeLeft.minutes}</span><label>Min</label></div>
                                        <div className="count-item"><span>{timeLeft.seconds}</span><label>Sec</label></div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* BIRTHDAY TEMPLATE: Minimalist "About" */}
                        {event.event_type === 'Birthday' && (
                            <div className="template-section birthday-welcome card">
                                <h2>Celebrating {event.title}</h2>
                                <p>{event.description || 'Join us for a day of joy, celebration, and creating wonderful memories together.'}</p>
                            </div>
                        )}

                        {/* UNIVERSAL TEMPLATE: Program / Itinerary (Timeline) */}
                        {details.itinerary?.length > 0 && details.itinerary[0].activity !== '' && (
                            <div className="template-section itinerary-section card">
                                <div className="section-header">
                                    <Clock size={24} />
                                    <h2>Program of Events</h2>
                                </div>
                                <div className="timeline">
                                    {details.itinerary.map((item: any, i: number) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            className="timeline-item"
                                        >
                                            <div className="time-col">{item.time}</div>
                                            <div className="dot-col"><div className="timeline-dot" /></div>
                                            <div className="activity-col">{item.activity}</div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="location-card card">
                            <div className="location-info">
                                <h3>Venue Location</h3>
                                <p>{event.location}</p>
                                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`} target="_blank" rel="noreferrer" className="map-link">
                                    View on Google Maps →
                                </a>
                            </div>
                        </div>

                        {/* WEDDING TEMPLATE: Gift Registry Notice */}
                        {event.event_type === 'Wedding' && (
                            <div className="gift-registry card">
                                <Gift size={32} />
                                <h3>Gift Suggestions</h3>
                                <p>Your presence is our greatest gift! If you wish to contribute, we appreciate your thoughtfulness through our registry or a monetary gift.</p>
                                <div className="registry-btns">
                                    <button className="btn btn-outline small">View Registry</button>
                                </div>
                            </div>
                        )}
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
                                    <h3>Confirm Attendance</h3>
                                    <p className="rsvp-sub">Please respond by {new Date(eventDate.getTime() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>

                                    <div className="form-group">
                                        <label>Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Enter your name"
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
                                            Attending
                                        </button>
                                        <button
                                            type="button"
                                            className={`status-btn ${rsvpData.status === 'declined' ? 'active' : ''}`}
                                            onClick={() => setRsvpData({ ...rsvpData, status: 'declined' })}
                                        >
                                            Declined
                                        </button>
                                    </div>

                                    {rsvpData.status === 'attending' && (
                                        <div className="form-group animate-fade">
                                            <label>Number of People</label>
                                            <select value={rsvpData.guests} onChange={e => setRsvpData({ ...rsvpData, guests: parseInt(e.target.value) })}>
                                                {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'People'}</option>)}
                                            </select>
                                        </div>
                                    )}

                                    <div className="form-group">
                                        <label>Special Notes</label>
                                        <textarea
                                            placeholder="Allergies or messages?"
                                            rows={2}
                                            value={rsvpData.notes}
                                            onChange={e => setRsvpData({ ...rsvpData, notes: e.target.value })}
                                        />
                                    </div>

                                    <button className="btn btn-primary rsvp-submit" style={{ background: event.theme_color }} disabled={submitting}>
                                        {submitting ? 'Saving...' : <>Confirm RSVP <Send size={18} /></>}
                                    </button>
                                </form>
                            )}
                        </div>
                    </aside>
                </div>
            </section>

            <footer className="event-footer">
                <p>Created by <a href="https://inviteuonline.vercel.app/" target="_blank" rel="noreferrer">inviteuonline.vercel.app</a></p>
                <div className="footer-links">
                    <Heart size={14} /> Made with Love
                </div>
            </footer>

            <style>{`
        .public-event-page {
          min-height: 100vh;
          background: #f8fafc;
          padding-bottom: 5rem;
          color: #1e293b;
        }

        /* Birthday Specific Theme (Green Canva-like) */
        .template-birthday { background: #f0fdf4; }
        .birthday-pattern { 
          position: fixed; inset: 0; opacity: 0.05; pointer-events: none; z-index: 0;
          background-image: radial-gradient(#064e3b 0.5px, transparent 0.5px);
          background-size: 20px 20px;
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
          height: 65vh;
          min-height: 450px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
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
          filter: brightness(0.5);
        }

        .event-banner-placeholder { width: 100%; height: 100%; opacity: 0.1; }

        .event-hero-overlay {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 900px;
          padding: 2rem;
        }

        .event-header-card {
          padding: 4rem 2rem;
          text-align: center;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
          border-radius: 2rem;
        }

        .event-type-badge {
          display: inline-block;
          padding: 0.6rem 2rem;
          background: var(--theme);
          color: white;
          border-radius: 2rem;
          font-weight: 800;
          font-size: 0.8rem;
          text-transform: uppercase;
          margin-bottom: 2rem;
          box-shadow: 0 10px 20px -5px var(--theme);
          letter-spacing: 2px;
        }

        .event-title { 
            font-size: clamp(2.5rem, 6vw, 4.5rem); 
            color: #0f172a; 
            margin-bottom: 2.5rem; 
            line-height: 1; 
            font-weight: 900; 
            font-family: 'Playfair Display', serif; /* Would need font import, using system fallbacks */
        }

        .event-quick-info {
          display: flex;
          justify-content: center;
          gap: 3rem;
          flex-wrap: wrap;
          color: #334155;
          font-weight: 700;
          font-size: 1.1rem;
        }

        .info-item { display: flex; align-items: center; gap: 0.75rem; }
        .info-item svg { color: var(--theme); }

        .event-body { margin-top: -100px; position: relative; z-index: 20; padding-bottom: 5rem; }

        .event-grid {
          display: grid;
          grid-template-columns: 2fr 1.2fr;
          gap: 4rem;
          align-items: start;
        }

        @media (max-width: 1000px) {
          .event-grid { grid-template-columns: 1fr; }
          .event-body { margin-top: 2rem; }
          .event-hero { height: auto; padding: 2rem 0; }
          .event-header-card { padding: 3rem 1.5rem; }
        }

        .card { 
            background: white; 
            padding: 3.5rem; 
            border-radius: 2rem; 
            border: 1px solid rgba(226, 232, 240, 0.8); 
            margin-bottom: 3rem; 
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.02);
            transition: 0.3s;
        }
        .card:hover { transform: translateY(-5px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.05); }

        .section-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2.5rem; color: var(--theme); }
        .section-header h2 { font-size: 1.8rem; font-weight: 900; color: #0f172a; margin: 0; }

        /* Wedding Photo Grid */
        .photo-gallery-section { padding: 2rem; }
        .wedding-photo-grid { display: grid; grid-template-columns: repeat(4, 1fr); grid-auto-rows: 150px; gap: 1rem; }
        .gallery-img-wrapper { border-radius: 1rem; overflow: hidden; }
        .gallery-img-wrapper img { width: 100%; height: 100%; object-fit: cover; }
        .gallery-img-wrapper.large { grid-column: span 2; grid-row: span 2; }

        /* Story & Couple */
        .wedding-couple-intro { text-align: center; }
        .couple-names-large { font-size: 3rem; font-weight: 900; color: #0f172a; margin-bottom: 1.5rem; }
        .ampersand { color: var(--theme); font-weight: 300; margin: 0 1rem; }
        .divider-line { width: 60px; height: 4px; background: var(--theme); margin: 0 auto 2rem; border-radius: 2px; }
        .story-text { font-size: 1.25rem; line-height: 1.8; color: #475569; font-style: italic; }

        /* Countdown */
        .wedding-countdown { display: flex; justify-content: center; gap: 1.5rem; margin-top: 3rem; }
        .count-item { background: #f8fafc; padding: 1rem 1.5rem; border-radius: 1rem; min-width: 80px; }
        .count-item span { display: block; font-size: 1.8rem; font-weight: 900; color: var(--theme); }
        .count-item label { font-size: 0.75rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; }

        /* Birthday Specific Title */
        .birthday-welcome h2 { font-size: 2.22rem; margin-bottom: 1.5rem; }
        .birthday-welcome p { font-size: 1.2rem; line-height: 1.8; color: #475569; }

        /* Timeline / Itinerary */
        .timeline { position: relative; padding-left: 2rem; }
        .timeline::before { content: ''; position: absolute; left: 106px; top: 0; bottom: 0; width: 2px; background: #e2e8f0; }
        .timeline-item { display: grid; grid-template-columns: 80px 50px 1fr; align-items: center; margin-bottom: 2.5rem; }
        .time-col { font-weight: 800; color: var(--theme); text-align: right; }
        .dot-col { display: flex; justify-content: center; position: relative; z-index: 5; }
        .timeline-dot { width: 14px; height: 14px; border-radius: 50%; background: var(--theme); border: 3px solid white; box-shadow: 0 0 0 4px var(--theme); }
        .activity-col { font-size: 1.15rem; font-weight: 700; color: #1e293b; background: #f8fafc; padding: 1rem 1.5rem; border-radius: 1rem; border: 1px solid #f1f5f9; }

        .location-info h3 { margin-bottom: 1rem; font-size: 1.5rem; font-weight: 900; }
        .map-link { color: var(--theme); font-weight: 800; text-decoration: none; border-bottom: 2px solid var(--theme); padding-bottom: 2px; }

        .gift-registry { text-align: center; background: #f8fafc; border: 2px dashed #cbd5e1; }
        .gift-registry svg { color: var(--theme); margin-bottom: 1rem; }
        .gift-registry p { color: #64748b; margin-bottom: 2rem; }

        .rsvp-card { padding: 3rem; background: white; border: 1px solid #e2e8f0; position: sticky; top: 120px; border-radius: 2rem; }
        .rsvp-card h3 { font-size: 1.8rem; margin-bottom: 0.5rem; font-weight: 900; }
        .rsvp-sub { color: #64748b; font-size: 0.95rem; margin-bottom: 2.5rem; }

        .form-group { margin-bottom: 1.5rem; }
        .form-group label { display: block; font-size: 0.8rem; font-weight: 800; color: #475569; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 1px; }
        .form-group input, .form-group select, .form-group textarea {
          width: 100%; border: 1px solid #e2e8f0; padding: 1rem 1.25rem; border-radius: 1rem; background: #f8fafc; font-size: 1rem; transition: 0.2s;
        }
        .form-group input:focus { border-color: var(--theme); background: white; box-shadow: 0 0 0 4px rgba(var(--theme), 0.1); }

        .status-toggle { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem; }
        .status-btn {
          padding: 1.25rem 0.5rem; border-radius: 1rem; border: 1px solid #e2e8f0; background: white; font-weight: 800; color: #64748b; transition: 0.3s; cursor: pointer;
        }
        .status-btn.active { background: var(--theme); color: white; border-color: var(--theme); box-shadow: 0 10px 15px -5px var(--theme); }

        .rsvp-submit { width: 100%; justify-content: center; padding: 1.25rem; font-size: 1.2rem; font-weight: 900; box-shadow: 0 15px 30px -10px var(--theme); }

        .rsvp-success-state { text-align: center; padding: 3rem 0; }
        .success-icon { color: #10b981; margin-bottom: 2rem; }
        .rsvp-success-state h2 { font-size: 2rem; margin-bottom: 1rem; }

        .event-footer { text-align: center; padding: 8rem 0; color: #94a3b8; font-weight: 600; }
        .event-footer a { color: #1e293b; text-decoration: none; font-weight: 900; margin-left: 0.5rem; }
        .footer-links { display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 1rem; font-size: 0.9rem; }
      `}</style>
        </div>
    );
};

export default EventPage;
