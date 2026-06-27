-- Migration para criação da tabela de Jornada de Trabalho (Múltiplos Turnos)
CREATE TABLE professional_schedules (
    id UUID NOT NULL,
    professional_estab_id UUID NOT NULL,
    day_of_week VARCHAR(20) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_professional_schedules PRIMARY KEY (id),

    CONSTRAINT fk_schedule_professional_establishment
        FOREIGN KEY (professional_estab_id)
        REFERENCES professional_establishment(id)
        ON DELETE CASCADE
);

-- Índice para otimização da busca de turnos ativos e checagem de conflitos
CREATE INDEX idx_professional_schedule_estab
ON professional_schedules(professional_estab_id)
WHERE is_active = TRUE;