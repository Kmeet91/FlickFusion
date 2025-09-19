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
import Loader from './components/Loader';

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
        return <Loader />;
    }

    return (
        <Router>
            <Routes>
                {/* --- Main App Routes --- */}
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={token ? <Profile /> : <Navigate to="/login" />} />
                <Route path="/details/:mediaType/:id" element={token ? <DetailPage /> : <Navigate to="/login" />} />
                <Route path="/my-list" element={token ? <MyListPage /> : <Navigate to="/login" />} />
                <Route path="/history" element={token ? <HistoryPage /> : <Navigate to="/login" />} />
                <Route path="/category/:categoryKey" element={token ? <CategoryPage /> : <Navigate to="/login" />} />
                <Route path="/search" element={token ? <SearchPage /> : <Navigate to="/login" />} />
                <Route path="/discover" element={token ? <DiscoverPage /> : <Navigate to="/login" />} />
                <Route path="/person/:personId" element={token ? <ActorDetailPage /> : <Navigate to="/login" />} />

                {/* --- New Footer Page Routes --- */}
                <Route path="/help-center" element={ <HelpCenterPage /> } />
                <Route path="/privacy" element={ <PrivacyPage /> } />
                <Route path="/terms-of-use" element={ <TermsOfUsePage />} />
                <Route path="/jobs" element={<JobsPage />} />
                <Route path="/contact-us" element={ <ContactUsPage />} />
                <Route path="/legal-notices" element={ <LegalNoticesPage />} />
                <Route path="/audio-description" element={ <AudioDescriptionPage />} />
                <Route path="/investor-relations" element={ <InvestorRelationsPage />} />
                <Route path="/cookie-preferences" element={ <CookiePreferencesPage />} />
                <Route path="/gift-cards" element={ <GiftCardsPage />} />
                <Route path="/corporate-information" element={ <CorporateInformationPage />} />
                <Route path="/media-center" element={ <MediaCenterPage />} />

                {/* --- Auth Routes --- */}
                <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
                <Route path="/register" element={!token ? <Register /> : <Navigate to="/" />} />

                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            </Routes>
        </Router>
    );
}
export default App;