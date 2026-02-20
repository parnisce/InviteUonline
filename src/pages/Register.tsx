import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rocket, Mail, Lock, User, ArrowRight, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                    }
                }
            });

            if (authError) throw authError;

            if (data.user) {
                setSuccess(true);
                // If email confirmation is disabled, we can redirect. 
                // Otherwise, show success message.
                setTimeout(() => navigate('/login'), 3000);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="auth-card glass-card"
                >
                    <div className="auth-header">
                        <Link to="/" className="auth-logo">
                            <Rocket className="logo-icon" />
                            <span>InviteU</span>
                        </Link>
                        <h1>Create your account</h1>
                        <p>Join thousands of users creating stunning RSVPs.</p>
                    </div>

                    {error && (
                        <div className="error-box">
                            <AlertCircle size={20} />
                            <span>{error}</span>
                        </div>
                    )}

                    {success ? (
                        <div className="success-box">
                            <CheckCircle size={40} />
                            <h2>Check your email!</h2>
                            <p>We've sent you a confirmation link to {formData.email}.</p>
                            <Link to="/login" className="btn btn-primary">Go to Login</Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="form-group">
                                <label><User size={16} /> Full Name</label>
                                <input
                                    type="text"
                                    placeholder="Aria Santos"
                                    required
                                    value={formData.fullName}
                                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label><Mail size={16} /> Email Address</label>
                                <input
                                    type="email"
                                    placeholder="aria@example.com"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label><Lock size={16} /> Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>

                            <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
                                {loading ? <Loader2 className="animate-spin" /> : <>Create Account <ArrowRight size={18} /></>}
                            </button>

                            <p className="auth-footer">
                                Already have an account? <Link to="/login">Sign In</Link>
                            </p>
                        </form>
                    )}
                </motion.div>
            </div>

            <style>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f0fdf4;
          padding: 2rem;
        }

        .auth-container { width: 100%; max-width: 450px; }

        .auth-card { padding: 3rem; background: white; border-radius: 2rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.05); }

        .auth-header { text-align: center; margin-bottom: 2.5rem; }
        .auth-logo { display: inline-flex; align-items: center; gap: 0.5rem; font-size: 1.5rem; font-weight: 800; color: #064e3b; margin-bottom: 1.5rem; text-decoration: none; }
        .logo-icon { color: var(--primary); }

        .auth-header h1 { font-size: 1.8rem; color: #0f172a; margin-bottom: 0.5rem; }
        .auth-header p { color: var(--text-muted); font-size: 0.95rem; }

        .auth-form { display: flex; flex-direction: column; gap: 1.5rem; }
        
        .form-group { display: flex; flex-direction: column; gap: 0.6rem; }
        .form-group label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; }
        .form-group input { padding: 1rem 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0; background: #f8fafc; outline: none; transition: all 0.3s; font-size: 1rem; }
        .form-group input:focus { border-color: var(--primary); background: white; box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1); }

        .auth-btn { width: 100%; padding: 1.15rem; font-size: 1rem; border-radius: 0.75rem; margin-top: 1rem; justify-content: center; }

        .auth-footer { text-align: center; font-size: 0.95rem; color: var(--text-muted); margin-top: 2rem; }
        .auth-footer a { color: var(--primary); font-weight: 700; text-decoration: none; }

        .error-box { background: #fef2f2; color: #b91c1c; padding: 1rem; border-radius: 0.75rem; margin-bottom: 2rem; display: flex; align-items: center; gap: 0.75rem; font-size: 0.9rem; border: 1px solid #fecaca; }
        .success-box { text-align: center; padding: 1rem 0; color: #064e3b; }
        .success-box h2 { margin: 1rem 0; }
        .success-box p { margin-bottom: 2rem; color: var(--text-muted); }

        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
};

export default Register;
