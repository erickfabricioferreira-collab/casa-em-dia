# Guia de Deploy — Casa em Dia

## 1. GitHub

Não suba arquivos sensíveis.

Confirmar que existem:

- `.gitignore`
- `.env.example`
- `vercel.json`
- `package-lock.json`
- `src/supabase-schema.sql`

## 2. Supabase

1. Crie um projeto no Supabase.
2. Vá em SQL Editor.
3. Execute `src/supabase-schema.sql`.
4. Em Authentication, habilite login por e-mail/senha.
5. Em Realtime/Replication, ative:
   - `bills`
   - `payments`
   - `family_members`

## 3. Vercel

Configuração:

```txt
Framework: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

Variáveis:

```txt
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

## 4. Validação final

Antes de publicar:

```bash
npm install
npm run build
npm run preview
```

Testar:

- Login
- Home
- Adicionar conta
- Editar conta
- Pagar conta
- Histórico
- Perfil
- Tema claro/escuro
- Instalação PWA
- Offline básico
