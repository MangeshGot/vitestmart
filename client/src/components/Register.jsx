import React, { useState } from 'react';

const Register = ({ onRegisterSuccess, onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:5001/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    full_name: formData.full_name,
                    email: formData.email,
                    password: formData.password
                }),
            });

            const data = await response.json();

            if (data.success) {
                alert("Account created successfully! Please login.");
                onRegisterSuccess();
            } else {
                setError(data.error || 'Registration failed');
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
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-secondary-200/40 dark:bg-secondary-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] animate-blob"></div>
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-primary-200/40 dark:bg-primary-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000"></div>
            </div>

            <div className="w-full max-w-md p-8 glass-card rounded-[2rem] animate-fade-in-up my-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black tracking-tight mb-2 dark:text-white">Create Account</h2>
                    <p className="text-gray-500 dark:text-gray-400">Join Student'S Mart today</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Full Name</label>
                        <div className="relative">
                            <span className="material-symbols-rounded absolute left-4 top-3.5 text-gray-400">person</span>
                            <input
                                id="full_name"
                                type="text"
                                value={formData.full_name}
                                onChange={handleChange}
                                required
                                className="w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900 focus:border-primary-500 transition-all outline-none dark:text-white"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
                        <div className="relative">
                            <span className="material-symbols-rounded absolute left-4 top-3.5 text-gray-400">mail</span>
                            <input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900 focus:border-primary-500 transition-all outline-none dark:text-white"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Password</label>
                            <div className="relative">
                                <span className="material-symbols-rounded absolute left-4 top-3.5 text-gray-400">lock</span>
                                <input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900 focus:border-primary-500 transition-all outline-none dark:text-white"
                                    placeholder="••••••"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Confirm</label>
                            <div className="relative">
                                <span className="material-symbols-rounded absolute left-4 top-3.5 text-gray-400">lock_reset</span>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900 focus:border-primary-500 transition-all outline-none dark:text-white"
                                    placeholder="••••••"
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm font-bold text-center">
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
                            'Create Account'
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 font-medium">
                    Already have an account?{' '}
                    <button
                        onClick={onSwitchToLogin}
                        className="font-bold text-primary-600 hover:underline dark:text-primary-400"
                    >
                        Sign In
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Register;
