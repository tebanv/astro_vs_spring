// stores/excelFileStore.js
import { writable } from 'svelte/store';

export const excelFileStore = writable({ file: null, fileName: '' });