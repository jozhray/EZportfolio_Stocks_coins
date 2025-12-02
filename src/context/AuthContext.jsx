import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = storageService.getCurrentUser();
        if (storedUser) {
            setUser(storedUser);
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        const user = storageService.login(email, password);
        setUser(user);
        return user;
    };

    const signup = (name, email, password) => {
        const user = storageService.signup(name, email, password);
        setUser(user);
        return user;
    };

    const logout = () => {
        storageService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
