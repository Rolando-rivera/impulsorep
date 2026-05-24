# Impulso REP

Plataforma académica para registro, validación y trazabilidad de residuos prioritarios bajo el marco de la Ley REP en Chile.

El proyecto usa:

- Frontend: Vue 3 + Vite + Bootstrap 5
- Backend: Node.js + Express
- Base de datos: PostgreSQL
- Despliegue recomendado: Koyeb + Neon PostgreSQL

## Estructura

```txt
backend/     API Express y conexión PostgreSQL
frontend/    Interfaz Vue 3
sql/         Script de creación e inicialización de base de datos
docs/        Guías de conexión, GitHub y despliegue
Dockerfile   Configuración para Koyeb
```

## Usuarios demo

```txt
admin@impulsorep.cl / admin123
gestor@impulsorep.cl / gestor123
productor@impulsorep.cl / productor123
```

## Ejecución local con PostgreSQL local

Crear una base llamada `ley_rep` en PostgreSQL y ejecutar:

```txt
sql/01_ley_rep_schema.sql
```

Luego configurar `backend/.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=TU_CLAVE
DB_NAME=ley_rep
DATABASE_SSL=false
PORT=3000
SESSION_SECRET=impulsorep_local
```

Levantar backend:

```cmd
cd backend
npm install
npm start
```

Levantar frontend:

```cmd
cd frontend
npm install
npm run dev
```

Abrir:

```txt
http://localhost:5173
```

## Ejecución local usando Neon

Configurar `backend/.env` con el connection string de Neon:

```env
DATABASE_URL=postgresql://USUARIO:CLAVE@HOST/neondb?sslmode=require
DATABASE_SSL=true
DATABASE_INIT=true
PORT=3000
SESSION_SECRET=impulsorep_local
```

Luego ejecutar:

```cmd
cd backend
npm install
node initDb.js
npm start
```

En otra terminal:

```cmd
cd frontend
npm install
npm run dev
```

## Despliegue en Koyeb + Neon

El proyecto incluye un `Dockerfile` en la raíz para desplegar la app completa en Koyeb.

En Koyeb usar:

```txt
Builder: Dockerfile
Root directory: vacío
Dockerfile path: Dockerfile
Exposed port: 3000
```

Variables de entorno requeridas:

```env
DATABASE_URL=postgresql://USUARIO:CLAVE@HOST/neondb?sslmode=require
DATABASE_SSL=true
DATABASE_INIT=true
SESSION_SECRET=impulsorep_cambiar_por_un_texto_largo
NODE_ENV=production
PORT=3000
```

Más detalle en:

```txt
docs/03_desplegar_en_koyeb_neon.md
```
