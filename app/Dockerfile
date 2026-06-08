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
# Копіюємо конфіги бекенду з кореня папки app
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm ci
# Копіюємо весь інший код програми
COPY . .

# --- Stage 3: Production Image ---
FROM node:20-alpine
WORKDIR /app

# Копіюємо всі залежності та вихідний код з Stage 2
COPY --from=backend-builder /build-server ./

EXPOSE 3001
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3001

# Запускаємо через офіційний скрипт додатка, прописаний у package.json
CMD ["npm", "run", "start:api"]
