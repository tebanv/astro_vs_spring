<script>
    import { rulesStore } from '../stores/rulesStores.js';
    import { headersStore } from '../stores/headersStore.js';
    import { ChevronDown, ChevronUp, Plus, X } from 'lucide-svelte';
    import Tooltip from './Tooltip.svelte';

    let selectedColumn = '';
    let allowedValue = '';
    let isExpanded = false;

    $: headers = $headersStore;
    $: specificValuesRules = $rulesStore.rules.categories.specificValuesRules || [];

    function addAllowedValue() {
        if (selectedColumn && allowedValue) {
            rulesStore.update(store => {
                const updatedStore = {
                    ...store,
                    rules: {
                        ...store.rules,
                        categories: {
                            ...store.rules.categories,
                            specificValuesRules: [...(store.rules.categories.specificValuesRules || [])]
                        }
                    }
                };

                const existingRule = updatedStore.rules.categories.specificValuesRules.find(rule => rule.columnName === selectedColumn);
                if (existingRule) {
                    if (!existingRule.allowedValues.includes(allowedValue)) {
                        existingRule.allowedValues.push(allowedValue);
                    }
                } else {
                    updatedStore.rules.categories.specificValuesRules.push({
                        columnName: selectedColumn,
                        allowedValues: [allowedValue]
                    });
                }
                return updatedStore;
            });
            allowedValue = '';
        }
    }

    function removeAllowedValue(columnName, valueToRemove) {
        rulesStore.update(store => {
            const updatedStore = {
                ...store,
                rules: {
                    ...store.rules,
                    categories: {
                        ...store.rules.categories,
                        specificValuesRules: [...(store.rules.categories.specificValuesRules || [])]
                    }
                }
            };

            const ruleIndex = updatedStore.rules.categories.specificValuesRules.findIndex(rule => rule.columnName === columnName);
            if (ruleIndex !== -1) {
                const rule = updatedStore.rules.categories.specificValuesRules[ruleIndex];
                rule.allowedValues = rule.allowedValues.filter(value => value !== valueToRemove);
                if (rule.allowedValues.length === 0) {
                    updatedStore.rules.categories.specificValuesRules.splice(ruleIndex, 1);
                }
            }
            return updatedStore;
        });
    }

    function toggleExpand() {
        isExpanded = !isExpanded;
    }
    const tooltipContent = "Validacion de valores especificos. Ejemplo= _Status debe tener valor especifico Validado o Realizado";
</script>

<div class="custom-green-div p-4 rounded-lg">
    <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
            <h2 class="text-lg font-bold text-black">Asociación de columanas para no nulidad</h2>
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
        <div class="mt-4 space-y-4">
            <div class="space-y-2">
                <select 
                    bind:value={selectedColumn} 
                    class="w-full bg-zinc-700 text-white p-2 rounded-md"
                >
                    <option value="">Seleccionar columna</option>
                    {#each headers as header}
                        <option value={header}>{header}</option>
                    {/each}
                </select>

                <div class="flex space-x-2">
                    <input
                        type="text"
                        bind:value={allowedValue}
                        placeholder="Valor permitido"
                        class="flex-grow bg-zinc-700 text-white p-2 rounded-md"
                    />
                    <button 
                        on:click={addAllowedValue} 
                        disabled={!selectedColumn || !allowedValue}
                        class="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus />
                    </button>
                </div>
            </div>

            {#if specificValuesRules.length > 0}
                <div class="space-y-2">
                    {#each specificValuesRules as rule}
                        <div class="bg-zinc-700 p-3 rounded-md">
                            <h3 class="text-white font-semibold mb-2">{rule.columnName}</h3>
                            <div class="flex flex-wrap gap-2">
                                {#each rule.allowedValues as value}
                                    <div class="bg-zinc-600 text-white px-2 py-1 rounded-md flex items-center">
                                        <span>{value}</span>
                                        <button
                                            on:click={() => removeAllowedValue(rule.columnName, value)}
                                            class="ml-2 text-red-400 hover:text-red-600 transition-colors"
                                        >
                                            <X />
                                        </button>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    {/if}
</div>