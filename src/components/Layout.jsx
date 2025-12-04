import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import UserTour from './UserTour'
import { useAuth } from '../context/AuthContext'
import { storageService } from '../services/storage'

const Layout = () => {
    const { user } = useAuth()
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

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
                <Outlet />
            </main>
            <footer className="bg-white border-t border-gray-200 py-6 text-center text-gray-500 text-sm">
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
