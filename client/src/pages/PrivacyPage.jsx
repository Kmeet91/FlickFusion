import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PrivacyPage = () => {
    return (
        <div className='bg-[#141414] min-h-screen text-white flex flex-col'>
            <Navbar />
            <main className="flex-grow pt-24 px-4 md:px-12">
                <div className="max-w-screen-lg mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-8 border-b border-neutral-700 pb-4">Privacy Policy</h1>
                    <div className="space-y-6 text-gray-300">
                        <div>
                            <h2 className="text-2xl font-semibold mb-2 text-white">Information We Collect</h2>
                            <p className="leading-relaxed">We collect information you provide directly to us, such as when you create an account. This includes your username, email address, and password. We also collect information automatically, such as your watch history and watchlist data, to improve your user experience.</p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold mb-2 text-white">How We Use Information</h2>
                            <p className="leading-relaxed">The information we collect is used to provide, maintain, and improve our services. This includes personalizing the content you see, providing customer support, and communicating with you about new features or updates.</p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PrivacyPage;