import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';



interface Props { event: any; timeLeft: any; }

const WeddingTemplate: React.FC<Props> = ({ event, timeLeft }) => {
    const d = event.event_details || {};
    const eventDate = new Date(event.event_date);
    const gallery: string[] = d.gallery || [];

    const [activeSlide, setActiveSlide] = useState(0);

    const nextSlide = () => { if (gallery.length > 0) setActiveSlide((prev: number) => (prev + 1) % gallery.length); };
    const prevSlide = () => { if (gallery.length > 0) setActiveSlide((prev: number) => (prev - 1 + gallery.length) % gallery.length); };

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
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeSlide}
                                    className="wt-slide-item center"
                                    initial={{ opacity: 0, scale: 1.04 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.96 }}
                                    transition={{ duration: 0.7, ease: 'easeInOut' }}
                                >
                                    <img src={gallery[activeSlide]} alt={`Gallery ${activeSlide}`} />
                                </motion.div>
                            </AnimatePresence>

                            {/* Prev / Next arrows */}
                            <button className="wt-arrow wt-arrow-l" onClick={prevSlide} aria-label="Previous">
                                <ChevronLeft size={28} />
                            </button>
                            <button className="wt-arrow wt-arrow-r" onClick={nextSlide} aria-label="Next">
                                <ChevronRight size={28} />
                            </button>
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
                    className="wt-ent-panel"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                >
                    {/* Title */}
                    <h2 className="wt-ent-title">The Entourage</h2>
                    <div className="wt-ent-bouquet">💐</div>

                    {/* Parents Row */}
                    <div className="wt-ent-parents-row">
                        <div className="wt-ent-col">
                            <h3 className="wt-ent-group-title">Parents of the Groom</h3>
                            {(d.entourage?.parentsOfGroom || ['Mr. Juan Dela Cruz', 'Mrs. Juana Dela Cruz']).map((name: string, i: number) => (
                                <p key={i} className="wt-ent-name">{name}</p>
                            ))}
                        </div>
                        <div className="wt-ent-col">
                            <h3 className="wt-ent-group-title">Parents of the Bride</h3>
                            {(d.entourage?.parentsOfBride || ['Mr. Juan Dela Cruz', 'Mrs. Juana Dela Cruz']).map((name: string, i: number) => (
                                <p key={i} className="wt-ent-name">{name}</p>
                            ))}
                        </div>
                    </div>

                    {/* Principal & Secondary Sponsors — side by side */}
                    <div className="wt-ent-sponsors-side">

                        {/* Principal Sponsors */}
                        <div className="wt-ent-block">
                            <h3 className="wt-ent-group-title wt-ent-center">Principal Sponsors</h3>
                            <div className="wt-ent-sponsors-grid">
                                {(d.entourage?.principalSponsorsMale || ['Mr. Juan Dela Cruz', 'Mr. Juan Dela Cruz', 'Mr. Juan Dela Cruz', 'Mr. Juan Dela Cruz', 'Mr. Juan Dela Cruz', 'Mr. Juan Dela Cruz']).map((name: string, i: number) => (
                                    <p key={i} className="wt-ent-name">{name}</p>
                                ))}
                                {(d.entourage?.principalSponsorsFemale || ['Mrs. Juana Dela Cruz', 'Mrs. Juana Dela Cruz', 'Mrs. Juana Dela Cruz', 'Mrs. Juana Dela Cruz', 'Mrs. Juana Dela Cruz', 'Mrs. Juana Dela Cruz']).map((name: string, i: number) => (
                                    <p key={i} className="wt-ent-name">{name}</p>
                                ))}
                            </div>
                            {d.entourage?.principalSponsorsSolo && (
                                <p className="wt-ent-name wt-ent-center" style={{ marginTop: '0.5rem' }}>{d.entourage.principalSponsorsSolo}</p>
                            )}
                            {!d.entourage?.principalSponsorsSolo && (
                                <p className="wt-ent-name wt-ent-center" style={{ marginTop: '0.5rem' }}>Ms. Carla Magpayo</p>
                            )}
                        </div>

                        {/* Secondary Sponsors */}
                        <div className="wt-ent-block">
                            <h3 className="wt-ent-group-title wt-ent-center">Secondary Sponsors</h3>
                            <div className="wt-ent-parents-row">
                                <div className="wt-ent-col">
                                    <h4 className="wt-ent-sub-title">Candle</h4>
                                    {(d.entourage?.candleSponsors || ['Mr. Juan Dela Cruz', 'Ms. Juana Dela Cruz']).map((name: string, i: number) => (
                                        <p key={i} className="wt-ent-name">{name}</p>
                                    ))}
                                </div>
                                <div className="wt-ent-col">
                                    <h4 className="wt-ent-sub-title">Veil</h4>
                                    {(d.entourage?.veilSponsors || ['Mr. Juan Dela Cruz', 'Ms. Juana Dela Cruz']).map((name: string, i: number) => (
                                        <p key={i} className="wt-ent-name">{name}</p>
                                    ))}
                                </div>
                            </div>
                            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                                <h4 className="wt-ent-sub-title">Cord</h4>
                                {(d.entourage?.cordSponsors || ['Mr. Juan Dela Cruz', 'Ms. Juana Dela Cruz']).map((name: string, i: number) => (
                                    <p key={i} className="wt-ent-name">{name}</p>
                                ))}
                            </div>
                            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                                <h4 className="wt-ent-sub-title">Bible</h4>
                                {(d.entourage?.bibleSponsors || ['Mr. Juan Dela Cruz', 'Ms. Juana Dela Cruz']).map((name: string, i: number) => (
                                    <p key={i} className="wt-ent-name">{name}</p>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Best Men & Matrons */}
                    <div className="wt-ent-parents-row">
                        <div className="wt-ent-col">
                            <h3 className="wt-ent-group-title">Best Men</h3>
                            {(d.entourage?.bestMen || ['Mr. Juan Dela Cruz']).map((name: string, i: number) => (
                                <p key={i} className="wt-ent-name">{name}</p>
                            ))}
                        </div>
                        <div className="wt-ent-col">
                            <h3 className="wt-ent-group-title">Matrons of Honor</h3>
                            {(d.entourage?.matronsOfHonor || ['Ms. Juana Dela Cruz']).map((name: string, i: number) => (
                                <p key={i} className="wt-ent-name">{name}</p>
                            ))}
                        </div>
                    </div>



                    {/* Groomsmen & Bridesmaids */}
                    <div className="wt-ent-block">
                        <div className="wt-ent-parents-row">
                            <div className="wt-ent-col">
                                <h3 className="wt-ent-group-title">Groomsmen</h3>
                                {(d.entourage?.groomsmen || ['Mr. Juan Dela Cruz', 'Mr. Juan Dela Cruz', 'Mr. Juan Dela Cruz', 'Mr. Juan Dela Cruz', 'Mr. Juan Dela Cruz', 'Mr. Juan Dela Cruz', 'Mr. Juan Dela Cruz', 'Mr. Juan Dela Cruz', 'Mr. Juan Dela Cruz']).map((name: string, i: number) => (
                                    <p key={i} className="wt-ent-name">{name}</p>
                                ))}
                            </div>
                            <div className="wt-ent-col">
                                <h3 className="wt-ent-group-title">Bridesmaids</h3>
                                {(d.entourage?.bridesmaids || ['Ms. Juana Dela Cruz', 'Ms. Juana Dela Cruz', 'Ms. Juana Dela Cruz', 'Ms. Juana Dela Cruz', 'Ms. Juana Dela Cruz', 'Ms. Juana Dela Cruz', 'Ms. Juana Dela Cruz', 'Ms. Juana Dela Cruz', 'Ms. Juana Dela Cruz']).map((name: string, i: number) => (
                                    <p key={i} className="wt-ent-name">{name}</p>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Flower Girls — centered */}
                    <div className="wt-ent-block" style={{ textAlign: 'center' }}>
                        <h3 className="wt-ent-group-title">Flower Girls</h3>
                        {(d.entourage?.flowerGirls || ['Juana', 'Juana', 'Juana']).map((name: string, i: number) => (
                            <p key={i} className="wt-ent-name">{name}</p>
                        ))}
                    </div>

                    {/* Ring Bearer & Coin Bearer */}
                    <div className="wt-ent-block">
                        <div className="wt-ent-parents-row">
                            <div className="wt-ent-col">
                                <h3 className="wt-ent-group-title">Ring Bearer</h3>
                                {(d.entourage?.ringBearers || ['Mr. Juan Dela Cruz']).map((name: string, i: number) => (
                                    <p key={i} className="wt-ent-name">{name}</p>
                                ))}
                            </div>
                            <div className="wt-ent-col">
                                <h3 className="wt-ent-group-title">Coin Bearer</h3>
                                {(d.entourage?.coinBearers || ['Ms. Juana Dela Cruz']).map((name: string, i: number) => (
                                    <p key={i} className="wt-ent-name">{name}</p>
                                ))}
                            </div>
                        </div>
                    </div>

                </motion.div>
            </section>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;600;700&family=Playfair+Display:ital,wght@0,400;1,400&family=Lato:wght@300;400;700&display=swap');

        /* ─ BASE ─ */
        .wt { font-family: 'Lato', sans-serif; background: #faf5ee; color: #3d1f0e; min-height: 100vh; }

        /* ─ HERO ─ */
        .wt-hero { position: relative; height: 92vh; min-height: 560px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .wt-hero-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center center; }
        .wt-hero-fallback { background: linear-gradient(160deg, #d4c5b0 0%, #e8d5b7 50%, #f5edd8 100%); }
        .wt-hero-veil { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0.42) 100%); }

        /* Couple Names */
        .wt-hero-names { position: absolute; top: 10%; left: 0; width: 100%; transform: translateY(-54%); z-index: 10; text-align: center; pointer-events: none; padding: 0 1rem; }
        .wt-hero-names h1 { display: flex; flex-direction: column; align-items: center; gap: 0; margin: 0; }
        .wt-name-line { font-family: 'Dancing Script', cursive; font-size: clamp(5rem, 11vw, 9rem); font-weight: 600; color: white; line-height: 1.02; text-shadow: 0 2px 40px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.08); letter-spacing: -1px; }
        .wt-name-amp { font-family: 'Dancing Script', cursive; font-size: clamp(2.8rem, 5.5vw, 5rem); font-weight: 400; color: rgba(255,255,255,0.82); line-height: 0.85; }

        /* Bottom strip */
        .wt-hero-bottom { position: absolute; bottom: 3rem; left: 0; width: 100%; z-index: 10; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 0.85rem; }
        .wt-hero-tagline { font-size: 0.72rem; font-weight: 700; letter-spacing: 7px; text-transform: uppercase; color: rgba(255,255,255,0.82); margin: 0; }
        .wt-hero-ornament { font-size: 0.7rem; color: rgba(255,255,255,0.45); letter-spacing: 6px; margin: -0.3rem 0; }
        .wt-hero-rsvp-btn { display: inline-block; border: 1.5px solid rgba(255,255,255,0.75); color: white; background: rgba(255,255,255,0.1); backdrop-filter: blur(6px); padding: 0.6rem 3rem; border-radius: 2rem; font-size: 0.72rem; font-weight: 700; letter-spacing: 6px; text-decoration: none; text-transform: uppercase; transition: 0.3s; cursor: pointer; }
        .wt-hero-rsvp-btn:hover { background: rgba(255,255,255,0.22); border-color: white; transform: translateY(-2px); }
        .wt-hero-hashtag { font-family: 'Dancing Script', cursive; font-size: clamp(1.3rem, 2.5vw, 1.8rem); color: rgba(255,255,255,0.85); letter-spacing: 1px; margin: 0; font-weight: 600; text-shadow: 0 1px 12px rgba(0,0,0,0.18); }

        /* ─ SAVE THE DATE / COUNTDOWN ─ */
        .wt-std-section { position: relative; padding: 8rem 2rem 22rem; background-size: cover; background-position: center; background-attachment: fixed; background-color: #fffaf5; overflow: hidden; text-align: center; }
        .wt-std-overlay { position: absolute; inset: 0; background: rgba(255,250,245,0.72); }
        .wt-std-content { position: relative; z-index: 10; max-width: 800px; margin: 0 auto; color: #5a3d2b; }
        
        .wt-std-title { font-family: 'Dancing Script', cursive; font-size: 2.22rem; margin-bottom: 1.5rem; opacity: 0.8; }
        
        .wt-std-date-hero { position: relative; height: 180px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .wt-std-month-bg { font-family: 'Dancing Script', cursive; font-size: clamp(5rem, 15vw, 12rem); color: rgba(139,94,60,0.12); position: absolute; top: 45%; left: 50%; transform: translate(-50%, -50%); white-space: nowrap; pointer-events: none; line-height: 1; z-index: 1; }
        .wt-std-day { font-family: 'Playfair Display', serif; font-size: clamp(6.5rem, 20vw, 14rem); font-weight: 500; line-height: 1; margin: 0; color: #5a3d2b; position: relative; z-index: 2; }
        .wt-std-year { font-family: 'Lato', sans-serif; font-size: 2.6rem; font-weight: 300; letter-spacing: 0.65rem; margin-top: -1.5rem; opacity: 0.95; position: relative; z-index: 3; }
        
        .wt-std-details { font-family: 'Lato', sans-serif; font-size: 0.82rem; letter-spacing: 5px; font-weight: 700; text-transform: uppercase; margin: 2rem 0 4.5rem; opacity: 0.75; display: flex; align-items: center; justify-content: center; gap: 1.5rem; }
        .wt-std-sep { opacity: 0.4; font-weight: 300; }
        
        .wt-std-timer { display: flex; justify-content: center; gap: clamp(1.5rem, 5vw, 4rem); margin-top: 3.5rem; border-top: 1px solid rgba(90,61,43,0.12); padding-top: 3.5rem; }
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
        .wt-gallery-slider { position: relative; padding: 4rem 0 4rem; overflow: hidden; background: #fff; margin-top: -16rem; z-index: 20; }
        .wt-slider-container { max-width: 900px; margin: 0 auto; position: relative; display: flex; flex-direction: column; align-items: center; padding: 0 1rem; }
        .wt-slides-track { position: relative; width: 100%; height: clamp(400px, 60vh, 620px); border-radius: 1.5rem; overflow: hidden; box-shadow: 0 30px 80px rgba(0,0,0,0.22); }

        .wt-slide-item { position: absolute; inset: 0; width: 100%; height: 100%; }
        .wt-slide-item img { width: 100%; height: 100%; object-fit: cover; display: block; }

        /* Prev / Next arrow buttons */
        .wt-arrow { position: absolute; top: 50%; transform: translateY(-50%); z-index: 30; background: rgba(255,255,255,0.18); backdrop-filter: blur(8px); border: 1.5px solid rgba(255,255,255,0.4); color: white; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.3s, transform 0.2s; }
        .wt-arrow:hover { background: rgba(255,255,255,0.35); transform: translateY(-50%) scale(1.1); }
        .wt-arrow-l { left: 1.25rem; }
        .wt-arrow-r { right: 1.25rem; }

        .wt-slider-dots { display: flex; justify-content: center; gap: 0.8rem; margin-top: 2rem; flex-wrap: wrap; }
        .wt-dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(90,61,43,0.15); border: none; padding: 0; cursor: pointer; transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .wt-dot.active { background: #5a3d2b; transform: scale(1.4); }

        @media (max-width: 850px) {
            .wt-gallery-slider { margin-top: -8rem; }
            .wt-slides-track { height: 380px; }
        }

        /* ─ MESSAGE & ENTOURAGE ─ */
        .wt-script-fancy { font-family: 'Dancing Script', cursive; color: #8b6b8d; }
        .wt-message-section { padding: 2rem 2rem; background: #fff; position: relative; z-index: 10; }
        .wt-message-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1.2fr 1fr; gap: 5rem; align-items: center; }
        .wt-message-text { text-align: left; }
        .wt-message-p-container { color: #6a4a3a; line-height: 1.9; font-size: 1.1rem; display: flex; flex-direction: column; gap: 1.5rem; }
        .wt-message-img { border-radius: 2.5rem; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.1); }
        .wt-message-img img { width: 100%; display: block; }

        .wt-entourage-section { padding: 5rem 2rem 6rem; background: #faf5ee; text-align: center; border-top: 1px solid rgba(0,0,0,0.04); }

        /* Entourage panel — clean, no background */
        .wt-ent-panel { max-width: 1100px; margin: 0 auto; padding: 2rem 1rem; }

        .wt-ent-title { font-family: 'Dancing Script', cursive; font-size: clamp(3rem, 7vw, 5rem); font-weight: 600; color: #8b6b8d; margin: 0 0 0.5rem; line-height: 1.1; }
        .wt-ent-bouquet { font-size: 3rem; margin-bottom: 2.5rem; display: block; }

        /* Parents & Best Men / Matrons — 2 columns */
        .wt-ent-parents-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem 3rem; margin-bottom: 2rem; }
        .wt-ent-col { text-align: center; }

        /* Principal + Secondary side by side */
        .wt-ent-sponsors-side { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem 4rem; margin-bottom: 2rem; text-align: center; }

        /* Group headings */
        .wt-ent-group-title { font-family: 'Dancing Script', cursive; font-size: clamp(1.4rem, 3vw, 2rem); font-weight: 600; color: #8b5e3c; margin: 0 0 0.75rem; }
        .wt-ent-sub-title { font-family: 'Dancing Script', cursive; font-size: clamp(1.1rem, 2.5vw, 1.5rem); font-weight: 600; color: #8b6b8d; margin: 0 0 0.4rem; }
        .wt-ent-center { text-align: center; }

        /* Names */
        .wt-ent-name { font-family: 'Playfair Display', serif; font-size: 0.98rem; color: #5c3c2a; margin: 0.15rem 0; line-height: 1.5; }

        /* Principal Sponsors grid — left col male, right col female */
        .wt-ent-sponsors-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.25rem 1.5rem; margin-bottom: 0; }

        /* Blocks (Principal, Secondary) */
        .wt-ent-block { margin-bottom: 2rem; padding-top: 2rem; border-top: 1px solid rgba(139,94,60,0.12); }
        .wt-ent-block:first-child { border-top: none; padding-top: 0; }

        @media (max-width: 700px) {
            .wt-ent-sponsors-side { grid-template-columns: 1fr; }
            .wt-ent-parents-row { grid-template-columns: 1fr; gap: 2rem; }
            .wt-ent-sponsors-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 960px) {
            .wt-message-inner { grid-template-columns: 1fr; gap: 3rem; text-align: center; }
            .wt-message-text { text-align: center; }
        }

        .wt-spin { animation: wt-spin 1s linear infinite; }
        @keyframes wt-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
};

export default WeddingTemplate;
