import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-black text-gray-400 py-12 mt-16">
            <div className="max-w-screen-lg mx-auto px-4 md:px-12">
                <div className="flex gap-6 mb-8">
                    <a href="#" className="hover:text-blue-600 transition"><FaFacebookF size={24} /></a>
                    <a href="#" className="hover:text-pink-500 transition"><FaInstagram size={24} /></a>
                    <a href="#" className="hover:text-sky-500 transition"><FaTwitter size={24} /></a>
                    <a href="#" className="hover:text-red-600 transition"><FaYoutube size={24} /></a>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div className="flex flex-col gap-3">
                        <Link to="/audio-description" className="hover:text-white transition">Audio Description</Link>
                        <Link to="/investor-relations" className="hover:text-white transition">Investor Relations</Link>
                        <Link to="/legal-notices" className="hover:text-white transition">Legal Notices</Link>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Link to="/help-center" className="hover:text-white transition">Help Center</Link>
                        <Link to="/jobs" className="hover:text-white transition">Jobs</Link>
                        <Link to="/cookie-preferences" className="hover:text-white transition">Cookie Preferences</Link>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Link to="/gift-cards" className="hover:text-white transition">Gift Cards</Link>
                        <Link to="/terms-of-use" className="hover:text-white transition">Terms of Use</Link>
                        <Link to="/corporate-information" className="hover:text-white transition">Corporate Information</Link>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Link to="/media-center" className="hover:text-white transition">Media Center</Link>
                        <Link to="/privacy" className="hover:text-white transition">Privacy</Link>
                        <Link to="/contact-us" className="hover:text-white transition">Contact Us</Link>
                    </div>
                </div>
                <p className="text-xs mt-8">&copy; 2025 Netlify Clone. All rights reserved.</p>
            </div>
        </footer>
    );
};
export default Footer;