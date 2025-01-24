<script>
    import { HelpCircle, FileSpreadsheet, Settings, BarChart, Download } from 'lucide-svelte';
  
    export let isMenuOpen;
  
    const menuItems = [
      { href: '/instructions', text: 'Instrucciones', icon: HelpCircle },
      { href: '/cargar-excel', text: 'Cargar Excel', icon: FileSpreadsheet },
      { href: '/rules', text: 'Configurar reglas', icon: Settings },
      { href: '/analyze', text: 'Analizar Data', icon: BarChart },
      { href: '/results', text: 'Descargar Resultado', icon: Download },
    ];
  
    $: currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  </script>
  
  <nav class="side-menu" class:open={isMenuOpen}>
    <ul class="space-y-2">
      {#each menuItems as item}
        <li>
          <a 
            href={item.href} 
            class="menu-item"
            class:active={currentPath === item.href}
            aria-current={currentPath === item.href ? 'page' : undefined}
          >
            <svelte:component this={item.icon} size={20} class="menu-icon" />
            <span>{item.text}</span>
          </a>
        </li>
      {/each}
    </ul>
  </nav>
  
  <style>
    .side-menu {
      position: fixed;
      top: 0;
      left: 0;
      width: 250px;
      height: 100vh;
      background-color: var(--background-color);
      box-shadow: 2px 0 5px rgba(0,0,0,0.1);
      padding: 1rem;
      z-index: 1000;
      overflow-y: auto;
      transform: translateX(-100%);
      transition: transform 0.3s ease-in-out;
    }
  
    .side-menu.open {
      transform: translateX(0);
    }
  
    .menu-item {
      display: flex;
      align-items: center;
      padding: 0.75rem;
      color: var(--text-color);
      text-decoration: none;
      transition: background-color 0.2s ease;
      border-radius: 4px;
      font-size: 1rem;
    }
  
    .menu-item:hover, .menu-item:focus {
      background-color: var(--secondary-color);
      color: white;
    }
  
    .menu-item.active {
      background-color: var(--primary-color);
      color: white;
    }
  
    .menu-icon {
      margin-right: 0.5rem;
    }
  </style>
  
  
  
  
  
  
  
  
  
  
  