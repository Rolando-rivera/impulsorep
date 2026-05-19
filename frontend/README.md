# Frontend Impulso REP

Este frontend lo dejé construido con **Vue 3 + Vite** y **Bootstrap 5**, con CSS propio de apoyo para la identidad visual de Impulso REP.

## Qué hace
- Muestra el login por perfiles.
- Consume la API REST del backend.
- Permite revisar el panel resumen, el módulo Marco Ley REP, formularios CRUD, alertas y auditoría.
- Usa el logo de Impulso REP desde `src/assets/logo-impulso-rep.jpeg`.

## Desarrollo local
```bash
npm install
npm run dev
```

Abre `http://localhost:5173`.

## Comunicación con backend
Durante el desarrollo local, Vite usa proxy hacia `http://localhost:3000` para las rutas `/api`.

## Nota
Si el backend ya está conectado a la base PostgreSQL que dejé creada en Render, el frontend mostrará y guardará datos sobre esa misma base.
