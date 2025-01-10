<script>
    import { rulesStore } from '../stores/rulesStores.js';
    import { headersStore } from '../stores/headersStore.js';
    import { ChevronDown, ChevronUp, Plus, X } from 'lucide-svelte';
    import { onMount } from 'svelte';
    import Tooltip from './Tooltip.svelte';

    let selectedColumn = '';
    let dictionaryName = '';
    let columnNameInDictionary = '';
    let isExpanded = false;
    let activeTab = 'names';

    // Para la pestaña de hábitos
    let columnNameHabit = '';
    let columnNameToCompare = '';
    let habit = '';
    let value = '';
    let habits = [];

    $: headers = $headersStore;
    $: dictionaries = $rulesStore.rules.dictionaries;

    onMount(() => {
        if (!$rulesStore.rules.dictionaries) {
            rulesStore.update(store => {
                store.rules.dictionaries = { names: [], numbers: [], habits: [] };
                return store;
            });
        }
    });

    function addDictionary() {
        if (activeTab === 'names' && selectedColumn && dictionaryName && columnNameInDictionary) {
            rulesStore.update(store => {
                if (!store.rules.dictionaries.names) {
                    store.rules.dictionaries.names = [];
                }
                store.rules.dictionaries.names.push({
                    columnName: selectedColumn,
                    dictionaryName,
                    columnNameInDictionary
                });
                return store;
            });
            // Reset fields
            selectedColumn = '';
            dictionaryName = '';
            columnNameInDictionary = '';
        } else if (activeTab === 'habits' && columnNameHabit && columnNameToCompare && habits.length > 0 && dictionaryName && columnNameInDictionary) {
            rulesStore.update(store => {
                if (!store.rules.dictionaries.habits) {
                    store.rules.dictionaries.habits = [];
                }
                store.rules.dictionaries.habits.push({
                    columnNameHabit,
                    columnNameToCompare,
                    habits: [...habits],
                    dictionaryName,
                    columnNameInDictionary
                });
                return store;
            });
            // Reset fields
            columnNameHabit = '';
            columnNameToCompare = '';
            habits = [];
            dictionaryName = '';
            columnNameInDictionary = '';
        }
    }

    function addHabit() {
        if (habit && value) {
            habits = [...habits, { habit, value: parseFloat(value) }];
            habit = '';
            value = '';
        }
    }

    function removeHabit(index) {
        habits = habits.filter((_, i) => i !== index);
    }

    function removeDictionary(index) {
        rulesStore.update(store => {
            if (activeTab === 'names') {
                store.rules.dictionaries.names.splice(index, 1);
            } else if (activeTab === 'habits') {
                store.rules.dictionaries.habits.splice(index, 1);
            }
            return store;
        });
    }

    function toggleExpand() {
        isExpanded = !isExpanded;
    }
    const tooltipContent = "Se debe seleccionar la columna y entrada del diccionario que el valor de la entrada debe coincidir (Nombres científicos con N. comunes, Barrios con comunas, hábito con especie, altura con tipo de altura, Listado de municipios)";
</script>

