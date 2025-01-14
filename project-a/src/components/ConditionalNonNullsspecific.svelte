<script>
    import { rulesStore } from '../stores/rulesStores.js';
    import { headersStore } from '../stores/headersStore.js';
    import { ChevronDown, ChevronUp, Plus, X, Info } from 'lucide-svelte';
    import Tooltip from './Tooltip.svelte';

    let selectedColumn = '';
    let selectedColumnsToValidate = [];
    let tempColumnToValidate = '';
    let isExpanded = false;

    $: headers = $headersStore;
    $: conditionalNonNullInColumnsspecificRules = $rulesStore.rules.categories.conditionalNonNullInColumnsspecificRules || [];

    function addColumnToValidate() {
        if (tempColumnToValidate && !selectedColumnsToValidate.includes(tempColumnToValidate)) {
            selectedColumnsToValidate = [...selectedColumnsToValidate, tempColumnToValidate];
            tempColumnToValidate = '';
        }
    }

    function removeColumnToValidate(columnToRemove) {
        selectedColumnsToValidate = selectedColumnsToValidate.filter(col => col !== columnToRemove);
    }

    function confirmRule() {
        if (selectedColumn && selectedColumnsToValidate.length > 0) {
            rulesStore.update(store => ({
                ...store,
                rules: {
                    ...store.rules,
                    categories: {
                        ...store.rules.categories,
                        conditionalNonNullInColumnsspecificRules: [
                            ...(store.rules.categories.conditionalNonNullInColumnsspecificRules || []),
                            {
                                selectedColumn,
                                columnsToValidate: [...selectedColumnsToValidate]
                            }
                        ]
                    }
                }
            }));
            // Reset fields for a new rule
            selectedColumn = '';
            selectedColumnsToValidate = [];
        }
    }

    function removeRule(index) {
        rulesStore.update(store => ({
            ...store,
            rules: {
                ...store.rules,
                categories: {
                    ...store.rules.categories,
                    conditionalNonNullInColumnsspecificRules: store.rules.categories.conditionalNonNullInColumnsspecificRules.filter((_, i) => i !== index)
                }
            }
        }));
    }

    function toggleExpand() {
        isExpanded = !isExpanded;
    }

    const tooltipContent = "Validacion de numero de columnas con valor y con null de acuerdo al numero que haya en una columna seleccionada, ejemplo=  si en la columna de la tabla de excel numero_tallos esta el numero 2, entonces en las columnas previamente seleccionadas por el cliente como tallo_1, tallo_2, tallo_3, tallo_4, tallo_5, entonces tallo_1, tallo_2 deberian estar llenas por algun valor numerico y tallo_3, tallo_4 y tallo_5 en null";
</script>

<div class="custom-green-div p-4 rounded-lg">
    <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
            <h2 class="text-lg font-bold text-black">9 Reglas Validación No Nulos</h2>
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
                    <option value="">Seleccionar columna principal</option>
                    {#each headers as header}
                        <option value={header}>{header}</option>
                    {/each}
                </select>

                <div class="flex space-x-2">
                    <select bind:value={tempColumnToValidate} class="flex-grow bg-zinc-700 text-white p-2 rounded-md">
                        <option value="">Seleccionar columna a validar</option>
                        {#each headers as header}
                            {#if header !== selectedColumn && !selectedColumnsToValidate.includes(header)}
                                <option value={header}>{header}</option>
                            {/if}
                        {/each}
                    </select>
                    <button 
                        on:click={addColumnToValidate} 
                        disabled={!tempColumnToValidate}
                        class="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus />
                    </button>
                </div>

                {#if selectedColumnsToValidate.length > 0}
                    <div class="flex flex-wrap gap-2 mt-2">
                        {#each selectedColumnsToValidate as column}
                            <div class="bg-zinc-700 text-white px-2 py-1 rounded-md flex items-center">
                                <span>{column}</span>
                                <button
                                    on:click={() => removeColumnToValidate(column)}
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
                    disabled={!selectedColumn || selectedColumnsToValidate.length === 0}
                    class="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Confirmar Regla
                </button>
            </div>

            {#each conditionalNonNullInColumnsspecificRules as rule, index}
                <div class="bg-zinc-700 p-3 rounded-md">
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="text-white font-semibold mb-2">
                                {rule.selectedColumn}
                            </h3>
                            <div class="flex flex-wrap gap-2">
                                {#each rule.columnsToValidate as column}
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