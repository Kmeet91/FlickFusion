import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import UserManagement from '../components/admin/UserManagement';
import MessageManagement from '../components/admin/MessageManagement';
import ReviewManagement from '../components/admin/ReviewManagement';
import { FaUsers, FaEnvelopeOpenText, FaComments } from 'react-icons/fa'; // Import icons


const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('users');

    const renderContent = () => {
        switch (activeTab) {
            case 'users':
                return <UserManagement />; // Placeholder
            case 'messages':
                return <MessageManagement />; // Placeholder
            case 'reviews':
                return <ReviewManagement />; // Placeholder
            default:
                return <UserManagement />;
        }
    };

    return (
        <div className='bg-[#141414] min-h-screen text-white flex flex-col'>
            <Navbar />
            <main className="flex-grow pt-24 px-4 md:px-12">
                <div className="max-w-screen-xl mx-auto flex gap-8">
                    {/* Admin Sidebar */}
                    <aside className="w-1/4">
                        <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
                        <nav className="flex flex-col gap-2">
                            <button onClick={() => setActiveTab('users')} className={`p-3 rounded-md text-left flex items-center gap-3 ...`}>
                                <FaUsers /> User Management
                            </button>
                            <button onClick={() => setActiveTab('messages')} className={`p-3 rounded-md text-left flex items-center gap-3 ...`}>
                                <FaEnvelopeOpenText /> Messages
                            </button>
                            <button onClick={() => setActiveTab('reviews')} className={`p-3 rounded-md text-left flex items-center gap-3 ...`}>
                                <FaComments /> Reviews
                            </button>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <section className="w-3/4 bg-neutral-900 p-6 rounded-lg">
                        {renderContent()}
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AdminDashboard;