import React, { useState } from 'react';

const Login = ({ onLoginSuccess, onSwitchToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5001/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success) {
                sessionStorage.setItem('user', JSON.stringify(data.user));
                onLoginSuccess(data.user);
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 transition-colors duration-500 relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-200/40 dark:bg-primary-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] animate-blob"></div>
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary-200/40 dark:bg-secondary-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000"></div>
            </div>

            <div className="w-full max-w-md p-8 glass-card rounded-[2rem] animate-fade-in-up">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center text-white shadow-lg">
                            <span className="material-symbols-rounded text-2xl">school</span>
                        </div>
                    </div>
                    <h2 className="text-3xl font-black tracking-tight mb-2 dark:text-white">Welcome Back</h2>
                    <p className="text-gray-500 dark:text-gray-400">Sign in to continue to Student'S Mart</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
                        <div className="relative">
                            <span className="material-symbols-rounded absolute left-4 top-3.5 text-gray-400">mail</span>
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900 focus:border-primary-500 transition-all outline-none dark:text-white"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Password</label>
                            <button type="button" className="text-xs font-bold text-primary-600 hover:text-primary-700">Forgot Password?</button>
                        </div>
                        <div className="relative">
                            <span className="material-symbols-rounded absolute left-4 top-3.5 text-gray-400">lock</span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900 focus:border-primary-500 transition-all outline-none dark:text-white"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm font-bold text-center animate-shake">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-bold text-lg shadow-lg shadow-primary-500/30 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? (
                            <span className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 font-medium">
                    Don't have an account?{' '}
                    <button
                        onClick={onSwitchToRegister}
                        className="font-bold text-primary-600 hover:underline dark:text-primary-400"
                    >
                        Create Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
