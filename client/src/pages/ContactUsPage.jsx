import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/api';
import { FaGithub, FaLinkedin, FaTwitter, FaDiscord } from 'react-icons/fa';

const ContactUsPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState('');
    const [developer, setDeveloper] = useState(null);

    // Fetch developer info when the page loads
    useEffect(() => {
        const fetchDeveloperInfo = async () => {
            try {
                const { data } = await api.get('/site/developer-info');
                setDeveloper(data);
            } catch (error) {
                console.error("Could not fetch developer info", error);
            }
        };
        fetchDeveloperInfo();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Sending...');
        try {
            await api.post('/messages', formData);
            setStatus('Message sent successfully!');
            setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
        } catch (error) {
            setStatus('Failed to send message. Please try again.');
            console.error("Contact form error:", error);
        }
    };

    // Construct avatar URL dynamically
    const avatarUrl = developer?.avatar
        ? (developer.avatar.startsWith('http') ? developer.avatar : `http://localhost:5000/api/image/${developer.avatar}`)
        : 'https://i.imgur.com/6VBx3io.png';

    return (
        <div className='bg-[#141414] min-h-screen text-white flex flex-col'>
            <Navbar />
            <main className="flex-grow pt-24 px-4 md:px-12">
                <div className="max-w-screen-lg mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-8 border-b border-neutral-700 pb-4">Contact Us</h1>
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Contact Form Section */}
                        <div>
                            <h2 className="text-2xl font-semibold text-white mb-4">Send us a Message</h2>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" required className="p-3 rounded-md bg-neutral-800" />
                                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your Email" required className="p-3 rounded-md bg-neutral-800" />
                                <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" required className="p-3 rounded-md bg-neutral-800" />
                                <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Your Message" rows="5" required className="p-3 rounded-md bg-neutral-800"></textarea>
                                <button type="submit" className="bg-red-600 py-3 px-6 rounded-md font-semibold hover:bg-red-700 transition self-start">Submit</button>
                                {status && <p className="mt-4">{status}</p>}
                            </form>
                        </div>

                        {/* Combined & Dynamic Developer Details Section */}
                        <div>
                            <h2 className="text-2xl font-semibold text-white mb-4">About the Developer</h2>
                            {developer && (
                                <>
                                    <div className="flex items-center gap-4">
                                        <img src={avatarUrl} alt="Developer Avatar" className="w-24 h-24 rounded-full object-cover" />
                                        <div>
                                            <h3 className="text-xl font-bold">{developer.firstName || developer.username} {developer.lastName ? developer.lastName : ""}</h3>
                                            <p className="text-gray-400">Full-Stack MERN Developer</p>
                                            <div className="flex gap-4 mt-2">
                                                <a href="https://github.com/Kmeet91" className="text-gray-400 hover:text-white transition" target="_blank" title="GitHub"><FaGithub size={24} /></a>
                                                <a href="https://www.linkedin.com/in/meet-kachhadiya-8a472928b/" className="text-gray-400 hover:text-sky-600 transition" target="_blank" title="LinkedIn"><FaLinkedin size={24} /></a>
                                                <a href="https://x.com/MeetKG91" className="text-gray-400 hover:text-sky-500 transition" target="_blank" title="Twitter"><FaTwitter size={24} /></a>
                                                <a href="https://discord.com/channels/@me" className="text-gray-400 hover:text-indigo-400 transition" target="_blank" title="Discord"><FaDiscord size={24} /></a>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-gray-300">This project was built to demonstrate a comprehensive understanding of the MERN stack, creating a feature-rich, modern web application.</p>
                                </>
                            ) }
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ContactUsPage;