<div class="custom-green-div p-4 rounded-lg">
    <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
            <h2 class="text-lg font-bold text-black">Emparejamiento con Biblioteca</h2>
            <Tooltip content={tooltipContent}>
                <Info size={20} class="text-gray-600 cursor-help" />
            </Tooltip>
        </div>
        <button on:click={toggleExpand} class="text-black hover:text-blue-300 transition-colors" aria-label={isExpanded ? "Contraer sección" : "Expandir sección"}>
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
                <button 
                    class:bg-blue-500={activeTab === 'names'} 
                    class:bg-gray-300={activeTab !== 'names'}
                    class="px-4 py-2 rounded text-white"
                    on:click={() => activeTab = 'names'}
                >
                    Nombres
                </button>
                <button 
                    class:bg-blue-500={activeTab === 'habits'} 
                    class:bg-gray-300={activeTab !== 'habits'}
                    class="px-4 py-2 rounded text-white"
                    on:click={() => activeTab = 'habits'}
                >
                    Hábitos
                </button>
                <button 
                    class:bg-blue-500={activeTab === 'numbers'} 
                    class:bg-gray-300={activeTab !== 'numbers'}
                    class="px-4 py-2 rounded text-white"
                    on:click={() => activeTab = 'numbers'}
                >
                    Números
                </button>
            </div>

            {#if activeTab === 'names'}
                <div class="space-y-2">
                    <select 
                        bind:value={selectedColumn} 
                        class="w-full bg-zinc-700 text-white p-2 rounded-md"
                        aria-label="Seleccionar columna para el diccionario"
                    >
                        <option value="">Seleccionar columna</option>
                        {#each headers as header}
                            <option value={header}>{header}</option>
                        {/each}
                    </select>

                    <input
                        type="text"
                        bind:value={dictionaryName}
                        placeholder="Nombre del diccionario"
                        class="w-full bg-zinc-700 text-white p-2 rounded-md"
                        aria-label="Nombre del diccionario"
                    />

                    <input
                        type="text"
                        bind:value={columnNameInDictionary}
                        placeholder="Nombre de la columna en el diccionario"
                        class="w-full bg-zinc-700 text-white p-2 rounded-md"
                        aria-label="Nombre de la columna en el diccionario"
                    />

                    <button 
                        on:click={addDictionary} 
                        disabled={!selectedColumn || !dictionaryName || !columnNameInDictionary}
                        class="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Agregar diccionario"
                    >
                        <Plus class="inline-block mr-2" />
                        Agregar Diccionario
                    </button>
                </div>

                {#if dictionaries.names && dictionaries.names.length > 0}
                    <div class="space-y-2">
                        {#each dictionaries.names as dictionary, index}
                            <div class="bg-zinc-700 p-3 rounded-md flex justify-between items-center">
                                <div>
                                    <span class="text-white font-semibold">{dictionary.columnName}</span>
                                    <span class="text-gray-400 ml-2">-</span>
                                    <span class="text-gray-300 ml-2">{dictionary.dictionaryName}</span>
                                    <span class="text-gray-400 ml-2">-</span>
                                    <span class="text-gray-300 ml-2">{dictionary.columnNameInDictionary}</span>
                                </div>
                                <button 
                                    on:click={() => removeDictionary(index)}
                                    class="text-red-400 hover:text-red-600 transition-colors"
                                    aria-label={`Eliminar diccionario para ${dictionary.columnName}`}
                                >
                                    <X />
                                </button>
                            </div>
                        {/each}
                    </div>
                {/if}
            {:else if activeTab === 'habits'}
                <div class="space-y-2">
                    <select 
                        bind:value={columnNameHabit} 
                        class="w-full bg-zinc-700 text-white p-2 rounded-md"
                        aria-label="Seleccionar columna para el hábito"
                    >
                        <option value="">Seleccionar columna para el hábito</option>
                        {#each headers as header}
                            <option value={header}>{header}</option>
                        {/each}
                    </select>

                    <select 
                        bind:value={columnNameToCompare} 
                        class="w-full bg-zinc-700 text-white p-2 rounded-md"
                        aria-label="Seleccionar columna para comparar"
                    >
                        <option value="">Seleccionar columna para comparar</option>
                        {#each headers as header}
                            <option value={header}>{header}</option>
                        {/each}
                    </select>

                    <input
                        type="text"
                        bind:value={habit}
                        placeholder="Hábito"
                        class="w-full bg-zinc-700 text-white p-2 rounded-md"
                        aria-label="Hábito"
                    />

                    <input
                        type="number"
                        bind:value={value}
                        placeholder="Valor"
                        class="w-full bg-zinc-700 text-white p-2 rounded-md"
                        aria-label="Valor"
                    />

                    <button 
                        on:click={addHabit}
                        disabled={!habit || !value}
                        class="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Agregar hábito"
                    >
                        <Plus class="inline-block mr-2" />
                        Agregar Hábito
                    </button>

                    {#if habits.length > 0}
                        <div class="space-y-2">
                            {#each habits as habit, index}
                                <div class="bg-zinc-600 p-2 rounded-md flex justify-between items-center">
                                    <span>{habit.habit} - {habit.value}</span>
                                    <button 
                                        on:click={() => removeHabit(index)}
                                        class="text-red-400 hover:text-red-600 transition-colors"
                                        aria-label={`Eliminar hábito ${habit.habit}`}
                                    >
                                        <X />
                                    </button>
                                </div>
                            {/each}
                        </div>
                    {/if}

                    <input
                        type="text"
                        bind:value={dictionaryName}
                        placeholder="Nombre del diccionario"
                        class="w-full bg-zinc-700 text-white p-2 rounded-md"
                        aria-label="Nombre del diccionario"
                    />

                    <input
                        type="text"
                        bind:value={columnNameInDictionary}
                        placeholder="Nombre de la columna en el diccionario"
                        class="w-full bg-zinc-700 text-white p-2 rounded-md"
                        aria-label="Nombre de la columna en el diccionario"
                    />

                    <button 
                        on:click={addDictionary}
                        disabled={!columnNameHabit || !columnNameToCompare || habits.length === 0 || !dictionaryName || !columnNameInDictionary}
                        class="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Agregar diccionario de hábitos"
                    >
                        <Plus class="inline-block mr-2" />
                        Agregar Diccionario de Hábitos
                    </button>
                </div>

                {#if dictionaries.habits && dictionaries.habits.length > 0}
                    <div class="space-y-2">
                        {#each dictionaries.habits as dictionary, index}
                            <div class="bg-zinc-700 p-3 rounded-md flex justify-between items-center">
                                <div>
                                    <span class="text-white font-semibold">{dictionary.columnNameHabit}</span>
                                    <span class="text-gray-400 ml-2">-</span>
                                    <span class="text-gray-300 ml-2">{dictionary.columnNameToCompare}</span>
                                    <span class="text-gray-400 ml-2">-</span>
                                    <span class="text-gray-300 ml-2">{dictionary.dictionaryName}</span>
                                    <span class="text-gray-400 ml-2">-</span>
                                    <span class="text-gray-300 ml-2">{dictionary.columnNameInDictionary}</span>
                                </div>
                                <button 
                                    on:click={() => removeDictionary(index)}
                                    class="text-red-400 hover:text-red-600 transition-colors"
                                    aria-label={`Eliminar diccionario de hábitos para ${dictionary.columnNameHabit}`}
                                >
                                    <X />
                                </button>
                            </div>
                        {/each}
                    </div>
                {/if}
            {:else if activeTab === 'numbers'}
                <p class="text-gray-300">Funcionalidad de números aún no implementada.</p>
            {/if}
        </div>
    {/if}
</div>