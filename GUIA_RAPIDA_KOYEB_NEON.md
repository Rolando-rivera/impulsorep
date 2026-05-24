# Guía rápida: Koyeb + Neon

## 1. Neon

Crear un proyecto PostgreSQL en Neon y copiar el connection string:

```txt
postgresql://USUARIO:CLAVE@HOST/neondb?sslmode=require
```

## 2. GitHub

Subir cambios:

```cmd
git add .
git commit -m "Preparar Koyeb y Neon"
git push
```

## 3. Koyeb

Crear App desde GitHub.

Configuración:

```txt
Builder: Dockerfile
Root Directory: dejar vacío
Dockerfile path: Dockerfile
Port: 3000
```

Variables:

```env
DATABASE_URL=pegar_connection_string_de_neon
DATABASE_SSL=true
DATABASE_INIT=true
SESSION_SECRET=impulsorep_cambiar_por_un_texto_largo
NODE_ENV=production
PORT=3000
```

## 4. Probar

```txt
https://TU-APP.koyeb.app/api/health
https://TU-APP.koyeb.app
```

Usuario:

```txt
admin@impulsorep.cl
admin123
```
