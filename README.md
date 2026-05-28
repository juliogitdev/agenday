# Agenday – Configuração de Ambientes


### DEV – Subir infraestrutura local

```bash
docker compose -f docker/docker-compose.dev.yml up -d
```



Sobe: PostgreSQL :5432, Redis :6379, MinIO :9000/:9001 (console)

Backend e frontend rodam localmente:
```bash
# Backend (Spring Boot)
cd agenday-bakcend
./mvnw clean
./mvnw spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"

# Frontend (Vite)
cd agenday-frontend; npm run dev
```

### DEV - Matar infraestrutura local

```bash
docker compose -f docker/docker-compose.dev.yml down -v
```

--- 

### PROD – Subir stack completa

```bash
# 1. Criar arquivo de variáveis a partir do exemplo
cp docker/.env.example docker/.env
# edite docker/.env com os valores reais

# 2. Fazer o build das imagens
docker build -f docker/Dockerfile.backend -t agenday/backend:latest .
docker build -f frontend/Dockerfile -t agenday/frontend:latest frontend/

# 3. Subir tudo
docker compose -f docker/docker-compose.prod.yml --env-file docker/.env up -d
```

---

## Arquitetura de URLs por ambiente

| Recurso        | DEV                          | PROD                          |
|----------------|------------------------------|-------------------------------|
| Frontend       | http://localhost:5173         | https://agenday.com           |
| API (backend)  | http://localhost:8080/api     | https://api.agenday.com/api   |
| MinIO (storage)| http://localhost:9000         | https://storage.agenday.com   |
| MinIO console  | http://localhost:9001         | (não exposto)                 |

---

## Signed URLs – como funciona

```
DEV:
  MinioClient → endpoint: http://localhost:9000
  publicBaseUrl:          http://localhost:9000
  Resultado: http://localhost:9000/agenday-images/foto.jpg?X-Amz-...
  ✓ Acessível pelo navegador

PROD:
  MinioClient → endpoint: http://minio:9000  (rede interna Docker)
  publicBaseUrl:          https://storage.agenday.com
  MinioStorageService reescreve o host antes de retornar ao cliente
  Resultado: https://storage.agenday.com/agenday-images/foto.jpg?X-Amz-...
  ✓ Acessível pelo navegador via Nginx → MinIO
```

---

## Regras de segurança em PROD

- `db` e `redis`: sem `ports`, inacessíveis fora da rede Docker
- `minio`: sem `ports`, acessível apenas via Nginx em storage.agenday.com
- `/actuator` bloqueado no Nginx externo
- JWT secret e passwords via variáveis de ambiente, nunca hardcoded
- TLS obrigatório via Let's Encrypt (certbot gerencia os certificados)
