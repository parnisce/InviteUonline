import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Send, CheckCircle, Loader2, Heart, Car, Gift } from 'lucide-react';
import { supabase } from '../lib/supabase';

const ICONS: Record<string, string> = {
    ceremony: '⛪',
    reception: '🎀',
    dinner: '🍽️',
    cocktail: '📸',
    photos: '📸',
    after: '🍹',
    party: '🎉',
    default: '💍',
};
const getIcon = (activity: string) => {
    const low = activity.toLowerCase();
    for (const k of Object.keys(ICONS)) if (low.includes(k)) return ICONS[k];
    return ICONS.default;
};

interface Props {
    event: any;
    timeLeft: any;
}

const WeddingTemplate: React.FC<Props> = ({ event, timeLeft }) => {
    const d = event.event_details || {};
    const theme = event.theme_color || '#8b5e3c';
    const eventDate = new Date(event.event_date);

    const [rsvp, setRsvp] = useState({ name: '', email: '', status: 'attending', guests: 1, notes: '' });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleRSVP = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await supabase.from('rsvps').insert({
                event_id: event.id, name: rsvp.name, email: rsvp.email,
                status: rsvp.status, guests_count: rsvp.guests, dietary_notes: rsvp.notes,
            });
            setSubmitted(true);
        } catch (err: any) { alert(err.message); }
        finally { setSubmitting(false); }
    };

    const gallery = d.gallery || [];
    const itinerary = (d.itinerary || []).filter((i: any) => i.activity);
    const motif: string[] = d.colorMotif || [];

    return (
        <div className="wt-page">

            {/* ─── HERO ─── */}
            <section className="wt-hero">
                {event.banner_url
                    ? <img src={event.banner_url} className="wt-hero-bg" alt="banner" />
                    : <div className="wt-hero-bg wt-hero-bg-default" />}
                <div className="wt-hero-veil" />
                <motion.div className="wt-hero-text" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
                    <p className="wt-pre">Happily</p>
                    <h1 className="wt-every-after">EVERY AFTER</h1>
                    <p className="wt-begins">Begins Here</p>
                    <div className="wt-hero-date-pill">
                        {eventDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                </motion.div>

                {/* Polaroid strip */}
                {gallery.length > 0 && (
                    <div className="wt-polaroid-strip">
                        {gallery.slice(0, 3).map((url: string, i: number) => (
                            <div key={i} className="wt-polaroid" style={{ transform: `rotate(${[-3, 1.5, -2][i] ?? 0}deg)` }}>
                                <img src={url} alt="" />
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* ─── WELCOME ─── */}
            <section className="wt-welcome">
                <div className="wt-leaf-deco left">🌿</div>
                <div className="wt-leaf-deco right">🌿</div>
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <p className="wt-section-sub">a very warm</p>
                    <h2 className="wt-script-lg">Welcome to our Wedding</h2>
                    <div className="wt-divider-dots">· · · · ·</div>
                    {d.welcomeMessage && <p className="wt-welcome-body">{d.welcomeMessage}</p>}
                    <p className="wt-sig">— {d.partner1} &amp; {d.partner2}</p>
                </motion.div>
            </section>

            {/* ─── LOVE STORY ─── */}
            {d.story && (
                <section className="wt-story">
                    <div className="wt-story-inner container-sm">
                        {gallery[1] && (
                            <div className="wt-story-photo">
                                <img src={gallery[1]} alt="Story" />
                            </div>
                        )}
                        <div className="wt-story-text-col">
                            <p className="wt-section-tag">love story</p>
                            <h2 className="wt-script-md">our Love Story</h2>
                            <div className="wt-thin-rule" />
                            <p className="wt-story-body">{d.story}</p>
                        </div>
                    </div>
                </section>
            )}

            {/* ─── COUNTDOWN ─── */}
            {timeLeft && (
                <section className="wt-countdown">
                    <div className="wt-cd-year">{eventDate.getFullYear()}</div>
                    <div className="wt-cd-cal-row">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                            <span key={d} className="wt-cd-dow">{d}</span>
                        ))}
                    </div>
                    <p className="wt-cd-label">Can't wait to see you, lovebirds!</p>
                    <div className="wt-cd-timer">
                        {[['days', timeLeft.days], ['hours', timeLeft.hours], ['min', timeLeft.minutes], ['sec', timeLeft.seconds]].map(([l, v]) => (
                            <div key={l as string} className="wt-cd-block">
                                <span className="wt-cd-num">{String(v).padStart(2, '0')}</span>
                                <span className="wt-cd-unit">{l as string}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ─── ORDER OF EVENTS ─── */}
            {itinerary.length > 0 && (
                <section className="wt-events">
                    <p className="wt-events-couple">{d.partner1} + {d.partner2}</p>
                    <h2 className="wt-script-md">Order of Events</h2>
                    <div className="wt-thin-rule" style={{ margin: '0 auto 2.5rem' }} />
                    <div className="wt-timeline">
                        {itinerary.map((item: any, i: number) => (
                            <motion.div key={i} className="wt-tl-item"
                                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                                <div className="wt-tl-icon">{getIcon(item.activity)}</div>
                                <div className="wt-tl-connector">
                                    <div className="wt-tl-dot" />
                                    {i < itinerary.length - 1 && <div className="wt-tl-line" />}
                                </div>
                                <div className="wt-tl-info">
                                    <p className="wt-tl-activity">{item.activity}</p>
                                    {item.time && <p className="wt-tl-time">{item.time}</p>}
                                    {item.location && <p className="wt-tl-loc"><MapPin size={11} /> {item.location}</p>}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {/* ─── PHOTO COLLAGE FOOTER ─── */}
            {gallery.length >= 3 && (
                <div className="wt-collage">
                    {gallery.slice(0, 4).map((url: string, i: number) => (
                        <div key={i} className={`wt-collage-img ${i === 0 ? 'wt-collage-tall' : ''}`}>
                            <img src={url} alt="" />
                        </div>
                    ))}
                </div>
            )}

            {/* ─── "WE'RE HAPPY TO SEE YOU" ─── */}
            <section className="wt-happy">
                <div className="wt-botanical" />
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                    <h2 className="wt-happy-title">We're happy to see<br />you here!</h2>
                    <p className="wt-happy-sub">a little reminder to all our guests</p>
                    {d.dressCode && <p className="wt-happy-body"><strong>Dress Code:</strong> {d.dressCode}</p>}
                    <p className="wt-happy-names">{d.partner1} &amp; {d.partner2}</p>
                </motion.div>
            </section>

            {/* ─── GUEST INFO CARDS ─── */}
            <section className="wt-info-section">
                {/* Color Motif */}
                {motif.length > 0 && (
                    <motion.div className="wt-info-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <div className="wt-motif-circles">
                            {motif.map((c, i) => <span key={i} className="wt-motif-dot" style={{ background: c }} />)}
                        </div>
                        <p className="wt-info-card-text">Our wedding palette — feel free to complement your attire with these colors.</p>
                    </motion.div>
                )}

                {/* Travel & Parking */}
                {d.parkingNote && (
                    <motion.div className="wt-info-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h3 className="wt-info-script"><Car size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} />Travel &amp; Parking</h3>
                        <p className="wt-info-addr"><MapPin size={13} /> {event.location}</p>
                        <p className="wt-info-card-text">{d.parkingNote}</p>
                        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`} target="_blank" rel="noreferrer" className="wt-map-btn">📍 View on Maps</a>
                    </motion.div>
                )}

                {/* Note on Gifts */}
                {d.giftNote && (
                    <motion.div className="wt-gift-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <Gift size={36} className="wt-gift-icon" />
                        <h3 className="wt-script-lg" style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>a note on gifts!</h3>
                        <p className="wt-gift-from">from {d.partner1} and {d.partner2}</p>
                        <div className="wt-thin-rule" style={{ margin: '1.25rem auto' }} />
                        <p className="wt-info-card-text">{d.giftNote}</p>
                        <p className="wt-gift-closing">we can't wait to celebrate with love,<br /><em>{d.partner1} + {d.partner2}</em></p>
                    </motion.div>
                )}
            </section>

            {/* ─── RSVP ─── */}
            <section className="wt-rsvp-section">
                <h2 className="wt-script-lg" style={{ color: '#5c2d0e' }}>Kindly RSVP</h2>
                <p className="wt-rsvp-deadline">
                    Please respond by {new Date(eventDate.getTime() - 7 * 86400000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>

                {submitted ? (
                    <motion.div className="wt-rsvp-success" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                        <CheckCircle size={56} className="wt-check-icon" />
                        <h3>Thank you, {rsvp.name}!</h3>
                        <p>We can't wait to see you on our special day.</p>
                        <p><em>— {d.partner1} &amp; {d.partner2}</em></p>
                        <button className="wt-outline-btn" onClick={() => setSubmitted(false)}>Update Response</button>
                    </motion.div>
                ) : (
                    <form className="wt-rsvp-form" onSubmit={handleRSVP}>
                        <div className="wt-fg">
                            <label>Full Name *</label>
                            <input required type="text" placeholder="Your full name" value={rsvp.name} onChange={e => setRsvp({ ...rsvp, name: e.target.value })} />
                        </div>
                        <div className="wt-fg">
                            <label>Email Address</label>
                            <input type="email" placeholder="your@email.com" value={rsvp.email} onChange={e => setRsvp({ ...rsvp, email: e.target.value })} />
                        </div>
                        <div className="wt-att-row">
                            <button type="button" className={`wt-att ${rsvp.status === 'attending' ? 'active' : ''}`} onClick={() => setRsvp({ ...rsvp, status: 'attending' })}>✓ Joyfully Accepts</button>
                            <button type="button" className={`wt-att ${rsvp.status === 'declined' ? 'active' : ''}`} onClick={() => setRsvp({ ...rsvp, status: 'declined' })}>✗ Regretfully Declines</button>
                        </div>
                        {rsvp.status === 'attending' && (
                            <div className="wt-fg">
                                <label>Number of Guests</label>
                                <select value={rsvp.guests} onChange={e => setRsvp({ ...rsvp, guests: parseInt(e.target.value) })}>
                                    {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>)}
                                </select>
                            </div>
                        )}
                        <div className="wt-fg">
                            <label>Notes / Dietary Restrictions</label>
                            <textarea rows={3} placeholder="Any special notes for the couple..." value={rsvp.notes} onChange={e => setRsvp({ ...rsvp, notes: e.target.value })} />
                        </div>
                        <button type="submit" className="wt-rsvp-submit" disabled={submitting}>
                            {submitting ? <Loader2 size={18} className="wt-spin" /> : <><Send size={16} /> Send My RSVP</>}
                        </button>
                    </form>
                )}
            </section>

            {/* ─── FOOTER ─── */}
            <footer className="wt-footer">
                <div className="wt-footer-hearts">
                    <Heart size={14} fill="currentColor" />
                    <Heart size={20} fill="currentColor" />
                    <Heart size={14} fill="currentColor" />
                </div>
                <p className="wt-footer-names">{d.partner1} &amp; {d.partner2}</p>
                <p className="wt-footer-date">{eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                <div className="wt-footer-icons">🌸 🌿 👗 🌳</div>
                <p className="wt-footer-credit">Thank you for visiting! Created with <Heart size={11} fill="currentColor" style={{ display: 'inline', verticalAlign: 'middle' }} /> by <a href="https://inviteuonline.vercel.app" target="_blank" rel="noreferrer">InviteU Online</a></p>
            </footer>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;600;700&family=Playfair+Display:ital,wght@0,400;1,400&family=Lato:wght@300;400;700&display=swap');

        .wt-page { font-family: 'Lato', sans-serif; background: #faf5ee; color: #3d1f0e; min-height: 100vh; }

        /* HERO */
        .wt-hero { position: relative; height: 100vh; min-height: 580px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .wt-hero-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .wt-hero-bg-default { background: linear-gradient(160deg, #8b5e3c 0%, #c8a97e 50%, #e8d5b7 100%); }
        .wt-hero-veil { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(60,25,5,0.65)); }
        .wt-hero-text { position: relative; z-index: 10; text-align: center; color: #fff; padding: 0 1rem; }
        .wt-pre { font-family: 'Dancing Script', cursive; font-size: 2rem; opacity: 0.9; margin-bottom: -0.5rem; }
        .wt-every-after { font-family: 'Lato', sans-serif; font-weight: 700; font-size: clamp(2.8rem, 9vw, 5.5rem); letter-spacing: 0.2em; text-shadow: 0 2px 20px rgba(0,0,0,0.4); margin: 0; }
        .wt-begins { font-family: 'Dancing Script', cursive; font-size: 1.8rem; opacity: 0.88; margin-top: 0.25rem; }
        .wt-hero-date-pill { margin-top: 2rem; display: inline-block; background: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.35); backdrop-filter: blur(6px); padding: 0.6rem 2rem; border-radius: 2rem; font-size: 0.9rem; letter-spacing: 2px; }

        /* POLAROIDS */
        .wt-polaroid-strip { position: absolute; bottom: -30px; left: 50%; transform: translateX(-50%); display: flex; gap: 1.5rem; z-index: 20; }
        .wt-polaroid { background: white; padding: 8px 8px 28px; box-shadow: 0 8px 25px rgba(0,0,0,0.3); width: 110px; }
        .wt-polaroid img { width: 100%; height: 90px; object-fit: cover; display: block; }

        /* WELCOME */
        .wt-welcome { background: linear-gradient(160deg, #6b3a1f 0%, #8b4e28 60%, #7a3b16 100%); color: #f5edd8; text-align: center; padding: 6rem 2rem 4rem; position: relative; margin-top: 30px; }
        .wt-leaf-deco { position: absolute; top: 2rem; font-size: 2.5rem; opacity: 0.35; }
        .wt-leaf-deco.left { left: 2rem; transform: scaleX(-1); }
        .wt-leaf-deco.right { right: 2rem; }
        .wt-section-sub { font-size: 0.8rem; letter-spacing: 4px; text-transform: uppercase; opacity: 0.65; margin-bottom: 0.75rem; }
        .wt-script-lg { font-family: 'Dancing Script', cursive; font-size: clamp(2.5rem, 7vw, 3.8rem); font-weight: 600; line-height: 1.15; color: inherit; margin: 0 0 1rem; }
        .wt-script-md { font-family: 'Dancing Script', cursive; font-size: clamp(2rem, 6vw, 3rem); font-weight: 600; color: #5c2d0e; margin: 0 0 0.75rem; }
        .wt-divider-dots { letter-spacing: 0.4rem; opacity: 0.5; margin: 1rem 0; }
        .wt-welcome-body { font-family: 'Playfair Display', serif; font-style: italic; font-size: 1.1rem; line-height: 1.9; max-width: 540px; margin: 0 auto 1.5rem; opacity: 0.85; }
        .wt-sig { font-family: 'Dancing Script', cursive; font-size: 1.4rem; opacity: 0.75; }

        /* LOVE STORY */
        .wt-story { background: #faf5ee; padding: 5rem 2rem; }
        .container-sm { max-width: 860px; margin: 0 auto; display: flex; gap: 3rem; align-items: flex-start; flex-wrap: wrap; }
        .wt-story-photo { width: 260px; flex-shrink: 0; border-radius: 1.5rem; overflow: hidden; box-shadow: 0 12px 40px rgba(107,58,31,0.2); }
        .wt-story-photo img { width: 100%; height: 320px; object-fit: cover; }
        .wt-story-text-col { flex: 1; min-width: 200px; }
        .wt-section-tag { font-size: 0.7rem; font-weight: 700; letter-spacing: 4px; text-transform: uppercase; color: ${theme}; background: rgba(139,94,60,0.1); border: 1px solid rgba(139,94,60,0.25); border-radius: 2rem; padding: 0.35rem 1rem; display: inline-block; margin-bottom: 1rem; }
        .wt-thin-rule { width: 50px; height: 2px; background: linear-gradient(90deg, transparent, ${theme}, transparent); border-radius: 2px; margin-bottom: 1.5rem; }
        .wt-story-body { font-family: 'Playfair Display', serif; font-style: italic; font-size: 1.1rem; line-height: 1.85; color: #5c3c2a; }

        /* COUNTDOWN */
        .wt-countdown { background: #3d1f0e; padding: 4rem 2rem; text-align: center; }
        .wt-cd-year { font-family: 'Playfair Display', serif; font-size: 5rem; color: rgba(200,169,126,0.15); font-weight: 400; line-height: 1; margin-bottom: -1rem; }
        .wt-cd-cal-row { display: flex; justify-content: center; gap: 1rem; margin-bottom: 1.5rem; }
        .wt-cd-dow { color: rgba(200,169,126,0.5); font-size: 0.7rem; letter-spacing: 1px; font-weight: 700; }
        .wt-cd-label { font-family: 'Dancing Script', cursive; color: rgba(240,220,190,0.8); font-size: 1.4rem; margin-bottom: 2rem; }
        .wt-cd-timer { display: flex; justify-content: center; gap: 0.5rem; align-items: center; }
        .wt-cd-block { text-align: center; min-width: 70px; }
        .wt-cd-num { display: block; font-size: 3.5rem; font-weight: 700; color: ${theme}; font-family: 'Playfair Display', serif; line-height: 1; }
        .wt-cd-unit { display: block; font-size: 0.65rem; letter-spacing: 3px; text-transform: uppercase; color: rgba(200,169,126,0.6); margin-top: 0.25rem; }
        .wt-cd-timer .wt-cd-block:not(:last-child)::after { content: ':'; font-size: 3rem; color: ${theme}; font-weight: 700; margin: 0 -0.25rem; position: relative; top: -8px; display: inline-block; margin-left: 0.5rem; }

        /* ORDER OF EVENTS */
        .wt-events { background: #fdf8f2; padding: 5rem 2rem; text-align: center; }
        .wt-events-couple { font-family: 'Dancing Script', cursive; font-size: 1.4rem; color: ${theme}; margin-bottom: 0.25rem; }
        .wt-timeline { max-width: 520px; margin: 0 auto; text-align: left; }
        .wt-tl-item { display: grid; grid-template-columns: 44px 40px 1fr; align-items: flex-start; margin-bottom: 0; }
        .wt-tl-icon { font-size: 1.4rem; padding-top: 2px; text-align: center; }
        .wt-tl-connector { display: flex; flex-direction: column; align-items: center; }
        .wt-tl-dot { width: 14px; height: 14px; border-radius: 50%; background: ${theme}; border: 3px solid #fdf8f2; box-shadow: 0 0 0 2px ${theme}; margin-top: 5px; }
        .wt-tl-line { width: 2px; flex: 1; min-height: 44px; background: linear-gradient(to bottom, ${theme}, rgba(139,94,60,0.2)); }
        .wt-tl-info { padding: 0 0 2.5rem 0.75rem; }
        .wt-tl-activity { font-weight: 700; font-size: 1rem; color: #3d1f0e; }
        .wt-tl-time { font-size: 0.82rem; color: ${theme}; font-weight: 600; margin-top: 2px; }
        .wt-tl-loc { font-size: 0.78rem; color: #9c7a5c; display: flex; align-items: center; gap: 3px; margin-top: 2px; }

        /* COLLAGE */
        .wt-collage { display: grid; grid-template-columns: 2fr 1fr 1fr; grid-template-rows: 180px 180px; gap: 4px; max-height: 364px; overflow: hidden; }
        .wt-collage-img { overflow: hidden; }
        .wt-collage-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s; }
        .wt-collage-img:hover img { transform: scale(1.05); }
        .wt-collage-tall { grid-row: span 2; }

        /* HAPPY SECTION */
        .wt-happy { background: linear-gradient(160deg, #f5edd8 0%, #e8d5b7 100%); padding: 6rem 2rem; text-align: center; position: relative; overflow: hidden; }
        .wt-botanical { position: absolute; inset: 0; opacity: 0.06; background-image: url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%238b5e3c' fill-opacity='1'%3E%3Ccircle cx='40' cy='40' r='3'/%3E%3C/g%3E%3C/svg%3E"); background-size: 40px; }
        .wt-happy-title { font-family: 'Dancing Script', cursive; font-size: clamp(2.8rem, 8vw, 4.5rem); color: #5c2d0e; line-height: 1.15; margin-bottom: 0.75rem; }
        .wt-happy-sub { font-size: 0.85rem; letter-spacing: 3px; text-transform: uppercase; color: #9c7a5c; margin-bottom: 1.5rem; }
        .wt-happy-body { max-width: 440px; margin: 0 auto 1.25rem; line-height: 1.7; color: #5c3c2a; font-size: 1.05rem; }
        .wt-happy-names { font-family: 'Dancing Script', cursive; font-size: 1.8rem; color: ${theme}; }

        /* GUEST INFO */
        .wt-info-section { background: linear-gradient(180deg, #fdf8f2 0%, #f5edd8 100%); padding: 4rem 2rem; max-width: 680px; margin: 0 auto; }
        .wt-info-card { background: white; border-radius: 1.5rem; padding: 2.5rem; margin-bottom: 1.75rem; border: 1px solid rgba(139,94,60,0.15); box-shadow: 0 4px 20px rgba(107,58,31,0.07); }
        .wt-info-script { font-family: 'Dancing Script', cursive; font-size: 1.8rem; color: #5c2d0e; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem; }
        .wt-info-addr { font-size: 0.85rem; color: #9c7a5c; display: flex; align-items: center; gap: 4px; margin-bottom: 0.75rem; }
        .wt-info-card-text { font-size: 1rem; line-height: 1.7; color: #5c3c2a; }
        .wt-map-btn { display: inline-block; margin-top: 1rem; background: ${theme}; color: white; padding: 0.5rem 1.5rem; border-radius: 2rem; font-size: 0.85rem; font-weight: 700; text-decoration: none; transition: 0.2s; }
        .wt-map-btn:hover { filter: brightness(0.9); }
        .wt-motif-circles { display: flex; justify-content: center; gap: 0.75rem; margin-bottom: 1rem; }
        .wt-motif-dot { width: 44px; height: 44px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.12); display: inline-block; }
        .wt-thin-rule { width: 50px; height: 2px; background: linear-gradient(90deg, transparent, ${theme}, transparent); border: none; border-radius: 2px; }

        /* GIFT */
        .wt-gift-card { background: #fdf5e8; border: 2px dashed rgba(139,94,60,0.3); border-radius: 1.5rem; padding: 3rem 2.5rem; text-align: center; margin-bottom: 1.75rem; }
        .wt-gift-icon { color: ${theme}; margin-bottom: 0.75rem; }
        .wt-gift-from { font-family: 'Playfair Display', serif; font-style: italic; color: #9c7a5c; font-size: 1rem; margin-bottom: 0; }
        .wt-gift-closing { font-family: 'Dancing Script', cursive; font-size: 1.3rem; color: ${theme}; margin-top: 1.5rem; }

        /* RSVP */
        .wt-rsvp-section { background: #5c2d0e; padding: 5rem 2rem; text-align: center; }
        .wt-rsvp-section .wt-script-lg { color: #f5edd8; }
        .wt-rsvp-deadline { color: rgba(245,237,216,0.65); font-size: 0.9rem; font-style: italic; margin-bottom: 2.5rem; }
        .wt-rsvp-form { max-width: 480px; margin: 0 auto; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 1.5rem; padding: 2.5rem; text-align: left; }
        .wt-fg { margin-bottom: 1.25rem; }
        .wt-fg label { display: block; font-size: 0.72rem; letter-spacing: 2px; text-transform: uppercase; color: rgba(245,237,216,0.6); margin-bottom: 0.4rem; font-weight: 700; }
        .wt-fg input, .wt-fg select, .wt-fg textarea { width: 100%; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 0.6rem; padding: 0.85rem 1rem; color: #f5edd8; font-size: 0.95rem; font-family: inherit; transition: 0.2s; box-sizing: border-box; resize: vertical; }
        .wt-fg input::placeholder, .wt-fg textarea::placeholder { color: rgba(245,237,216,0.3); }
        .wt-fg input:focus, .wt-fg select:focus, .wt-fg textarea:focus { outline: none; border-color: ${theme}; background: rgba(255,255,255,0.12); }
        .wt-fg select option { background: #5c2d0e; }
        .wt-att-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.25rem; }
        .wt-att { padding: 0.85rem 0.5rem; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.05); color: rgba(245,237,216,0.7); border-radius: 0.6rem; font-weight: 600; font-size: 0.82rem; cursor: pointer; transition: 0.2s; font-family: inherit; }
        .wt-att.active { background: ${theme}; border-color: ${theme}; color: white; box-shadow: 0 6px 18px rgba(139,94,60,0.35); }
        .wt-rsvp-submit { width: 100%; background: linear-gradient(135deg, ${theme}, #a0622a); color: white; border: none; padding: 1.1rem; border-radius: 0.75rem; font-size: 1rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.6rem; margin-top: 0.5rem; font-family: inherit; transition: 0.2s; }
        .wt-rsvp-submit:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(139,94,60,0.4); }
        .wt-rsvp-submit:disabled { opacity: 0.65; cursor: not-allowed; }
        .wt-rsvp-success { max-width: 420px; margin: 0 auto; color: #f5edd8; text-align: center; }
        .wt-check-icon { color: #d4a57a; margin-bottom: 1rem; }
        .wt-rsvp-success h3 { font-family: 'Dancing Script', cursive; font-size: 2.2rem; margin-bottom: 0.75rem; }
        .wt-rsvp-success p { font-size: 1rem; line-height: 1.7; opacity: 0.8; margin-bottom: 0.5rem; }
        .wt-outline-btn { margin-top: 1.5rem; background: transparent; border: 1px solid rgba(245,237,216,0.4); color: #f5edd8; padding: 0.65rem 1.75rem; border-radius: 2rem; font-size: 0.9rem; cursor: pointer; transition: 0.2s; }
        .wt-outline-btn:hover { background: rgba(255,255,255,0.08); }

        /* FOOTER */
        .wt-footer { background: #2a1208; padding: 4rem 2rem; text-align: center; color: rgba(200,169,126,0.7); }
        .wt-footer-hearts { color: ${theme}; display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 1rem; }
        .wt-footer-names { font-family: 'Dancing Script', cursive; font-size: 2.2rem; color: #f0e0c8; margin-bottom: 0.4rem; }
        .wt-footer-date { font-size: 0.82rem; letter-spacing: 2px; margin-bottom: 1.5rem; text-transform: uppercase; }
        .wt-footer-icons { font-size: 1.5rem; letter-spacing: 1rem; margin-bottom: 1.5rem; opacity: 0.5; }
        .wt-footer-credit { font-size: 0.78rem; }
        .wt-footer a { color: ${theme}; text-decoration: none; font-weight: 600; }

        /* UTILS */
        .wt-spin { animation: wt-spin-anim 1s linear infinite; }
        @keyframes wt-spin-anim { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        @media (max-width: 640px) {
          .wt-polaroid-strip { display: none; }
          .container-sm { flex-direction: column; }
          .wt-story-photo { width: 100%; }
          .wt-collage { grid-template-columns: 1fr 1fr; grid-template-rows: 140px 140px; }
          .wt-collage-tall { grid-row: span 1; }
          .wt-cd-timer { flex-wrap: wrap; }
          .wt-att-row { grid-template-columns: 1fr; }
          .wt-rsvp-form { padding: 2rem 1.25rem; }
        }
      `}</style>
        </div>
    );
};

export default WeddingTemplate;
