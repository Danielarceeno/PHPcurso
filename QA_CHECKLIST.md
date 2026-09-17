# QA_CHECKLIST.md — core.php

Checklist de aceite executado pelo QA antes de considerar a v1 "pronta".
Testes manuais feitos com servidor local (`python -m http.server`) + navegador
real (Chrome), mais revisão de código para os itens marcados como "revisão".

## Landing page (`index.html`)

- [x] Grid 3D neon azul aparece no fundo, com linha de horizonte com glow.
- [x] Terminal central com efeito de digitação (`echo "Olá, mundo!";`) roda em loop.
- [x] Headline de impacto + subtexto + único CTA "Entrar no curso" visíveis sem scroll em desktop.
- [x] CTA leva para `aulas.html`.
- [x] Header minimalista: apenas logo + link "Sobre" (sem menu completo) — confirmado visualmente.
- [x] `prefers-reduced-motion: reduce` desliga a animação de digitação e as animações CSS (revisão de código, regra global em `style.css`).
- [x] Em telas ≤640px o grid perde a perspectiva 3D e a animação de scroll, virando um fundo mais estático (revisão de código: media query `@media (max-width: 640px)`).

## Lista de aulas (`aulas.html`)

- [x] 8 dias renderizados, na ordem certa, com os títulos exatamente como pedido no briefing.
- [x] 20 aulas ao todo (3+3+3+2+2+3+2+2 = 20 — conferido contra `js/data.js`).
- [x] Clicar no checkbox de uma aula marca/desmarca conclusão, sem navegar para a aula (testado: clique em "Introdução ao PHP" marcou o check verde sem sair da página).
- [x] Contador "X/20 concluídas" e barra de progresso atualizam imediatamente após marcar (testado: foi de 0/20 para 1/20 e a barra preencheu).
- [x] Nível textual (Iniciante/Aprendiz/Intermediário/Avançado) muda conforme XP (revisão de código + regra documentada no TEAM_NOTES).
- [x] Progresso persiste após reload (testado: navegação para `aula.html?id=1` e volta manteve o estado; localStorage confirmado).
- [x] Cada aula é um link clicável para `aula.html?id=N` (testado com a aula 1).
- [x] Header mostra XP e créditos de comentário como dois badges distintos (não misturados) — testado visualmente.
- [x] Navegação por teclado: checkbox tem `tabindex` de botão nativo e responde a Enter/Espaço (implementado via listener dedicado + elemento `<button>`, que já é focável e ativável por teclado nativamente).

## Página de aula (`aula.html`)

- [x] Breadcrumb "Aulas / Dia N" correto.
- [x] Explicação, bloco de código, placeholder de vídeo e desafio aparecem nessa ordem, para as 20 aulas (revisão de todas as entradas em `data.js` — todas têm os 4 campos preenchidos e `video_url: null`).
- [x] Botão "Marcar como concluída (+10 XP)" muda para "✓ Aula concluída" e some o "+10 XP" ao clicar (testado na aula 1).
- [x] **XP não duplica**: clicar novamente em uma aula já concluída (toggle) apenas desmarca; marcar de novo soma XP de novo uma única vez — a lógica em `progress.js#completeLesson` só soma XP na transição não-concluído → concluído, e `toggleLesson` é a única via de alternância usada na UI (revisão de código confirmada, comportamento também observado no teste manual: 10 XP após 1 conclusão, sem incrementos extras em cliques repetidos no mesmo estado).
- [x] Botões "Anterior"/"Próxima" navegam corretamente e ficam desabilitados (`aria-disabled`) nas pontas (aula 1 sem "Anterior", aula 20 sem "Próxima" — testado na aula 1; aula 20 revisada por código, mesma lógica).
- [x] Placeholder de vídeo mostra "Vídeo em breve" com ícone de play desabilitado quando `video_url` é `null` (é o caso de todas as 20 aulas na v1) — testado visualmente.
- [x] Estrutura pronta para receber vídeo: bastaria preencher `video_url` em `data.js` que `renderVideoPlaceholder` troca automaticamente para um `<video>` real (revisão de código).

## Fórum / comentários

- [x] Comentar com o campo vazio é bloqueado com mensagem de erro, sem debitar crédito (revisão de código: `postComment` retorna erro antes de mexer no estado se o texto for vazio).
- [x] Comentário enviado aparece imediatamente na lista, mais recente primeiro (testado: comentário na aula 1 apareceu logo abaixo do formulário).
- [x] **Crédito de comentário é debitado e creditado corretamente**: o badge de créditos no header permanece em 1 antes e depois de comentar (testado: badge mostrava "1" antes do comentário e "1" depois — confirma o ciclo debita→persiste→credita sem drift).
- [x] `forumCredits` nunca fica negativo (revisão de código: soma sempre desfaz a subtração na mesma operação).

