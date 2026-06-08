# Використовуємо офіційний стабільний образ Node.js з AWS дзеркала
FROM public.ecr.aws/docker/library/node:20-alpine AS builder

WORKDIR /app

# Копіюємо конфіги з кореня папки app
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm ci

# Копіюємо весь інший код програми (включаючи src, server, skills)
COPY . .

# Переходимо в папку сервера та встановлюємо його власні залежності
WORKDIR /app/server
RUN npm ci

EXPOSE 3001
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3001

# Запускаємо сервер напряму через ts-node (інструмент запуску TypeScript без компіляції)
CMD ["npx", "ts-node", "server.ts"]
