import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, Check } from 'lucide-react';
import { storageService } from '../services/storage';
import { sendPasswordResetEmail, isEmailServiceConfigured } from '../services/emailService';
import logo from '../assets/logo.png';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: Code, 3: New Password, 4: Success
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [sentCode, setSentCode] = useState('');
    const navigate = useNavigate();

    const handleSendCode = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Check if user exists
        const user = storageService.findUser(email);
        if (!user) {
            setError('No account found with this email address');
            setLoading(false);
            return;
        }

        // Check if EmailJS is configured
        if (!isEmailServiceConfigured()) {
            setError('Email service is not configured. Please contact support.');
            setLoading(false);
            return;
        }

        // Send reset email
        const result = await sendPasswordResetEmail(email, user.name);

        if (result.success) {
            setSentCode(result.code);
            storageService.storeResetCode(email, result.code);
            setStep(2);
        } else {
            setError(result.error || 'Failed to send reset email. Please try again.');
        }

        setLoading(false);
    };

    const handleVerifyCode = (e) => {
        e.preventDefault();
        setError('');

        if (storageService.verifyResetCode(email, code)) {
            setStep(3);
        } else {
            setError('Invalid or expired code. Please request a new one.');
        }
    };

    const handleResetPassword = (e) => {
        e.preventDefault();
        setError('');

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            storageService.updateUserPassword(email, newPassword);
            setStep(4);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleResendCode = async () => {
        setError('');
        setLoading(true);

        const user = storageService.findUser(email);
        const result = await sendPasswordResetEmail(email, user.name);

        if (result.success) {
            setSentCode(result.code);
            storageService.storeResetCode(email, result.code);
            setError('');
            // Show success message briefly
            const successMsg = 'New code sent to your email!';
            setError(successMsg);
            setTimeout(() => setError(''), 3000);
        } else {
            setError(result.error || 'Failed to resend code');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="max-w-md w-full space-y-8 p-10 rounded-3xl shadow-2xl relative backdrop-blur-xl bg-white/10 border border-white/20">
                <div className="relative z-10">
                    {/* Header */}
                    <div className="flex flex-col items-center">
                        <img src={logo} alt="Ez Portfolio" className="w-20 h-20 rounded-2xl shadow-lg mb-4" />
                        <h2 className="text-center text-3xl font-bold text-white tracking-tight">
                            {step === 4 ? 'Password Reset!' : 'Reset Password'}
                        </h2>
                        <p className="mt-2 text-center text-sm text-white/80">
                            {step === 1 && "Enter your email to receive a reset code"}
                            {step === 2 && "Enter the 6-digit code sent to your email"}
                            {step === 3 && "Create a new password for your account"}
                            {step === 4 && "Your password has been successfully reset"}
                        </p>
                    </div>

                    {/* Step 1: Email Input */}
                    {step === 1 && (
                        <form className="mt-8 space-y-6" onSubmit={handleSendCode}>
                            {error && (
                                <div className="bg-red-500/20 border border-red-300/50 rounded-lg p-4 backdrop-blur-sm">
                                    <p className="text-sm text-white text-center">{error}</p>
                                </div>
                            )}

                            <div>
                                <label htmlFor="email" className="sr-only">Email address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="Email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="appearance-none relative block w-full pl-12 pr-4 py-3 border border-white/30 placeholder-white/60 text-white rounded-xl bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent focus:bg-white/20 transition-all sm:text-sm backdrop-blur-sm"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 transition-all shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Sending...' : 'Send Reset Code'}
                            </button>
                        </form>
                    )}

                    {/* Step 2: Code Verification */}
                    {step === 2 && (
                        <form className="mt-8 space-y-6" onSubmit={handleVerifyCode}>
                            {error && (
                                <div className={`${error.includes('sent') ? 'bg-green-500/20 border-green-300/50' : 'bg-red-500/20 border-red-300/50'} border rounded-lg p-4 backdrop-blur-sm`}>
                                    <p className="text-sm text-white text-center">{error}</p>
                                </div>
                            )}

                            <div>
                                <label htmlFor="code" className="sr-only">Verification Code</label>
                                <input
                                    id="code"
                                    name="code"
                                    type="text"
                                    required
                                    maxLength="6"
                                    placeholder="Enter 6-digit code"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                                    className="appearance-none relative block w-full px-4 py-3 border border-white/30 placeholder-white/60 text-white text-center text-2xl tracking-widest rounded-xl bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent focus:bg-white/20 transition-all backdrop-blur-sm"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleResendCode}
                                    disabled={loading}
                                    className="flex-1 py-3 px-4 border border-white/30 text-sm font-semibold rounded-xl text-white bg-white/10 hover:bg-white/20 focus:outline-none transition-all disabled:opacity-50"
                                >
                                    Resend Code
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none transition-all shadow-lg"
                                >
                                    Verify
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Step 3: New Password */}
                    {step === 3 && (
                        <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
                            {error && (
                                <div className="bg-red-500/20 border border-red-300/50 rounded-lg p-4 backdrop-blur-sm">
                                    <p className="text-sm text-white text-center">{error}</p>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="newPassword" className="sr-only">New Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                                        <input
                                            id="newPassword"
                                            name="newPassword"
                                            type="password"
                                            required
                                            placeholder="New password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="appearance-none relative block w-full pl-12 pr-4 py-3 border border-white/30 placeholder-white/60 text-white rounded-xl bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent focus:bg-white/20 transition-all sm:text-sm backdrop-blur-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            required
                                            placeholder="Confirm new password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="appearance-none relative block w-full pl-12 pr-4 py-3 border border-white/30 placeholder-white/60 text-white rounded-xl bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent focus:bg-white/20 transition-all sm:text-sm backdrop-blur-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 transition-all shadow-lg hover:shadow-2xl"
                            >
                                Reset Password
                            </button>
                        </form>
                    )}

                    {/* Step 4: Success */}
                    {step === 4 && (
                        <div className="mt-8 text-center">
                            <div className="flex justify-center mb-6">
                                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center border-4 border-green-400">
                                    <Check className="w-10 h-10 text-green-400" />
                                </div>
                            </div>
                            <p className="text-white/90 mb-4">
                                Your password has been successfully reset!
                            </p>
                            <p className="text-white/70 text-sm">
                                Redirecting to login page...
                            </p>
                        </div>
                    )}

                    {/* Back to Login */}
                    {step !== 4 && (
                        <div className="mt-6 text-center">
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 text-sm text-white/90 hover:text-white transition-colors font-medium"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to login
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
