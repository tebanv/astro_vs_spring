<script>
  import { rulesStore } from '../stores/rulesStores.js';
  import { headersStore } from '../stores/headersStore.js';
  import { ChevronDown, ChevronUp, X } from 'lucide-svelte';
  import Tooltip from './Tooltip.svelte';

  let comparetorOne = '';
  let comparetorTwo = '';
  let selectedOperator = '';
  let isExpanded = false;

  $: headers = $headersStore;
  $: comparisons = $rulesStore.rules.categories?.comparisonsWithDateRules || [];

  const addComparison = () => {
    if (comparetorOne && comparetorTwo && selectedOperator) {
      rulesStore.update(store => ({
        ...store,
        rules: {
          ...store.rules,
          categories: {
            ...store.rules.categories,
            comparisonsWithDateRules: [
              ...(store.rules.categories?.comparisonsWithDateRules || []),
              { comparetorOne, comparetorTwo, operator: selectedOperator }
            ]
          }
        }
      }));
      comparetorOne = '';
      comparetorTwo = '';
      selectedOperator = '';
    }
  };

  const removeComparison = (index) => {
    rulesStore.update(store => ({
      ...store,
      rules: {
        ...store.rules,
        categories: {
          ...store.rules.categories,
          comparisonsWithDateRules: store.rules.categories?.comparisonsWithDateRules.filter((_, i) => i !== index)
        }
      }
    }));
  };

  const toggleExpand = () => {
    isExpanded = !isExpanded;
  };
  const tooltipContent = "Se selecciona una columna y se compara con [ Igual a, Menor a o Mayor a ] otra columna de tipo fecha. Ejemplo= fecha de diagnóstico no puede ser posterior a fecha de intervención.";
</script>

<div class="custom-green-div p-4 rounded-lg">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <h2 class="text-lg font-bold text-black">11 Regla Comparación de Fechas</h2>
      <Tooltip content={tooltipContent} />
    </div>
    <button on:click={toggleExpand} class="text-black hover:text-blue-300 transition-colors">
      {#if isExpanded}
        <ChevronUp />
      {:else}
        <ChevronDown />
      {/if}
    </button>
  </div>
  
  {#if isExpanded}
    <div class="flex flex-wrap items-center gap-4 mb-4 mt-4">
      <select
        bind:value={comparetorOne}
        class="bg-zinc-600 text-white p-1 rounded-md  flex-grow"
        aria-label="Seleccionar primera columna de fecha"
      >
        <option value="">Seleccionar columna</option>
        {#each headers as header}
          <option value={header}>{header}</option>
        {/each}
      </select>
  
      <select
        bind:value={selectedOperator}
        class="bg-zinc-600 text-white p-1 rounded-md flex-grow"
        aria-label="Seleccionar operador"
      >
        <option value="">Operador</option>
        <option value="less_than">Antes que (&lt;)</option>
        <option value="greater_than">Después que (&gt;)</option>
        <option value="equal_to">Igual a (=)</option>
      </select>
  
      <select
        bind:value={comparetorTwo}
        class="bg-zinc-600 text-white p-1 rounded-md  flex-grow"
        aria-label="Seleccionar segunda columna de fecha"
      >
        <option value="">Seleccionar columna</option>
        {#each headers as header}
          <option value={header}>{header}</option>
        {/each}
      </select>

      <button
        on:click={addComparison}
        class="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600 transition-colors flex-shrink-0"
        disabled={!comparetorOne || !comparetorTwo || !selectedOperator}
      >
        Añadir
      </button>
    </div>
  
    <div class="space-y-2">
      {#each comparisons as comparison, index (index)}
        <div class="flex items-center justify-between bg-zinc-600/50 p-2 rounded-md">
          <span class="text-white">
            {comparison.comparetorOne} 
            {comparison.operator === 'less_than' ? 'antes que' : comparison.operator === 'greater_than' ? 'después que' : 'igual a'} 
            {comparison.comparetorTwo}
          </span>
          <button
            on:click={() => removeComparison(index)}
            class="text-red-400 hover:text-red-600 transition-colors"
            aria-label={`Eliminar comparación ${comparison.comparetorOne} ${comparison.operator} ${comparison.comparetorTwo}`}
          >
            <X size={20} />
          </button>
        </div>
      {/each}
    </div>
  {/if}
</div>