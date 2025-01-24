// Importar los módulos necesarios
import Elysia from 'elysia';
import jwt from 'jsonwebtoken';
import cors from '@elysiajs/cors';

// Crear la aplicación Elysia
const app = new Elysia();

// Usar el middleware CORS para permitir solicitudes desde el frontend
app.use(cors());

// Clave secreta para firmar los tokens JWT
const SECRET_KEY = 'mi_clave_secreta_super_segura';

// Base de datos "falsa" de usuarios
const users = [
  { nombre: 'Admin User', rol: 'admin', email: 'admin@example.com', contrasena: 'admin123' },
  { nombre: 'General User', rol: 'general', email: 'user@example.com', contrasena: 'user123' }
];

// Ruta de inicio de sesión
app.post('/login', async (req) => {
  try {
    console.log('Solicitud recibida en /login'); // Log para ver si la solicitud llega a la ruta
    const { email, password } = req.body;

    // Log para depurar: Imprimir los datos recibidos
    console.log('Datos recibidos:', { email, password });

    // Verificar si el usuario existe en la "base de datos"
    const user = users.find((u) => u.email === email && u.contrasena === password);

    if (user) {
      // Generar un token JWT con la información del usuario
      const token = jwt.sign(
        {
          nombre: user.nombre,
          rol: user.rol,
        },
        SECRET_KEY,
        { expiresIn: '1h' } // El token expira en 1 hora
      );

      console.log('Usuario autenticado exitosamente:', user.nombre); // Log para ver si el usuario fue autenticado

      // Devolver el token al cliente de manera directa usando Response
      return new Response(JSON.stringify({ token }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } else {
      // Si el usuario no existe o la contraseña es incorrecta, devolver un error
      console.log('Usuario no encontrado o contraseña incorrecta'); // Log para ver qué falla
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
  } catch (error) {
    console.error('Error interno del servidor:', error); // Log del error para depurar
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});










