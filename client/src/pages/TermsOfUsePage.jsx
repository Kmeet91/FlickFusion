import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TermsOfUsePage = () => {
    return (
        <div className='bg-[#141414] min-h-screen text-white flex flex-col'>
            <Navbar />
            <main className="flex-grow pt-24 px-4 md:px-12">
                <div className="max-w-screen-lg mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-8 border-b border-neutral-700 pb-4">Terms of Use</h1>
                    <div className="space-y-6 text-gray-300">
                        <div>
                            <h2 className="text-2xl font-semibold mb-2 text-white">Acceptance of Terms</h2>
                            <p className="leading-relaxed">By accessing or using the Netlify Clone service, you agree to be bound by these Terms of Use and our Privacy Policy. If you do not agree to these terms, please do not use our service.</p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold mb-2 text-white">Your Account</h2>
                            <p className="leading-relaxed">You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.</p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default TermsOfUsePage;