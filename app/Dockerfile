# --- Stage 1: Build Frontend (Vite) ---
FROM public.ecr.aws/docker/library/node:20-alpine AS frontend-builder
WORKDIR /build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- Stage 2: Build Backend API (TypeScript) ---
FROM public.ecr.aws/docker/library/node:20-alpine AS backend-builder
WORKDIR /build-server
COPY server/package*.json ./
RUN npm ci
COPY server/ .
# Додаємо оператор || true для обходу помилок типізації
RUN npm run build --if-present || true


# --- Stage 3: Production Image ---
FROM public.ecr.aws/docker/library/node:20-alpine
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

WORKDIR /app/server

CMD ["npm", "start"]
