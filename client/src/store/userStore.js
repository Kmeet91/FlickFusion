import { create } from 'zustand';

const useUserStore = create((set) => ({
    user: null, // User data will be stored here
    setUser: (userData) => set({ user: userData }),
    clearUser: () => set({ user: null }),

    // listType can be 'watchlist' or 'history'
    removeFromList: (listType, movieId) => set((state) => {
        if (!state.user) return state;

        const updatedList = state.user[listType].filter(item => item.id !== movieId);

        return {
            user: {
                ...state.user,
                [listType]: updatedList,
            }
        };
    }),

    addToList: (listType, item) => set((state) => {
        if (!state.user) return state;

        // Prevent client-side duplicates
        if (state.user[listType].some(existingItem => existingItem.id === item.id)) {
            return state;
        }

        return {
            user: {
                ...state.user,
                [listType]: [item, ...state.user[listType]],
            }
        };
    }),
}));

export default useUserStore;