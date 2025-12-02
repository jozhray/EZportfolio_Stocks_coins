import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

const Layout = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
                <Outlet />
            </main>
            <footer className="bg-white border-t border-gray-200 py-6 text-center text-gray-500 text-sm">
                © {new Date().getFullYear()} Ez Portfolio stocks. All rights reserved.
            </footer>
        </div>
    )
}

export default Layout
