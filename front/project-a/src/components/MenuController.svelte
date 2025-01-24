<script>
    import { onMount } from 'svelte';
    import { Menu } from 'lucide-svelte';
    import SideMenu from './SideMenu.svelte';
  
    let isMenuOpen = false;
    let isMounted = false;
  
    function toggleMenu() {
      isMenuOpen = !isMenuOpen;
    }
  
    onMount(() => {
      isMounted = true;
      const mediaQuery = window.matchMedia('(min-width: 768px)');
      
      const handleResize = (e) => {
        if (e.matches) {
          isMenuOpen = false;
        }
      };
  
      mediaQuery.addListener(handleResize);
      handleResize(mediaQuery);
  
      return () => {
        mediaQuery.removeListener(handleResize);
      };
    });
  </script>
  
  <button on:click={toggleMenu} class="menu-button" aria-label="Toggle menu">
    <Menu />
  </button>
  
  {#if isMounted}
    <SideMenu {isMenuOpen} />
  {/if}
  
  <style>
    .menu-button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      z-index: 1001;
    }
  </style>
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  