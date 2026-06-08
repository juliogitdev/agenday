CREATE TABLE professional_catalog_items (
    id UUID PRIMARY KEY,
    professional_establishment_id UUID NOT NULL,
    catalog_item_id UUID NOT NULL,
    custom_price DECIMAL(10, 2) DEFAULT NULL,
    custom_duration_minutes INTEGER DEFAULT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,


    CONSTRAINT fk_prof_catalog_items_establishment_link
        FOREIGN KEY (professional_establishment_id)
        REFERENCES professional_establishment(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_prof_catalog_items_catalog_item
        FOREIGN KEY (catalog_item_id)
        REFERENCES catalog_items(id)
        ON DELETE RESTRICT,

    --Trava de Segurança: Impede associar o mesmo serviço ao mesmo contrato mais de uma vez
    CONSTRAINT uk_professional_establishment_catalog_item
        UNIQUE (professional_establishment_id, catalog_item_id)
);

-- Índices de performance para o motor de busca
CREATE INDEX idx_prof_cat_items_link ON professional_catalog_items(professional_establishment_id);
CREATE INDEX idx_prof_cat_items_catalog_item ON professional_catalog_items(catalog_item_id);