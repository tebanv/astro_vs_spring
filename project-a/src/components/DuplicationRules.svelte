<script>
    import { rulesStore } from '../stores/rulesStores.js';
    import { headersStore } from '../stores/headersStore.js';
    import { ChevronDown, ChevronUp, Plus, X } from 'lucide-svelte';

    let isExpanded = false;
    let selectedHeader = '';

    $: headers = $headersStore;
    $: duplicationRules = $rulesStore.rules.categories?.duplicationRules || [];

    function toggleExpand() {
        isExpanded = !isExpanded;
    }

    function addDuplicationRule() {
        if (selectedHeader && !duplicationRules.includes(selectedHeader)) {
            rulesStore.update(store => ({
                ...store,
                rules: {
                    ...store.rules,
                    categories: {
                        ...store.rules.categories,
                        duplicationRules: [...(store.rules.categories.duplicationRules || []), selectedHeader]
                    }
                }
            }));
            selectedHeader = '';
        }
    }

    function removeDuplicationRule(header) {
        rulesStore.update(store => ({
            ...store,
            rules: {
                ...store.rules,
                categories: {
                    ...store.rules.categories,
                    duplicationRules: (store.rules.categories.duplicationRules || []).filter(h => h !== header)
                }
            }
        }));
    }
</script>

<div class="custom-green-div p-4 rounded-lg">
    <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold text-black">Reglas de Duplicación</h2>
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
            <div class="flex space-x-2">
                <select 
                    bind:value={selectedHeader}
                    class="flex-grow bg-zinc-700 text-white p-2 rounded-md"
                >
                    <option value="">Seleccionar cabecera</option>
                    {#each headers as header}
                        <option value={header}>{header}</option>
                    {/each}
                </select>
                <button 
                    on:click={addDuplicationRule}
                    disabled={!selectedHeader}
                    class="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Agregar
                </button>
            </div>

            {#if duplicationRules.length > 0}
                <div class="space-y-2">
                    {#each duplicationRules as rule}
                        <div class="flex items-center justify-between bg-zinc-700 p-2 rounded-md">
                            <span class="text-white">{rule}</span>
                            <button
                                on:click={() => removeDuplicationRule(rule)}
                                class="text-red-400 hover:text-red-600 transition-colors"
                                aria-label={`Eliminar regla de duplicación para ${rule}`}
                            >
                                <X />
                            </button>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    {/if}
</div>