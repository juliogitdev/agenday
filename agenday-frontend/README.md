# Agenday Frontend

Interface web desenvolvida com **React 18 + TypeScript + Vite**.

## Tecnologias
- React 18 + TypeScript
- Vite (bundler)
- React Router v6 (rotas)
- Axios (chamadas à API)
- Zustand (estado global)
- Day.js (manipulação de datas)

## Estrutura (`src/`)
```
components/   → Componentes reutilizáveis (Button, Card, Sidebar...)
pages/        → Uma página por rota da aplicação
hooks/        → Custom React Hooks (useAuth, useAppointments...)
services/     → Chamadas à API via Axios
store/        → Estado global com Zustand (apenas auth + UI)
types/        → Tipos TypeScript compartilhados
utils/        → Funções utilitárias puras (datas, formatação...)
```

## Como rodar
```bash
cp .env.example .env
npm install
npm run dev
```
