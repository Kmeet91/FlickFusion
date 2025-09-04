import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import api from '../../api/api';
import { FaTimes } from 'react-icons/fa';

Modal.setAppElement('#root');

const EditUserModal = ({ isOpen, onRequestClose, user, onUserUpdate }) => {
    const [formData, setFormData] = useState({ username: '', email: '', role: '' });

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username,
                email: user.email,
                role: user.role,
            });
        }
    }, [user]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/admin/users/${user._id}`, formData);
            onUserUpdate({ ...user, ...formData });
            onRequestClose();
        } catch (error) {
            console.error("Failed to update user", error);
            alert('Failed to update user.');
        }
    };

    if (!user) return null;

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            // The placeholder '...' is now replaced with the full style object
            style={{
                overlay: { backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 1000 },
                content: {
                    top: '50%', left: '50%', right: 'auto', bottom: 'auto',
                    marginRight: '-50%', transform: 'translate(-50%, -50%)',
                    width: '90%', maxWidth: '500px',
                    backgroundColor: '#181818',
                    border: '1px solid #282828',
                    borderRadius: '8px',
                    padding: '2rem',
                    color: 'white',
                }
            }}
        >
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Edit User: {user.username}</h2>
                <button onClick={onRequestClose} className="text-gray-400 hover:text-white transition">
                    <FaTimes size={20} />
                </button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="block mb-1 text-sm font-semibold text-gray-300">Username</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} className="p-2 rounded w-full bg-neutral-700 border border-neutral-600" />
                </div>
                <div>
                    <label className="block mb-1 text-sm font-semibold text-gray-300">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="p-2 rounded w-full bg-neutral-700 border border-neutral-600" />
                </div>
                <div>
                    <label className="block mb-1 text-sm font-semibold text-gray-300">Role</label>
                    <select name="role" value={formData.role} onChange={handleChange} className="p-2 rounded w-full bg-neutral-700 border border-neutral-600">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div className="flex gap-4 mt-4">
                    <button type="submit" className="bg-red-600 px-4 py-2 rounded font-semibold hover:bg-red-700 transition">Save Changes</button>
                    <button type="button" onClick={onRequestClose} className="bg-neutral-600 px-4 py-2 rounded font-semibold hover:bg-neutral-500 transition">Cancel</button>
                </div>
            </form>
        </Modal>
    );
};
export default EditUserModal;