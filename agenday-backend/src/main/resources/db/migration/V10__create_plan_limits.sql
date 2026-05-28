CREATE TABLE plan_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL,
    limit_key VARCHAR(100) NOT NULL,
    limit_value VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_plan_limits_plan
        FOREIGN KEY (plan_id) REFERENCES plans(id)
        ON DELETE CASCADE,

    CONSTRAINT uk_plan_limit UNIQUE(plan_id, limit_key)
);