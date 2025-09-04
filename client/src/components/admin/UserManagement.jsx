import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { FaEdit, FaTrash } from 'react-icons/fa';
import EditUserModal from './EditUserModal';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); 

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await api.get('/admin/users');
                setUsers(data);
            } catch (error) {
                console.error("Failed to fetch users", error);
            }
        };
        fetchUsers();
    }, []);

    const handleOpenModal = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleUserUpdate = (updatedUser) => {
        setUsers(users.map(u => (u._id === updatedUser._id ? updatedUser : u)));
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/admin/users/${userId}`);
                setUsers(users.filter(user => user._id !== userId));
            } catch (error) {
                alert('Failed to delete user.');
                console.error("Failed to delete user", error);
            }
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">User Management</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-neutral-800">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b border-neutral-700 text-left">Username</th>
                            <th className="py-2 px-4 border-b border-neutral-700 text-left">Email</th>
                            <th className="py-2 px-4 border-b border-neutral-700 text-left">Role</th>
                            <th className="py-2 px-4 border-b border-neutral-700 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id} className="hover:bg-neutral-700">
                                <td className="py-2 px-4 border-b border-neutral-700">{user.username}</td>
                                <td className="py-2 px-4 border-b border-neutral-700">{user.email}</td>
                                <td className="py-2 px-4 border-b border-neutral-700">{user.role}</td>
                                <td className="py-2 px-4 border-b border-neutral-700 flex gap-4">
                                    <button onClick={() => handleOpenModal(user)} className="text-sky-500 hover:text-sky-400"><FaEdit /></button>
                                    <button onClick={() => handleDeleteUser(user._id)} className="text-red-500 hover:text-red-400"><FaTrash /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <EditUserModal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} user={selectedUser} onUserUpdate={handleUserUpdate} />
            </div>
        </div>
    );
};

export default UserManagement;