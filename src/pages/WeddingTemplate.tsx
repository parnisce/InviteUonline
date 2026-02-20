import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Send, CheckCircle, Loader2, Heart, Car, Gift, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

const ICONS: Record<string, string> = {
    ceremony: '⛪', reception: '🎀', dinner: '🍽️',
    cocktail: '🍹', photos: '📸', party: '🎉', after: '🍹', default: '💍',
};
const getIcon = (a: string) => {
    const l = a.toLowerCase();
    for (const k of Object.keys(ICONS)) if (l.includes(k)) return ICONS[k];
    return ICONS.default;
};

interface Props { event: any; timeLeft: any; }

const WeddingTemplate: React.FC<Props> = ({ event, timeLeft }) => {
    const d = event.event_details || {};
    const theme = event.theme_color || '#8b5e3c';
    const eventDate = new Date(event.event_date);
    const gallery: string[] = d.gallery || [];
    const itinerary = (d.itinerary || []).filter((i: any) => i.activity);
    const motif: string[] = d.colorMotif || [];

    const [rsvp, setRsvp] = useState({ name: '', email: '', status: 'attending', guests: 1, notes: '' });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [activeSlide, setActiveSlide] = useState(0);

    const nextSlide = () => { if (gallery.length > 0) setActiveSlide((prev: number) => (prev + 1) % gallery.length); };
    const prevSlide = () => { if (gallery.length > 0) setActiveSlide((prev: number) => (prev - 1 + gallery.length) % gallery.length); };

    const handleRSVP = async (e: React.FormEvent) => {
        e.preventDefault(); setSubmitting(true);
        try {
            await supabase.from('rsvps').insert({
                event_id: event.id, name: rsvp.name, email: rsvp.email,
                status: rsvp.status, guests_count: rsvp.guests, dietary_notes: rsvp.notes,
            });
            setSubmitted(true);
        } catch (err: any) { alert(err.message); }
        finally { setSubmitting(false); }
    };

    return (
        <div className="wt">

            {/* ── HERO ── */}
            <section className="wt-hero">
                {event.banner_url
                    ? <img src={event.banner_url} className="wt-hero-bg" alt="banner" />
                    : <div className="wt-hero-bg wt-hero-fallback" />}
                {/* Very light veil — let photo breathe */}
                <div className="wt-hero-veil" />

                {/* Couple names — centered over photo */}
                <motion.div
                    className="wt-hero-names"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2 }}
                >
                    <h1>
                        <span className="wt-name-line">{d.partner1 || 'Partner One'}</span>
                        <span className="wt-name-amp">&amp;</span>
                        <span className="wt-name-line">{d.partner2 || 'Partner Two'}</span>
                    </h1>
                </motion.div>

                {/* Bottom info — WE ARE GETTING MARRIED + RSVP + hashtag */}
                <motion.div
                    className="wt-hero-bottom"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    <p className="wt-hero-tagline">WE ARE GETTING MARRIED</p>
                    <div className="wt-hero-ornament">✦ ◈ ✦</div>
                    <a href="#wt-rsvp" className="wt-hero-rsvp-btn">RSVP</a>
                    {d.hashtag && <p className="wt-hero-hashtag">{d.hashtag.startsWith('#') ? d.hashtag : `#${d.hashtag}`}</p>}
                </motion.div>
            </section>


            {/* COUNTDOWN / SAVE THE DATE — FULL WIDTH */}
            <section className="wt-std-section" style={d.saveTheDateBanner ? { backgroundImage: `url(${d.saveTheDateBanner})` } : {}}>
                <div className="wt-std-overlay" />
                <div className="wt-std-content">
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}>
                        <p className="wt-std-title">Save the Date</p>

                        <div className="wt-std-date-hero">
                            <div className="wt-std-month-bg">{eventDate.toLocaleDateString('en-US', { month: 'long' })}</div>
                            <div className="wt-std-day">{String(eventDate.getDate()).padStart(2, '0')}</div>
                            <div className="wt-std-year">{eventDate.getFullYear()}</div>
                        </div>

                        <div className="wt-std-details">
                            <span>{eventDate.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()}</span>
                            <span className="wt-std-sep">|</span>
                            <span>{event.event_date.split('T')[1]?.substring(0, 5) || '3:00PM'}</span>
                        </div>

                        {timeLeft && (
                            <div className="wt-std-timer">
                                {[
                                    { label: 'Days', value: timeLeft.days },
                                    { label: 'Hours', value: timeLeft.hours },
                                    { label: 'Minutes', value: timeLeft.minutes },
                                    { label: 'Seconds', value: timeLeft.seconds }
                                ].map((item) => (
                                    <div key={item.label} className="wt-std-timer-box">
                                        <span className="wt-std-timer-num">{String(item.value).padStart(2, '0')}</span>
                                        <span className="wt-std-timer-unit">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* ── GALLERY SLIDESHOW ── */}
            {gallery.length > 0 && (
                <section className="wt-gallery-slider">
                    <div className="wt-slider-container">
                        <div className="wt-slides-track">
                            <AnimatePresence mode="popLayout">
                                {[-1, 0, 1].map((offset) => {
                                    const index = (activeSlide + offset + gallery.length) % gallery.length;
                                    const isCenter = offset === 0;
                                    return (
                                        <motion.div
                                            key={`${index}-${offset}`}
                                            className={`wt-slide-item ${isCenter ? 'center' : 'side'}`}
                                            initial={{ opacity: 0, scale: 0.8, x: offset * 320 }}
                                            animate={{
                                                opacity: 1,
                                                scale: isCenter ? 1.05 : 0.85,
                                                x: offset * 280,
                                                zIndex: isCenter ? 10 : 5,
                                                rotateY: offset * -15,
                                            }}
                                            exit={{ opacity: 0, scale: 0.5, x: offset * 400 }}
                                            transition={{ duration: 0.6, ease: "easeOut" }}
                                            onClick={() => {
                                                if (offset === -1) prevSlide();
                                                if (offset === 1) nextSlide();
                                            }}
                                        >
                                            <img src={gallery[index]} alt={`Gallery ${index}`} />
                                            {!isCenter && (
                                                <div className="wt-slide-nav-overlay">
                                                    {offset === -1 ? <ChevronLeft size={30} /> : <ChevronRight size={30} />}
                                                </div>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>

                        {/* Pagination Dots */}
                        <div className="wt-slider-dots">
                            {gallery.map((_, i) => (
                                <button
                                    key={i}
                                    className={`wt-dot ${i === activeSlide ? 'active' : ''}`}
                                    onClick={() => setActiveSlide(i)}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── MESSAGE SECTION ── */}
            <section className="wt-message-section">
                <div className="wt-message-inner">
                    <motion.div
                        className="wt-message-text"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    >
                        <h2 className="wt-script-fancy" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '1.5rem' }}>With hearts full of joy,</h2>
                        <div className="wt-message-p-container">
                            <p>We honor the union that brings two souls together as one.</p>
                            <p>It brings us great joy to celebrate this special day with you.</p>
                            <p>Your love, friendship, and support are deeply cherished, and we are honored to share this moment together.</p>
                            <p>To keep this occasion truly meaningful, we have chosen an intimate gathering with our dearest loved ones.</p>
                            <p>In this way, each guest is welcomed warmly, with a place at the table to share in the laughter, love, and feast.</p>
                        </div>
                    </motion.div>
                    <motion.div
                        className="wt-message-img"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    >
                        <img src={gallery[2] || gallery[0]} alt="Message" />
                    </motion.div>
                </div>
            </section>

            {/* ── ENTOURAGE SECTION ── */}
            <section className="wt-entourage-section">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                >
                    <h2 className="wt-script-fancy" style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)', marginBottom: '2rem' }}>The Wedding Entourage</h2>
                    <button className="wt-open-btn">OPEN</button>
                </motion.div>
            </section>





            {/* ── MAIN 2-COL BODY ── */}
            <div className="wt-body">

                {/* ════ LEFT COLUMN ════ */}
                <div className="wt-left">

                    {/* WELCOME */}
                    <section className="wt-welcome">
                        <span className="wt-leaf wt-leaf-l">🌿</span>
                        <span className="wt-leaf wt-leaf-r">🌿</span>
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                            <p className="wt-sub-label">a very warm</p>
                            <h2 className="wt-script-xl">Welcome to our Wedding</h2>
                            <div className="wt-dots">· · · · ·</div>
                            {d.welcomeMessage && <p className="wt-welcome-p">{d.welcomeMessage}</p>}
                            <p className="wt-sig">— {d.partner1} &amp; {d.partner2}</p>
                        </motion.div>
                    </section>

                    {/* LOVE STORY */}
                    {d.story && (
                        <section className="wt-story">
                            <div className="wt-story-inner">
                                {gallery[1] && <div className="wt-story-img"><img src={gallery[1]} alt="Our story" /></div>}
                                <div className="wt-story-text">
                                    <span className="wt-badge">love story</span>
                                    <h2 className="wt-script-lg">our Love Story</h2>
                                    <div className="wt-rule" />
                                    <p className="wt-serif-p">{d.story}</p>
                                </div>
                            </div>
                        </section>
                    )}


                    {/* ORDER OF EVENTS */}
                    {itinerary.length > 0 && (
                        <section className="wt-events">
                            <p className="wt-events-couple">{d.partner1} + {d.partner2}</p>
                            <h2 className="wt-script-lg">Order of Events</h2>
                            <div className="wt-rule" style={{ margin: '0 auto 2.5rem' }} />
                            <div className="wt-timeline">
                                {itinerary.map((item: any, i: number) => (
                                    <motion.div key={i} className="wt-tl-row"
                                        initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                                        <div className="wt-tl-icon">{getIcon(item.activity)}</div>
                                        <div className="wt-tl-mid">
                                            <div className="wt-tl-dot" />
                                            {i < itinerary.length - 1 && <div className="wt-tl-line" />}
                                        </div>
                                        <div className="wt-tl-info">
                                            <p className="wt-tl-name">{item.activity}</p>
                                            {item.time && <p className="wt-tl-time">{item.time}</p>}
                                            {item.location && <p className="wt-tl-loc"><MapPin size={11} /> {item.location}</p>}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* PHOTO COLLAGE */}
                    {gallery.length >= 3 && (
                        <div className="wt-collage">
                            {gallery.slice(0, 4).map((url, i) => (
                                <div key={i} className={`wt-c-img ${i === 0 ? 'wt-c-tall' : ''}`}>
                                    <img src={url} alt="" />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* WE'RE HAPPY */}
                    <section className="wt-happy">
                        <div className="wt-botanical-bg" />
                        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                            <h2 className="wt-happy-title">We're happy to see<br />you here!</h2>
                            <p className="wt-happy-sub">a little reminder to all our guests</p>
                            {d.dressCode && <p className="wt-happy-note">{d.dressCode}</p>}
                            <p className="wt-happy-sig">{d.partner1} &amp; {d.partner2}</p>
                        </motion.div>
                    </section>
                </div>

                {/* ════ RIGHT SIDEBAR ════ */}
                <div className="wt-right">
                    <div className="wt-sidebar-inner">

                        {/* Color Motif */}
                        {motif.length > 0 && (
                            <div className="wt-card">
                                <div className="wt-motif-dots">
                                    {motif.map((c, i) => <span key={i} className="wt-m-dot" style={{ background: c }} />)}
                                </div>
                                <p className="wt-card-text">Complement our wedding palette with these colors.</p>
                            </div>
                        )}

                        {/* Travel & Parking */}
                        {d.parkingNote && (
                            <div className="wt-card">
                                <h3 className="wt-card-script"><Car size={16} style={{ verticalAlign: 'middle', marginRight: 8 }} />Travel &amp; Parking</h3>
                                <p className="wt-card-addr"><MapPin size={12} /> {event.location}</p>
                                <p className="wt-card-text">{d.parkingNote}</p>
                                <a className="wt-map-btn" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`} target="_blank" rel="noreferrer">📍 View on Maps</a>
                            </div>
                        )}

                        {/* Note on Gifts */}
                        {d.giftNote && (
                            <div className="wt-card wt-gift-card">
                                <Gift size={32} className="wt-gift-ico" />
                                <h3 className="wt-script-xl" style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>a note on gifts!</h3>
                                <p className="wt-from-line">from {d.partner1} and {d.partner2}</p>
                                <hr className="wt-hr" />
                                <p className="wt-card-text">{d.giftNote}</p>
                                <p className="wt-gift-close">we can't wait to celebrate with love,<br /><em>{d.partner1} + {d.partner2}</em></p>
                            </div>
                        )}

                        {/* RSVP FORM */}
                        <div className="wt-rsvp-card">
                            <h3 className="wt-script-xl" style={{ color: '#f5edd8', fontSize: '2.2rem' }}>Kindly RSVP</h3>
                            <p className="wt-rsvp-by">Please respond by {new Date(eventDate.getTime() - 7 * 86400000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                            {submitted ? (
                                <div className="wt-success">
                                    <CheckCircle size={50} className="wt-check" />
                                    <h4>Thank you, {rsvp.name}!</h4>
                                    <p>See you on our special day! 🎉</p>
                                    <button className="wt-outline-btn" onClick={() => setSubmitted(false)}>Update Response</button>
                                </div>
                            ) : (
                                <form className="wt-form" onSubmit={handleRSVP}>
                                    <div className="wt-fg"><label>Full Name *</label><input required type="text" placeholder="Your full name" value={rsvp.name} onChange={e => setRsvp({ ...rsvp, name: e.target.value })} /></div>
                                    <div className="wt-fg"><label>Email</label><input type="email" placeholder="your@email.com" value={rsvp.email} onChange={e => setRsvp({ ...rsvp, email: e.target.value })} /></div>
                                    <div className="wt-toggle">
                                        <button type="button" className={rsvp.status === 'attending' ? 'on' : ''} onClick={() => setRsvp({ ...rsvp, status: 'attending' })}>✓ Joyfully Accepts</button>
                                        <button type="button" className={rsvp.status === 'declined' ? 'on' : ''} onClick={() => setRsvp({ ...rsvp, status: 'declined' })}>✗ Regretfully Declines</button>
                                    </div>
                                    {rsvp.status === 'attending' && (
                                        <div className="wt-fg">
                                            <label>Guests</label>
                                            <select value={rsvp.guests} onChange={e => setRsvp({ ...rsvp, guests: parseInt(e.target.value) })}>
                                                {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>)}
                                            </select>
                                        </div>
                                    )}
                                    <div className="wt-fg"><label>Notes</label><textarea rows={3} placeholder="Dietary needs, allergies, message..." value={rsvp.notes} onChange={e => setRsvp({ ...rsvp, notes: e.target.value })} /></div>
                                    <button type="submit" className="wt-submit" disabled={submitting}>
                                        {submitting ? <Loader2 size={18} className="wt-spin" /> : <><Send size={15} /> Send RSVP</>}
                                    </button>
                                </form>
                            )}
                        </div>

                    </div>
                </div>
            </div>



            {/* ── FOOTER ── */}
            <footer className="wt-footer">
                <div className="wt-fh"><Heart size={14} fill="currentColor" /><Heart size={20} fill="currentColor" /><Heart size={14} fill="currentColor" /></div>
                <p className="wt-fn">{d.partner1} &amp; {d.partner2}</p>
                <p className="wt-fd">{eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                <div className="wt-ficons">🌸 &nbsp; 🌿 &nbsp; 👗 &nbsp; 🌳</div>
                <p className="wt-fcredit">Created with <Heart size={10} fill="currentColor" style={{ display: 'inline', verticalAlign: 'middle' }} /> by <a href="https://inviteuonline.vercel.app" target="_blank" rel="noreferrer">InviteU Online</a></p>
            </footer>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;600;700&family=Playfair+Display:ital,wght@0,400;1,400&family=Lato:wght@300;400;700&display=swap');

        /* ─ BASE ─ */
        .wt { font-family: 'Lato', sans-serif; background: #faf5ee; color: #3d1f0e; min-height: 100vh; }

        /* ─ HERO ─ */
        .wt-hero { position: relative; height: 92vh; min-height: 560px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .wt-hero-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center center; }
        .wt-hero-fallback { background: linear-gradient(160deg, #d4c5b0 0%, #e8d5b7 50%, #f5edd8 100%); }
        /* Very subtle veil — photo must remain vivid */
        .wt-hero-veil { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0.42) 100%); }

        /* Couple Names — large, centered, over the photo */
        .wt-hero-names { position: absolute; top: 10%; left: 0; width: 100%; transform: translateY(-54%); z-index: 10; text-align: center; pointer-events: none; padding: 0 1rem; }
        .wt-hero-names h1 { display: flex; flex-direction: column; align-items: center; gap: 0; margin: 0; }
        .wt-name-line { font-family: 'Dancing Script', cursive; font-size: clamp(5rem, 11vw, 9rem); font-weight: 600; color: white; line-height: 1.02; text-shadow: 0 2px 40px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.08); letter-spacing: -1px; }
        .wt-name-amp { font-family: 'Dancing Script', cursive; font-size: clamp(2.8rem, 5.5vw, 5rem); font-weight: 400; color: rgba(255,255,255,0.82); line-height: 0.85; }

        /* Bottom strip — WE ARE GETTING MARRIED / ornament / RSVP / hashtag */
        .wt-hero-bottom { position: absolute; bottom: 3rem; left: 0; width: 100%; z-index: 10; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 0.85rem; }
        .wt-hero-tagline { font-size: 0.72rem; font-weight: 700; letter-spacing: 7px; text-transform: uppercase; color: rgba(255,255,255,0.82); margin: 0; }
        .wt-hero-ornament { font-size: 0.7rem; color: rgba(255,255,255,0.45); letter-spacing: 6px; margin: -0.3rem 0; }
        .wt-hero-rsvp-btn { display: inline-block; border: 1.5px solid rgba(255,255,255,0.75); color: white; background: rgba(255,255,255,0.1); backdrop-filter: blur(6px); padding: 0.6rem 3rem; border-radius: 2rem; font-size: 0.72rem; font-weight: 700; letter-spacing: 6px; text-decoration: none; text-transform: uppercase; transition: 0.3s; cursor: pointer; }
        .wt-hero-rsvp-btn:hover { background: rgba(255,255,255,0.22); border-color: white; transform: translateY(-2px); }
        .wt-hero-hashtag { font-family: 'Dancing Script', cursive; font-size: clamp(1.3rem, 2.5vw, 1.8rem); color: rgba(255,255,255,0.85); letter-spacing: 1px; margin: 0; font-weight: 600; text-shadow: 0 1px 12px rgba(0,0,0,0.18); }

        /* Removed celebrate button */

        /* ─ BODY 2-COL ─ */
        .wt-body { display: grid; grid-template-columns: 1fr 400px; gap: 0; max-width: 1300px; margin: 0 auto; align-items: start; padding: 60px 2rem 0; }
        .wt-left { min-width: 0; }
        .wt-right { position: sticky; top: 90px; padding-left: 2rem; }
        .wt-sidebar-inner { display: flex; flex-direction: column; gap: 1.5rem; max-height: calc(100vh - 120px); overflow-y: auto; padding-bottom: 2rem; scrollbar-width: thin; scrollbar-color: ${theme} transparent; }

        /* ─ WELCOME ─ */
        .wt-welcome { background: linear-gradient(160deg, #6b3a1f 0%, #8b4e28 65%, #7a3b16 100%); color: #f5edd8; text-align: center; padding: 5rem 4rem 4rem; position: relative; border-radius: 0 0 2rem 2rem; margin-bottom: 3rem; }
        .wt-leaf { position: absolute; top: 2.5rem; font-size: 2.8rem; opacity: 0.3; }
        .wt-leaf-l { left: 2.5rem; transform: scaleX(-1); }
        .wt-leaf-r { right: 2.5rem; }
        .wt-sub-label { font-size: 0.75rem; letter-spacing: 4px; text-transform: uppercase; opacity: 0.6; margin-bottom: 0.5rem; }
        .wt-script-xl { font-family: 'Dancing Script', cursive; font-size: clamp(2.3rem, 5vw, 3.4rem); font-weight: 600; line-height: 1.18; margin: 0 0 0.75rem; }
        .wt-dots { letter-spacing: 0.4rem; opacity: 0.45; margin: 0.75rem 0; }
        .wt-welcome-p { font-family: 'Playfair Display', serif; font-style: italic; font-size: 1.08rem; line-height: 1.9; max-width: 520px; margin: 0 auto 1.5rem; opacity: 0.85; }
        .wt-sig { font-family: 'Dancing Script', cursive; font-size: 1.35rem; opacity: 0.7; }

        /* ─ LOVE STORY ─ */
        .wt-story { padding: 3rem 0 3.5rem; }
        .wt-story-inner { display: flex; gap: 3rem; align-items: flex-start; }
        .wt-story-img { width: 240px; flex-shrink: 0; border-radius: 1.5rem; overflow: hidden; box-shadow: 0 12px 40px rgba(107,58,31,0.22); }
        .wt-story-img img { width: 100%; height: 300px; object-fit: cover; }
        .wt-story-text { flex: 1; }
        .wt-badge { font-size: 0.68rem; font-weight: 700; letter-spacing: 4px; text-transform: uppercase; color: ${theme}; background: rgba(139,94,60,0.1); border: 1px solid rgba(139,94,60,0.25); border-radius: 2rem; padding: 0.3rem 1rem; display: inline-block; margin-bottom: 0.75rem; }
        .wt-script-lg { font-family: 'Dancing Script', cursive; font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 600; color: #5c2d0e; margin: 0 0 0.6rem; }
        .wt-rule { width: 50px; height: 2px; background: linear-gradient(90deg, transparent, ${theme}, transparent); border: none; border-radius: 2px; margin-bottom: 1.25rem; }
        .wt-serif-p { font-family: 'Playfair Display', serif; font-style: italic; font-size: 1.08rem; line-height: 1.85; color: #5c3c2a; }

        /* ─ COUNTDOWN ─ */
        .wt-countdown { background: #3d1f0e; border-radius: 1.5rem; padding: 3.5rem 2.5rem; text-align: center; margin-bottom: 3rem; }
        .wt-cd-year { font-family: 'Playfair Display', serif; font-size: 5.5rem; color: rgba(200,169,126,0.12); line-height: 1; margin-bottom: -1.5rem; font-weight: 400; }
        .wt-cd-dow-row { display: flex; justify-content: center; gap: 1rem; margin-bottom: 1.25rem; }
        .wt-cd-dow-row span { color: rgba(200,169,126,0.45); font-size: 0.68rem; font-weight: 700; letter-spacing: 1px; }
        .wt-cd-tagline { font-family: 'Dancing Script', cursive; color: rgba(240,220,190,0.75); font-size: 1.3rem; margin-bottom: 2rem; }
        /* ─ SAVE THE DATE / COUNTDOWN ─ */
        .wt-std-section { position: relative; padding: 5rem 2rem 14rem; background-size: cover; background-position: center; background-attachment: fixed; background-color: #fffaf5; overflow: hidden; text-align: center; }
        .wt-std-overlay { position: absolute; inset: 0; background: rgba(255,250,245,0.72); }
        .wt-std-content { position: relative; z-index: 10; max-width: 800px; margin: 0 auto; color: #5a3d2b; }
        
        .wt-std-title { font-family: 'Dancing Script', cursive; font-size: 2.22rem; margin-bottom: 1.5rem; opacity: 0.8; }
        
        .wt-std-date-hero { position: relative; height: 180px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .wt-std-month-bg { font-family: 'Dancing Script', cursive; font-size: clamp(5rem, 15vw, 12rem); color: rgba(139,94,60,0.12); position: absolute; top: 45%; left: 50%; transform: translate(-50%, -50%); white-space: nowrap; pointer-events: none; line-height: 1; z-index: 1; }
        .wt-std-day { font-family: 'Playfair Display', serif; font-size: clamp(6.5rem, 20vw, 14rem); font-weight: 500; line-height: 1; margin: 0; color: #5a3d2b; position: relative; z-index: 2; }
        .wt-std-year { font-family: 'Lato', sans-serif; font-size: 2.6rem; font-weight: 300; letter-spacing: 0.65rem; margin-top: -1.5rem; opacity: 0.95; position: relative; z-index: 3; }
        
        .wt-std-details { font-family: 'Lato', sans-serif; font-size: 0.82rem; letter-spacing: 5px; font-weight: 700; text-transform: uppercase; margin: 2rem 0 4.5rem; opacity: 0.75; display: flex; align-items: center; justify-content: center; gap: 1.5rem; }
        .wt-std-sep { opacity: 0.4; font-weight: 300; }
        
        .wt-std-timer { display: flex; justify-content: center; gap: clamp(1.5rem, 5vw, 4rem); margin-top: 3.5rem; border-top: 1px solid rgba(90,61,43,0.12); padding-top: 3.5rem; padding-bottom: 6.5em; }
        .wt-std-timer-box { display: flex; flex-direction: column; align-items: center; min-width: 80px; }
        .wt-std-timer-num { font-family: 'Lato', sans-serif; font-size: 1.6rem; font-weight: 400; color: #5a3d2b; margin-bottom: 0.35rem; }
        .wt-std-timer-unit { font-size: 0.68rem; text-transform: uppercase; letter-spacing: 2px; opacity: 0.6; font-weight: 700; }
        
        @media (max-width: 600px) {
            .wt-std-section { padding: 5rem 2rem 10rem; }
            .wt-std-timer { gap: 1.25rem; }
            .wt-std-timer-box { min-width: 50px; }
            .wt-std-timer-num { font-size: 1.4rem; }
        }

        /* ─ GALLERY SLIDESHOW ─ */
        .wt-gallery-slider { position: relative; padding: 0 0 6rem; overflow: visible; background: #fff; perspective: 1500px; margin-top: -18rem; z-index: 20; }
        .wt-slider-container { max-width: 1400px; margin: 0 auto; position: relative; display: flex; flex-direction: column; align-items: center; }
        .wt-slides-track { display: flex; justify-content: center; align-items: center; position: relative; height: clamp(400px, 60vh, 650px); width: 100%; transform-style: preserve-3d; }
        
        .wt-slide-item { position: absolute; width: clamp(280px, 32vw, 420px); height: 100%; border-radius: 1.5rem; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.2); cursor: pointer; transform-style: preserve-3d; transition: filter 0.5s; background: #eee; }
        .wt-slide-item.side { filter: brightness(0.8); }
        .wt-slide-item.center { filter: brightness(1); box-shadow: 0 30px 60px rgba(0,0,0,0.3); }
        .wt-slide-item img { width: 100%; height: 100%; object-fit: cover; }
        
        .wt-slide-nav-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.15); color: white; transition: 0.3s; opacity: 0; pointer-events: none; }
        .wt-slide-item.side:hover .wt-slide-nav-overlay { opacity: 1; }
        
        .wt-slider-dots { display: flex; justify-content: center; gap: 0.8rem; margin-top: 4rem; flex-wrap: wrap; max-width: 90%; }
        .wt-dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(90,61,43,0.15); border: none; padding: 0; cursor: pointer; transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .wt-dot.active { background: #5a3d2b; transform: scale(1.4); }

        @media (max-width: 850px) {
            .wt-slides-track { height: 500px; }
            .wt-slide-item { width: 70vw; height: 100%; }
            .wt-slide-item.side { display: none; }
            .wt-gallery-slider { margin-top: -8rem; }
        }

        /* ─ MESSAGE & ENTOURAGE ─ */
        .wt-script-fancy { font-family: 'Dancing Script', cursive; color: #8b6b8d; }
        .wt-message-section { padding: 8rem 2rem; background: #fff; position: relative; z-index: 10; }
        .wt-message-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1.2fr 1fr; gap: 5rem; align-items: center; }
        .wt-message-text { text-align: left; }
        .wt-message-p-container { color: #6a4a3a; line-height: 1.9; font-size: 1.1rem; display: flex; flex-direction: column; gap: 1.5rem; }
        .wt-message-img { border-radius: 2.5rem; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.1); }
        .wt-message-img img { width: 100%; display: block; }

        .wt-entourage-section { padding: 8rem 2rem; background: #faf5ee; text-align: center; border-top: 1px solid rgba(0,0,0,0.03); }
        .wt-open-btn { background: #8b6b8d; color: white; border: none; padding: 1rem 5.5rem; border-radius: 3rem; font-size: 1rem; font-weight: 700; cursor: pointer; transition: 0.3s; letter-spacing: 2px; box-shadow: 0 10px 25px rgba(139,107,141,0.25); }
        .wt-open-btn:hover { background: #7a5a7c; transform: translateY(-3px); box-shadow: 0 15px 35px rgba(139,107,141,0.35); }

        @media (max-width: 960px) {
            .wt-message-inner { grid-template-columns: 1fr; gap: 3rem; text-align: center; }
            .wt-message-text { text-align: center; }
        }


        /* ─ ORDER OF EVENTS ─ */
        .wt-events { background: #fdf8f2; border-radius: 1.5rem; padding: 3.5rem 3rem; margin-bottom: 3rem; text-align: center; }
        .wt-events-couple { font-family: 'Dancing Script', cursive; font-size: 1.35rem; color: ${theme}; margin-bottom: 0.2rem; }
        .wt-timeline { max-width: 480px; margin: 0 auto; text-align: left; }
        .wt-tl-row { display: grid; grid-template-columns: 44px 38px 1fr; align-items: flex-start; }
        .wt-tl-icon { font-size: 1.4rem; padding-top: 2px; }
        .wt-tl-mid { display: flex; flex-direction: column; align-items: center; }
        .wt-tl-dot { width: 13px; height: 13px; border-radius: 50%; background: ${theme}; border: 3px solid #fdf8f2; box-shadow: 0 0 0 2px ${theme}; margin-top: 5px; flex-shrink: 0; }
        .wt-tl-line { width: 2px; flex: 1; min-height: 40px; background: linear-gradient(to bottom, ${theme}, rgba(139,94,60,0.15)); }
        .wt-tl-info { padding: 0 0 2.25rem 0.75rem; }
        .wt-tl-name { font-weight: 700; font-size: 0.98rem; color: #3d1f0e; }
        .wt-tl-time { font-size: 0.8rem; color: ${theme}; font-weight: 600; margin-top: 2px; }
        .wt-tl-loc { font-size: 0.76rem; color: #9c7a5c; display: flex; align-items: center; gap: 3px; margin-top: 2px; }

        /* ─ COLLAGE ─ */
        .wt-collage { display: grid; grid-template-columns: 2fr 1fr 1fr; grid-template-rows: 180px 180px; gap: 5px; border-radius: 1.5rem; overflow: hidden; margin-bottom: 3rem; }
        .wt-c-img { overflow: hidden; }
        .wt-c-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
        .wt-c-img:hover img { transform: scale(1.05); }
        .wt-c-tall { grid-row: span 2; }

        /* ─ WE'RE HAPPY ─ */
        .wt-happy { background: linear-gradient(160deg, #f5edd8 0%, #e8d5b7 100%); border-radius: 1.5rem; padding: 5rem 3rem; text-align: center; position: relative; overflow: hidden; margin-bottom: 3rem; }
        .wt-botanical-bg { position: absolute; inset: 0; opacity: 0.05; background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='2' fill='%238b5e3c'/%3E%3C/svg%3E"); background-size: 30px; }
        .wt-happy-title { font-family: 'Dancing Script', cursive; font-size: clamp(2.5rem, 5vw, 4rem); color: #5c2d0e; line-height: 1.18; margin-bottom: 0.75rem; }
        .wt-happy-sub { font-size: 0.78rem; letter-spacing: 3px; text-transform: uppercase; color: #9c7a5c; margin-bottom: 1.5rem; }
        .wt-happy-note { max-width: 420px; margin: 0 auto 1.25rem; line-height: 1.7; color: #5c3c2a; font-size: 1rem; }
        .wt-happy-sig { font-family: 'Dancing Script', cursive; font-size: 1.7rem; color: ${theme}; }

        /* ─ SIDEBAR CARDS ─ */
        .wt-card { background: white; border-radius: 1.25rem; padding: 2rem; border: 1px solid rgba(139,94,60,0.14); box-shadow: 0 4px 20px rgba(107,58,31,0.07); text-align: center; }
        .wt-card-script { font-family: 'Dancing Script', cursive; font-size: 1.65rem; color: #5c2d0e; margin-bottom: 0.6rem; display: flex; align-items: center; justify-content: center; gap: 0.4rem; }
        .wt-card-addr { font-size: 0.82rem; color: #9c7a5c; display: flex; align-items: center; justify-content: center; gap: 4px; margin-bottom: 0.6rem; }
        .wt-card-text { font-size: 0.96rem; line-height: 1.7; color: #5c3c2a; }
        .wt-map-btn { display: inline-block; margin-top: 1rem; background: ${theme}; color: white; padding: 0.5rem 1.5rem; border-radius: 2rem; font-size: 0.82rem; font-weight: 700; text-decoration: none; transition: 0.2s; }
        .wt-map-btn:hover { filter: brightness(0.88); }
        .wt-motif-dots { display: flex; justify-content: center; gap: 0.65rem; margin-bottom: 0.75rem; }
        .wt-m-dot { width: 40px; height: 40px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.12); display: inline-block; }

        /* ─ GIFT ─ */
        .wt-gift-card { background: #fdf5e8; border: 2px dashed rgba(139,94,60,0.3); }
        .wt-gift-ico { color: ${theme}; margin-bottom: 0.5rem; }
        .wt-from-line { font-family: 'Playfair Display', serif; font-style: italic; color: #9c7a5c; font-size: 0.92rem; }
        .wt-hr { border: none; border-top: 1px solid rgba(139,94,60,0.2); margin: 1rem 0; }
        .wt-gift-close { font-family: 'Dancing Script', cursive; font-size: 1.2rem; color: ${theme}; margin-top: 1rem; }

        /* ─ RSVP CARD ─ */
        .wt-rsvp-card { background: linear-gradient(160deg, #5c2d0e, #6b3a1f); border-radius: 1.25rem; padding: 2rem; text-align: center; }
        .wt-rsvp-by { color: rgba(245,237,216,0.6); font-size: 0.82rem; font-style: italic; margin: 0.4rem 0 1.5rem; }
        .wt-form { text-align: left; }
        .wt-fg { margin-bottom: 1rem; }
        .wt-fg label { display: block; font-size: 0.68rem; letter-spacing: 2px; text-transform: uppercase; color: rgba(245,237,216,0.55); margin-bottom: 0.35rem; font-weight: 700; }
        .wt-fg input, .wt-fg select, .wt-fg textarea { width: 100%; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.14); border-radius: 0.55rem; padding: 0.75rem 0.9rem; color: #f5edd8; font-size: 0.9rem; font-family: inherit; transition: 0.2s; box-sizing: border-box; resize: vertical; }
        .wt-fg input::placeholder, .wt-fg textarea::placeholder { color: rgba(245,237,216,0.3); }
        .wt-fg input:focus, .wt-fg select:focus, .wt-fg textarea:focus { outline: none; border-color: ${theme}; background: rgba(255,255,255,0.12); }
        .wt-fg select option { background: #5c2d0e; }
        .wt-toggle { display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; margin-bottom: 1rem; }
        .wt-toggle button { padding: 0.75rem 0.4rem; border: 1px solid rgba(255,255,255,0.18); background: rgba(255,255,255,0.05); color: rgba(245,237,216,0.65); border-radius: 0.55rem; font-weight: 600; font-size: 0.75rem; cursor: pointer; transition: 0.2s; font-family: inherit; }
        .wt-toggle button.on { background: ${theme}; border-color: ${theme}; color: white; box-shadow: 0 5px 16px rgba(139,94,60,0.35); }
        .wt-submit { width: 100%; background: linear-gradient(135deg, ${theme}, #a06230); color: white; border: none; padding: 1rem; border-radius: 0.7rem; font-size: 0.95rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.55rem; margin-top: 0.4rem; font-family: inherit; transition: 0.2s; }
        .wt-submit:hover { transform: translateY(-2px); box-shadow: 0 10px 26px rgba(139,94,60,0.4); }
        .wt-submit:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }
        .wt-success { color: #f5edd8; text-align: center; padding: 1.5rem 0; }
        .wt-check { color: #d4a57a; margin-bottom: 0.75rem; }
        .wt-success h4 { font-family: 'Dancing Script', cursive; font-size: 1.8rem; margin-bottom: 0.5rem; }
        .wt-success p { font-size: 0.92rem; opacity: 0.75; margin-bottom: 0.4rem; }
        .wt-outline-btn { margin-top: 1rem; background: transparent; border: 1px solid rgba(245,237,216,0.35); color: #f5edd8; padding: 0.55rem 1.5rem; border-radius: 2rem; font-size: 0.85rem; cursor: pointer; }

        /* ─ FOOTER ─ */
        .wt-footer { background: #2a1208; padding: 4rem 2rem; text-align: center; color: rgba(200,169,126,0.65); }
        .wt-fh { color: ${theme}; display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 1rem; }
        .wt-fn { font-family: 'Dancing Script', cursive; font-size: 2rem; color: #f0e0c8; margin-bottom: 0.3rem; }
        .wt-fd { font-size: 0.78rem; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 1.25rem; }
        .wt-ficons { font-size: 1.4rem; margin-bottom: 1.25rem; opacity: 0.45; }
        .wt-fcredit { font-size: 0.75rem; }
        .wt-footer a { color: ${theme}; text-decoration: none; font-weight: 600; }

        .wt-spin { animation: wt-spin 1s linear infinite; }
        @keyframes wt-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        /* ─ RESPONSIVE ─ */
        @media (max-width: 960px) {
          .wt-body { grid-template-columns: 1fr; padding: 50px 1rem 0; }
          .wt-right { position: static; padding-left: 0; }
          .wt-sidebar-inner { max-height: none; overflow-y: visible; }
          .wt-polaroids { gap: 1rem; }
          .wt-polaroid { width: 100px; }
        }
        @media (max-width: 600px) {
          .wt-polaroids { display: none; }
          .wt-story-inner { flex-direction: column; }
          .wt-story-img { width: 100%; }
          .wt-collage { grid-template-columns: 1fr 1fr; grid-template-rows: 140px 140px; }
          .wt-c-tall { grid-row: span 1; }
          .wt-toggle { grid-template-columns: 1fr; }
        }
      `}</style>
        </div >
    );
};

export default WeddingTemplate;
