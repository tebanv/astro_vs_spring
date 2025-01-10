<script>
    import { headersStore } from '../stores/headersStore.js';
    import { rulesStore } from '../stores/rulesStores.js';
    import { ChevronDown, ChevronUp, X } from 'lucide-svelte';

    let selectedHeader = '';
    let isExpanded = false;

    $: headers = $headersStore;
    $: nullRules = $rulesStore.rules.categories?.nullRules || [];

    function addNullRule() {
        if (selectedHeader && !nullRules.includes(selectedHeader)) {
            updateRulesStore([...nullRules, selectedHeader]);
            selectedHeader = '';
        }
    }

    function removeNullRule(header) {
        updateRulesStore(nullRules.filter(h => h !== header));
    }

    function updateRulesStore(updatedNullRules) {
        rulesStore.update(store => ({
            ...store,
            rules: {
                ...store.rules,
                categories: {
                    ...store.rules.categories,
                    nullRules: updatedNullRules
                }
            }
        }));
    }

    function toggleExpand() {
        isExpanded = !isExpanded;
    }
</script>

<div class="custom-green-div p-4 rounded-lg">
    <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold text-black">No Nulidad</h2>
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
                bind:value={selectedHeader}
                class="bg-zinc-600 text-white p-2 rounded-md flex-grow"
                aria-label="Seleccionar cabecera"
            >
                <option value="">Seleccionar cabecera</option>
                {#each headers as header}
                    <option value={header}>{header}</option>
                {/each}
            </select>

            <button
                on:click={addNullRule}
                class="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors"
                disabled={!selectedHeader}
            >
                Agregar
            </button>
        </div>

        <div class="space-y-2">
            {#each nullRules as rule}
                <div class="flex items-center justify-between bg-zinc-600/50 p-2 rounded-md">
                    <span class="text-white">{rule}</span>
                    <button
                        on:click={() => removeNullRule(rule)}
                        class="text-red-400 hover:text-red-600 transition-colors"
                        aria-label={`Eliminar regla nula para ${rule}`}
                    >
                        <X size={20} />
                    </button>
                </div>
            {/each}
        </div>
    {/if}
</div>