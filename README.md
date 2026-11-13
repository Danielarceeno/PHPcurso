# core.php

Plataforma de aulas de PHP para iniciantes — 20 aulas, 8 dias de estudo, trilha
com progresso, XP, login simulado e fórum simples com comentários.

## Como rodar localmente

O projeto é 100% estático (HTML + CSS + JS puro, sem build). Para rodar, basta
servir a pasta do projeto com qualquer servidor HTTP local — abrir os arquivos
direto com `file://` pode bloquear alguns navegadores/extensões.

**Opção 1 — Python (já vem instalado na maioria dos sistemas):**
```
python -m http.server 8000
```
Depois acesse http://localhost:8000/index.html

**Opção 2 — Node (se tiver o `npx` disponível):**
```
npx serve .
```

## Testes

```
npm test
```
Roda os testes de `tests/` com o test runner nativo do Node (sem dependências;
requer Node 21+). Cobrem a lógica de `progress.js` e `forum.js`, usando o
`auth.js` real para criar contas e logar.

## Estrutura

```
index.html       landing page
aulas.html       trilha de aulas (lista por dia + progresso)
aula.html        template de uma aula (use ?id=1 até ?id=20)
css/style.css    design system e estilos
js/data.js       conteúdo das 20 aulas
js/auth.js       contas e sessão simuladas (localStorage, sem backend)
js/progress.js   progresso do aluno, XP e níveis, por conta
js/content.js    edições de admin sobre o conteúdo das aulas (overrides)
js/forum.js      comentários por aula e créditos de participação
js/main.js       renderização das telas
assets/          favicon
tests/           testes automatizados (node --test)
TEAM_NOTES.md    histórico de decisões de arquitetura e design
QA_CHECKLIST.md  checklist de aceite da v1 (registro histórico)
```

Ao alterar qualquer arquivo de `js/` ou `css/`, aumente o `?v=N` das tags
`<script>`/`<link>` nos três HTML para o navegador não servir a versão em cache.

## Adicionando o vídeo de uma aula

Em `js/data.js`, troque `video_url: null` pela URL do vídeo na aula desejada.
Aceita link de arquivo do Google Drive (vira player embutido), link de pasta do
Drive (vira um link para abrir em outra aba) ou URL direta de vídeo.

## Login e dados

Tudo fica no `localStorage` do navegador — não há backend:

- `corephp:users` / `corephp:session` — contas e sessão. **Não é autenticação
  real** (senhas em texto puro); a conta admin de demonstração é
  `admin` / `corephp123`.
- `corephp:progress:<conta>` — aulas concluídas, XP e créditos, por conta.
- `corephp:comments` — comentários, compartilhados entre as contas do navegador.
- `corephp:contentOverrides` — edições feitas pelo admin (explicação/vídeo).

Limpar os dados do site (ou usar outro navegador/dispositivo) reseta tudo — é
uma limitação conhecida da v1, documentada em `TEAM_NOTES.md`.
