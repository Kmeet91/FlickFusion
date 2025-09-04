import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { FaTrash, FaReply } from 'react-icons/fa';

const MessageManagement = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchMessages = async () => {
            const { data } = await api.get('/admin/messages');
            setMessages(data);
        };
        fetchMessages();
    }, []);

    const handleDeleteMessage = async (messageId) => {
        if (window.confirm('Are you sure you want to delete this message?')) {
            await api.delete(`/admin/messages/${messageId}`);
            setMessages(messages.filter(msg => msg._id !== messageId));
        }
    };

    const handleReply = (email) => {
        // Creates a 'mailto' link to open the default email client
        const mailtoLink = `mailto:${email}`;
        window.location.href = mailtoLink;
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">User Messages</h2>
            <div className="space-y-4">
                {messages.map(msg => (
                    <div key={msg._id} className="bg-neutral-800 p-4 rounded-lg relative">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold">{msg.subject}</p>
                                <p className="text-sm text-gray-400">From: {msg.name} ({msg.email})</p>
                                <p className="text-xs text-gray-500">Received: {new Date(msg.createdAt).toLocaleString()}</p>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => handleReply(msg.email)} className="text-sky-400 hover:text-sky-300 transition" title="Reply">
                                    <FaReply />
                                </button>
                                <button onClick={() => handleDeleteMessage(msg._id)} className="text-red-500 hover:text-red-400 transition" title="Delete">
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                        <p className="mt-4 text-gray-300">{msg.message}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MessageManagement;