<script>
  import { headersStore } from '../stores/headersStore.js';
  import { writable } from 'svelte/store';

  export let category;
  let associatedHeaders = writable([]);
  let showHeaders = false;
  let selectedHeader = '';

  // Obtener las cabeceras desde el store de Svelte
  $: headers = $headersStore;
  // Filtrar las cabeceras para mostrar solo las no asociadas
  $: availableHeaders = headers.filter(h => !$associatedHeaders.includes(h));
  
  // Resetear selectedHeader cuando cambian las cabeceras disponibles
  $: {
    if (!availableHeaders.includes(selectedHeader)) {
      selectedHeader = '';
    }
  }

  // Función para asociar una cabecera a la categoría
  const addHeaderToCategory = () => {
    if (selectedHeader) {
      associatedHeaders.update(headers => [...headers, selectedHeader]);
      selectedHeader = ''; // Resetear la selección después de añadir
    }
  };

  // Función para eliminar una cabecera asociada
  const removeHeaderFromCategory = (header) => {
    associatedHeaders.update(headers => headers.filter(h => h !== header));
  };
</script>

<div class="category-card p-4 border rounded-md shadow-md bg-zinc-300 w-full sm:max-w-sm">
  <h3 class="font-bold text-lg text-zinc-800">{category.name}</h3>
  <button 
    class="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-700" 
    on:click={() => showHeaders = !showHeaders}
  >
    {showHeaders ? 'Ocultar' : 'Seleccionar'}
  </button>
  
  <!-- Desplegar lista de cabeceras disponibles en un select -->
  {#if showHeaders}
    <select 
      bind:value={selectedHeader}
      class="available-headers mt-2 bg-gray-200 text-black p-2 rounded w-full" 
      on:change={addHeaderToCategory}
    >
      <option value="" disabled selected>Seleccionar cabecera</option>
      {#each availableHeaders as header (header)}
        <option value={header}>{header}</option>
      {/each}
    </select>
  {/if}

  <!-- Mostrar cabeceras asociadas -->
  <div class="associated-headers mt-4">
    <h4 class="font-semibold text-zinc-500">Cabeceras Asociadas:</h4>
    {#each $associatedHeaders as header (header)}
      <div class="associated-header-item flex items-center mt-1">
        <span class="mr-2 text-zinc-500">{header}</span>
        <button 
          class="bg-red-500 text-white p-1 rounded" 
          on:click={() => removeHeaderFromCategory(header)}
        >
          Eliminar
        </button>
      </div>
    {/each}
  </div>
</div>

<style>
  .category-card {
    max-width: 300px;
  }
</style>
  
  