<script>
    import { unifiedStore, setRules } from '../stores/unifiedStore.js';
    import { ChevronDown, ChevronUp, X } from 'lucide-svelte';
    import { onMount } from 'svelte';

    let selectedHeader = '';
    let isExpanded = false;
    let headers = [];
    let notNullRules = [];

    $: ({ headers = [] } = $unifiedStore);
    $: ({ rules: { categories: { notNullRules = [] } = {} } = {} } = $unifiedStore);

    $: {
        console.log('Headers en NotNullRules:', headers);
        console.log('Estado completo del store:', $unifiedStore);
    }

    onMount(() => {
        const unsubscribe = unifiedStore.subscribe(state => {
            headers = state.headers || [];
            notNullRules = state.rules?.categories?.notNullRules || [];
            console.log('Headers actualizados:', headers);
        });

        return unsubscribe;
    });

    function addNotNullRule() {
        if (selectedHeader && !notNullRules.includes(selectedHeader)) {
            updateRulesStore([...notNullRules, selectedHeader]);
            selectedHeader = '';
        }
    }

    function removeNotNullRule(header) {
        updateRulesStore(notNullRules.filter(h => h !== header));
    }

    function updateRulesStore(updatedNotNullRules) {
        const currentRules = $unifiedStore.rules;
        setRules({
            ...currentRules,
            categories: {
                ...currentRules.categories,
                notNullRules: updatedNotNullRules
            }
        });
    }

    function toggleExpand() {
        isExpanded = !isExpanded;
    }
</script>

<div class="custom-green-div p-4 rounded-lg">
    <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold text-black">Reglas No Nulas</h2>
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
                on:click={addNotNullRule}
                class="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors"
                disabled={!selectedHeader || headers.length === 0}
            >
                Agregar
            </button>
        </div>

        <div class="space-y-2">
            {#each notNullRules as rule}
                <div class="flex items-center justify-between bg-zinc-600/50 p-2 rounded-md">
                    <span class="text-white">{rule}</span>
                    <button
                        on:click={() => removeNotNullRule(rule)}
                        class="text-red-400 hover:text-red-600 transition-colors"
                        aria-label={`Eliminar regla no nula para ${rule}`}
                    >
                        <X size={20} />
                    </button>
                </div>
            {/each}
        </div>
    {/if}
</div>