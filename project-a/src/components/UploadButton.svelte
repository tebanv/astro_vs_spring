<script>
  import { headersStore } from '../stores/headersStore.js';
  import { excelFileStore } from '../stores/excelFileStore.js';
  import * as XLSX from 'xlsx';

  let fileInput;

  function handleFileChange(event) {
    const file = event.target.files[0];
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
        return;
      }

      // Si no hay duplicados, actualizar los stores
      headersStore.set(headers);
      excelFileStore.set({ file: file, fileName: file.name });  // Guardamos el archivo en el nuevo store
      console.log(headers);
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
      <p class="text-sm text-black dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
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

  
  
  
  