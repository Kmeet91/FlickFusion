import React, { useState } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { setToken } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { identifier, password });
            setToken(res.data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.msg || 'Login failed. Please check your credentials.');
            console.error('Login failed:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative h-screen w-full bg-[url('/src/assets/hero-bg.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
            <div className="bg-black w-full h-full lg:bg-opacity-50">
                <nav className="px-12 py-5">
                    <img src="/src/assets/Netlify.png" alt="Logo" className="h-12" />
                </nav>
                <div className="flex justify-center">
                    <div className="bg-black bg-opacity-70 px-16 py-16 self-center mt-2 lg:w-2/5 lg:max-w-md rounded-md w-full">
                        <h2 className="text-white text-4xl mb-8 font-semibold">Sign In</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <input
                                type="text"
                                placeholder="Email or Username"
                                // value={email}
                                onChange={(e) => setIdentifier(e.target.value)}
                                className="p-3 rounded-md bg-neutral-700 text-white"
                                required
                            />
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="p-3 rounded-md bg-neutral-700 text-white w-full"
                                    required
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <button type="submit" className="bg-red-600 py-3 text-white rounded-md w-full mt-6 hover:bg-red-700 transition">
                                {loading ? 'Logging In...' : 'Log In'}
                            </button>
                        </form>
                        <p className="text-neutral-500 mt-12">
                            New to Netlify?{' '}
                            <Link to="/register" className="text-white ml-1 hover:underline">
                                Sign up now.
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;