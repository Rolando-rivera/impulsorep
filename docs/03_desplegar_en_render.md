# 03. Desplegar en Render

## Variables de entorno necesarias
```env
DATABASE_URL=TU_URL_COMPLETA_DE_RENDER
DATABASE_SSL=true
SESSION_SECRET=impulsorep123
```

## Configuración sugerida
### Build Command
```bash
npm --prefix frontend install --include=dev && npm --prefix frontend run build && npm --prefix backend install
```

### Start Command
```bash
npm --prefix backend start
```

## Pasos
1. Crear o abrir el Web Service en Render.
2. Conectarlo al repositorio de GitHub.
3. Ingresar las variables de entorno.
4. Guardar cambios.
5. Ejecutar un deploy.
6. Verificar que la app abra y que el login funcione.

## Verificación final
- Login correcto.
- Dashboard visible.
- CRUD funcionando.
- Datos guardándose en la base PostgreSQL ya creada.
