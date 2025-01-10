<script>
    import { headersStore } from '../stores/headersStore.js';
    import { categoriesStore } from '../stores/categoriesStore.js';
    import { rulesStore } from '../stores/rulesStores.js';
    import { ChevronDown, ChevronUp, X } from 'lucide-svelte';

    let selectedHeader = '';
    let selectedType = '';
    let isExpanded = false;

    $: headers = $headersStore;
    $: variableTypes = $categoriesStore.variableTypeRules;
    $: associations = $rulesStore.rules.categories?.variableTypeRules || [];

    function addAssociation() {
        if (selectedHeader && selectedType) {
            rulesStore.update(store => {
                const updatedAssociations = [...(store.rules.categories?.variableTypeRules || [])];
                if (!updatedAssociations.some(a => a.name === selectedHeader)) {
                    updatedAssociations.push({ name: selectedHeader, type: selectedType });
                }
                return {
                    ...store,
                    rules: {
                        ...store.rules,
                        categories: {
                            ...store.rules.categories,
                            variableTypeRules: updatedAssociations
                        }
                    }
                };
            });
            selectedHeader = '';
            selectedType = '';
        }
    }

    function removeAssociation(name) {
        rulesStore.update(store => ({
            ...store,
            rules: {
                ...store.rules,
                categories: {
                    ...store.rules.categories,
                    variableTypeRules: store.rules.categories?.variableTypeRules.filter(a => a.name !== name) || []
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
        <h2 class="text-lg font-bold text-black">Tipo de Variable</h2>
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

            <select
                bind:value={selectedType}
                class="bg-zinc-600 text-white p-2 rounded-md flex-grow"
                aria-label="Seleccionar tipo de variable"
            >
                <option value="">Seleccionar tipo</option>
                {#each variableTypes as type}
                    <option value={type.name}>{type.name}</option>
                {/each}
            </select>

            <button
                on:click={addAssociation}
                class="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors"
                disabled={!selectedHeader || !selectedType}
            >
                Agregar
            </button>
        </div>

        <div class="space-y-2">
            {#each associations as association (association.name)}
                <div class="flex items-center justify-between bg-zinc-600/50 p-2 rounded-md">
                    <span class="text-white">{association.name}: {association.type}</span>
                    <button
                        on:click={() => removeAssociation(association.name)}
                        class="text-red-400 hover:text-red-600 transition-colors"
                        aria-label={`Eliminar asociación para ${association.name}`}
                    >
                        <X size={20} />
                    </button>
                </div>
            {/each}
        </div>
    {/if}
</div>