import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const CorporateInformationPage = () => {
    return (
        <div className='bg-[#141414] min-h-screen text-white flex flex-col'>
            <Navbar />
            <main className="flex-grow pt-24 px-4 md:px-12">
                <div className="max-w-screen-lg mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-8 border-b border-neutral-700 pb-4">Corporate Information</h1>
                    <div className="space-y-8 text-gray-300">
                        <div>
                            <h2 className="text-2xl font-semibold mb-2 text-white">Our Mission</h2>
                            <p className="leading-relaxed">Our mission is to provide the highest quality entertainment from around the world to our viewers. We believe in the power of storytelling to connect people and cultures.</p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold mb-2 text-white">About the Project</h2>
                            <p className="leading-relaxed">This application is a feature-rich clone of a modern streaming service, built for educational purposes using the MERN stack (MongoDB, Express, React, Node.js) with Vite. It demonstrates a wide range of web development skills, from backend API design to complex, interactive frontend user interfaces.</p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold mb-4 text-white">Follow Us on Social Media</h2>
                            <div className="flex flex-col gap-4">
                                <a href="#" className="flex items-center gap-3 text-gray-300 hover:text-blue-600 transition text-lg">
                                    <FaFacebookF size={28} />
                                    <span className="font-semibold">Facebook</span>
                                </a>
                                <a href="#" className="flex items-center gap-3 text-gray-300 hover:text-pink-500 transition text-lg">
                                    <FaInstagram size={28} />
                                    <span className="font-semibold">Instagram</span>
                                </a>
                                <a href="#" className="flex items-center gap-3 text-gray-300 hover:text-sky-500 transition text-lg">
                                    <FaTwitter size={28} />
                                    <span className="font-semibold">Twitter</span>
                                </a>
                                <a href="#" className="flex items-center gap-3 text-gray-300 hover:text-red-600 transition text-lg">
                                    <FaYoutube size={28} />
                                    <span className="font-semibold">YouTube</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CorporateInformationPage;