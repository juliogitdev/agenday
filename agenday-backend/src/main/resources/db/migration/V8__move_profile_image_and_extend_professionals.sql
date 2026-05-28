

-- Move foto do profissional para o usuário
ALTER TABLE users
ADD COLUMN profile_image_url VARCHAR(500);

-- Migra fotos existentes
UPDATE users u
SET profile_image_url = p.profile_image_url
FROM professionals p
WHERE p.user_id = u.id
AND p.profile_image_url IS NOT NULL;

-- Remove foto da tabela professionals
ALTER TABLE professionals
DROP COLUMN profile_image_url;

-- Adiciona informações profissionais
ALTER TABLE professionals
ADD COLUMN working_since DATE,
ADD COLUMN instagram_url VARCHAR(255),
ADD COLUMN specialized_in VARCHAR(500);