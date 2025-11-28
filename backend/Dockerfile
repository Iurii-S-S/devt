FROM node:18-alpine

WORKDIR /app

# Копируем package.json
COPY package*.json ./

# Сначала устанавливаем все зависимости (включая dev)
RUN npm install

# Копируем исходный код
COPY . .

# Создаем не-root пользователя для безопасности
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Меняем владельца файлов
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 5000

CMD ["node", "server.js"]