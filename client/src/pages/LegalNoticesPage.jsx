import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const LegalNoticesPage = () => {
    return (
        <div className='bg-[#141414] min-h-screen text-white flex flex-col'>
            <Navbar />
            <main className="flex-grow pt-24 px-4 md:px-12">
                <div className="max-w-screen-lg mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-8 border-b border-neutral-700 pb-4">Legal Notices</h1>
                    <div className="space-y-6 text-gray-300">
                        <p>All content provided on this service is the property of Netlify Clone or its content suppliers and protected by international copyright laws. This project is for educational purposes only.</p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default LegalNoticesPage;