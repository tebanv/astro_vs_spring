<script>
    import { onMount } from 'svelte';
  
    function checkTokenExpiration() {
      const token = localStorage.getItem('token');
      const expTime = localStorage.getItem('exp');
  
      if (!token || !expTime) {
        console.log("No token or expiration time found");
        redirectToLogin();
        return;
      }
  
      const expirationDate = new Date(parseInt(expTime) * 1000);
      const now = new Date();
      const timeUntilExpiration = expirationDate.getTime() - now.getTime();
      const hoursUntilExpiration = timeUntilExpiration / (1000 * 60 * 60);
  
      if (hoursUntilExpiration <= 0) {
        // Token ha expirado
        console.log("Token expired");
        clearLocalStorageAndRedirect();
      } else if (hoursUntilExpiration <= 12) {
        showExpirationWarning(Math.round(hoursUntilExpiration));
      }
    }
  
    function showExpirationWarning(hours) {
      // Evitar mostrar múltiples advertencias
      if (document.getElementById('expirationWarning')) return;
  
      const warningDiv = document.createElement('div');
      warningDiv.id = 'expirationWarning';
      warningDiv.style.position = 'fixed';
      warningDiv.style.top = '16px';
      warningDiv.style.right = '16px';
      warningDiv.style.left = '16px';
      warningDiv.style.backgroundColor = '#FFA500';
      warningDiv.style.color = 'white';
      warningDiv.style.padding = '15px';
      warningDiv.style.borderRadius = '5px';
      warningDiv.style.zIndex = '1000';
      warningDiv.innerHTML = `
        <p>Su sesión expirará en aproximadamente ${hours} horas. Guarde su trabajo y vuelva a iniciar sesión pronto.</p>
        <button id="closeWarning" style="background-color: #FF6347; border: none; color: white; padding: 5px 10px; margin-top: 10px; cursor: pointer;">Entendido</button>      
      `;
      document.body.appendChild(warningDiv);
        
      document.getElementById('closeWarning').addEventListener('click', () => {
        warningDiv.remove();
      });
    }
  
    function clearLocalStorageAndRedirect() {
      localStorage.removeItem('token');
      localStorage.removeItem('exp');
      localStorage.removeItem('rol');
      redirectToLogin();
    }
  
    function redirectToLogin() {
      window.location.href = '/login';
    }
  
    onMount(() => {
      // Verificar la expiración del token cada 5 minutos
      const interval = setInterval(checkTokenExpiration, 5 * 60 * 1000);
  
      // Verificar inmediatamente al cargar la página
      checkTokenExpiration();
  
      // Limpiar el intervalo cuando el componente se desmonta
      return () => clearInterval(interval);
    });
  </script>