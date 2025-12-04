import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Wallet, TrendingUp, LogOut, Bitcoin, Newspaper } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import clsx from 'clsx'

import logo from '../assets/logo.png'

const Navbar = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { user, logout } = useAuth()

    const navItems = [
        { path: '/', label: 'Portfolio', icon: Wallet },
        { path: '/dividends', label: 'Dividend & Earning', icon: LayoutDashboard },
        { path: '/suggestions', label: 'Suggestions', icon: TrendingUp },
        { path: '/crypto', label: 'Crypto Market', icon: Bitcoin },
        { path: '/market-updates', label: 'Market Updates', icon: Newspaper },
    ]

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="text-xl font-bold text-blue-600 flex items-center gap-2">
                        <img src={logo} alt="Ez Portfolio" className="w-8 h-8 rounded-lg" />
                        Ez Portfolio stocks
                    </Link>

                    <div className="flex items-center gap-6">
                        <div className="flex space-x-4">
                            {navItems.map((item) => {
                                const Icon = item.icon
                                const isActive = location.pathname === item.path

                                // Add data-tour attribute for specific nav items
                                const dataTour = item.path === '/dividends' ? 'dividends-nav'
                                    : item.path === '/market-updates' ? 'market-updates-nav'
                                        : undefined;

                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        data-tour={dataTour}
                                        className={clsx(
                                            "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                            isActive
                                                ? "bg-blue-50 text-blue-600"
                                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        )}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {item.label}
                                    </Link>
                                )
                            })}
                        </div>

                        <div className="flex items-center gap-4 pl-6 border-l border-gray-200">
                            <span className="text-sm font-medium text-gray-700">
                                {user?.name}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                title="Sign out"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
