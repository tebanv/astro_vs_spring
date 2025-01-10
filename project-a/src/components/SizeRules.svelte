<script>
    import { headersStore } from '../stores/headersStore.js';
    import { rulesStore } from '../stores/rulesStores.js';
    import { ChevronDown, ChevronUp, X } from 'lucide-svelte';

    let selectedHeader = '';
    let newSize = '';
    let isExpanded = false;

    $: headers = $headersStore;
    $: sizeRules = $rulesStore.rules.categories?.sizeRules || [];

    function toggleExpand() {
        isExpanded = !isExpanded;
    }

    function addSizeRule() {
        if (selectedHeader && newSize) {
            rulesStore.update(store => {
                const updatedSizeRules = [...(store.rules.categories.sizeRules || [])];
                if (!updatedSizeRules.some(rule => rule.name === selectedHeader)) {
                    updatedSizeRules.push({ name: selectedHeader, size: parseInt(newSize, 10) });
                }
                return {
                    ...store,
                    rules: {
                        ...store.rules,
                        categories: {
                            ...store.rules.categories,
                            sizeRules: updatedSizeRules
                        }
                    }
                };
            });
            selectedHeader = '';
            newSize = '';
        }
    }

    function removeSizeRule(name) {
        rulesStore.update(store => {
            const updatedSizeRules = store.rules.categories.sizeRules.filter(rule => rule.name !== name);
            return {
                ...store,
                rules: {
                    ...store.rules,
                    categories: {
                        ...store.rules.categories,
                        sizeRules: updatedSizeRules
                    }
                }
            };
        });
    }
</script>

<div class="custom-green-div p-4 rounded-lg">
    <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold text-black">Longitud de cadena</h2>
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

            <input
                type="number"
                bind:value={newSize}
                class="bg-zinc-600 text-white p-2 rounded-md flex-grow"
                placeholder="Tamaño"
                aria-label="Ingresar tamaño"
            />

            <button
                on:click={addSizeRule}
                class="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors"
                disabled={!selectedHeader || !newSize}
            >
                Agregar
            </button>
        </div>

        <div class="space-y-2">
            {#each sizeRules as rule (rule.name)}
                <div class="flex items-center justify-between bg-zinc-600/50 p-2 rounded-md">
                    <span class="text-white">{rule.name}: {rule.size}</span>
                    <button
                        on:click={() => removeSizeRule(rule.name)}
                        class="text-red-400 hover:text-red-600 transition-colors"
                        aria-label={`Eliminar regla de tamaño para ${rule.name}`}
                    >
                        <X size={20} />
                    </button>
                </div>
            {/each}
        </div>
    {/if}
</div>
