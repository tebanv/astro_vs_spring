# Instructivo para Backend: Configuracion Runtime de Endpoints del Frontend

## Objetivo

El frontend fue preparado para leer la configuracion de endpoints en tiempo de ejecucion, sin necesidad de recompilar.

La meta es que backend o la infraestructura publiquen un archivo JavaScript con la configuracion real del ambiente. Si cambian dominios, prefijos o paths de endpoints, el frontend debe seguir funcionando con solo actualizar ese archivo.

## Fuente que consume el frontend

El frontend carga este archivo al abrir la aplicacion:

- `front/project-a/public/app-config.js`

Ese archivo se inyecta en los layouts principales antes de hidratar los componentes, por lo que debe existir y ser accesible desde el navegador.

## Formato obligatorio del archivo

Backend debe exponer un JavaScript valido con esta estructura:

```js
window.__APP_CONFIG__ = {
  services: {
    api: "https://dominio-real/api",
    auth: "https://dominio-real/auth"
  },
  endpoints: {
    login: {
      service: "auth",
      path: "/login"
    },
    analyzeDatabase: {
      service: "api",
      path: "/analyze-databases-savia"
    },
    reportStatus: {
      service: "api",
      path: "/report-status/{reportId}"
    },
    downloadExcel: {
      service: "api",
      path: "/download-excel/{fileName}"
    },
    dictionaries: {
      service: "api",
      path: "/dictionaries"
    }
  }
};
```

## Significado de cada seccion

### `services`

Define las bases reales por tipo de servicio.

- `api`: base para endpoints de analisis, reportes y diccionarios.
- `auth`: base para login y futuras rutas de autenticacion.

Reglas:

- Deben ser strings validos.
- No deben terminar en `/`.
- Pueden apuntar al mismo dominio o a dominios distintos.

Ejemplos validos:

```js
services: {
  api: "https://api.miempresa.com/api",
  auth: "https://api.miempresa.com/auth"
}
```

```js
services: {
  api: "https://backend-reportes.miempresa.com/api",
  auth: "https://backend-auth.miempresa.com/auth"
}
```

### `endpoints`

Define el nombre logico del endpoint y el path real que debe usar el frontend.

Cada endpoint tiene:

- `service`: nombre de la base definida en `services`
- `path`: path relativo dentro de ese servicio

## Placeholders soportados

El frontend reemplaza automaticamente placeholders dentro del path.

Actualmente estan soportados:

- `{reportId}`
- `{fileName}`

Ejemplos:

```js
path: "/report-status/{reportId}"
```

```js
path: "/download-excel/{fileName}"
```

Si backend cambia un path con parametros, debe mantener este formato de placeholders con llaves.

## Contratos actuales que backend no debe romper

La configuracion runtime permite cambiar ubicaciones de endpoints. No cambia el contrato funcional del frontend.

Backend debe mantener estos contratos salvo que se coordine un cambio de codigo en frontend.

### 1. Login

Endpoint logico: `login`

Request:

```http
POST application/json
```

Body enviado por frontend:

```json
{
  "email": "usuario@dominio.com",
  "password": "clave"
}
```

Response esperada en caso exitoso:

```json
{
  "token": "jwt"
}
```

Notas:

- El frontend decodifica el JWT y extrae `role` y `exp`.
- Si el token cambia de estructura, backend debe avisar porque el frontend depende de esos claims.

### 2. Iniciar analisis

Endpoint logico: `analyzeDatabase`

Request:

```http
POST multipart/form-data
Authorization: Bearer <token>
```

Partes enviadas por frontend:

- `db-file`: archivo Excel cargado por el usuario
- `br-file`: archivo JSON de reglas generado por el frontend

Response esperada en caso exitoso:

```json
{
  "reportId": "uuid-o-id"
}
```

Notas:

- Si backend responde con otro envoltorio, frontend debe adaptarse.
- Si backend requiere headers adicionales, deben acordarse antes.

### 3. Consultar estado del analisis

Endpoint logico: `reportStatus`

Request:

```http
GET
Authorization: Bearer <token>
```

Path params:

- `reportId`

Response esperada:

