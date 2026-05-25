
CREATE TABLE professional_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    professional_id UUID NOT NULL
        REFERENCES professionals(id)
        ON DELETE CASCADE,

    plan_id UUID NOT NULL
        REFERENCES plans(id),

    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    started_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    last_payment_at TIMESTAMPTZ,
    gateway_subscription_id VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);