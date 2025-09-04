import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const Register = () => {
    const [username, setUsername] = useState(''); // <-- Added state for username
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({ label: '', color: 'text-gray-400' });
    // A more detailed validation state
    const [validation, setValidation] = useState({
        username: { isValid: null, message: '' },
        email: { isValid: null, message: '' },
        password: { isValid: null, message: '', strength: 0 } // Strength: 0-4
    });
    const navigate = useNavigate();

    // Debounce function using useCallback for performance
    const debounce = useCallback((func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    }, []);

    // Effect for username validation
    useEffect(() => {
        if (!username) {
            setValidation(v => ({ ...v, username: { isValid: null, message: '' } }));
            return;
        }
        if (username.length < 3) {
            setValidation(v => ({ ...v, username: { isValid: false, message: 'Username must be at least 3 characters.' } }));
            return;
        }
        const checkUsername = debounce(async () => {
            try {
                const res = await axios.post('http://localhost:5000/api/auth/check-username', { username });
                if (res.data.exists) {
                    setValidation(v => ({ ...v, username: { isValid: false, message: 'Username is already taken.' } }));
                } else {
                    setValidation(v => ({ ...v, username: { isValid: true, message: 'Username is available!' } }));
                }
            } catch (err) { console.error("Username check failed", err) }
        }, 500);
        checkUsername();
    }, [username, debounce]);

    // --- Email Validation (Format + Uniqueness) ---
    useEffect(() => {
        if (!email) {
            setValidation(v => ({ ...v, email: { isValid: null, message: '' } }));
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setValidation(v => ({ ...v, email: { isValid: false, message: 'Please enter a valid email address.' } }));
            return;
        }
        const checkEmail = debounce(async () => {
            try {
                const res = await axios.post('http://localhost:5000/api/auth/check-email', { email });
                if (res.data.exists) {
                    setValidation(v => ({ ...v, email: { isValid: false, message: 'Email is already registered.' } }));
                } else {
                    setValidation(v => ({ ...v, email: { isValid: true, message: '' } }));
                }
            } catch (err) { console.error("Email check failed", err) }
        }, 500);
        checkEmail();
    }, [email, debounce]);

    // --- Password Validation (Strength) ---
    useEffect(() => {
        if (!password) {
            setValidation(v => ({ ...v, password: { isValid: null, strength: 0 } }));
            setPasswordStrength({ label: '', color: 'text-gray-400' });
            return;
        }

        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 8) strength++;
        if (password.match(/[A-Z]/)) strength++;
        if (password.match(/[0-9]/) || password.match(/[^A-Za-z0-9]/)) strength++;

        const strengthLevels = [
            { label: 'Weak', color: 'text-red-500' },
            { label: 'Medium', color: 'text-yellow-500' },
            { label: 'Strong', color: 'text-green-500' },
            { label: 'Very Strong', color: 'text-green-500' }
        ];

        setValidation(v => ({ ...v, password: { isValid: password.length >= 6, strength } }));
        if (strength > 0) {
            setPasswordStrength(strengthLevels[strength - 1]);
        } else {
            setPasswordStrength({ label: 'Too Short', color: 'text-red-500' });
        }

    }, [password]);

    const isFormValid = validation.username.isValid && validation.email.isValid && validation.password.isValid;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) {
            setError('Please correct the errors before submitting.');
            return;
        }
        setIsSubmitting(true);
        try {
            await axios.post('http://localhost:5000/api/auth/register', { username, email, password });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration failed.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getInputBorderClass = (isValid) => {
        if (isValid === null) return 'border-transparent focus:border-white';
        return isValid ? 'border-green-500' : 'border-red-500';
    };

    const strengthBarColors = ['bg-neutral-600', 'bg-red-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-500'];

    return (
        <div className="relative h-screen w-full overflow-hidden">
            <video autoPlay loop muted className="absolute top-0 left-0 w-full h-full object-cover -z-10"><source src="https://assets.mixkit.co/videos/preview/mixkit-flying-through-a-dark-stormy-sky-23741-large.mp4" type="video/mp4" /></video>
            <div className="bg-black w-full h-full bg-opacity-50">
                <nav className="px-12 py-5"><img src="/src/assets/Netlify.png" alt="Logo" className="h-12" /></nav>
                <div className="flex justify-center">
                    <div className="bg-black bg-opacity-70 px-16 py-16 self-center mt-2 lg:w-2/5 rounded-md">
                        <h2 className="text-4xl mb-8 font-semibold text-white">Sign Up</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                            <div className="relative">
                                <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} className={`p-3 rounded-md bg-neutral-700 text-white w-full border-2 transition ${getInputBorderClass(validation.username.isValid)}`} />
                                {validation.username.isValid === true && <FaCheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />}
                                {validation.username.isValid === false && <FaTimesCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" />}
                            </div>
                            <p className={`text-xs h-4 mb-2 ml-1 ${validation.username.isValid ? 'text-green-500' : 'text-gray-400'}`}>{validation.username.message || 'Must be at least 3 characters.'}</p>

                            <div className="relative">
                                <input type="email" placeholder="Email address" onChange={(e) => setEmail(e.target.value)} className={`p-3 rounded-md bg-neutral-700 text-white w-full border-2 transition ${getInputBorderClass(validation.email.isValid)}`} />
                                {validation.email.isValid === false && <FaTimesCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" />}
                            </div>
                            {validation.email.message && <p className="text-xs h-4 mb-2 ml-1 text-red-500">{validation.email.message}</p>}

                            <div>
                                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className={`p-3 rounded-md bg-neutral-700 text-white w-full border-2 transition ${getInputBorderClass(validation.password.isValid)}`} />
                                <p className="text-xs h-4 mt-1 ml-1 text-gray-400">Must be at least 6 characters.</p>
                                {password && (
                                    <div className="flex gap-2 items-center mt-2">
                                        {/* The bars */}
                                        <div className="flex-grow flex gap-1">
                                            {Array.from({ length: 4 }).map((_, index) => (
                                                <div
                                                    key={index}
                                                    className={`h-2 flex-1 rounded-full transition-colors ${index < validation.password.strength ? strengthBarColors[validation.password.strength] : 'bg-neutral-600'}`}
                                                />
                                            ))}
                                        </div>
                                        {/* The colored text label */}
                                        <p className={`text-xs ml-2 font-semibold w-24 text-right ${passwordStrength.color}`}>
                                            {passwordStrength.label}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                            <button type="submit" disabled={!isFormValid || isSubmitting} className="bg-red-600 py-3 text-white rounded-md w-full mt-6 hover:bg-red-700 disabled:bg-red-900 disabled:cursor-not-allowed">
                                {isSubmitting ? 'Signing Up...' : 'Sign Up'}
                            </button>
                        </form>
                        <p className="text-neutral-500 mt-12">Already have an account? <Link to="/login" className="text-white hover:underline">Sign in now.</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;