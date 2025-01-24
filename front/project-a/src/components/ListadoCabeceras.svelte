<script>
    import { headersStore } from "../stores/headersStore.js";
  
    $: headers = $headersStore;
  </script>
  
  <div class="w-full max-h-[30vh] overflow-y-auto p-4 bg-white shadow-md rounded-lg">
    <h2 class="text-xl font-semibold mb-4">Cabeceras del Archivo:</h2>
    {#if headers.length > 0}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each headers as header}
          <div class="bg-blue-100 p-3 text-blue-800 rounded-lg flex items-center justify-center">
            <span class="text-sm">{header}</span>
          </div>
        {/each}
      </div>
    {:else}
      <p class="text-gray-600">No se ha cargado ningún archivo.</p>
    {/if}
  </div>
  
  