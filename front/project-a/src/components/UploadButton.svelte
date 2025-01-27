<script>
  import { headersStore } from '../stores/headersStore.js';
  import { excelFileStore } from '../stores/excelFileStore.js';
  import * as XLSX from 'xlsx';
  import { writable } from 'svelte/store';

  let fileInput;

let isLoading = writable(false); // Estado de carga

  function handleFileChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    isLoading.set(true); // Activar el estado de carga
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const headers = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0];

      // Verificar duplicados
      const uniqueHeaders = new Set(headers);
      if (uniqueHeaders.size !== headers.length) {
        alert('Se detectaron cabeceras duplicadas. Por favor, corrija los duplicados en el archivo Excel antes de importar.');
        isLoading.set(false);
        return;
      }

      // Si no hay duplicados, actualizar los stores
      headersStore.set(headers);
      excelFileStore.set({ file: file, fileName: file.name });  // Guardamos el archivo en el nuevo store
      console.log(headers);
      isLoading.set(false); // Desactivar el estado de carga
    };

    reader.readAsArrayBuffer(file);
  }
</script>

<div class="flex items-center justify-center w-full">
  <label for="dropzone-file" class="flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-green-50 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
    <div class="flex items-center justify-center pt-4 space-x-3">
      <svg class="w-8 h-8 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
      </svg>
      <p class="text-sm text-black dark:text-gray-400"><span class="font-semibold">Click para cargar excel</span> o arrastre y suelte</p>
    </div>
    <p class="text-xs text-black dark:text-gray-400 pb-4">XLSX, XLS</p>
    <input 
      id="dropzone-file" 
      type="file" 
      class="hidden" 
      accept=".xlsx, .xls" 
      on:change={handleFileChange} 
      bind:this={fileInput}
    />
  </label>
</div>
<!-- Overlay de carga -->
{#if $isLoading}
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
      <svg class="animate-spin h-8 w-8 text-blue-500 mb-4" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0h-4a4 4 0 00-8 0H4z"></path>
      </svg>
      <p class="text-lg font-semibold text-gray-700">Cargando cabeceras...</p>
    </div>
  </div>
{/if}

  
  
  
  