-- Vínculo entre profissional e estabelecimento
CREATE TABLE professional_establishment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
    establishment_id UUID NOT NULL REFERENCES establishment(id) ON DELETE CASCADE,

    status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- PENDING, ACTIVE, INACTIVE

    linked_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Garante que o mesmo profissional não se vincule duas vezes ao mesmo estabelecimento
    UNIQUE (professional_id, establishment_id)
);

CREATE INDEX idx_prof_estab_professional ON professional_establishment(professional_id);
CREATE INDEX idx_prof_estab_establishment ON professional_establishment(establishment_id);
