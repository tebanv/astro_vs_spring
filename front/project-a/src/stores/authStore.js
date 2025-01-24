// src/stores/authStore.js
import { writable } from 'svelte/store';

function createAuthStore() {
    // Inicializar el estado con valores del localStorage si existen
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');

    const { subscribe, set, update } = writable({
        isAuthenticated: !!storedToken,
        token: storedToken,
        role: storedRole
    });

    return {
        subscribe,
        login: (token, role) => {
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            set({ isAuthenticated: true, token, role });
        },
        logout: () => {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            set({ isAuthenticated: false, token: null, role: null });
        },
        checkAuth: () => {
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('role');
            if (token) {
                set({ isAuthenticated: true, token, role });
            } else {
                set({ isAuthenticated: false, token: null, role: null });
            }
        }
    };
}

export const authStore = createAuthStore();