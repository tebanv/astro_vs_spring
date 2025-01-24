<script>
  import { headersStore } from '../stores/headersStore.js';
  import { rulesStore } from '../stores/rulesStores.js';
  import { ChevronDown, ChevronUp, Plus, Save, X } from 'lucide-svelte';
  import Tooltip from './Tooltip.svelte';

  let selectedColumns = [{ id: 1, value: '' }];
  let orderType = '';
  let nextId = 2;
  let isExpanded = false;

  $: headers = $headersStore;
  $: savedRules = $rulesStore.rules.categories?.orderColumnsRules || [];
  $: canAddColumn = selectedColumns.length < 5;

  function addColumn() {
    if (canAddColumn) {
      selectedColumns = [...selectedColumns, { id: nextId, value: '' }];
      nextId++;
    }
  }

  function removeColumn(id) {
    selectedColumns = selectedColumns.filter(col => col.id !== id);
  }

  function saveRule() {
    const validColumns = selectedColumns
      .map(col => col.value)
      .filter(Boolean);

    if (validColumns.length > 0 && orderType) {
      const newRule = {
        columns: validColumns,
        orderType: orderType
      };

      rulesStore.update(store => ({
        ...store,
        rules: {
          ...store.rules,
          categories: {
            ...store.rules.categories,
            orderColumnsRules: [...(store.rules.categories?.orderColumnsRules || []), newRule]
          }
        }
      }));

      // Reset for next rule
      selectedColumns = [{ id: 1, value: '' }];
      orderType = '';
      nextId = 2;
    }
  }

  function removeRule(index) {
    rulesStore.update(store => ({
      ...store,
      rules: {
        ...store.rules,
        categories: {
          ...store.rules.categories,
          orderColumnsRules: store.rules.categories?.orderColumnsRules.filter((_, i) => i !== index)
        }
      }
    }));
  }

  const toggleExpand = () => {
    isExpanded = !isExpanded;
  };
  const tooltipContent = "Se Debe seleccionar dos a cinco columnas y establecer cual debe ser el orden de acuerdo a los valores de las entradas: ejemplo= CAP 1>CAP 2>CAP 3 > CAP 4 > CAP 5 --> Ascendente o Descendiente.";
</script>

<div class="custom-green-div p-4 rounded-lg">
  <div class="flex items-center justify-between">
    <div class="flex items-center space-x-2">
      <h2 class="text-lg font-bold text-black">10 Validar Orden de Columnas</h2>
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
    <div class="space-y-4 mb-4 mt-4">
      {#each selectedColumns as column (column.id)}
        <div class="flex flex-row gap-2 items-center">
          <select
            bind:value={column.value}
            class="bg-zinc-600 text-white p-2 rounded-md flex-grow"
            aria-label={`Seleccionar columna ${column.id}`}
          >
            <option value="">Seleccionar columna</option>
            {#each headers as header}
              <option value={header}>{header}</option>
            {/each}
          </select>
          <button
            on:click={() => removeColumn(column.id)}
            class="text-red-400 hover:text-red-600 transition-colors"
            aria-label={`Eliminar columna ${column.id}`}
          >
            <X size={20} />
          </button>
        </div>
      {/each}
      {#if canAddColumn}
        <button
          on:click={addColumn}
          class="bg-green-500 text-white p-1 rounded-md hover:bg-green-600 transition-colors mt-2"
          aria-label="Agregar columna"
        >
          <Plus size={20} />
        </button>
      {/if}
    </div>

    <div class="mt-4 flex gap-2">
      <select
        bind:value={orderType}
        class="bg-zinc-600 text-white p-2 rounded-md flex-grow"
        aria-label="Seleccionar tipo de orden"
      >
        <option value="">Seleccionar orden</option>
        <option value="ascendente">Orden Ascendente</option>
        <option value="descendente">Orden Descendente</option>
      </select>
      <button
        on:click={saveRule}
        class="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors flex items-center"
        disabled={!orderType || selectedColumns.every(col => !col.value)}
      >
        Agregar
      </button>
    </div>

    {#if savedRules.length > 0}
      <div class="mt-4">
        <h3 class="text-white font-bold mb-2">Reglas guardadas:</h3>
        {#each savedRules as rule, index}
          <div class="bg-zinc-600/50 p-2 rounded-md mb-2 flex justify-between items-center">
            <span class="text-white">
              {rule.columns.join(', ')} - {rule.orderType}
            </span>
            <button
              on:click={() => removeRule(index)}
              class="text-red-400 hover:text-red-600 transition-colors"
              aria-label={`Eliminar regla ${rule.columns.join(', ')} - ${rule.orderType}`}
            >
              <X size={20} />
            </button>
          </div>
        {/each}
      </div>
    {/if}
  {/if}
</div>
  