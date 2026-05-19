# 01. Conectar la base de datos ya creada

## Qué reutilizo
Para este proyecto dejé pensado reutilizar la misma base PostgreSQL creada en Render en la entrega anterior. Así evito duplicar infraestructura y mantengo la misma información del sistema.

## Paso a paso
1. Entrar al panel de Render.
2. Abrir la base PostgreSQL ya creada.
3. Copiar la **External Database URL**.
4. Ir al archivo `backend/.env`.
5. Pegar la URL en la variable `DATABASE_URL`.
6. Dejar `DATABASE_SSL=true`.
7. Guardar el archivo.

## Ejemplo
```env
DATABASE_URL=postgresql://USUARIO:CLAVE@HOST_EXTERNO:5432/NOMBRE_BASE
DATABASE_SSL=true
PORT=3000
SESSION_SECRET=impulsorep123
```

## Cuándo ejecutar el script SQL
- Si la base ya tiene el esquema correcto, no necesito volver a ejecutarlo.
- Si quiero reiniciar todo o cargar datos base de nuevo, ejecuto `sql/01_ley_rep_schema.sql`.
