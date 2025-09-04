import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CookiePreferencesPage = () => {
    return (
        <div className='bg-[#141414] min-h-screen text-white flex flex-col'>
            <Navbar />
            <main className="flex-grow pt-24 px-4 md:px-12">
                <div className="max-w-screen-lg mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-8 border-b border-neutral-700 pb-4">Cookie Preferences</h1>
                    <div className="space-y-6 text-gray-300">
                        <p>This page will allow you to manage your cookie settings for this site. This functionality is currently under development.</p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CookiePreferencesPage;