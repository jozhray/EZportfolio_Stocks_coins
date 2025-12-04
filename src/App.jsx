import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Portfolio from './pages/Portfolio'
import Dividends from './pages/Dividends'
import Suggestions from './pages/Suggestions'
import CryptoMarket from './pages/CryptoMarket'
import MarketUpdates from './pages/MarketUpdates'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
};

function App() {
    return (
        <AuthProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />

                    <Route path="/" element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }>
                        <Route index element={<Portfolio />} />
                        <Route path="dividends" element={<Dividends />} />
                        <Route path="suggestions" element={<Suggestions />} />
                        <Route path="crypto" element={<CryptoMarket />} />
                        <Route path="market-updates" element={<MarketUpdates />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default App
