# --- Stage 1: Build Frontend ---
FROM node:20-alpine AS frontend-builder
WORKDIR /build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- Stage 2: Build Backend API ---
FROM node:20-alpine AS backend-builder
WORKDIR /build-server
COPY package*.json ./
RUN npm ci
COPY . .

# --- Stage 3: Production Image ---
FROM node:20-alpine
WORKDIR /app

# Копіюємо все разом із залежностями та кодом у корінь /app
COPY --from=backend-builder /build-server ./

EXPOSE 3001
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3001

# Запускаємо файл напряму з тієї папки, де він реально лежить
CMD ["node", "server/server.js"]
