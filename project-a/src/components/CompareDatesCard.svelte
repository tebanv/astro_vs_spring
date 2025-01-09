<script>
    import { rulesStore } from '../stores/rulesStores.js';
    import { ChevronDown, ChevronUp, X } from 'lucide-svelte';
  
    let selectedDate1 = '';
    let selectedDate2 = '';
    let selectedOperator = '';
    let isExpanded = false;
  
    $: comparisons = $rulesStore.rules.categories?.comparisonsWithDateRules || [];
  
    const addComparison = () => {
      if (selectedDate1 && selectedDate2 && selectedOperator) {
        rulesStore.update(store => ({
          ...store,
          rules: {
            ...store.rules,
            categories: {
              ...store.rules.categories,
              comparisonsWithDateRules: [
                ...(store.rules.categories?.comparisonsWithDateRules || []),
                { date1: selectedDate1, date2: selectedDate2, operator: selectedOperator }
              ]
            }
          }
        }));
        selectedDate1 = '';
        selectedDate2 = '';
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
  </script>
  
  <div class="custom-green-div p-4 rounded-lg">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-bold text-black">Comparar Fechas</h2>
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
      <input
        type="date"
        bind:value={selectedDate1}
        class="bg-zinc-600 text-white p-1 rounded-md text-sm flex-grow"
        aria-label="Seleccionar primera fecha"
      />
  
      <select
        bind:value={selectedOperator}
        class="bg-zinc-600 text-white p-1 rounded-md text-sm flex-grow"
        aria-label="Seleccionar operador"
      >
        <option value="">Operador</option>
        <option value="less_than">Antes que (&lt;)</option>
        <option value="greater_than">Después que (&gt;)</option>
        <option value="equal_to">Igual a (=)</option>
      </select>
  
      <input
        type="date"
        bind:value={selectedDate2}
        class="bg-zinc-600 text-white p-1 rounded-md text-sm flex-grow"
        aria-label="Seleccionar segunda fecha"
      />
  
      <button
        on:click={addComparison}
        class="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600 transition-colors text-sm flex-shrink-0"
        disabled={!selectedDate1 || !selectedDate2 || !selectedOperator}
      >
        Añadir
      </button>
    </div>
  
    <div class="space-y-2">
      {#each comparisons as comparison, index (index)}
        <div class="flex items-center justify-between bg-zinc-600/50 p-2 rounded-md">
          <span class="text-white">{comparison.date1} {comparison.operator} {comparison.date2}</span>
          <button
            on:click={() => removeComparison(index)}
            class="text-red-400 hover:text-red-600 transition-colors"
            aria-label={`Eliminar comparación ${comparison.date1} ${comparison.operator} ${comparison.date2}`}
          >
            <X size={20} />
          </button>
        </div>
      {/each}
    </div>
  {/if}
  </div>