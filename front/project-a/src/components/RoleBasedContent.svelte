<script>
    import { onMount } from 'svelte';
    import ButtonAdmin from './ButtonAdmin.svelte';
  
    let role = null;
  
    onMount(() => {
      // Esta lógica se ejecutará solo cuando el componente esté en el lado del cliente
      if (typeof window !== 'undefined') {
        role = localStorage.getItem('role');
      }
    });
  </script>
  
  {#if role === 'admin'}
    <div class="mt-4 p-2">
      <ButtonAdmin />
    </div>
  {/if}
  
  