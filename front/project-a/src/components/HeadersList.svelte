<script>
  import { headersStore } from "../stores/headersStore.js";
  import { onMount } from "svelte";

  let headers = [];

  // Suscribirse al store para obtener las cabeceras
  $: headers = $headersStore;
</script>

<div class="w-full max-h-[30vh] overflow-y-auto p-2">
  <h2 class="text-lg text-black font-bold mb-4">Cabeceras del Archivo:</h2>
  {#if headers.length > 0}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each headers as header}
        <div class="bg-zinc-500 p-3 text-white rounded-lg flex items-center justify-center">
          <span class="text-sm">{header}</span>
        </div>
      {/each}
    </div>
  {:else}
    <p class="text-black">No se ha cargado ningún archivo.</p>
  {/if}
</div>
  