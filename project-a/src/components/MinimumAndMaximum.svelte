<script>
    import { headersStore } from '../stores/headersStore.js';
    import { rulesStore } from '../stores/rulesStores.js';
    import { ChevronDown, ChevronUp, X } from 'lucide-svelte';
    import Tooltip from './Tooltip.svelte';

    let isExpanded = false;
    let selectedHeader = '';
    let minValue = null;
    let maxValue = null;

    $: headers = $headersStore;
    $: minMaxRules = $rulesStore.rules.categories?.minimumAndMaximumRules || [];

    function toggleExpand() {
        isExpanded = !isExpanded;
    }

    function addMinMaxRule() {
        if (selectedHeader && (minValue !== null || maxValue !== null)) {
            rulesStore.update(store => {
                const updatedStore = {
                    ...store,
                    rules: {
                        ...store.rules,
                        categories: {
                            ...store.rules.categories,
                            minimumAndMaximumRules: [...(store.rules.categories.minimumAndMaximumRules || [])]
                        }
                    }
                };

                const existingRuleIndex = updatedStore.rules.categories.minimumAndMaximumRules.findIndex(rule => rule.name === selectedHeader);
                
                if (existingRuleIndex !== -1) {
                    updatedStore.rules.categories.minimumAndMaximumRules[existingRuleIndex] = {
                        name: selectedHeader,
                        minValue: minValue,
                        maxValue: maxValue
                    };
                } else {
                    updatedStore.rules.categories.minimumAndMaximumRules.push({
                        name: selectedHeader,
                        minValue: minValue,
                        maxValue: maxValue
                    });
                }

                return updatedStore;
            });

            selectedHeader = '';
            minValue = null;
            maxValue = null;
        }
    }

    function removeMinMaxRule(header) {
        rulesStore.update(store => {
            const updatedStore = {
                ...store,
                rules: {
                    ...store.rules,
                    categories: {
                        ...store.rules.categories,
                        minimumAndMaximumRules: store.rules.categories.minimumAndMaximumRules.filter(rule => rule.name !== header)
                    }
                }
            };
            return updatedStore;
        });
    }
    const tooltipContent = "El valor en la columna seleccionada debe tener un Minimo y Maximo numéricos.";
</script>

<div class="custom-green-div p-4 rounded-lg">
    <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
            <h2 class="text-lg font-bold text-black">8 Reglas de Mínimo y Máximo</h2>
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
                    bind:value={selectedHeader}
                    class="bg-zinc-600 text-white p-2 rounded-md flex-grow"
                    aria-label="Seleccionar cabecera"
                >
                    <option value="">Seleccionar cabecera</option>
                    {#each headers as header}
                        <option value={header}>{header}</option>
                    {/each}
                </select>

                <input
                    type="number"
                    bind:value={minValue}
                    class="bg-zinc-600 text-white p-2 rounded-md flex-grow"
                    placeholder="Valor Mínimo"
                    aria-label="Ingresar valor mínimo"
                />

                <input
                    type="number"
                    bind:value={maxValue}
                    class="bg-zinc-600 text-white p-2 rounded-md flex-grow"
                    placeholder="Valor Máximo"
                    aria-label="Ingresar valor máximo"
                />
                <button
                on:click={addMinMaxRule}
                class="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors flex-shrink-0"
                disabled={!selectedHeader || (minValue === null && maxValue === null)}
                >
                Agregar
                </button>
            


        </div>

        <div class="space-y-2">
            {#each minMaxRules as rule (rule.name)}
                <div class="flex items-center justify-between bg-zinc-600/50 p-2 rounded-md">
                    <span class="text-white">
                        {rule.name}: 
                        {rule.minValue !== null ? `Mínimo ${rule.minValue}` : ''}
                        {rule.minValue !== null && rule.maxValue !== null ? ', ' : ''}
                        {rule.maxValue !== null ? `Máximo ${rule.maxValue}` : ''}
                    </span>
                    <button
                        on:click={() => removeMinMaxRule(rule.name)}
                        class="text-red-400 hover:text-red-600 transition-colors"
                        aria-label={`Eliminar regla para ${rule.name}`}
                    >
                        <X size={20} />
                    </button>
                </div>
            {/each}
        </div>
    {/if}
</div>

