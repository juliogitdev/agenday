ALTER TABLE establishment ADD COLUMN slug VARCHAR(255);
CREATE UNIQUE INDEX uk_establishment_slug ON establishment (slug);
ALTER TABLE establishment ALTER COLUMN slug SET NOT NULL;