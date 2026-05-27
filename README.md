# Organizador Contas Familiar — Casa em Dia

Aplicativo familiar simples para organizar contas da casa com clareza, leveza e tranquilidade.

Frase central do produto:

> Organizar a casa sem transformar isso em uma dor.

## Status

Projeto refinado para entrega MVP com:

- React + Vite
- PWA instalável
- Layout mobile-first
- Tema claro/escuro
- Persistência local funcional
- Estrutura preparada para Supabase Auth + RLS + Realtime
- Configuração Vercel
- Manifest e ícones PWA
- Service Worker com cache básico e fallback offline
- Build validado

## Stack

- React 19
- Vite 8
- JavaScript
- Supabase
- Vercel
- PWA

## Rodar localmente

```bash
npm install
npm run dev
```

## Build de produção

```bash
npm run build
npm run preview
```

## Variáveis de ambiente

Crie um arquivo `.env.local` baseado em `.env.example`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica
```

Sem essas variáveis, o app roda em modo local para validação do MVP.

## Deploy na Vercel

1. Suba o projeto para o GitHub.
2. Importe o repositório na Vercel.
3. Configure as variáveis:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Build command: `npm run build`
5. Output directory: `dist`

O arquivo `vercel.json` já está configurado.

## Supabase

Execute o arquivo:

```txt
src/supabase-schema.sql
```

no SQL Editor do Supabase.

Depois ative Realtime para:

- `bills`
- `payments`
- `family_members`

## Segurança

O schema inclui:

- RLS ativo
- Policies por família
- Vínculo com `auth.users`
- Controle por `family_members`
- Separação de dados entre famílias

## Estrutura

```txt
src/
├── app/
├── components/
├── data/
├── hooks/
├── pages/
├── services/
├── styles/
├── utils/
└── supabase-schema.sql
```

## Observação de produção

Para uso real compartilhado entre celulares, configure Supabase antes de entregar para usuários finais. O modo local serve para teste visual, UX e validação inicial.
