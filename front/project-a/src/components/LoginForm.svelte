<script>
  import { LogOut } from 'lucide-svelte';
  import { jwtDecode } from 'jwt-decode';

  let email = '';
  let password = '';
  let message = '';

  async function handleSubmit(event) {
    event.preventDefault();
    console.log('handleSubmit called, event default prevented.');
    const body = JSON.stringify({ email, password });
    console.log('Sending JSON body:', body); // Log the JSON body here

      try {
      const response = await fetch('https://valued-teal-complete.ngrok-free.app/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });
          // Convertir el cuerpo de la solicitud a un string


      console.log('Fetch response received:', response);

      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok && data.token) {
        console.log('Login successful, received token:', data.token);

        const decoded = jwtDecode(data.token);
        const userRole = decoded?.role;

        localStorage.setItem('token', data.token);
        localStorage.setItem('rol', userRole);

        window.location.href = '/';
      } else {
        console.log('Login failed:', data.error);
        message = data.error || 'Login fallido. Intente nuevamente.';
      }
    } catch (error) {
      console.error('Error:', error);
      message = 'Ocurrió un error.Por favor intente nuevamente.';
    }
  }
</script>

<div class="flex flex-col items-center">
  <img src="../images/logo.jpg" alt="Logo" class="h-20 w-auto mb-8" />
  
  <form on:submit={handleSubmit} class="space-y-6 w-full">
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
      <input
        type="email"
        id="email"
        bind:value={email}
        required
        class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
               focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
      />
    </div>
    <div>
      <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
      <input
        type="password"
        id="password"
        bind:value={password}
        required
        class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
               focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
      />
    </div>
    <div>
      <button
        type="submit"
        class="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
      >
        <LogOut class="mr-2" size={18} strokeWidth={2.5} />
        <span>Iniciar Sesión</span>
      </button>
    </div>
    {#if message}
      <p class="mt-2 text-sm text-red-600">{message}</p>
    {/if}
  </form>
</div>




  