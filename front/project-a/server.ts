import { Elysia, t } from 'elysia'
import jwt from 'jsonwebtoken'
import { cors } from '@elysiajs/cors'

// Mock user database
const users = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' },
]

// Secret key for JWT (in a real app, this should be an environment variable)
const JWT_SECRET = 'your-secret-key'

const app = new Elysia()
  .use(cors({
    origin: 'http://localhost:4321',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }))
  .post(
    '/login',
    ({ body }) => {
      const { username, password } = body

      // Find user in mock database
      const user = users.find(u => u.username === username && u.password === password)

      if (!user) {
        return {
          success: false,
          message: 'Invalid username or password'
        }
      }

      // Generate fake JWT
      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' })

      return {
        success: true,
        token
      }
    },
    {
      body: t.Object({
        username: t.String(),
        password: t.String()
      })
    }
  )
  .listen(3000)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)