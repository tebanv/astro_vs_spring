<script>
    import { rulesStore } from '../stores/rulesStores.js';
    import { headersStore } from '../stores/headersStore.js';
    import { ChevronDown, ChevronUp, Plus, X } from 'lucide-svelte';

    let isExpanded = false;
    let selectedHeader = '';

    $: headers = $headersStore;
    $: reportHeaders = $rulesStore.report?.headers || [];

    function toggleExpand() {
        isExpanded = !isExpanded;
        
    }

    function addHeader() {
        if (selectedHeader && !reportHeaders.includes(selectedHeader)) {
            rulesStore.update(store => ({
                ...store,
                report: {
                    ...store.report,
                    headers: [...(store.report?.headers || []), selectedHeader]
                }
            }));
            selectedHeader = '';
        }
    }

    function removeHeader(header) {
        rulesStore.update(store => ({
            ...store,
            report: {
                ...store.report,
                headers: (store.report?.headers || []).filter(h => h !== header)
            }
        }));
    }
</script>

<div class="bg-zinc-100 p-4 rounded-lg">
    <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold text-black">Cabeceras del Reporte</h2>
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
                    class="flex-grow bg-zinc-700 text-gray-200 p-2 rounded-md"
                >
                    <option value="">Seleccionar cabecera</option>
                    {#each headers as header}
                        <option value={header}>{header}</option>
                    {/each}
                </select>
                <button 
                    on:click={addHeader}
                    disabled={!selectedHeader}
                    class="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Agregar
                </button>
            </div>

            {#if reportHeaders.length > 0}
                <div class="space-y-2">
                    {#each reportHeaders as header}
                        <div class="flex items-center justify-between bg-zinc-700 p-2 rounded-md">
                            <span class="text-white">{header}</span>
                            <button
                                on:click={() => removeHeader(header)}
                                class="text-red-400 hover:text-red-600 transition-colors"
                                aria-label={`Eliminar ${header}`}
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