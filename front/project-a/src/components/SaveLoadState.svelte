<script>
    import { rulesStore } from '../stores/rulesStores.js';
    import { ArrowDownToLine, ArrowUpFromLine } from 'lucide-svelte';
    import { transformJsonForBackend, transformJsonFromBackend } from '../utils/jsonTransformations.js';
    import { excelFileStore } from '../stores/excelFileStore.js';

    let fileInput;
    let errorMessage = '';
    let successMessage = '';
    let excelFileName;

    excelFileStore.subscribe(value => {
    excelFileName = value.fileName;
    });

    function processFileName(fileName) {
        // Reemplazar espacios con guiones bajos y eliminar la extensión
        return fileName.replace(/\s+/g, '_').split('.').slice(0, -1).join('_');
    }

    function saveState() {
        const state = transformJsonForBackend($rulesStore);
        const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        const baseFileName = excelFileName ? processFileName(excelFileName) : ' ';        
        a.download = `Reglas_${baseFileName}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        successMessage = 'Estado guardado exitosamente.';
        setTimeout(() => successMessage = '', 3000);
    }

    function loadState(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const loadedState = JSON.parse(e.target.result);
                    const transformedState = transformJsonFromBackend(loadedState);
                    rulesStore.set(transformedState);
                    successMessage = 'Estado cargado exitosamente.';
                    setTimeout(() => successMessage = '', 3000);
                } catch (error) {
                    errorMessage = 'Error al cargar el archivo. Asegúrese de que es un JSON válido.';
                    setTimeout(() => errorMessage = '', 5000);
                }
            };
            reader.readAsText(file);
        }
    }
</script>

<div class="bg-zinc-100 p-4 rounded-lg">
    <h2 class="text-lg font-bold text-black mb-4">Guardar/Cargar Estado</h2>
    <div class="flex gap-4">
        <button
            on:click={saveState}
            class="flex items-center justify-center gap-2 bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors w-1/2"
        >
            <ArrowDownToLine size={20} />
            Guardar Estado
        </button>
        <label
            for="load-state"
            class="flex items-center justify-center gap-2 bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors cursor-pointer w-1/2"
        >
            <ArrowUpFromLine size={20} />
            Cargar Estado
        </label>
        <input
            id="load-state"
            type="file"
            accept=".json"
            on:change={loadState}
            class="hidden"
            bind:this={fileInput}
        />
    </div>
    {#if errorMessage}
        <p class="text-red-500 mt-2">{errorMessage}</p>
    {/if}
    {#if successMessage}
        <p class="text-green-500 mt-2">{successMessage}</p>
    {/if}
</div>
