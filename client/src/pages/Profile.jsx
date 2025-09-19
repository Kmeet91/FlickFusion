import React, { useState, useEffect } from 'react';
import api from '../api/api';
import Navbar from '../components/Navbar';
import useUserStore from '../store/userStore';
import Footer from '../components/Footer';
import Loader from '../components/Loader';

const DEFAULT_PLACEHOLDER = 'https://i.imgur.com/6VBx3io.png'; // A neutral default avatar

const Profile = () => {
    const { user, setUser } = useUserStore();
    const [formData, setFormData] = useState({ firstName: '', lastName: '' });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(DEFAULT_PLACEHOLDER); // Start with placeholder

    // --- NEW: This effect handles the image loading with a timeout ---
    useEffect(() => {
        if (user) {
            setFormData({ firstName: user.firstName || '', lastName: user.lastName || '' });
            if (user.avatar) {
                const potentialSrc = user.avatar.startsWith('http')
                    ? user.avatar
                    : `http://localhost:5000/api/image/${user.avatar}`;

                let isMounted = true; // Prevent state updates on unmounted component
                const image = new Image();
                image.src = potentialSrc;

                const timeoutId = setTimeout(() => {
                    if (isMounted) setAvatarPreview(DEFAULT_PLACEHOLDER);
                }, 5000);

                image.onload = () => {
                    clearTimeout(timeoutId);
                    if (isMounted) setAvatarPreview(potentialSrc);
                };

                image.onerror = () => {
                    clearTimeout(timeoutId);
                    if (isMounted) setAvatarPreview(DEFAULT_PLACEHOLDER);
                };

                return () => { isMounted = false; clearTimeout(timeoutId); };
            }
        }
    }, [user]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('firstName', formData.firstName);
        data.append('lastName', formData.lastName);
        if (avatarFile) data.append('avatar', avatarFile);

        try {
            const res = await api.put('/users/profile', data);
            setUser(res.data);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error("Error updating profile:", error);
            setAvatarPreview(DEFAULT_PLACEHOLDER); // Reset to placeholder on error
            alert('Failed to update profile.');
        }
    };

    if (!user) return <Loader />;

    return (
        <div className='bg-[#141414] min-h-screen text-white'>
            <Navbar />
            <div className="pt-24 px-4 md:px-12">
                <h1 className="text-4xl font-bold mb-8">Edit Profile</h1>
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-8">
                    <div className="flex flex-col items-center">
                        <img src={avatarPreview} alt="Avatar" className="w-32 h-32 rounded-md object-cover" />
                        <label htmlFor="avatar-upload" className="cursor-pointer bg-neutral-600 text-white text-sm py-1 px-3 rounded mt-2 hover:bg-neutral-500">Change Photo</label>
                        <input type="file" id="avatar-upload" onChange={handleFileChange} className="hidden" />
                    </div>
                    <div className="flex-1 max-w-lg">
                        <div className="bg-neutral-700 p-3 rounded-md mb-4 text-gray-400">{user.email}</div>
                        <div className="bg-neutral-700 p-3 rounded-md mb-4 text-gray-400">{user.username}</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="p-3 rounded-md bg-neutral-700" />
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="p-3 rounded-md bg-neutral-700" />
                        </div>
                        <button type="submit" className="bg-red-600 px-6 py-2 rounded mt-4 w-full md:w-auto">Save Changes</button>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
};
export default Profile;