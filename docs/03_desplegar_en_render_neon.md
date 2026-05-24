# Despliegue en Render + Neon PostgreSQL

Esta guía evita usar la base PostgreSQL de Render. La aplicación se aloja en Render y se conecta a una base externa gratuita en Neon.

## Crear PostgreSQL en Neon

1. Crear un proyecto en Neon.
2. Copiar el connection string.
3. Verificar que incluya `sslmode=require`.

Ejemplo:

```txt
postgresql://USUARIO:CLAVE@HOST/neondb?sslmode=require
```

## Crear Web Service en Render

Usar:

```txt
New + > Web Service
```

Configuración recomendada:

```txt
Repository: Rolando-rivera/impulsorep
Branch: main
Runtime: Docker
Root Directory: vacío
Dockerfile Path: ./Dockerfile
Plan: Free
```

## Variables de entorno

```env
DATABASE_URL=postgresql://USUARIO:CLAVE@HOST/neondb?sslmode=require
DATABASE_SSL=true
DATABASE_INIT=true
SESSION_SECRET=impulsorep_cambiar_por_texto_largo
NODE_ENV=production
PORT=3000
```

## Inicialización de la base

En el primer arranque, el comando del contenedor ejecuta:

```cmd
node backend/initDb.js
```

Si la tabla `roles` no existe, se ejecuta:

```txt
sql/01_ley_rep_schema.sql
```

Si la base ya está creada, no se vuelve a cargar el script.

## Pruebas

```txt
https://TU-APP.onrender.com/api/health
```

Respuesta esperada:

```json
{
  "status": "ok",
  "database": "connected"
}
```
