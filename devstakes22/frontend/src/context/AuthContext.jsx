import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { addToast } = useToast();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('cs_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                localStorage.removeItem('cs_user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const res = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                const data = await res.json();
                setUser(data);
                localStorage.setItem('cs_user', JSON.stringify(data));
                addToast(`Welcome back, ${data.firstName || 'User'}!`, 'success');
                return { success: true };
            }
            const errText = await res.text();
            return { success: false, message: errText || 'Login failed' };
        } catch (error) {
            console.error('Login error:', error);
            addToast('Login Failed: Auth server unreachable.', 'error');
            return { success: false, message: 'Auth server unreachable. Please make sure the backend is running.' };
        }
    };

    const signup = async (userData) => {
        try {
            const res = await fetch('http://localhost:8080/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            if (res.ok) {
                const data = await res.json();
                setUser(data);
                localStorage.setItem('cs_user', JSON.stringify(data));
                addToast('Account created successfully!', 'success');
                return { success: true };
            }
            const errText = await res.text();
            return { success: false, message: errText || 'Signup failed' };
        } catch (error) {
            console.error('Signup error:', error);
            addToast('Signup Failed: Auth server unreachable.', 'error');
            return { success: false, message: 'Auth server unreachable. Please make sure the backend is running.' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('cs_user');
    };

    return (
        <AuthContext.Provider value={{ 
            user, login, signup, logout, loading, 
            showLogin, setShowLogin, 
            showSignup, setShowSignup 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
