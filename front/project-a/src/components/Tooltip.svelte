<script>
    import { createEventDispatcher } from 'svelte';
    import { Info } from 'lucide-svelte';
  
    export let content = '';
  
    let isVisible = false;
  
    const dispatch = createEventDispatcher();
  
    function showTooltip() {
      isVisible = true;
      dispatch('show');
    }
  
    function hideTooltip() {
      isVisible = false;
      dispatch('hide');
    }
  </script>
  
  <div class="relative inline-block">
    <button
      on:mouseenter={showTooltip}
      on:mouseleave={hideTooltip}
      on:focus={showTooltip}
      on:blur={hideTooltip}
      class="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 rounded-full"
      aria-label="Más información"
    >
      <Info size={18} />
    </button>
  
    {#if isVisible}
      <div
        class="absolute z-50 bg-white border border-gray-200 p-2 rounded-md text-xs text-gray-700 w-64 shadow-md"
        style="top: 100%; left: calc(100% + 10px); transform: translateX(-25%);"
        role="tooltip"
      >
        {content}
      </div>
    {/if}
  </div>