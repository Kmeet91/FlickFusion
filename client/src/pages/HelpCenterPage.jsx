import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HelpCenterPage = () => {
    return (
        <div className='bg-[#141414] min-h-screen text-white flex flex-col'>
            <Navbar />
            <main className="flex-grow pt-24 px-4 md:px-12">
                <div className="max-w-screen-lg mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-8 border-b border-neutral-700 pb-4">Help Center</h1>
                    <div className="space-y-6 text-gray-300">
                        <div>
                            <h2 className="text-2xl font-semibold mb-2 text-white">Getting Started</h2>
                            <p className="leading-relaxed">Welcome to Netlify Clone! To get started, simply create an account, browse our vast library of content, and start watching. You can add titles to your "My List" to watch later.</p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold mb-2 text-white">Managing Your Account</h2>
                            <p className="leading-relaxed">You can manage your account details, including your email, password, and profile information, by navigating to the "Profile" page from the user dropdown menu in the top-right corner.</p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold mb-2 text-white">Troubleshooting</h2>
                            <p className="leading-relaxed">If you are experiencing issues with video playback, please ensure your internet connection is stable. For all other issues, feel free to contact us through the "Contact Us" page.</p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default HelpCenterPage;