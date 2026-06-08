# --- Stage 1: Build Frontend (Vite) ---
FROM node:20-alpine AS frontend-builder
WORKDIR /build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- Stage 2: Build Backend API ---
FROM node:20-alpine AS backend-builder
WORKDIR /build-server
# Копіюємо конфіги бекенду з папки server
COPY server/package*.json ./
RUN npm ci
# Копіюємо весь інший код бекенду
COPY server/ .

# --- Stage 3: Production Image ---
FROM node:20-alpine
WORKDIR /app

# Копіюємо згенерований статический фронтенд у папку public
COPY --from=frontend-builder /build/dist ./public 
# Копіюємо AI-скиллы
COPY skills ./skills

# Копіюємо бекенд разом із його node_modules
COPY --from=backend-builder /build-server ./server

EXPOSE 3001
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3001

# Переходимо в папку сервера для запуску
WORKDIR /app/server

# Запускаємо сервер через офіційний скрипт додатка, прописаний у його package.json
CMD ["npm", "start"]