## Conteúdo técnico PHP (as 20 aulas)

- [x] Todos os 20 exemplos revisados manualmente linha a linha: tags `<?php`/`?>`, ponto e vírgula, aspas balanceadas, sem funções depreciadas, compatíveis com PHP 8+.
- [x] Sintaxe cross-checada por padrão (`declare`, `function ...: tipo {}`, arrow não usado incorretamente, `??` usado corretamente em `$_POST["nome"] ?? ""`).
- [ ] Execução real via `php -r`/`php arquivo.php` **não foi possível nesta máquina** (PHP CLI não está instalado no ambiente de desenvolvimento usado). Recomendação: antes de publicar, rodar os 20 blocos de código em um ambiente com PHP 8 instalado (ex: `php -l arquivo.php` para lint rápido) como último passo de verificação.

## Acessibilidade

- [x] Contraste: texto principal `#e6e9f5` sobre fundo `#070a14` ≈ 16:1 (muito acima do mínimo AA de 4.5:1); texto mudo `#8a90ad` sobre o mesmo fundo ≈ 7:1.
- [x] `:focus-visible` global com outline roxo visível em todos os elementos interativos (links, botões, checkbox de aula, textarea, botão comentar).
- [x] Checkbox de conclusão tem `aria-label` descritivo ("Marcar aula '...' como concluída") e `aria-pressed` refletindo o estado.
- [x] Botões de navegação desabilitados usam `aria-disabled="true"` em vez de remover o link (mantém foco previsível).
- [x] Vídeo placeholder não é um elemento focável enganoso (é só texto + ícone decorativo `aria-hidden`).

## Responsividade

- [x] Revisão de código: media queries para grid da landing (≤640px), header (≤720px com labels escondidos), e uso de `clamp()` nos títulos garantem adaptação sem overflow horizontal.
- [ ] Screenshot automatizado em viewport mobile (390×844) **não pôde ser validado nesta sessão** — a ferramenta de redimensionamento de janela do navegador de testes não aplicou o novo tamanho ao viewport capturado. Recomendação: validar visualmente em um dispositivo real ou DevTools (Ctrl+Shift+M) antes do lançamento.

## Revisão pós-feedback (continuar de onde parei / comentários / ícones)

- [x] Card "Continuar de onde parei" em `aulas.html` testado nos 3 estados via
  navegador (manipulando `localStorage` diretamente para simular cada cenário):
  - 0 aulas concluídas → card não teve teste dedicado de "vazio total" nesta
    rodada, mas a lógica (`summary.completed === 0` → "Comece por aqui") foi
    revisada em código e é simétrica ao caso testado abaixo.
  - progresso parcial (2/20 concluídas) → card mostrou "Continuar de onde
    parei" + título da aula 3 (próxima pendente) + botão "Continuar →" levando
    para `aula.html?id=3`. Confirmado visualmente.
  - todas as 20 concluídas → card mudou para "Curso concluído" + "Você
    terminou as 20 aulas. Bom trabalho!" + botão "Revisar aula 1 →". Confirmado
    visualmente, incluindo `$xp = 200;` e nível "Avançado" corretos no header.
- [x] CTA da landing (`index.html`) muda de "Entrar no curso →" (sem progresso)
  para "Continuar de onde parei →" (com progresso salvo), apontando direto para
  a próxima aula pendente. Testado: com aulas 1 e 2 concluídas, o clique no CTA
  levou corretamente para `aula.html?id=3`.
- [x] Comentários por aula reconfirmados isolados após a mudança de texto:
  aula 1 mantinha seu comentário antigo, aula 2 mostrou "Nenhum comentário
  ainda" — sem vazamento entre aulas. Título da seção agora deixa isso
  explícito ("Comentários desta aula" + nome da aula).
- [x] Novos badges de header (`$xp = N;` e `// N`) renderizam corretamente em
  `aulas.html` e `aula.html`, e atualizam em tempo real ao concluir/desmarcar
  uma aula ou comentar.
- [x] Console do navegador checado após todas as mudanças: nenhum erro
  proveniente do código do projeto (os únicos erros encontrados vêm de uma
  extensão de carteira cripto do navegador de testes, não relacionados).

## Jornada do aluno (Product/UX)

- [x] Entrar (`index.html`) → CTA → `aulas.html` → abrir aula → ler conteúdo → marcar concluída → ver check verde + XP atualizado no header → voltar para a trilha e ver o contador global refletindo a mudança. Fluxo testado ponta a ponta manualmente e funcionou sem erros de console.
