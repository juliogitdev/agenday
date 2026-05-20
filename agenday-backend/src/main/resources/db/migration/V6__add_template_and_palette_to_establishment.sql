-- Adiciona template (layout da página pública)
ALTER TABLE establishment
ADD COLUMN template SMALLINT NOT NULL DEFAULT 1;

-- Adiciona palette (cores personalizadas)
ALTER TABLE establishment
ADD COLUMN palette VARCHAR(50);
