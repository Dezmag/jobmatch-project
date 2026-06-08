FROM public.ecr.aws/docker/library/node:20-alpine

WORKDIR /app

# Копіюємо конфіги з кореня папки app
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm ci

# Копіюємо весь інший код програми (включаючи src, server, skills)
COPY . .

# Збираємо фронтенд всередині образу (створює папку dist в корені)
RUN npm run build

# Переходимо в папку сервера та встановлюємо його залежності
WORKDIR /app/server
RUN npm ci

# КРИТИЧНО ВАЖЛИВИЙ DevOps-фікс: розкладаємо фронтенд туди, де його може шукати сервер
RUN mkdir -p public dist && \
    cp -r /app/dist/* ./public/ 2>/dev/null || true && \
    cp -r /app/dist/* ./dist/ 2>/dev/null || true

EXPOSE 3001
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3001

# Запускаємо сервер через офіційний скрипт розробників
CMD ["npm", "run", "dev"]