```json
{
  "status": "PENDIENTE|COMPLETADO",
  "resultFilePath": "ruta-opcional",
  "fileName": "archivo.xlsx"
}
```

Notas:

- El frontend hoy trabaja explicitamente con `PENDIENTE` y `COMPLETADO`.
- Si backend usa otros estados, hay que mapearlos en frontend.

### 4. Descargar archivo resultado

Endpoint logico: `downloadExcel`

Request:

```http
GET
```

Path params:

- `fileName`

Comportamiento esperado:

- Debe devolver el archivo listo para descarga.
- El frontend construye un enlace directo con esa URL.

### 5. Listado de diccionarios

Endpoint logico: `dictionaries`

Request:

```http
GET
Authorization: Bearer <token>
```

Response esperada:

```json
{
  "dictionaries": [
    {
      "id": 1,
      "name": "Nombre Diccionario"
    }
  ]
}
```

## Lo que backend puede cambiar sin recompilar frontend

Backend o infraestructura pueden cambiar estas cosas modificando solo `app-config.js`:

- dominio base del servicio `api`
- dominio base del servicio `auth`
- prefijos como `/api`, `/api/v2`, `/auth`, `/identity`
- paths concretos de endpoints

Ejemplo:

```js
window.__APP_CONFIG__ = {
  services: {
    api: "https://gateway.miempresa.com/reporting",
    auth: "https://gateway.miempresa.com/identity"
  },
  endpoints: {
    login: {
      service: "auth",
      path: "/session/login"
    },
    analyzeDatabase: {
      service: "api",
      path: "/analysis/run"
    },
    reportStatus: {
      service: "api",
      path: "/analysis/{reportId}/status"
    },
    downloadExcel: {
      service: "api",
      path: "/reports/{fileName}/download"
    },
    dictionaries: {
      service: "api",
      path: "/catalogs/dictionaries"
    }
  }
};
```

## Lo que backend no puede cambiar sin coordinar frontend

Estos cambios si requieren revisar codigo frontend:

- nombres de campos enviados en requests
- nombres de campos devueltos en responses
- estructura del JWT, especialmente `role` y `exp`
- estados funcionales distintos a `PENDIENTE` y `COMPLETADO`
- cambiar un endpoint de `GET` a `POST`, o viceversa
- exigir autenticacion diferente a Bearer token en los endpoints actuales

## Recomendacion de implementacion para backend

La opcion recomendada es que backend o la capa de despliegue generen `app-config.js` al iniciar el servicio o durante el deploy.

Opciones validas:

1. Servir un archivo estatico generado desde variables de entorno.
2. Reemplazar placeholders en un template durante el despliegue.
3. Exponer un endpoint que devuelva JavaScript valido y montarlo en la ruta `/app-config.js`.

La opcion mas simple para operaciones suele ser esta:

1. Mantener un template base de `app-config.js`.
2. Inyectar valores reales con variables de entorno del ambiente.
3. Publicarlo junto al frontend compilado o a traves del gateway.

## Validacion manual recomendada

Antes de liberar un cambio de endpoints, backend debe validar esto en navegador:

1. Abrir `/app-config.js` y comprobar que responde con JavaScript valido.
2. Verificar que `window.__APP_CONFIG__` contiene `services` y `endpoints`.
3. Probar login.
4. Probar inicio de analisis.
5. Probar polling de estado.
6. Probar descarga del archivo.
7. Probar carga de diccionarios.

## Ubicacion tecnica en frontend

Para referencia del equipo backend, la configuracion runtime hoy la consume el frontend en estos archivos:

- `front/project-a/src/layouts/Layout.astro`
- `front/project-a/src/layouts/LoginLayout.astro`
- `front/project-a/src/services/appConfig.js`
- `front/project-a/src/services/apiClient.js`

## Resumen operativo

Backend debe asumir que el frontend ya no depende de URLs hardcodeadas en componentes.

La responsabilidad de backend o infraestructura ahora es:

1. Publicar `app-config.js`.
2. Mantener la estructura `window.__APP_CONFIG__`.
3. Ajustar ahi dominios y paths por ambiente.
4. No romper contratos de request, response y JWT sin coordinación.