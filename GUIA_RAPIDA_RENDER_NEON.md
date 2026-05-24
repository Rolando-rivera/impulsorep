# Guía rápida: Impulso REP en Render + Neon

Esta versión usa Render solo para alojar la aplicación y Neon como base PostgreSQL externa.

## 1. Crear la base en Neon

1. Entra a Neon y crea un proyecto PostgreSQL.
2. Copia el connection string.
3. Debe verse parecido a:

```txt
postgresql://USUARIO:CLAVE@HOST/neondb?sslmode=require
```

Usa la conexión normal/directa para inicializar la base. Para la app también puede usarse la pooled connection, pero si hay problemas inicializando tablas, usa la directa.

## 2. Subir este proyecto a GitHub

Desde la carpeta del proyecto:

```cmd
git add .
git commit -m "Preparar despliegue en Render con Neon"
git push
```

## 3. Crear Web Service en Render

En Render:

```txt
New + > Web Service
```

Configura:

```txt
Repository: Rolando-rivera/impulsorep
Branch: main
Runtime / Language: Docker
Root Directory: vacío
Dockerfile Path: ./Dockerfile
Plan: Free
```

Render detectará el `Dockerfile` y construirá la app completa.

## 4. Variables de entorno en Render

Agrega estas variables:

```env
DATABASE_URL=postgresql://USUARIO:CLAVE@HOST/neondb?sslmode=require
DATABASE_SSL=true
DATABASE_INIT=true
SESSION_SECRET=impulsorep_cambiar_por_texto_largo
NODE_ENV=production
PORT=3000
```

No agregues la URL de Neon en el frontend ni en variables `VITE_`.

## 5. Probar

Primero prueba:

```txt
https://TU-APP.onrender.com/api/health
```

Luego entra a:

```txt
https://TU-APP.onrender.com
```

Usuario demo:

```txt
admin@impulsorep.cl
admin123
```
