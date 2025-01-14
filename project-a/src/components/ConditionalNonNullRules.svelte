<script>
    import { rulesStore } from '../stores/rulesStores.js';
    import { headersStore } from '../stores/headersStore.js';
    import { ChevronDown, ChevronUp, Plus, X } from 'lucide-svelte';
    import Tooltip from './Tooltip.svelte';

    let selectedColumn = '';
    let selectedValue = '';
    let selectedComparedColumns = [];
    let tempComparedColumn = '';
    let isExpanded = false;

    $: headers = $headersStore;
    $: conditionalNonNullRules = $rulesStore.rules.categories.conditionalNonNullRules || [];

    function addComparedColumn() {
        if (tempComparedColumn && !selectedComparedColumns.includes(tempComparedColumn)) {
            selectedComparedColumns = [...selectedComparedColumns, tempComparedColumn];
            tempComparedColumn = '';
        }
    }

    function removeComparedColumn(columnToRemove) {
        selectedComparedColumns = selectedComparedColumns.filter(col => col !== columnToRemove);
    }

    function confirmRule() {
        if (selectedColumn && selectedValue && selectedComparedColumns.length > 0) {
            rulesStore.update(store => ({
                ...store,
                rules: {
                    ...store.rules,
                    categories: {
                        ...store.rules.categories,
                        conditionalNonNullRules: [
                            ...(store.rules.categories.conditionalNonNullRules || []),
                            {
                                selectedColumn,
                                selectedValue,
                                comparedColumns: [...selectedComparedColumns]
                            }
                        ]
                    }
                }
            }));
            // Reset fields for a new rule
            selectedColumn = '';
            selectedValue = '';
            selectedComparedColumns = [];
        }
    }

    function removeRule(index) {
        rulesStore.update(store => ({
            ...store,
            rules: {
                ...store.rules,
                categories: {
                    ...store.rules.categories,
                    conditionalNonNullRules: store.rules.categories.conditionalNonNullRules.filter((_, i) => i !== index)
                }
            }
        }));
    }

    function toggleExpand() {
        isExpanded = !isExpanded;
    }
    const tooltipContent = "Columna seleccionada con un valor no nulo no puede tener un valor  nulo en columna comparada [ejemplo, Si estado es realizado, no puede haber valores nulos en fecha de intervención, profesional de intervención y en id de foto de despues]";
</script>

<div class="custom-green-div p-4 rounded-lg">
    <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
            <h2 class="text-lg font-bold text-black">13 No nulidad por columna condicionante. </h2>
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
        <div class="mt-4 space-y-4">
            <div class="space-y-2">
                <select bind:value={selectedColumn} class="w-full bg-zinc-700 text-white p-2 rounded-md">
                    <option value="">Seleccionar columna</option>
                    {#each headers as header}
                        <option value={header}>{header}</option>
                    {/each}
                </select>

                <input
                    type="text"
                    bind:value={selectedValue}
                    placeholder="Valor seleccionado"
                    class="w-full bg-zinc-700 text-white p-2 rounded-md"
                />

                <div class="flex space-x-2">
                    <select bind:value={tempComparedColumn} class="flex-grow bg-zinc-700 text-white p-2 rounded-md">
                        <option value="">Seleccionar columna de comparación</option>
                        {#each headers as header}
                            {#if header !== selectedColumn && !selectedComparedColumns.includes(header)}
                                <option value={header}>{header}</option>
                            {/if}
                        {/each}
                    </select>
                    <button 
                        on:click={addComparedColumn} 
                        disabled={!tempComparedColumn}
                        class="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus />
                    </button>
                </div>

                {#if selectedComparedColumns.length > 0}
                    <div class="flex flex-wrap gap-2 mt-2">
                        {#each selectedComparedColumns as column}
                            <div class="bg-zinc-700 text-white px-2 py-1 rounded-md flex items-center">
                                <span>{column}</span>
                                <button
                                    on:click={() => removeComparedColumn(column)}
                                    class="ml-2 text-red-400 hover:text-red-600 transition-colors"
                                >
                                    <X />
                                </button>
                            </div>
                        {/each}
                    </div>
                {/if}

                <button 
                    on:click={confirmRule} 
                    disabled={!selectedColumn || !selectedValue || selectedComparedColumns.length === 0}
                    class="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Confirmar Regla
                </button>
            </div>

            {#each conditionalNonNullRules as rule, index}
                <div class="bg-zinc-700 p-3 rounded-md">
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="text-white font-semibold mb-2">
                                {rule.selectedColumn} = {rule.selectedValue}
                            </h3>
                            <div class="flex flex-wrap gap-2">
                                {#each rule.comparedColumns as column}
                                    <span class="bg-zinc-600 text-white px-2 py-1 rounded-md">
                                        {column}
                                    </span>
                                {/each}
                            </div>
                        </div>
                        <button 
                            on:click={() => removeRule(index)}
                            class="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors"
                        >
                            <X />
                        </button>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>