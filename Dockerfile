# Impulso REP - Deploy en Render con PostgreSQL externo en Neon
# Etapa 1: compila el frontend Vue/Vite
FROM node:22-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Etapa 2: instala backend y sirve la app compilada
FROM node:22-alpine AS production

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY backend/package*.json ./backend/
RUN cd backend && npm ci --omit=dev

COPY backend ./backend
COPY sql ./sql
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

EXPOSE 3000

CMD ["sh", "-c", "node backend/initDb.js && npm --prefix backend start"]
