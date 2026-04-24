-- 1. Tabela de Permissões (Roles)
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Inserindo as roles padrão do sistema Agenday
INSERT INTO roles (name) VALUES
    ('ROLE_CLIENT'),
    ('ROLE_PROFESSIONAL'),
    ('ROLE_ADMIN');

-- 2. Tabela de Usuários
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255), -- Aceita NULL para logins via Google
    auth_provider VARCHAR(50) NOT NULL DEFAULT 'LOCAL', -- Ex: LOCAL, GOOGLE
    provider_id VARCHAR(255), -- Guarda o ID único que vem do Google
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice para acelerar o login
CREATE INDEX idx_users_email ON users(email);

-- 3. Tabela de Relacionamento (Muitos-para-Muitos)
CREATE TABLE user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);