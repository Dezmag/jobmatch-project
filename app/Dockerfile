# Використовуємо надійне AWS дзеркало для Node.js
FROM public.ecr.aws/docker/library/node:20-alpine

WORKDIR /app

# Копіюємо конфіги з кореня папки app
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm ci

# Копіюємо весь інший код програми (включаючи src, server, skills)
COPY . .

# ОДИН НОВИЙ РЯДОК: Збираємо фронтенд всередині образу
RUN npm run build

# Переходимо в папку сервера та встановлюємо його залежності
WORKDIR /app/server
RUN npm ci

EXPOSE 3001
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3001

# Запускаємо сервер через офіційний скрипт розробників, який точно знає назву файлу
CMD ["npm", "run", "dev"]
