import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import useUserStore from './store/userStore';
import api from './api/api';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import DetailPage from './pages/DetailPage';
import MyListPage from './pages/MyListPage';
import HistoryPage from './pages/HistoryPage';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import DiscoverPage from './pages/DiscoverPage';
import ActorDetailPage from './pages/ActorDetailPage';

import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/AdminRoute';

// Import all the new footer pages
import HelpCenterPage from './pages/HelpCenterPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsOfUsePage from './pages/TermsOfUsePage';
import JobsPage from './pages/JobsPage';
import ContactUsPage from './pages/ContactUsPage';
import LegalNoticesPage from './pages/LegalNoticesPage';
import AudioDescriptionPage from './pages/AudioDescriptionPage';
import InvestorRelationsPage from './pages/InvestorRelationsPage';
import CookiePreferencesPage from './pages/CookiePreferencesPage';
import GiftCardsPage from './pages/GiftCardsPage';
import CorporateInformationPage from './pages/CorporateInformationPage';
import MediaCenterPage from './pages/MediaCenterPage';

function App() {
    const { token, logout } = useAuthStore();
    const { setUser } = useUserStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const validateToken = async () => {
            if (token) {
                try {
                    const { data } = await api.get('/users/me');
                    setUser(data);
                } catch (error) {
                    console.error('Failed to validate token:', error);
                    logout();
                }
            }
            setLoading(false);
        };
        validateToken();
    }, [token, setUser, logout]);

    if (loading) {
        return <div className="bg-black h-screen flex justify-center items-center text-white">Loading...</div>;
    }

    return (
        <Router>
            <Routes>
                {/* --- Main App Routes --- */}
                <Route path="/" element={ <Home /> } />
                <Route path="/profile" element={token ? <Profile /> : <Navigate to="/login" />} />
                <Route path="/details/:mediaType/:id" element={token ? <DetailPage /> : <Navigate to="/login" />} />
                <Route path="/my-list" element={token ? <MyListPage /> : <Navigate to="/login" />} />
                <Route path="/history" element={token ? <HistoryPage /> : <Navigate to="/login" />} />
                <Route path="/category/:categoryKey" element={token ? <CategoryPage /> : <Navigate to="/login" />} />
                <Route path="/search" element={token ? <SearchPage /> : <Navigate to="/login" />} />
                <Route path="/discover" element={token ? <DiscoverPage /> : <Navigate to="/login" />} />
                <Route path="/person/:personId" element={token ? <ActorDetailPage /> : <Navigate to="/login" />} />

                {/* --- New Footer Page Routes --- */}
                <Route path="/help-center" element={token ? <HelpCenterPage /> : <Navigate to="/login" />} />
                <Route path="/privacy" element={token ? <PrivacyPage /> : <Navigate to="/login" />} />
                <Route path="/terms-of-use" element={token ? <TermsOfUsePage /> : <Navigate to="/login" />} />
                <Route path="/jobs" element={token ? <JobsPage /> : <Navigate to="/login" />} />
                <Route path="/contact-us" element={token ? <ContactUsPage /> : <Navigate to="/login" />} />
                <Route path="/legal-notices" element={token ? <LegalNoticesPage /> : <Navigate to="/login" />} />
                <Route path="/audio-description" element={token ? <AudioDescriptionPage /> : <Navigate to="/login" />} />
                <Route path="/investor-relations" element={token ? <InvestorRelationsPage /> : <Navigate to="/login" />} />
                <Route path="/cookie-preferences" element={token ? <CookiePreferencesPage /> : <Navigate to="/login" />} />
                <Route path="/gift-cards" element={token ? <GiftCardsPage /> : <Navigate to="/login" />} />
                <Route path="/corporate-information" element={token ? <CorporateInformationPage /> : <Navigate to="/login" />} />
                <Route path="/media-center" element={token ? <MediaCenterPage /> : <Navigate to="/login" />} />

                {/* --- Auth Routes --- */}
                <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
                <Route path="/register" element={!token ? <Register /> : <Navigate to="/" />} />

                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            </Routes>
        </Router>
    );
}
export default App;