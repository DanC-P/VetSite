# Estágio 1: Build do React
FROM node:20 AS frontend-build
WORKDIR /app/frontend
COPY frontend/vetsite_frontend/package*.json ./vetsite_frontend/
RUN npm install --prefix vetsite_frontend --legacy-peer-deps
COPY frontend/vetsite_frontend/ ./vetsite_frontend/
RUN npm run build --prefix vetsite_frontend

# Estágio 2: Backend Django
FROM python:3.11-slim
WORKDIR /app

# Instalar dependências do sistema para o Psycopg2 e ferramentas básicas
RUN apt-get update && apt-get install -y libpq-dev gcc curl && rm -rf /var/lib/apt/lists/*

# Copiar arquivos do Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar o projeto todo e os arquivos buildados do React
COPY . .
COPY --from=frontend-build /app/frontend/vetsite_frontend/build /app/frontend/vetsite_frontend/build

# Comando de inicialização
# Dar permissão de execução ao script
RUN chmod +x /app/start.sh

# Chamar o script
CMD ["/app/start.sh"]