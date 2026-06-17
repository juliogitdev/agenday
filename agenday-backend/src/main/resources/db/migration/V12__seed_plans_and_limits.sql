-- SIMPLE
INSERT INTO plans(name, description, price, duration_days, is_active)
VALUES (
    'Free',
    'Plano básico para pequenos profissionais',
    00.00,
    -1,
    true
);

INSERT INTO plan_limits(plan_id, limit_key, limit_value)
SELECT p.id, v.key, v.value
FROM plans p,
(VALUES
    ('MAX_ESTABLISHMENTS','1'),
    ('MAX_PROFESSIONALS','3'),
    ('MAX_APPOINTMENTS_MONTH','300'),
    ('DASHBOARD_LEVEL','SIMPLE'),
    ('EXPORT_REPORTS','false'),
    ('CUSTOM_THEME','false'),
    ('COUPONS','false'),
    ('API_ACCESS','false'),
    ('HISTORY_DAYS','90')
) AS v(key, value)
WHERE p.name = 'Free';


-- Basic
INSERT INTO plans(name, description, price, duration_days, is_active)
VALUES (
    'Basic',
    'Plano intermediário',
    49.90,
    30,
    true
);

INSERT INTO plan_limits(plan_id, limit_key, limit_value)
SELECT p.id, v.key, v.value
FROM plans p,
(VALUES
    ('MAX_ESTABLISHMENTS','3'),
    ('MAX_PROFESSIONALS','15'),
    ('MAX_APPOINTMENTS_MONTH','2000'),
    ('DASHBOARD_LEVEL','MEDIUM'),
    ('EXPORT_REPORTS','true'),
    ('CUSTOM_THEME','true'),
    ('COUPONS','true'),
    ('API_ACCESS','false'),
    ('HISTORY_DAYS','365')
) AS v(key, value)
WHERE p.name = 'Medium';


-- FULL
INSERT INTO plans(name, description, price, duration_days, is_active)
VALUES (
    'Pro',
    'Plano avançado',
    99.90,
    30,
    true
);

INSERT INTO plan_limits(plan_id, limit_key, limit_value)
SELECT p.id, v.key, v.value
FROM plans p,
(VALUES
    ('MAX_ESTABLISHMENTS','-1'),
    ('MAX_PROFESSIONALS','-1'),
    ('MAX_APPOINTMENTS_MONTH','-1'),
    ('DASHBOARD_LEVEL','FULL'),
    ('EXPORT_REPORTS','true'),
    ('CUSTOM_THEME','true'),
    ('COUPONS','true'),
    ('API_ACCESS','true'),
    ('HISTORY_DAYS','-1')
) AS v(key, value)
WHERE p.name = 'Pro';