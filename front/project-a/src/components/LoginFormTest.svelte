<script>
  let username = '';
  let password = '';
  let message = '';

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await fetch('https://reqres.in/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: username, password }),  // ReqRes espera 'email' en lugar de 'username'
      });

      const data = await response.json();

      if (response.ok && data.token) {
        console.log('Received token:', data.token);
        message = 'Login successful! Check console for token.';
      } else {
        message = data.error || 'Login failed. Please try again.';
      }
    } catch (error) {
      console.error('Error:', error);
      message = 'An error occurred. Please try again.';
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-t from-zinc-500 via-fuchsia-600/7">
  <div class="bg-white p-8 rounded-lg shadow-md w-96">
    <h1 class="text-2xl font-bold mb-6 text-center">Login</h1>
    <form on:submit={handleSubmit} class="space-y-4">
      <div>
        <label for="username" class="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="text"
          id="username"
          bind:value={username}
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          id="password"
          bind:value={password}
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <button
        type="submit"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Enter
      </button>
    </form>
    {#if message}
      <p class="mt-4 text-center text-sm" class:text-green-600={message.includes('successful')} class:text-red-600={!message.includes('successful')}>
        {message}
      </p>
    {/if}
  </div>
</div>