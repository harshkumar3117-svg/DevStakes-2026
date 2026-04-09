import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthModals = () => {
    const { 
        showLogin, setShowLogin, 
        showSignup, setShowSignup, 
        login, signup 
    } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const res = await login(email, password);
        setLoading(false);
        if (res.success) {
            setShowLogin(false);
            setEmail('');
            setPassword('');
        } else {
            setError(res.message);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const res = await signup({ email, password, firstName: name });
        setLoading(false);
        if (res.success) {
            setShowSignup(false);
            setEmail('');
            setPassword('');
            setName('');
        } else {
            setError(res.message);
        }
    };

    if (!showLogin && !showSignup) return null;

    return (
        <div className={`modal-overlay visible`}>
            <div className="modal glass-card">
                <button className="modal-close" onClick={() => { setShowLogin(false); setShowSignup(false); }}>
                    <X size={18} />
                </button>

                <div className="modal-logo">CINE<span className="logo-accent">STREAM</span></div>
                
                {showLogin ? (
                    <>
                        <h2 className="modal-title">Welcome Back</h2>
                        <p className="modal-subtitle">Experience cinema like never before</p>
                        <form className="auth-form" onSubmit={handleLogin}>
                            <div className="form-group">
                                <label>Email Address</label>
                                <div className="input-wrapper neu-input">
                                    <Mail size={16} />
                                    <input 
                                        type="email" 
                                        placeholder="name@example.com" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required 
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <div className="input-wrapper neu-input">
                                    <Lock size={16} />
                                    <input 
                                        type={showPass ? "text" : "password"} 
                                        placeholder="••••••••" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required 
                                    />
                                    <button type="button" className="toggle-password" onClick={() => setShowPass(!showPass)}>
                                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                            {error && <div className="form-error">{error}</div>}
                            <button className="btn-primary full-width" disabled={loading}>
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>
                            <div className="auth-switch">
                                Don't have an account? <a href="#" onClick={() => { setShowLogin(false); setShowSignup(true); }}>Create one</a>
                            </div>
                        </form>
                    </>
                ) : (
                    <>
                        <h2 className="modal-title">Join CineStream</h2>
                        <p className="modal-subtitle">Start your 30-day free trial today</p>
                        <form className="auth-form" onSubmit={handleSignup}>
                            <div className="form-group">
                                <label>Full Name</label>
                                <div className="input-wrapper neu-input">
                                    <User size={16} />
                                    <input 
                                        type="text" 
                                        placeholder="John Doe" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required 
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <div className="input-wrapper neu-input">
                                    <Mail size={16} />
                                    <input 
                                        type="email" 
                                        placeholder="name@example.com" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required 
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <div className="input-wrapper neu-input">
                                    <Lock size={16} />
                                    <input 
                                        type={showPass ? "text" : "password"} 
                                        placeholder="••••••••" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required 
                                    />
                                </div>
                            </div>
                            {error && <div className="form-error">{error}</div>}
                            <button className="btn-primary full-width" disabled={loading}>
                                {loading ? 'Creating account...' : 'Create Account'}
                            </button>
                            <div className="auth-switch">
                                Already have an account? <a href="#" onClick={() => { setShowSignup(false); setShowLogin(true); }}>Sign in</a>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default AuthModals;
