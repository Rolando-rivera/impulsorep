# Impulso REP

Este es el proyecto que desarrollé para mi título. La solución busca registrar, validar y trazar digitalmente residuos prioritarios bajo la Ley N° 20.920 y normativa asociada, incorporando perfiles diferenciados, reglas automáticas, alertas preventivas y auditoría de eventos.

## Enlaces públicos
- Aplicación desplegada: https://impulsorep.onrender.com
- Repositorio público: https://github.com/Rolando-rivera/impulsorep

## Qué dejé funcionando
- Frontend en **Vue 3 + Vite** con **Bootstrap 5 + CSS propio de apoyo**.
- Backend en **Node.js + Express** con API REST.
- Persistencia en **PostgreSQL**.
- Login demo con perfiles **Administrador**, **Gestor** y **Productor**.
- CRUD de **declaraciones REP**, **categorías REP** y **metas anuales**.
- Gestión de **reglas**, **alertas** y **auditoría**.
- Despliegue en **Render** usando la base de datos creada en la entrega anterior.

## Orden del repositorio
- `frontend/`: interfaz Vue 3 + Vite.
- `backend/`: API, conexión a PostgreSQL y servicio estático del build.
- `sql/01_ley_rep_schema.sql`: script de creación y carga base.
- `docs/`: guía ordenada para conectar la base, subir a GitHub y desplegar.
- `render.yaml`: configuración sugerida para Render.


## Marco legal incorporado
La aplicación incluye una sección **Marco Ley REP** con resumen del objeto de la Ley N° 20.920, principios de trazabilidad, actores regulados, productos prioritarios, obligaciones del productor y flujo operativo de declaración-validación-auditoría.

Fuentes de referencia usadas para el contenido normativo:
- Biblioteca del Congreso Nacional: Ley N° 20.920.
- Ministerio del Medio Ambiente: Economía Circular / Ley REP.
- RETC: requerimientos de información para productores regulados por Ley REP.

## Usuarios demo
- Administrador: `admin@impulsorep.cl` / `admin123`
- Gestor: `gestor@impulsorep.cl` / `gestor123`
- Productor: `productor@impulsorep.cl` / `productor123`

## Pasos rápidos para reutilizar la base de datos ya creada
1. Tomar la **External Database URL** de la base PostgreSQL que ya dejé creada en Render.
2. Copiar esa URL en `backend/.env` usando la variable `DATABASE_URL`.
3. Dejar `DATABASE_SSL=true`.
4. Si la base ya tiene las tablas de este proyecto, puedo usarla directamente.
5. Si necesito recrear la estructura o cargar datos base, ejecuto `sql/01_ley_rep_schema.sql` sobre esa misma base.

## Desarrollo local
### Backend
```bash
cd backend
npm install
cp .env.example .env
# completar DATABASE_URL con la base ya creada o una base local
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

## Deploy sugerido
La guía completa quedó separada por pasos:
- `docs/01_conectar_base_existente.md`
- `docs/02_subir_a_github.md`
- `docs/03_desplegar_en_render.md`

## Nota
Si voy a reutilizar la base de datos ya creada en una entrega anterior, no necesito crear otra. Solo debo volver a usar la misma `DATABASE_URL` y asegurarme de que el esquema esté cargado.
