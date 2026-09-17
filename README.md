# core.php

Plataforma de aulas de PHP para iniciantes — 20 aulas, 8 dias de estudo, trilha
com progresso, XP e fórum simples com comentários.

## Como rodar localmente

O projeto é 100% estático (HTML + CSS + JS puro, sem build). Para rodar, basta
servir a pasta com qualquer servidor HTTP local — abrir os arquivos direto com
`file://` pode bloquear alguns navegadores/extensões.

**Opção 1 — Python (já vem instalado na maioria dos sistemas):**
```
cd Curso
python -m http.server 8000
```
Depois acesse http://localhost:8000/index.html

**Opção 2 — Node (se tiver o `npx` disponível):**
```
cd Curso
npx serve .
```

## Estrutura

```
index.html       landing page
aulas.html       trilha de aulas (lista por dia + progresso)
aula.html        template de uma aula (use ?id=1 até ?id=20)
css/style.css    design system e estilos
js/data.js       conteúdo das 20 aulas
js/progress.js   progresso do aluno, XP e níveis (localStorage)
js/forum.js      comentários por aula e créditos de participação
js/main.js       renderização das telas
TEAM_NOTES.md    decisões de arquitetura e design do time
QA_CHECKLIST.md  checklist de aceite e testes executados
```

## Adicionando o vídeo de uma aula

Em `js/data.js`, troque `video_url: null` pela URL do vídeo na aula desejada.
O player já está pronto para isso — nenhuma outra mudança é necessária.

## Progresso do aluno

Guardado no `localStorage` do navegador (chave `corephp:state`). Limpar os
dados do site (ou usar outro navegador/dispositivo) reseta o progresso — é uma
limitação conhecida da v1, documentada em `TEAM_NOTES.md`.
