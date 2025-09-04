import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const JobsPage = () => {
    return (
        <div className='bg-[#141414] min-h-screen text-white flex flex-col'>
            <Navbar />
            <main className="flex-grow pt-24 px-4 md:px-12">
                <div className="max-w-screen-lg mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-8 border-b border-neutral-700 pb-4">Careers</h1>
                    <div className="space-y-6 text-gray-300">
                        <p>We are always looking for talented individuals to join our team. Currently, there are no open positions, but please check back later for updates.</p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default JobsPage;