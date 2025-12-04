import React, { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import UserTour from './UserTour'
import { useAuth } from '../context/AuthContext'
import { storageService } from '../services/storage'

const Layout = () => {
    const { user } = useAuth()
    const location = useLocation()
    const [showTour, setShowTour] = useState(false)

    useEffect(() => {
        // Check if user should see the tour
        if (user && !storageService.hasSeenTour(user.id)) {
            // Show tour after a short delay to let the page load
            const timer = setTimeout(() => {
                setShowTour(true)
            }, 1000)
            return () => clearTimeout(timer)
        }
    }, [user])

    const handleTourComplete = () => {
        setShowTour(false)
    }

    // Determine background class based on current route
    const getBackgroundClass = () => {
        const path = location.pathname
        if (path === '/' || path === '/portfolio') return 'portfolio-background'
        if (path === '/dividends') return 'dividends-background'
        if (path === '/suggestions') return 'suggestions-background'
        if (path === '/crypto') return 'crypto-background'
        if (path === '/market-updates') return 'market-updates-background'
        return 'portfolio-background' // default
    }

    return (
        <div className={`min-h-screen flex flex-col font-sans animated-bg ${getBackgroundClass()}`}>
            {/* Animated Background Blobs */}
            <div className="blob-container">
                <div className="blob-1"></div>
                <div className="blob-2"></div>
                <div className="blob-3"></div>
                <div className="blob-4"></div>
            </div>

            {/* Floating Particles */}
            <div className="particles">
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
            </div>

            {/* Glowing Ring */}
            <div className="glow-ring"></div>

            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8 page-content">
                <Outlet />
            </main>
            <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200/50 py-6 text-center text-gray-600 text-sm relative z-10">
                © {new Date().getFullYear()} Ez Portfolio stocks. All rights reserved.
            </footer>

            {/* User Tour */}
            {showTour && user && (
                <UserTour userId={user.id} onComplete={handleTourComplete} />
            )}
        </div>
    )
}

export default Layout
