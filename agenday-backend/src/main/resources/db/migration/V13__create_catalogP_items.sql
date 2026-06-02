CREATE TABLE catalog_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    establishment_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    default_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    default_duration_minutes INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_catalog_items_establishment
        FOREIGN KEY (establishment_id) REFERENCES establishment(id),
    CONSTRAINT chk_catalog_price_positive
        CHECK (default_price >= 0),
    CONSTRAINT chk_catalog_duration_positive
        CHECK (default_duration_minutes >= 0)
);