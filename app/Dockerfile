# --- Stage 1: Build Stage (Спільний для компіляції) ---
FROM public.ecr.aws/docker/library/node:20-alpine AS builder
WORKDIR /app
COPY package*.json tsconfig*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- Stage 2: Target API (Бекенд-сервер) ---
FROM public.ecr.aws/docker/library/node:20-alpine AS api
WORKDIR /app
COPY package*.json tsconfig*.json ./
RUN npm ci
COPY . .
WORKDIR /app/server
RUN npm ci

EXPOSE 3001
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3001

CMD ["npm", "run", "dev"]

# --- Stage 3: Target Web (Фронтенд на Nginx) --
FROM public.ecr.aws/docker/nginx:alpine AS web
# Копіюємо зібраний фронтенд з Stage 1 в папку Nginx
COPY --from=builder /app/dist /usr/share/nginx/html
# Копіюємо нашу конфіга проксі
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
