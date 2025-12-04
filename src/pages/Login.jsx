import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Wallet, ArrowRight } from 'lucide-react'

import logo from '../assets/logo.png'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        try {
            login(email, password)
            navigate('/')
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="max-w-md w-full space-y-8 p-10 rounded-3xl shadow-2xl relative backdrop-blur-xl bg-white/10 border border-white/20">
                <div className="relative z-10">
                    <div className="flex flex-col items-center">
                        <img src={logo} alt="Ez Portfolio" className="w-20 h-20 rounded-2xl shadow-lg mb-4" />
                        <h2 className="text-center text-3xl font-bold text-white tracking-tight">
                            Ez Portfolio
                        </h2>
                        <p className="mt-2 text-center text-sm text-white/80">
                            Sign in to manage your investments
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-500/20 border border-red-300/50 rounded-lg p-4 backdrop-blur-sm">
                                <p className="text-sm text-white text-center">{error}</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="sr-only">
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none relative block w-full px-4 py-3 border border-white/30 placeholder-white/60 text-white rounded-xl bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent focus:bg-white/20 transition-all sm:text-sm backdrop-blur-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none relative block w-full px-4 py-3 border border-white/30 placeholder-white/60 text-white rounded-xl bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent focus:bg-white/20 transition-all sm:text-sm backdrop-blur-sm"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end">
                            <Link
                                to="/forgot-password"
                                className="text-sm text-white/90 hover:text-white transition-colors font-medium"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 transition-all shadow-lg hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <span className="flex items-center gap-2">
                                    Sign in
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-white/80">
                            New to Ez Portfolio?{' '}
                            <Link to="/signup" className="font-medium text-white hover:text-white/90 transition-colors underline underline-offset-2">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
