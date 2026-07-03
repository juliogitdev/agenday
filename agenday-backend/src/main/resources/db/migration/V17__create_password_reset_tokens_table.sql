-- Tabela de tokens de redefinição de senha
CREATE TABLE password_reset_tokens (
    id UUID NOT NULL,
    token VARCHAR(255) NOT NULL,
    user_id UUID NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_password_reset_tokens PRIMARY KEY (id),
    CONSTRAINT uc_password_reset_tokens_token UNIQUE (token),
    CONSTRAINT fk_password_reset_tokens_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Índice para busca rápida por token
CREATE INDEX idx_password_reset_tokens_token ON password_reset_tokens(token);

-- Índice para busca por usuário
CREATE INDEX idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);

-- Índice para limpeza de tokens expirados
CREATE INDEX idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);