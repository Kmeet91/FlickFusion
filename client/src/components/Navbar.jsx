import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useUserStore from '../store/userStore';
import api from '../api/api';
import { FaSearch, FaUserCircle, FaSignOutAlt, FaRegListAlt, FaHistory } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import { MdAdminPanelSettings } from 'react-icons/md';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const { token, logout } = useAuthStore();
    const { user, setUser, clearUser } = useUserStore();

    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            if (token && !user) {
                try {
                    const { data } = await api.get('/users/me');
                    setUser(data);
                } catch (error) { console.error("Failed to fetch user.", error) }
            }
        };
        fetchUser();
    }, [token, setUser]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        if (dropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownOpen]);

    const handleLogout = () => {
        logout();
        clearUser();
        // navigate('/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${searchQuery.trim()}`);
            setSearchQuery("");
        }
    };

    const getAvatarUrl = () => {
        if (!user?.avatar) return null;
        if (user.avatar.startsWith('http')) return user.avatar;
        return `http://localhost:5000/api/image/${user.avatar}`;
    };
    const avatarUrl = getAvatarUrl();

    return (
        <div className={`fixed top-0 w-full p-4 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/90' : 'bg-transparent'}`}>
            <div className="flex justify-between items-center gap-4 px-4 md:px-10">
                <div className="flex items-center gap-6">
                    <Link to="/">
                        <img className="h-10 md:h-12 cursor-pointer" src="/src/assets/Netlify.png" alt="Logo" />
                    </Link>
                    {token && (
                        <Link to="/discover" className="text-white font-semibold hover:text-gray-300 transition hidden md:block">
                            Browse
                        </Link>
                    )}
                </div>

                {token ? (
                    <div className="flex items-center gap-4 flex-grow justify-end">
                        <form onSubmit={handleSearch} className="relative flex-grow max-w-xs">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search titles..."
                                className="bg-neutral-700 bg-opacity-70 text-white placeholder-neutral-400 text-sm rounded-md py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-white"
                            />
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        </form>

                        <div className="relative" ref={dropdownRef}>
                            <button onClick={() => setDropdownOpen(!dropdownOpen)}>
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="User Avatar" className="w-9 h-9 rounded-full object-cover" />
                                ) : (
                                    <FaUserCircle size={32} className="text-white" />
                                )}
                            </button>
                            {dropdownOpen && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-black bg-opacity-90 rounded-md shadow-lg py-2">
                                    {user && user.role === 'admin' && (
                                        <Link to="/admin" className="flex items-center gap-3 px-4 py-2 text-sm text-white hover:bg-neutral-700">
                                            <MdAdminPanelSettings /><span>Admin Panel</span>
                                        </Link>
                                    )}
                                    <Link to="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-white hover:bg-neutral-700"><CgProfile /><span>Profile</span></Link>
                                    <Link to="/my-list" className="flex items-center gap-3 px-4 py-2 text-sm text-white hover:bg-neutral-700"><FaRegListAlt /><span>My List</span></Link>
                                    <Link to="/history" className="flex items-center gap-3 px-4 py-2 text-sm text-white hover:bg-neutral-700"><FaHistory /><span>History</span></Link>
                                    <div className="border-t border-gray-700 my-1"></div>
                                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-white hover:bg-neutral-700"><FaSignOutAlt /><span>Logout</span></button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex gap-4 items-center">
                        <Link to="/login" className="px-4 py-2 rounded font-semibold transition hover:bg-neutral-700">Login</Link>
                        <Link to="/register" className="bg-red-600 px-4 py-2 rounded font-semibold transition hover:bg-red-700">Sign Up</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;