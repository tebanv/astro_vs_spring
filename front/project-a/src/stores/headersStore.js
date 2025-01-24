import { writable } from 'svelte/store';

// Crear un store para compartir los encabezados con otros componentes
export const headersStore = writable([]);