<script>
  import { headersStore } from '../stores/headersStore.js';
  import { rulesStore } from '../stores/rulesStores.js';
  import { ChevronDown, ChevronUp, X } from 'lucide-svelte';
  import Tooltip from './Tooltip.svelte';

  let selectedHeader1 = '';
  let selectedHeader2 = '';
  let selectedOperator = '';
  let isExpanded = false;

  $: headers = $headersStore;
  $: comparisons = $rulesStore.rules.categories?.comparisonsWithOtherColumnRules || [];

  const addComparison = () => {
    if (selectedHeader1 && selectedHeader2 && selectedOperator) {
      rulesStore.update(store => ({
        ...store,
        rules: {
          ...store.rules,
          categories: {
            ...store.rules.categories,
            comparisonsWithOtherColumnRules: [
              ...(store.rules.categories?.comparisonsWithOtherColumnRules || []),
              { comparetorOne: selectedHeader1, comparetorTwo: selectedHeader2, operator: selectedOperator }
            ]
          }
        }
      }));
      selectedHeader1 = '';
      selectedHeader2 = '';
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
          comparisonsWithOtherColumnRules: store.rules.categories?.comparisonsWithOtherColumnRules.filter((_, i) => i !== index)
        }
      }
    }));
  };

  const toggleExpand = () => {
    isExpanded = !isExpanded;
  };
  const tooltipContent = "El valor de la primer Columna debe ser [ Igual a, Menor a o Mayor a ] con la que se compara.";
</script>

<div class="custom-green-div p-4 rounded-lg">
  <div class="flex items-center justify-between">
    <div class="flex items-center space-x-2">
      <h2 class="text-lg font-bold text-black">7 Comparar Columnas</h2>
      <Tooltip content={tooltipContent}>
        <Info size={20} class="text-gray-600 cursor-help" />
      </Tooltip>
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
    <div class="flex flex-col sm:flex-row gap-4 mb-4 mt-4">
      <select
        bind:value={selectedHeader1}
        class="bg-zinc-600 text-white p-2 rounded-md flex-grow"
        aria-label="Seleccionar primera cabecera"
      >
        <option value="">Seleccionar cabecera 1</option>
        {#each headers as header}
          <option value={header}>{header}</option>
        {/each}
      </select>
  
      <select
        bind:value={selectedOperator}
        class="bg-zinc-600 text-white p-2 rounded-md flex-grow"
        aria-label="Seleccionar operador"
      >
        <option value="">Seleccionar operador</option>
        <option value="less_than">Menor que (&lt;)</option>
        <option value="greater_than">Mayor que (&gt;)</option>
        <option value="equal_to">Igual a (=)</option>
      </select>
  
      <select
        bind:value={selectedHeader2}
        class="bg-zinc-600 text-white p-2 rounded-md flex-grow"
        aria-label="Seleccionar segunda cabecera"
      >
        <option value="">Seleccionar cabecera 2</option>
        {#each headers as header}
          <option value={header}>{header}</option>
        {/each}
      </select>
    </div>
  
    <button
      on:click={addComparison}
      class="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors w-full mb-4"
      disabled={!selectedHeader1 || !selectedHeader2 || !selectedOperator}
    >
      Agregar
    </button>
  
    <div class="space-y-2">
      {#each comparisons as comparison, index (index)}
        <div class="flex items-center justify-between bg-zinc-600/50 p-2 rounded-md">
          <span class="text-white">{comparison.comparetorOne} {comparison.operator} {comparison.comparetorTwo}</span>
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

