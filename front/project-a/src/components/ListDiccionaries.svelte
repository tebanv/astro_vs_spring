<!-- RESPUESTA:
{
  "diccionarios": [
    { "id": 1, "nombre": "Diccionario 1" },
    { "id": 2, "nombre": "Diccionario 2" },
    { "id": 3, "nombre": "Diccionario 3" }
  ]
} -->
<script>
  let diccionarios = []; // Array para almacenar los diccionarios
  let error = null; // Variable para manejar errores

  // Función para obtener los diccionarios
  async function obtenerDiccionarios() {
    try {
      const response = await axios.get('/api/diccionarios', {
        headers: {
          'Accept': 'application/json'
        }
      });

      // Asigna el array de diccionarios desde la respuesta
      diccionarios = response.data.diccionarios;
    } catch (err) {
      // Manejo de errores
      error = 'Error al obtener los diccionarios';
      console.error(err);
    }
  }

  // Llama a la función cuando el componente se monte
  onMount(() => {
    obtenerDiccionarios();
  });
</script>