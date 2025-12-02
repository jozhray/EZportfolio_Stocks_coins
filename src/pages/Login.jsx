import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Wallet, ArrowRight } from 'lucide-react'

import logo from '../assets/logo.png'
import loginBg from '../assets/login-bg.png'

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
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white">
            <div
                className="max-w-md w-full space-y-8 p-10 rounded-3xl shadow-2xl relative overflow-hidden"
                style={{
                    backgroundImage: `url(${loginBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                {/* Dark Overlay for contrast */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

                <div className="relative z-10">
                    <div className="flex flex-col items-center">
                        <img src={logo} alt="Ez Portfolio" className="w-20 h-20 rounded-2xl shadow-lg mb-4" />
                        <h2 className="text-center text-3xl font-bold text-white tracking-tight">
                            Ez Portfolio
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-200">
                            Sign in to manage your stocks
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 backdrop-blur-sm">
                                <p className="text-sm text-red-200 text-center">{error}</p>
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
                                    className="appearance-none relative block w-full px-4 py-3 border border-white/20 placeholder-gray-300 text-white rounded-xl bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white/20 transition-all sm:text-sm backdrop-blur-sm"
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
                                    className="appearance-none relative block w-full px-4 py-3 border border-white/20 placeholder-gray-300 text-white rounded-xl bg-white/10 focus:outline-none focus:ring-blue-500 focus:border-transparent focus:bg-white/20 transition-all sm:text-sm backdrop-blur-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-lg hover:shadow-blue-500/30"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-300">
                            New to Ez Portfolio stocks?{' '}
                            <Link to="/signup" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
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
