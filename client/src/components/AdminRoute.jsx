import React from 'react';
import { Navigate } from 'react-router-dom';
import useUserStore from '../store/userStore';

const AdminRoute = ({ children }) => {
    const { user } = useUserStore();

    if (user && user.role === 'admin') {
        return children;
    }

    return <Navigate to="/" />; // Redirect to homepage if not an admin
};

export default AdminRoute;