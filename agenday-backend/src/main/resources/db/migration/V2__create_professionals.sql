CREATE TABLE professionals (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,


    -- URL amigável para a página de agendamento (/agendar/:slug)
    slug VARCHAR(255) UNIQUE NOT NULL,

    -- Descrição do profissional e seus serviços
    bio TEXT,

    -- Link para a imagem hospedada no Cloudflare R2
    profile_image_url VARCHAR(500),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice crítico para buscas rápidas pela página pública
CREATE INDEX idx_professionals_slug ON professionals(slug);