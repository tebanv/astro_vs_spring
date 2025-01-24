<script>
    import { LogOut } from 'lucide-svelte';
  
    function handleLogout() {
      // Limpiar localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('role');
  
      // Redirigir al login
      window.location.href = '/login';
    }
  </script>
  
  <button
    on:click={handleLogout}
    class="w-full bg-zinc-400 text-white py-2 px-4 rounded hover:bg-zinc-500 transition-colors flex items-center justify-center"
  >
    <LogOut class="mr-2" size={18} strokeWidth={2.5} />
    <span class="font-normal">Cerrar Sesión</span>
  </button>