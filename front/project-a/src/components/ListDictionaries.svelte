<!-- EJEMPLO RESPUESTA:
{
  "diccionarios": [
    { "id": 1, "nombre": "Diccionario 1" },
    { "id": 2, "nombre": "Diccionario 2" },
    { "id": 3, "nombre": "Diccionario 3" }
  ]
} -->
<script>
  import { onMount } from 'svelte';
  import axios from 'axios';
  
  export let selectedDictionary = null;
  let dictionaries = [];
  let error = null;
  let isLoading = true;

  const API_BASE_URL = 'https://valued-teal-complete.ngrok-free.app/api';
  const token = localStorage.getItem('token');

  async function obtainDictionaries() {
    try {
      const response = await axios.get(`${API_BASE_URL}/dictionaries`, {
        headers: {
          'Accept': '*/*',
          'Authorization': `Bearer ${token}`
        },
      });

      dictionaries = response.data.dictionaries;
    } catch (err) {
      error = 'Error al obtener los diccionarios';
      console.error(err);
    } finally {
      isLoading = false;
    }
  }

  onMount(obtainDictionaries);

  function handleSelect(event) {
    const selectedId = parseInt(event.target.value);
    selectedDictionary = dictionaries.find(d => d.id === selectedId) || null;
  }
</script>

{#if isLoading}
  <p>Cargando diccionarios...</p>
{:else if error}
  <p>{error}</p>
{:else}
  <select 
    on:change={handleSelect}
    class="w-full bg-zinc-700 text-white p-2 rounded-md"
    aria-label="Seleccionar diccionario"
  >
    <option value="">Seleccionar diccionario</option>
    {#each dictionaries as dictionary}
      <option value={dictionary.id}>{dictionary.name}</option>
    {/each}
  </select>
{/if}