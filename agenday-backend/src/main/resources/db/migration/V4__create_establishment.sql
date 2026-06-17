CREATE TABLE establishment(

                              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

                              name VARCHAR(255) NOT NULL,
                              slogan VARCHAR(255),

                              owner_id UUID NOT NULL REFERENCES users(id),

                              cep VARCHAR(10),
                              state VARCHAR(2) NOT NULL,
                              city VARCHAR(255) NOT NULL,
                              street VARCHAR(255),
                              number VARCHAR(20),

                              phone VARCHAR(20),

                              image_url VARCHAR(255),

                              is_active BOOLEAN NOT NULL DEFAULT TRUE,

                              created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                              updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_establishment_owner ON establishment(owner_id);