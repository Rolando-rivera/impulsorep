# Despliegue de Impulso REP en Koyeb + Neon

Este proyecto queda preparado para desplegarse en Koyeb usando Dockerfile y conectarse a una base PostgreSQL creada en Neon.

## 1. Crear base PostgreSQL en Neon

1. Entrar a Neon.
2. Crear un proyecto nuevo.
3. Usar una base llamada `neondb` o crear una llamada `ley_rep`.
4. Copiar el connection string del dashboard.
5. Usar preferentemente la cadena directa/unpooled para el primer despliegue e inicialización.

La cadena suele tener este formato:

```txt
postgresql://USUARIO:CLAVE@HOST/neondb?sslmode=require
```

## 2. Subir proyecto a GitHub

Desde la raíz del proyecto:

```cmd
git add .
git commit -m "Preparar despliegue en Koyeb con Neon"
git push
```

## 3. Crear App en Koyeb

1. Entrar a Koyeb.
2. Crear una nueva App.
3. Elegir GitHub como método de despliegue.
4. Seleccionar el repositorio `impulsorep`.
5. Builder: seleccionar Dockerfile.
6. Root directory: dejar vacío.
7. Dockerfile path: `Dockerfile`.
8. Puerto expuesto: `3000`.

## 4. Variables de entorno en Koyeb

Agregar estas variables en el servicio:

```env
DATABASE_URL=postgresql://USUARIO:CLAVE@HOST/neondb?sslmode=require
DATABASE_SSL=true
DATABASE_INIT=true
SESSION_SECRET=impulsorep_cambiar_por_un_texto_largo
NODE_ENV=production
PORT=3000
```

Importante: `DATABASE_URL` nunca debe ir en el frontend ni en `frontend/.env`.

## 5. Primer deploy

Al iniciar, Koyeb ejecutará:

```sh
node backend/initDb.js && npm --prefix backend start
```

El archivo `initDb.js` revisa si existe la tabla `roles`. Si no existe, ejecuta `sql/01_ley_rep_schema.sql` y crea las tablas con datos iniciales.

## 6. Probar

Primero probar:

```txt
https://TU-APP.koyeb.app/api/health
```

Luego abrir:

```txt
https://TU-APP.koyeb.app
```

Usuarios demo:

```txt
admin@impulsorep.cl / admin123
gestor@impulsorep.cl / gestor123
productor@impulsorep.cl / productor123
```

## 7. Después del primer deploy

Cuando la base ya esté creada, puedes dejar `DATABASE_INIT=true`, porque el script detecta que ya existe la tabla `roles` y no vuelve a ejecutar el SQL.

Si prefieres bloquear inicialización automática después de comprobar que todo funciona, cambia en Koyeb:

```env
DATABASE_INIT=false
```
