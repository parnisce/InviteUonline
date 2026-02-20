import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Users, ArrowLeft, Download,
    Search, Loader2, AlertCircle,
    CheckCircle2, XCircle, Clock
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const GuestList: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { user } = useAuth();

    const [event, setEvent] = useState<any>(null);
    const [guests, setGuests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'all' | 'attending' | 'declined'>('all');

    useEffect(() => {
        const fetchData = async () => {
            if (!user || !slug) return;

            try {
                // 1. Fetch Event (Verify ownership)
                const { data: eventData, error: eventError } = await supabase
                    .from('events')
                    .select('*')
                    .eq('slug', slug)
                    .eq('user_id', user.id)
                    .single();

                if (eventError) throw new Error("Event not found or access denied.");
                setEvent(eventData);

                // 2. Fetch Guests
                const { data: guestData, error: guestError } = await supabase
                    .from('rsvps')
                    .select('*')
                    .eq('event_id', eventData.id)
                    .order('created_at', { ascending: false });

                if (guestError) throw guestError;
                setGuests(guestData || []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, slug]);

    const filteredGuests = guests.filter(g => {
        const matchesSearch = g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (g.email && g.email.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesFilter = filter === 'all' || g.status === filter;
        return matchesSearch && matchesFilter;
    });

    const stats = {
        total: guests.length,
        attending: guests.filter(g => g.status === 'attending').length,
        declined: guests.filter(g => g.status === 'declined').length,
        totalGuests: guests.filter(g => g.status === 'attending').reduce((acc, curr) => acc + (curr.guests_count || 1), 0)
    };

    const exportToCSV = () => {
        const headers = ['Name', 'Email', 'Status', 'Guest Count', 'Notes', 'Date'];
        const rows = guests.map(g => [
            g.name,
            g.email || '',
            g.status,
            g.guests_count,
            g.dietary_notes || '',
            new Date(g.created_at).toLocaleDateString()
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${slug}_guest_list.csv`);
        document.body.appendChild(link);
        link.click();
    };

    if (loading) return (
        <div className="guest-loading">
            <Loader2 className="animate-spin" size={40} color="#10b981" />
            <p>Loading guest list...</p>
        </div>
    );

    if (error) return (
        <div className="guest-error section-padding">
            <div className="container">
                <AlertCircle size={64} color="#ef4444" />
                <h1>Access Denied</h1>
                <p>{error}</p>
                <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
            </div>
        </div>
    );

    return (
        <div className="guest-list-page section-padding">
            <div className="container">
                <div className="guest-header">
                    <Link to="/dashboard" className="back-link"><ArrowLeft size={18} /> Dashboard</Link>
                    <div className="header-main">
                        <div>
                            <h1>{event?.title}</h1>
                            <p className="event-slug">inviteuonline.vercel.app/{slug}</p>
                        </div>
                        <button className="btn btn-outline" onClick={exportToCSV}>
                            <Download size={18} /> Export CSV
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="stats-grid">
                    <div className="stat-card glass-card">
                        <Users className="stat-icon" />
                        <div className="stat-info">
                            <span className="stat-label">Total Responses</span>
                            <span className="stat-value">{stats.total}</span>
                        </div>
                    </div>
                    <div className="stat-card glass-card">
                        <CheckCircle2 className="stat-icon attending" />
                        <div className="stat-info">
                            <span className="stat-label">Total Attending</span>
                            <span className="stat-value attending">{stats.attending}</span>
                            <span className="sub-stat">({stats.totalGuests} total heads)</span>
                        </div>
                    </div>
                    <div className="stat-card glass-card">
                        <XCircle className="stat-icon declined" />
                        <div className="stat-info">
                            <span className="stat-label">Declined</span>
                            <span className="stat-value declined">{stats.declined}</span>
                        </div>
                    </div>
                </div>

                <div className="list-controls glass-card">
                    <div className="search-box">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filter-group">
                        <button
                            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                            onClick={() => setFilter('all')}
                        >
                            All
                        </button>
                        <button
                            className={`filter-btn ${filter === 'attending' ? 'active' : ''}`}
                            onClick={() => setFilter('attending')}
                        >
                            Attending
                        </button>
                        <button
                            className={`filter-btn ${filter === 'declined' ? 'active' : ''}`}
                            onClick={() => setFilter('declined')}
                        >
                            Declined
                        </button>
                    </div>
                </div>

                <div className="guest-table-container glass-card">
                    <table className="guest-table">
                        <thead>
                            <tr>
                                <th>Guest Name</th>
                                <th>Status</th>
                                <th>Heads</th>
                                <th>Dietary / Notes</th>
                                <th>Date Received</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {filteredGuests.map((guest, idx) => (
                                    <motion.tr
                                        key={guest.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                    >
                                        <td>
                                            <div className="guest-name-cell">
                                                <span className="name-main">{guest.name}</span>
                                                <span className="name-sub">{guest.email || 'No email provided'}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${guest.status}`}>
                                                {guest.status === 'attending' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                                                {guest.status}
                                            </span>
                                        </td>
                                        <td>{guest.status === 'attending' ? guest.guests_count : '-'}</td>
                                        <td className="notes-cell">{guest.dietary_notes || <span className="no-notes">None</span>}</td>
                                        <td>
                                            <div className="date-cell">
                                                <Clock size={14} />
                                                {new Date(guest.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                            {filteredGuests.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="empty-row">
                                        <Users size={40} />
                                        <p>No guests found matching your criteria.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <style>{`
        .guest-list-page { padding-top: 120px; min-height: 100vh; background: #f8fafc; }
        .guest-loading, .guest-error { height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 1.5rem; }
        
        .guest-header { margin-bottom: 3rem; }
        .back-link { display: inline-flex; align-items: center; gap: 0.5rem; color: #64748b; font-weight: 600; text-decoration: none; margin-bottom: 1.5rem; }
        .back-link:hover { color: var(--primary); }
        .header-main { display: flex; justify-content: space-between; align-items: flex-end; }
        .header-main h1 { font-size: 2.2rem; color: #0f172a; margin-bottom: 0.25rem; }
        .event-slug { color: var(--primary); font-family: monospace; font-weight: 600; }

        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
        .stat-card { display: flex; align-items: center; gap: 1.5rem; padding: 2rem; }
        .stat-icon { width: 50px; height: 50px; background: #f1f5f9; color: #64748b; padding: 0.75rem; border-radius: 1rem; }
        .stat-icon.attending { background: #dcfce7; color: #10b981; }
        .stat-icon.declined { background: #fef2f2; color: #ef4444; }
        .stat-label { display: block; font-size: 0.85rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 0.25rem; }
        .stat-value { font-size: 2rem; font-weight: 800; color: #0f172a; }
        .stat-value.attending { color: #10b981; }
        .stat-value.declined { color: #ef4444; }
        .sub-stat { font-size: 0.9rem; color: #64748b; margin-left: 0.5rem; font-weight: 500; }

        .list-controls { display: flex; justify-content: space-between; align-items: center; gap: 2rem; margin-bottom: 2rem; padding: 1rem 2rem; }
        .search-box { flex: 1; display: flex; align-items: center; gap: 0.75rem; background: #f1f5f9; padding: 0.75rem 1.25rem; border-radius: 0.75rem; }
        .search-box input { border: none; background: transparent; width: 100%; outline: none; font-size: 1rem; }
        .filter-group { display: flex; gap: 0.5rem; background: #f1f5f9; padding: 0.4rem; border-radius: 0.75rem; }
        .filter-btn { padding: 0.5rem 1.25rem; border-radius: 0.5rem; border: none; font-weight: 700; color: #64748b; cursor: pointer; transition: 0.2s; }
        .filter-btn.active { background: white; color: #0f172a; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }

        .guest-table-container { padding: 0; overflow: hidden; }
        .guest-table { width: 100%; border-collapse: collapse; text-align: left; }
        .guest-table th { background: #f8fafc; padding: 1.25rem 2rem; font-size: 0.75rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; border-bottom: 1px solid #f1f5f9; }
        .guest-table td { padding: 1.5rem 2rem; border-bottom: 1px solid #f1f5f9; }
        
        .guest-name-cell { display: flex; flex-direction: column; }
        .name-main { font-weight: 700; color: #0f172a; font-size: 1.05rem; }
        .name-sub { font-size: 0.85rem; color: #94a3b8; }
        
        .status-badge { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.35rem 0.75rem; border-radius: 2rem; font-size: 0.8rem; font-weight: 700; text-transform: capitalize; }
        .status-badge.attending { background: #dcfce7; color: #166534; }
        .status-badge.declined { background: #fef2f2; color: #991b1b; }
        
        .notes-cell { color: #475569; font-size: 0.95rem; max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .no-notes { color: #cbd5e1; font-style: italic; }
        
        .date-cell { display: flex; align-items: center; gap: 0.5rem; color: #94a3b8; font-size: 0.85rem; }
        
        .empty-row { text-align: center; padding: 5rem !important; color: #cbd5e1; }
        .empty-row p { margin-top: 1rem; color: #94a3b8; font-weight: 500; }
      `}</style>
        </div>
    );
};

export default GuestList;
