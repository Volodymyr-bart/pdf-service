# Базовий імідж
FROM node:18-alpine

# Робоча директорія всередині контейнера
WORKDIR /app

# Копіюємо package файли
COPY package*.json ./

# Встановлюємо залежності
RUN npm install

# Копіюємо весь код
COPY . .

# Білдимо Nest.js застосунок
RUN npm run build

# Відкриваємо порт
EXPOSE 10300

# Запускаємо застосунок
CMD ["npm", "run", "start:prod"]
