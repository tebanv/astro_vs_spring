// src/stores/navigationStore.js
import { writable } from 'svelte/store';
import { authStore } from './authStore';

function createNavigationStore() {
    const { subscribe, set, update } = writable({
        currentRoute: '/'
    });

    return {
        subscribe,
        navigate: (route) => {
            set({ currentRoute: route });
        },
        goHome: () => {
            set({ currentRoute: '/' });
        },
        goToDashboard: () => {
            set({ currentRoute: '/dashboard' });
        },
        navigateToProtectedRoute: (route) => {
            if (authStore.isAuthenticated()) {
                set({ currentRoute: route });
            } else {
                set({ currentRoute: '/login' });
            }
        }
    };
}

export const navigationStore = createNavigationStore();