# --- Stage 1: Build Frontend (Vite) ---
FROM node:20-alpine AS frontend-builder
WORKDIR /build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- Stage 2: Build Backend API (Node.js) ---
FROM node:20-alpine AS backend-builder
WORKDIR /build-server
COPY server/package*.json ./
RUN npm ci
COPY server/ .

# --- Stage 3: Production Image ---
FROM node:20-alpine
WORKDIR /app

# Копіюємо згенерований фронтенд у корінь для роздачі
COPY --from=frontend-builder /build ./public 
# Копіюємо AI-скиллы
COPY skills ./skills

# Копіюємо бекенд і ПЕРЕХОДИМО в його папку для запуску
COPY --from=backend-builder /build-server ./server
WORKDIR /app/server

EXPOSE 3001
ENV NODE_ENV=production

# Запускаємо безпосередньо з папки сервера
CMD ["node", "server.js"]
