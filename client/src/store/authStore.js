import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useUserStore from './userStore'; // Import the user store

const useAuthStore = create(
    persist(
        (set) => ({
            token: null,
            setToken: (token) => set({ token }),
            logout: () => {
                set({ token: null });
                // This line is crucial: it clears the user profile data
                useUserStore.getState().clearUser();
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);

export default useAuthStore;