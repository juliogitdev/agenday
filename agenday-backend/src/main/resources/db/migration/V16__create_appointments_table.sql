-- Migration para criação da tabela de Agendamentos
CREATE TABLE appointments (
    id UUID NOT NULL,
    customer_id UUID NOT NULL,
    professional_estab_id UUID NOT NULL,
    catalog_item_id UUID NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status VARCHAR(30) NOT NULL,
    notes TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_appointments PRIMARY KEY (id),

    CONSTRAINT fk_appointment_customer
        FOREIGN KEY (customer_id)
        REFERENCES users(id),

    CONSTRAINT fk_appointment_professional_establishment
        FOREIGN KEY (professional_estab_id)
        REFERENCES professional_establishment(id),

    CONSTRAINT fk_appointment_catalog_item
        FOREIGN KEY (catalog_item_id)
        REFERENCES catalog_items(id)
);

-- Índice para busca de horários ocupados/disponibilidade
CREATE INDEX idx_appointment_perf_search
ON appointments(professional_estab_id, start_time, end_time)
WHERE status = 'SCHEDULED';

-- Índice para histórico de agendamentos do cliente
CREATE INDEX idx_appointment_customer
ON appointments(customer_id);