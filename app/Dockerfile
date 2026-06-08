# --- Stage 1: Build Frontend (Vite) ---
FROM node:20-alpine AS frontend-builder
WORKDIR /build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- Stage 2: Build Backend API (TypeScript) ---
FROM node:20-alpine AS backend-builder
WORKDIR /build-server
COPY server/package*.json ./
RUN npm ci
COPY server/ .
# Обов'язковий крок компіляції TypeScript у JavaScript (створює папку dist)
RUN npm run build --if-present

# --- Stage 3: Production Image ---
FROM node:20-alpine
WORKDIR /app

# Копіюємо згенерований фронтенд
COPY --from=frontend-builder /build/dist ./public 
# Копіюємо AI-скиллы
COPY skills ./skills

# Копіюємо бекенд разом із згенерованою папкою dist та node_modules
COPY --from=backend-builder /build-server ./server

EXPOSE 3001
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3001

# Переходимо в папку сервера для запуску
WORKDIR /app/server

# Запускаємо сервер через npm start, який тепер знайде свій dist/index.js
CMD ["npm", "start"]
