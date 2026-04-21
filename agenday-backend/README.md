# Agenday Backend

API REST desenvolvida com **Java 21 + Spring Boot 3**.

## Tecnologias
- Java 21
- Spring Boot 3 (Web, Security, Data JPA)
- PostgreSQL
- JWT (autenticação)
- BCrypt (hash de senhas)

## Estrutura de pacotes (`com.agenday`)
```
interfaces/rest/v1/     → Controllers (endpoints da API)
interfaces/rest/dto/    → Objetos de entrada e saída da API
interfaces/advice/      → Tratamento global de erros
application/service/    → Lógica de negócio (Use Cases)
application/dto/        → Objetos internos de comando/resultado
domain/model/           → Entidades do domínio
domain/event/           → Eventos de domínio
domain/exception/       → Exceções de negócio customizadas
infrastructure/         → Banco de dados, notificações, storage
```

## Como rodar
```bash
cp .env.example .env
# Edite o .env com suas credenciais
./mvnw spring-boot:run
```
