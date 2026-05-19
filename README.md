
# Agenday

Sistema web para agendamento e gerenciamento de serviços voltado para profissionais autônomos.

---

# Tecnologias

## Backend
- Java 21
- Spring Boot 3
- Spring Security
- JWT Authentication
- PostgreSQL
- Redis
- Flyway
- Swagger / OpenAPI
- Docker

## Frontend
- React
- TypeScript
- Vite
- React Router
- Docker

---

# Estrutura do projeto

```txt
agenday/
├── agenday-backend/
├── agenday-frontend/
├── docker-compose.yml
└── .env.example
````

---

# Configuração inicial

Antes de iniciar o projeto, configure os arquivos de ambiente.

O projeto utiliza variáveis de ambiente para autenticação, banco de dados e integração com APIs externas.

Copie os arquivos modelo:

```bash
cp .env.example .env
```

Frontend:

```bash
cp .env.example agenday-frontend/.env.local
```

---

# Variáveis importantes

## Backend (.env)

```env
DB_USER=seu_usuario
DB_PASSWORD=sua_senha

# JWT_SECRET deve possuir pelo menos 64 caracteres
JWT_SECRET=sua_chave_jwt_super_secreta
```

## Frontend (.env.local)

```env
VITE_API_URL=http://localhost:8080/api/v1/

# Google Client ID pode ser público
VITE_GOOGLE_CLIENT_ID=seu_google_client_id
```

---

# Como gerar uma JWT_SECRET segura

Linux:

```bash
openssl rand -base64 64
```

Windows PowerShell:

```powershell
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Maximum 256 }))
```

---

# Configuração do Google OAuth

Crie um projeto no Google Cloud Console:

* Ative a API Google Identity
* Gere um OAuth Client ID
* Adicione:

```txt
http://localhost:5173
```

Cole o Client ID no:

```txt
agenday-frontend/.env.local
```

---

# Executando com Docker

## Linux

Subir serviços:

```bash
sudo docker compose up --build
```

Parar serviços:

```bash
sudo docker compose down -v
```

## Windows (Docker Desktop)

Abra o CMD ou PowerShell:

```powershell
docker compose up --build
```

Parar serviços:

```powershell
docker compose down -v
```

---

# Serviços disponíveis

| Serviço     | URL                                                                                        |
| ----------- | ------------------------------------------------------------------------------------------ |
| Frontend    | [http://localhost:5173](http://localhost:5173)                                             |
| Backend API | [http://localhost:8080/api/v1/](http://localhost:8080/api/v1/)                             |
| Swagger     | [http://localhost:8080/swagger-ui/index.html#/](http://localhost:8080/swagger-ui/index.html#/) |
| PostgreSQL  | localhost:5432                                                                             |
| Redis       | localhost:6379                                                                             |

---

# Desenvolvimento do frontend

Entre na pasta:

```bash
cd agenday-frontend
```

Instale as dependências:

```bash
npm install
```

Inicie o projeto:

```bash
npm run dev -- --host
```

Acesse:

```txt
http://localhost:5173/home
```

Na rede local:

```txt
http://SEU_IP:5173/home
```

---

# Desenvolvimento do backend

Inicie PostgreSQL e Redis.

Entre na pasta:

```bash
cd agenday-backend
```

Execute:

```bash
./mvnw spring-boot:run
```

Windows:

```powershell
mvnw.cmd spring-boot:run
```

API disponível em:

```txt
http://localhost:8080/api/v1/
```

Swagger:

```txt
http://localhost:8080/swagger-ui/index.html
```
