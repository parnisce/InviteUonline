import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Plus, Calendar, MapPin, Users, Globe,
    ExternalLink, Loader2, AlertCircle, ChevronRight
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user) return;

            try {
                const { data, error: eventsError } = await supabase
                    .from('events')
                    .select(`
            *,
            rsvps (id, status)
          `)
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (eventsError) throw eventsError;
                setEvents(data || []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);

    if (loading) return (
        <div className="dashboard-loading">
            <Loader2 className="animate-spin" size={40} color="#10b981" />
            <p>Loading your dashboard...</p>
        </div>
    );

    return (
        <div className="dashboard-page section-padding">
            <div className="container">
                <header className="dashboard-header">
                    <div>
                        <h1>My Events</h1>
                        <p>Welcome back! You have {events.length} active invitations.</p>
                    </div>
                    <Link to="/create" className="btn btn-primary">
                        <Plus size={20} /> Create New Event
                    </Link>
                </header>

                {error && (
                    <div className="error-banner">
                        <AlertCircle size={20} /> {error}
                    </div>
                )}

                {events.length === 0 ? (
                    <div className="empty-dashboard glass-card">
                        <Calendar size={60} className="empty-icon" />
                        <h2>No events yet</h2>
                        <p>Create your first stunning RSVP page in just a few minutes.</p>
                        <Link to="/create" className="btn btn-primary">Get Started Now</Link>
                    </div>
                ) : (
                    <div className="events-grid">
                        {events.map((event) => {
                            const rsvps = event.rsvps || [];
                            const attending = rsvps.filter((r: any) => r.status === 'attending').length;

                            return (
                                <motion.div
                                    key={event.id}
                                    whileHover={{ y: -5 }}
                                    className="event-card glass-card"
                                >
                                    <div className="event-card-banner" onClick={() => navigate(`/${event.slug}`)} style={{ cursor: 'pointer' }}>
                                        {event.banner_url ? (
                                            <img src={event.banner_url} alt={event.title} />
                                        ) : (
                                            <div className="banner-placeholder" style={{ background: event.theme_color + '20' }} />
                                        )}
                                        <div className="event-status-tag" style={{ background: event.is_published ? '#dcfce7' : '#f1f5f9', color: event.is_published ? '#166534' : '#64748b' }}>
                                            {event.is_published ? 'Published' : 'Draft'}
                                        </div>
                                    </div>

                                    <div className="event-card-content">
                                        <div className="event-info-main">
                                            <span className="event-type">{event.event_type}</span>
                                            <h3 className="event-title">{event.title}</h3>
                                            <div className="event-meta">
                                                <div className="meta-item"><Calendar size={14} /> {new Date(event.event_date).toLocaleDateString()}</div>
                                                <div className="meta-item"><MapPin size={14} /> {event.location}</div>
                                            </div>
                                        </div>

                                        <div className="event-stats-row">
                                            <div className="stat-box">
                                                <span className="stat-val">{rsvps.length}</span>
                                                <span className="stat-label">RSVPs</span>
                                            </div>
                                            <div className="stat-box">
                                                <span className="stat-val attending">{attending}</span>
                                                <span className="stat-label">Attending</span>
                                            </div>
                                        </div>

                                        <div className="event-card-actions">
                                            <a href={`/${event.slug}`} target="_blank" rel="noreferrer" className="action-btn link-btn">
                                                <Globe size={18} /> View Site <ExternalLink size={14} />
                                            </a>
                                            <button
                                                className="action-btn guest-btn"
                                                onClick={() => navigate(`/dashboard/${event.slug}/guests`)}
                                            >
                                                <Users size={18} /> Guest List <ChevronRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            <style>{`
        .dashboard-page { padding-top: 120px; min-height: 100vh; background: #f8fafc; }
        .dashboard-loading { height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; }
        
        .dashboard-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3rem; }
        .dashboard-header h1 { font-size: 2.5rem; color: #0f172a; margin-bottom: 0.5rem; }
        .dashboard-header p { color: #64748b; font-size: 1.1rem; }

        .empty-dashboard { text-align: center; padding: 5rem; display: flex; flex-direction: column; align-items: center; gap: 1.5rem; }
        .empty-icon { color: #cbd5e1; }
        .empty-dashboard h2 { font-size: 1.8rem; color: #0f172a; }

        .events-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 2rem; }
        
        .event-card { overflow: hidden; padding: 0; background: white; border: 1px solid #e2e8f0; height: 100%; display: flex; flex-direction: column; }
        
        .event-card-banner { height: 160px; position: relative; }
        .event-card-banner img { width: 100%; height: 100%; object-fit: cover; }
        .banner-placeholder { width: 100%; height: 100%; }
        
        .event-status-tag { position: absolute; top: 1rem; right: 1rem; padding: 0.35rem 0.85rem; border-radius: 2rem; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }

        .event-card-content { padding: 2rem; flex: 1; display: flex; flex-direction: column; }
        
        .event-info-main { margin-bottom: 2rem; }
        .event-type { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: var(--primary); letter-spacing: 1px; margin-bottom: 0.5rem; display: block; }
        .event-title { font-size: 1.4rem; color: #0f172a; margin-bottom: 1rem; }
        .event-meta { display: flex; flex-direction: column; gap: 0.5rem; color: #64748b; font-size: 0.9rem; font-weight: 500; }
        .meta-item { display: flex; align-items: center; gap: 0.5rem; }

        .event-stats-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; padding: 1.5rem 0; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; margin-bottom: 1.5rem; }
        .stat-box { text-align: center; }
        .stat-val { display: block; font-size: 1.5rem; font-weight: 800; color: #0f172a; }
        .stat-val.attending { color: #10b981; }
        .stat-label { font-size: 0.75rem; font-weight: 600; color: #94a3b8; text-transform: uppercase; }

        .event-card-actions { display: flex; gap: 1rem; margin-top: auto; }
        .action-btn { flex: 1; padding: 0.75rem; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-weight: 700; font-size: 0.9rem; text-decoration: none; transition: 0.3s; }
        
        .link-btn { background: #f1f5f9; color: #475569; }
        .link-btn:hover { background: #e2e8f0; color: #0f172a; }
        
        .guest-btn { background: #f0fdf4; color: #10b981; border: none; cursor: pointer; }
        .guest-btn:hover { background: #dcfce7; }

        .error-banner { background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; padding: 1rem; border-radius: 0.75rem; margin-bottom: 2rem; display: flex; align-items: center; gap: 0.75rem; font-size: 0.9rem; }
        
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
};

export default Dashboard;
