# Estágio de Compilação
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install

# Estágio de Execução
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]