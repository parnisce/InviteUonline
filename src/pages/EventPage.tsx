import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Calendar, MapPin, Clock, CheckCircle,
    AlertCircle, Loader2, Send, Heart,
    Gift, Car, Shirt
} from 'lucide-react';
import { supabase } from '../lib/supabase';

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
                const { data, error } = await supabase
                    .from('events')
                    .select('*')
                    .eq('slug', slug)
                    .single();
                if (error) throw error;
                setEvent(data);
                calculateTimeLeft(data.event_date);
                const timer = setInterval(() => calculateTimeLeft(data.event_date), 1000);
                return () => clearInterval(timer);
            } catch (err: any) {
                setError(err.message === 'JSON object requested, multiple (or no) rows returned' ? 'Event not found' : err.message);
            } finally {
                setLoading(false);
            }
        };
        if (slug) fetchEvent();
    }, [slug]);

    const calculateTimeLeft = (dateStr: string) => {
        const diff = +new Date(dateStr) - +new Date();
        if (diff > 0) {
            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((diff / 1000 / 60) % 60),
                seconds: Math.floor((diff / 1000) % 60),
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
        <div className="ep-loading">
            <Loader2 className="ep-spin" size={48} />
            <p>Loading your invitation...</p>
        </div>
    );
    if (error || !event) return (
        <div className="ep-error">
            <AlertCircle size={64} color="#ef4444" />
            <h1>Event Not Found</h1>
            <p>The link might be broken or this event has been removed.</p>
            <a href="/" className="ep-btn ep-btn-primary">Go Home</a>
        </div>
    );

    const eventDate = new Date(event.event_date);
    const d = event.event_details || {};
    const isWedding = event.event_type === 'Wedding';
    const theme = event.theme_color || '#c8a97e';

    // ───── WEDDING TEMPLATE ─────
    if (isWedding) {
        return (
            <div className="wedding-page" style={{ '--tw': theme } as any}>
                {/* ── HERO ── */}
                <header className="w-hero">
                    {event.banner_url ? (
                        <motion.img
                            initial={{ scale: 1.08 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 2 }}
                            src={event.banner_url}
                            className="w-hero-img"
                            alt="wedding banner"
                        />
                    ) : (
                        <div className="w-hero-placeholder" />
                    )}
                    <div className="w-hero-overlay" />
                    <motion.div
                        className="w-hero-content"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.3 }}
                    >
                        <p className="w-pre-title">We're getting married!</p>
                        <h1 className="w-couple-hero">
                            <span>{d.partner1 || 'Partner'}</span>
                            <span className="w-amp">&amp;</span>
                            <span>{d.partner2 || 'Partner'}</span>
                        </h1>
                        <div className="w-hero-date">
                            {eventDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                        <div className="w-hero-location"><MapPin size={16} />{event.location}</div>
                    </motion.div>
                </header>

                {/* ── PHOTO GALLERY ── */}
                {d.gallery?.length > 0 && (
                    <section className="w-section">
                        <div className="w-gallery">
                            {d.gallery.slice(0, 6).map((url: string, i: number) => (
                                <motion.div
                                    key={i}
                                    className={`w-gallery-item ${i === 0 ? 'w-gallery-main' : ''}`}
                                    whileHover={{ scale: 1.02 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.08 }}
                                >
                                    <img src={url} alt={`Photo ${i + 1}`} />
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ── WELCOME TO OUR WEDDING ── */}
                {d.welcomeMessage && (
                    <section className="w-section w-welcome-section">
                        <div className="w-divider-ornament">✦ ✦ ✦</div>
                        <motion.div
                            className="w-welcome-box"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <Heart size={32} className="w-heart-icon" />
                            <h2 className="w-script-title">Welcome to our Wedding</h2>
                            <div className="w-thin-line" />
                            <p className="w-welcome-text">{d.welcomeMessage}</p>
                            <p className="w-couple-sig">— {d.partner1} &amp; {d.partner2}</p>
                        </motion.div>
                        <div className="w-divider-ornament">✦ ✦ ✦</div>
                    </section>
                )}

                {/* ── COUNTDOWN ── */}
                {timeLeft && (
                    <section className="w-countdown-section">
                        <p className="w-countdown-label">Can't wait to see you!</p>
                        <div className="w-countdown">
                            {[['days', timeLeft.days], ['hours', timeLeft.hours], ['minutes', timeLeft.minutes], ['seconds', timeLeft.seconds]].map(([label, val]) => (
                                <div key={label as string} className="w-count-box">
                                    <span className="w-count-num">{String(val).padStart(2, '0')}</span>
                                    <span className="w-count-label">{label as string}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ── OUR LOVE STORY ── */}
                {d.story && (
                    <section className="w-section w-story-section">
                        <div className="w-section-badge">love story</div>
                        <h2 className="w-script-title">Our Love Story</h2>
                        <div className="w-thin-line" />
                        <p className="w-story-text">{d.story}</p>
                    </section>
                )}

                {/* ── ORDER OF EVENTS ── */}
                {d.itinerary?.length > 0 && d.itinerary[0].activity && (
                    <section className="w-section w-events-section">
                        <div className="w-section-badge">the program</div>
                        <h2 className="w-script-title">Order of Events</h2>
                        <div className="w-thin-line" />
                        <div className="w-timeline">
                            {d.itinerary.map((item: any, i: number) => (
                                <motion.div
                                    key={i}
                                    className="w-timeline-item"
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <div className="w-tl-time">{item.time}</div>
                                    <div className="w-tl-dot-col">
                                        <div className="w-tl-dot" />
                                        {i < d.itinerary.length - 1 && <div className="w-tl-line" />}
                                    </div>
                                    <div className="w-tl-content">
                                        <p className="w-tl-activity">{item.activity}</p>
                                        {item.location && <p className="w-tl-venue"><MapPin size={12} /> {item.location}</p>}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ── GUEST INFO: Color Motif + Dress Code + Parking + Gift ── */}
                <section className="w-guest-info-section">
                    <div className="w-section-badge">guest info</div>

                    {/* Color Motif */}
                    {d.colorMotif?.length > 0 && (
                        <motion.div
                            className="w-info-card"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="w-info-title"><span className="w-info-icon">🎨</span> Color Motif</h3>
                            <div className="w-motif-swatches">
                                {d.colorMotif.map((color: string, i: number) => (
                                    <div key={i} className="w-motif-circle" style={{ background: color }} />
                                ))}
                            </div>
                            <p className="w-info-text">We kindly ask our guests to complement our wedding palette.</p>
                        </motion.div>
                    )}

                    {/* Dress Code */}
                    {d.dressCode && (
                        <motion.div
                            className="w-info-card"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="w-info-title"><Shirt size={18} className="w-info-svg" /> Dress Code</h3>
                            <p className="w-info-text">{d.dressCode}</p>
                        </motion.div>
                    )}

                    {/* Parking Note */}
                    {d.parkingNote && (
                        <motion.div
                            className="w-info-card"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="w-info-title"><Car size={18} className="w-info-svg" /> Travel &amp; Parking</h3>
                            <p className="w-info-text">{d.parkingNote}</p>
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="w-map-link"
                            >
                                📍 View on Google Maps →
                            </a>
                        </motion.div>
                    )}

                    {/* Note on Gifts */}
                    {d.giftNote && (
                        <motion.div
                            className="w-info-card w-gift-card"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <Gift size={32} className="w-gift-icon" />
                            <h3 className="w-script-title" style={{ fontSize: '2rem' }}>a note on gifts!</h3>
                            <p className="w-gift-from">from {d.partner1} and {d.partner2}</p>
                            <div className="w-thin-line" style={{ margin: '1rem auto' }} />
                            <p className="w-info-text">{d.giftNote}</p>
                        </motion.div>
                    )}
                </section>

                {/* ── RSVP FORM ── */}
                <section className="w-rsvp-section">
                    <div className="w-section-badge">kindly reply</div>
                    <h2 className="w-script-title">Confirm Your Attendance</h2>
                    <div className="w-thin-line" />
                    <p className="w-rsvp-deadline">
                        Please respond by {new Date(eventDate.getTime() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>

                    {submitted ? (
                        <motion.div className="w-rsvp-success" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                            <CheckCircle size={60} className="w-success-icon" />
                            <h3>Thank You!</h3>
                            <p>We can't wait to celebrate with you. See you soon!</p>
                            <p className="w-couple-sig">— {d.partner1} &amp; {d.partner2}</p>
                            <button className="w-btn-outline" onClick={() => setSubmitted(false)}>Update RSVP</button>
                        </motion.div>
                    ) : (
                        <form className="w-rsvp-form" onSubmit={handleRSVP}>
                            <div className="w-form-group">
                                <label>Full Name *</label>
                                <input type="text" required placeholder="Your full name" value={rsvpData.name} onChange={e => setRsvpData({ ...rsvpData, name: e.target.value })} />
                            </div>
                            <div className="w-form-group">
                                <label>Email Address</label>
                                <input type="email" placeholder="For updates & reminders" value={rsvpData.email} onChange={e => setRsvpData({ ...rsvpData, email: e.target.value })} />
                            </div>
                            <div className="w-attendance-toggle">
                                <button type="button" className={`w-att-btn ${rsvpData.status === 'attending' ? 'w-att-active' : ''}`} onClick={() => setRsvpData({ ...rsvpData, status: 'attending' })}>
                                    ✓ Joyfully Accepts
                                </button>
                                <button type="button" className={`w-att-btn ${rsvpData.status === 'declined' ? 'w-att-active' : ''}`} onClick={() => setRsvpData({ ...rsvpData, status: 'declined' })}>
                                    ✗ Regretfully Declines
                                </button>
                            </div>
                            {rsvpData.status === 'attending' && (
                                <div className="w-form-group">
                                    <label>Number of Guests</label>
                                    <select value={rsvpData.guests} onChange={e => setRsvpData({ ...rsvpData, guests: parseInt(e.target.value) })}>
                                        {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
                                    </select>
                                </div>
                            )}
                            <div className="w-form-group">
                                <label>Message / Special Notes</label>
                                <textarea rows={3} placeholder="Dietary restrictions, allergies, or a message for the couple..." value={rsvpData.notes} onChange={e => setRsvpData({ ...rsvpData, notes: e.target.value })} />
                            </div>
                            <button type="submit" className="w-rsvp-submit" disabled={submitting}>
                                {submitting ? <Loader2 size={18} className="ep-spin" /> : <><Send size={18} /> Send RSVP</>}
                            </button>
                        </form>
                    )}
                </section>

                {/* ── FOOTER ── */}
                <footer className="w-footer">
                    <div className="w-footer-hearts">
                        <Heart size={16} fill="currentColor" /><Heart size={22} fill="currentColor" /><Heart size={16} fill="currentColor" />
                    </div>
                    <p className="w-footer-names">{d.partner1} &amp; {d.partner2}</p>
                    <p className="w-footer-date">{eventDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    <p className="w-footer-credit">Created with <Heart size={12} fill="currentColor" style={{ display: 'inline', verticalAlign: 'middle' }} /> by <a href="https://inviteuonline.vercel.app" target="_blank" rel="noreferrer">InviteU Online</a></p>
                </footer>

                <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&family=Montserrat:wght@300;400;500;600&display=swap');

          :root { --tw: ${theme}; }

          .wedding-page {
            min-height: 100vh;
            background: #faf7f4;
            color: #3d2b1f;
            font-family: 'Montserrat', sans-serif;
          }

          /* ── HERO ── */
          .w-hero {
            position: relative;
            height: 100vh;
            min-height: 600px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
          }
          .w-hero-img {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .w-hero-placeholder {
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, #c8a97e 0%, #e8d5b7 50%, #f0e6d3 100%);
          }
          .w-hero-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.55) 100%);
          }
          .w-hero-content {
            position: relative;
            z-index: 10;
            text-align: center;
            color: white;
            padding: 2rem;
          }
          .w-pre-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.3rem;
            font-style: italic;
            letter-spacing: 3px;
            opacity: 0.9;
            margin-bottom: 1.5rem;
          }
          .w-couple-hero {
            font-family: 'Playfair Display', serif;
            font-size: clamp(3.5rem, 10vw, 7rem);
            font-weight: 400;
            line-height: 1.1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            flex-wrap: wrap;
            margin-bottom: 2rem;
            text-shadow: 0 2px 20px rgba(0,0,0,0.3);
          }
          .w-amp {
            font-family: 'Cormorant Garamond', serif;
            color: var(--tw);
            font-size: 0.6em;
            font-style: italic;
          }
          .w-hero-date {
            font-size: 1rem;
            letter-spacing: 4px;
            text-transform: uppercase;
            opacity: 0.85;
            margin-bottom: 0.75rem;
          }
          .w-hero-location {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            font-size: 0.95rem;
            opacity: 0.75;
          }

          /* ── SECTIONS ── */
          .w-section {
            max-width: 900px;
            margin: 0 auto;
            padding: 5rem 2rem;
          }
          .w-section-badge {
            display: inline-block;
            font-size: 0.7rem;
            font-weight: 700;
            letter-spacing: 4px;
            text-transform: uppercase;
            color: var(--tw);
            background: linear-gradient(135deg, rgba(200,169,126,0.12), rgba(215,185,140,0.08));
            border: 1px solid rgba(200,169,126,0.3);
            padding: 0.4rem 1.2rem;
            border-radius: 2rem;
            margin-bottom: 1.5rem;
          }
          .w-script-title {
            font-family: 'Playfair Display', serif;
            font-size: 3rem;
            font-weight: 400;
            font-style: italic;
            color: #3d2b1f;
            margin-bottom: 1rem;
            line-height: 1.2;
          }
          .w-thin-line {
            width: 60px;
            height: 2px;
            background: linear-gradient(90deg, transparent, var(--tw), transparent);
            margin: 0 auto 2rem;
            border-radius: 2px;
          }

          /* ── GALLERY ── */
          .w-gallery {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-auto-rows: 200px;
            gap: 0.75rem;
            max-width: 1000px;
            margin: 0 auto;
            padding: 0 2rem 5rem;
          }
          .w-gallery-item { border-radius: 0.75rem; overflow: hidden; transition: 0.3s; }
          .w-gallery-item img { width: 100%; height: 100%; object-fit: cover; }
          .w-gallery-main { grid-column: span 2; grid-row: span 2; border-radius: 1.2rem; }

          /* ── WELCOME ── */
          .w-welcome-section { text-align: center; }
          .w-divider-ornament { color: var(--tw); letter-spacing: 1rem; font-size: 0.9rem; margin: 1rem 0; opacity: 0.6; }
          .w-welcome-box { background: white; border-radius: 2rem; padding: 4rem 3rem; box-shadow: 0 10px 40px rgba(200,169,126,0.1); border: 1px solid rgba(200,169,126,0.2); margin: 2rem 0; }
          .w-heart-icon { color: var(--tw); margin-bottom: 1.5rem; }
          .w-welcome-text { font-family: 'Cormorant Garamond', serif; font-size: 1.35rem; line-height: 1.9; color: #5a3e2b; font-style: italic; max-width: 550px; margin: 0 auto 1.5rem; }
          .w-couple-sig { font-family: 'Playfair Display', serif; font-style: italic; color: var(--tw); font-size: 1.1rem; }

          /* ── COUNTDOWN ── */
          .w-countdown-section {
            background: linear-gradient(135deg, #3d2b1f 0%, #5a3e2b 100%);
            padding: 4rem 2rem;
            text-align: center;
          }
          .w-countdown-label { color: rgba(255,255,255,0.7); font-size: 0.85rem; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 2rem; font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 1.2rem; }
          .w-countdown { display: flex; justify-content: center; gap: 1.5rem; flex-wrap: wrap; }
          .w-count-box { min-width: 100px; background: rgba(255,255,255,0.08); border: 1px solid rgba(200,169,126,0.3); border-radius: 1.25rem; padding: 1.5rem 1rem; }
          .w-count-num { display: block; font-size: 3rem; font-weight: 700; color: var(--tw); font-family: 'Playfair Display', serif; line-height: 1; }
          .w-count-label { display: block; font-size: 0.7rem; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0.6); margin-top: 0.5rem; }

          /* ── STORY ── */
          .w-story-section { text-align: center; background: white; border-radius: 2rem; margin: 0 auto 0; max-width: 900px; box-shadow: 0 10px 40px rgba(200,169,126,0.08); }
          .w-story-text { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; line-height: 1.8; color: #5a3e2b; font-style: italic; max-width: 650px; margin: 0 auto; }

          /* ── ORDER OF EVENTS ── */
          .w-events-section {
            text-align: center;
            background: #fdf8f3;
            border-radius: 2rem;
            margin: 5rem auto;
            border: 1px solid rgba(200,169,126,0.15);
          }
          .w-timeline { max-width: 600px; margin: 0 auto; text-align: left; }
          .w-timeline-item { display: grid; grid-template-columns: 90px 50px 1fr; align-items: flex-start; margin-bottom: 0; }
          .w-tl-time { font-weight: 700; color: var(--tw); padding-top: 0.5rem; font-size: 0.9rem; text-align: right; padding-right: 0.5rem; }
          .w-tl-dot-col { display: flex; flex-direction: column; align-items: center; }
          .w-tl-dot { width: 16px; height: 16px; border-radius: 50%; background: var(--tw); border: 3px solid #faf7f4; box-shadow: 0 0 0 3px var(--tw); flex-shrink: 0; margin-top: 0.5rem; }
          .w-tl-line { width: 2px; flex: 1; background: linear-gradient(to bottom, var(--tw), rgba(200,169,126,0.2)); min-height: 40px; }
          .w-tl-content { padding: 0.25rem 0 2rem 0.75rem; }
          .w-tl-activity { font-weight: 700; font-size: 1.05rem; color: #3d2b1f; margin-bottom: 0.25rem; }
          .w-tl-venue { font-size: 0.85rem; color: #9c7a5c; display: flex; align-items: center; gap: 0.3rem; }

          /* ── GUEST INFO ── */
          .w-guest-info-section {
            max-width: 900px;
            margin: 0 auto;
            padding: 5rem 2rem;
            text-align: center;
          }
          .w-info-card {
            background: white;
            border-radius: 1.5rem;
            padding: 3rem;
            margin-bottom: 2rem;
            border: 1px solid rgba(200,169,126,0.2);
            box-shadow: 0 4px 20px rgba(200,169,126,0.08);
            text-align: center;
          }
          .w-info-title { font-size: 1.4rem; font-weight: 700; color: #3d2b1f; margin-bottom: 1.25rem; display: flex; align-items: center; justify-content: center; gap: 0.6rem; }
          .w-info-icon { font-size: 1.2rem; }
          .w-info-svg { color: var(--tw); }
          .w-info-text { font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; line-height: 1.7; color: #5a3e2b; }
          .w-motif-swatches { display: flex; justify-content: center; gap: 1rem; margin-bottom: 1.25rem; }
          .w-motif-circle { width: 48px; height: 48px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.12); }
          .w-map-link { display: inline-block; margin-top: 1rem; color: var(--tw); font-weight: 700; font-size: 0.9rem; text-decoration: none; }
          .w-gift-card { border: 2px dashed rgba(200,169,126,0.4); background: #fdf8f3; }
          .w-gift-icon { color: var(--tw); margin-bottom: 0.75rem; }
          .w-gift-from { font-family: 'Cormorant Garamond', serif; font-style: italic; color: #9c7a5c; font-size: 1.1rem; margin-bottom: 0.5rem; }

          /* ── RSVP ── */
          .w-rsvp-section {
            background: linear-gradient(135deg, #3d2b1f 0%, #5a3e2b 100%);
            padding: 6rem 2rem;
            text-align: center;
          }
          .w-rsvp-section .w-section-badge { color: #f0d9b5; border-color: rgba(240,217,181,0.3); background: rgba(240,217,181,0.1); }
          .w-rsvp-section .w-script-title { color: #f0e6d3; }
          .w-rsvp-section .w-thin-line { background: linear-gradient(90deg, transparent, #c8a97e, transparent); }
          .w-rsvp-deadline { color: rgba(255,255,255,0.65); font-size: 0.9rem; margin-bottom: 3rem; font-style: italic; }
          
          .w-rsvp-form {
            max-width: 500px;
            margin: 0 auto;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 2rem;
            padding: 3rem;
            backdrop-filter: blur(10px);
          }
          .w-form-group { margin-bottom: 1.5rem; text-align: left; }
          .w-form-group label { display: block; font-size: 0.75rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.6); margin-bottom: 0.5rem; }
          .w-form-group input, .w-form-group select, .w-form-group textarea {
            width: 100%;
            background: rgba(255,255,255,0.08);
            border: 1px solid rgba(255,255,255,0.15);
            border-radius: 0.75rem;
            padding: 1rem 1.25rem;
            color: white;
            font-size: 1rem;
            font-family: inherit;
            transition: 0.2s;
            box-sizing: border-box;
            resize: vertical;
          }
          .w-form-group input::placeholder, .w-form-group textarea::placeholder { color: rgba(255,255,255,0.35); }
          .w-form-group input:focus, .w-form-group select:focus, .w-form-group textarea:focus {
            outline: none;
            border-color: var(--tw);
            background: rgba(255,255,255,0.12);
          }
          .w-form-group select option { background: #3d2b1f; color: white; }
          .w-attendance-toggle { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
          .w-att-btn {
            padding: 1rem;
            border-radius: 0.75rem;
            border: 1px solid rgba(255,255,255,0.2);
            background: rgba(255,255,255,0.05);
            color: rgba(255,255,255,0.7);
            font-weight: 600;
            font-size: 0.85rem;
            cursor: pointer;
            transition: 0.2s;
          }
          .w-att-active {
            background: var(--tw);
            border-color: var(--tw);
            color: white;
            box-shadow: 0 8px 20px rgba(200,169,126,0.3);
          }
          .w-rsvp-submit {
            width: 100%;
            background: linear-gradient(135deg, var(--tw), #b5887a);
            color: white;
            border: none;
            padding: 1.25rem;
            border-radius: 0.75rem;
            font-size: 1.1rem;
            font-weight: 700;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            margin-top: 0.5rem;
            transition: 0.2s;
            font-family: inherit;
          }
          .w-rsvp-submit:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(200,169,126,0.4); }
          .w-rsvp-submit:disabled { opacity: 0.7; cursor: not-allowed; }
          .w-rsvp-success { max-width: 420px; margin: 0 auto; color: white; text-align: center; }
          .w-success-icon { color: var(--tw); margin-bottom: 1.5rem; }
          .w-rsvp-success h3 { font-family: 'Playfair Display', serif; font-size: 2.5rem; font-style: italic; margin-bottom: 1rem; }
          .w-rsvp-success p { font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; color: rgba(255,255,255,0.8); margin-bottom: 0.75rem; }
          .w-btn-outline { margin-top: 1.5rem; background: transparent; border: 1px solid rgba(255,255,255,0.4); color: white; padding: 0.75rem 2rem; border-radius: 2rem; font-size: 0.9rem; cursor: pointer; transition: 0.2s; }
          .w-btn-outline:hover { background: rgba(255,255,255,0.08); }

          /* ── FOOTER ── */
          .w-footer {
            background: #2a1d14;
            padding: 5rem 2rem;
            text-align: center;
            color: rgba(255,255,255,0.6);
          }
          .w-footer-hearts { color: var(--tw); display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 1rem; }
          .w-footer-names { font-family: 'Playfair Display', serif; font-style: italic; font-size: 2rem; color: #f0e6d3; margin-bottom: 0.5rem; }
          .w-footer-date { font-size: 0.85rem; letter-spacing: 2px; margin-bottom: 2rem; }
          .w-footer-credit { font-size: 0.8rem; }
          .w-footer a { color: var(--tw); text-decoration: none; font-weight: 600; }

          /* ── LOADING / ERROR ── */
          .ep-loading, .ep-error { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1.5rem; text-align: center; background: #faf7f4; }
          .ep-spin { animation: ep-spin-anim 1s linear infinite; color: var(--tw, #c8a97e); }
          @keyframes ep-spin-anim { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          .ep-btn { display: inline-block; padding: 0.85rem 2rem; border-radius: 0.75rem; font-weight: 700; text-decoration: none; background: #c8a97e; color: white; }
          .ep-btn-primary { background: #c8a97e; }

          @media (max-width: 768px) {
            .w-gallery { grid-template-columns: 1fr 1fr; grid-auto-rows: 140px; }
            .w-gallery-main { grid-column: span 2; grid-row: span 1; }
            .w-couple-hero { font-size: clamp(2.5rem, 12vw, 4rem); }
            .w-info-card { padding: 2rem 1.5rem; }
            .w-rsvp-form { padding: 2rem 1.5rem; }
            .w-attendance-toggle { grid-template-columns: 1fr; }
            .w-timeline-item { grid-template-columns: 80px 40px 1fr; }
          }
        `}</style>
            </div>
        );
    }

    // ───── BIRTHDAY / DEFAULT TEMPLATE ─────
    return (
        <div className="public-event-page" style={{ '--theme': theme } as any}>
            {event.event_type === 'Birthday' && <div className="birthday-pattern" />}

            <header className="event-hero">
                <div className="event-banner-container">
                    {event.banner_url ? (
                        <motion.img initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.5 }} src={event.banner_url} alt={event.title} className="event-banner-img" />
                    ) : (
                        <div className="event-banner-placeholder" style={{ background: `linear-gradient(135deg, ${theme}, #fff)` }} />
                    )}
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
                        {d.itinerary?.length > 0 && d.itinerary[0].activity && (
                            <div className="itinerary-section card">
                                <div className="section-header"><Clock size={24} /><h2>Program of Events</h2></div>
                                <div className="timeline">
                                    {d.itinerary.map((item: any, i: number) => (
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
        .public-event-page { min-height: 100vh; background: #f8fafc; padding-bottom: 5rem; color: #1e293b; }
        .birthday-pattern { position: fixed; inset: 0; opacity: 0.05; pointer-events: none; z-index: 0; background-image: radial-gradient(#064e3b 0.5px, transparent 0.5px); background-size: 20px 20px; }
        .event-loading, .event-error { height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1.5rem; text-align: center; padding: 2rem; }
        .event-hero { position: relative; height: 65vh; min-height: 450px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .event-banner-container { position: absolute; inset: 0; overflow: hidden; }
        .event-banner-img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.5); }
        .event-banner-placeholder { width: 100%; height: 100%; opacity: 0.1; }
        .event-hero-overlay { position: relative; z-index: 10; width: 100%; max-width: 900px; padding: 2rem; }
        .event-header-card { padding: 4rem 2rem; text-align: center; background: rgba(255,255,255,0.95); backdrop-filter: blur(12px); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.1); border-radius: 2rem; }
        .event-type-badge { display: inline-block; padding: 0.6rem 2rem; background: var(--theme); color: white; border-radius: 2rem; font-weight: 800; font-size: 0.8rem; text-transform: uppercase; margin-bottom: 2rem; letter-spacing: 2px; }
        .event-title { font-size: clamp(2.5rem, 6vw, 4.5rem); color: #0f172a; margin-bottom: 2.5rem; line-height: 1; font-weight: 900; }
        .event-quick-info { display: flex; justify-content: center; gap: 3rem; flex-wrap: wrap; color: #334155; font-weight: 700; font-size: 1.1rem; }
        .info-item { display: flex; align-items: center; gap: 0.75rem; }
        .info-item svg { color: var(--theme); }
        .event-body { margin-top: -100px; position: relative; z-index: 20; padding-bottom: 5rem; }
        .event-grid { display: grid; grid-template-columns: 2fr 1.2fr; gap: 4rem; align-items: start; }
        @media (max-width: 1000px) { .event-grid { grid-template-columns: 1fr; } .event-body { margin-top: 2rem; } }
        .card { background: white; padding: 3.5rem; border-radius: 2rem; border: 1px solid rgba(226,232,240,0.8); margin-bottom: 3rem; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.02); transition: 0.3s; }
        .card:hover { transform: translateY(-5px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.05); }
        .section-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2.5rem; color: var(--theme); }
        .section-header h2 { font-size: 1.8rem; font-weight: 900; color: #0f172a; margin: 0; }
        .birthday-welcome h2 { font-size: 2.2rem; margin-bottom: 1.5rem; }
        .birthday-welcome p { font-size: 1.2rem; line-height: 1.8; color: #475569; }
        .timeline { position: relative; padding-left: 2rem; }
        .timeline::before { content: ''; position: absolute; left: 106px; top: 0; bottom: 0; width: 2px; background: #e2e8f0; }
        .timeline-item { display: grid; grid-template-columns: 80px 50px 1fr; align-items: center; margin-bottom: 2.5rem; }
        .time-col { font-weight: 800; color: var(--theme); text-align: right; }
        .dot-col { display: flex; justify-content: center; position: relative; z-index: 5; }
        .timeline-dot { width: 14px; height: 14px; border-radius: 50%; background: var(--theme); border: 3px solid white; box-shadow: 0 0 0 4px var(--theme); }
        .activity-col { font-size: 1.15rem; font-weight: 700; color: #1e293b; background: #f8fafc; padding: 1rem 1.5rem; border-radius: 1rem; border: 1px solid #f1f5f9; }
        .map-link { color: var(--theme); font-weight: 800; text-decoration: none; border-bottom: 2px solid var(--theme); padding-bottom: 2px; margin-top: 1rem; display: inline-block; }
        .rsvp-card { padding: 3rem; background: white; border: 1px solid #e2e8f0; position: sticky; top: 120px; border-radius: 2rem; }
        .rsvp-card h3 { font-size: 1.8rem; margin-bottom: 2rem; font-weight: 900; }
        .form-group { margin-bottom: 1.5rem; }
        .form-group label { display: block; font-size: 0.8rem; font-weight: 800; color: #475569; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 1px; }
        .form-group input, .form-group select, .form-group textarea { width: 100%; border: 1px solid #e2e8f0; padding: 1rem 1.25rem; border-radius: 1rem; background: #f8fafc; font-size: 1rem; transition: 0.2s; box-sizing: border-box; }
        .status-toggle { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem; }
        .status-btn { padding: 1.25rem 0.5rem; border-radius: 1rem; border: 1px solid #e2e8f0; background: white; font-weight: 800; color: #64748b; transition: 0.3s; cursor: pointer; }
        .status-btn.active { background: var(--theme); color: white; border-color: var(--theme); }
        .rsvp-submit { width: 100%; justify-content: center; padding: 1.25rem; font-size: 1.2rem; font-weight: 900; }
        .rsvp-success-state { text-align: center; padding: 3rem 0; }
        .success-icon { color: #10b981; margin-bottom: 2rem; }
        .event-footer { text-align: center; padding: 5rem 0; color: #94a3b8; font-weight: 600; }
        .event-footer a { color: #1e293b; text-decoration: none; font-weight: 900; margin-left: 0.25rem; }
        .footer-links { display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 1rem; font-size: 0.9rem; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
};

export default EventPage;
