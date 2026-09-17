# TEAM_NOTES.md — core.php

Registro das decisões do "time" simulado antes e durante a construção da plataforma.
Cada seção representa o papel assumido e o que foi decidido/entregue.

## 9. XP exige login

Pedido do usuário: "somente quem estiver logado consegue ganhar XP". Antes,
qualquer visitante (sem conta) podia marcar aulas como concluídas e acumular
XP na conta "guest" (ver item 7) — o que fazia sentido tecnicamente, mas
esvaziava o propósito de ter contas.

**Implementado em duas camadas** (mesmo padrão já usado para comentários,
que também exigem login):

- **Camada de dados** (`js/progress.js`): `completeLesson()` agora checa
  `getSession()` logo no início e não faz nada (retorna o estado sem
  alterar) se não houver sessão — é a regra "de verdade", a que vale mesmo
  se alguém tentar chamar a função direto pelo console.
- **Camada de UI** (`js/main.js`): tanto o círculo de conclusão na lista de
  aulas quanto o botão "Marcar como concluída" na página da aula checam
  `getSession()` **antes** de chamar `toggleLesson`; sem sessão, abrem o
  modal de login (`openLoginModal()`) em vez de tentar concluir. O botão da
  aula também troca de texto para "Entrar para marcar como concluída"
  quando deslogado, e o círculo da lista ganha um `title`/`aria-label`
  explicando o motivo.

**Testado ao vivo:** deslogado, clicar no círculo da lista ou no botão da
aula abre o modal de login em vez de marcar/dar XP (confirmado: 0/20, 0 XP
antes e depois da tentativa). Logando com uma conta, o mesmo clique volta a
funcionar normalmente (XP sobe, botão mostra "✓ Aula concluída"). Deslogar
de novo faz o botão voltar a pedir login.

## 8. Redesign da lista de aulas por dia (estilo trilha/timeline)

O usuário enviou uma nova referência visual (desta vez da tela de listagem
de aulas por dia, não do post de boas-vindas) mostrando: título "Aulas /web"
com um badge de ícone, e dentro de cada "Dia N" uma lista compacta onde os
círculos de conclusão são conectados por uma linha vertical (como uma
trilha/timeline), com o título de cada aula em azul, estilo link, sem card,
sem descrição e sem seta.

**Implementado em `aulas.html`/`js/main.js`/`css/style.css`:**
- Título da página virou "Aulas <span class="path-tag">/php</span>" com um
  badge quadrado verde arredondado (📅) ao lado — mesma ideia da referência,
  adaptada ao nosso path (`/php`, não `/web`) e à nossa paleta.
- `.day-heading` ("Dia N") mudou de texto roxo/mono discreto para um heading
  branco, em negrito, mais parecido com a referência.
  Cada `<ul class="lesson-list">` (uma por dia) ganhou uma linha vertical
  (`::before` posicionado atrás dos círculos) conectando as aulas daquele
  dia — dias diferentes têm trilhas independentes, sem linha entre eles.
- Cada aula virou uma linha simples: círculo de conclusão (clicável, mesma
  lógica de toggle de antes) + título em azul (`--grid-glow`) como link
  direto para a aula. Removidos o card com borda, o resumo da aula
  (`lesson.summary`) e a seta — o resumo continua existindo nos dados
  (usado no post de boas-vindas de cada aula) e no botão de continuar.
- Testado ao vivo: clicar no círculo continua marcando/desmarcando
  corretamente (XP, barra de progresso e card "Continuar" atualizam), e
  clicar no título da aula continua levando para `aula.html?id=N`.

## 7. XP/progresso vinculado à conta (não mais compartilhado no navegador)

Pedido do usuário: "Rafael entrou, o XP conta pra ele; Daniel entrou, o XP
que ele fizer só vai pra ele" — antes disso, **todo o progresso (XP, aulas
concluídas, créditos de fórum) ficava numa única chave de `localStorage`
compartilhada por todo o navegador**, independente de quem estivesse logado.
Qualquer conta que entrasse via aquele navegador via (e conseguia alterar) o
progresso de todo mundo.

**O que mudou:**

- `js/progress.js`: a chave de armazenamento deixou de ser fixa
  (`corephp:state`) e passou a ser calculada por conta —
  `corephp:progress:<nome da conta em minúsculas>` (`getProgressKey()`).
  Sem login, usa-se uma conta `guest` separada. `completedLessons`, `xp` e
  `forumCredits` agora são 100% pessoais.
- `js/forum.js`: os **comentários continuam compartilhados** entre todas as
  contas do navegador (faz sentido: um comentário deve ser visível para
  qualquer um que abrir a aula, não só para quem comentou) — movidos para uma
  chave própria, `corephp:comments`, independente do progresso de qualquer
  conta. Só o crédito gasto/reposto ao comentar (`forumCredits`) é que
  continua pessoal, lido/gravado no progresso da conta logada no momento.
- **Bug pego durante o teste, não relacionado à separação de dados em si:**
  o modal de login só re-renderizava a página de aula individual
  (`initLessonPage()`) depois de logar/deslogar — em `aulas.html` (lista) e
  em `index.html` (CTA da landing), nada era recalculado, então trocar de
  conta pelo modal deixava a tela mostrando o progresso da conta ANTERIOR até
  um F5. Corrigido com uma função única, `refreshAccountDependentUI()`,
  chamada tanto no sucesso do login/cadastro quanto no logout, que
  re-renderiza o que for relevante pra cada página (header, lista de aulas,
  barra de progresso, card de continuar, e o CTA da landing).

**Testado (ao vivo, no navegador, sem recarregar a página):**
- Rafael completa 2 aulas → 20 XP. Daniel se cadastra → começa em 0 XP.
  Daniel completa 1 aula diferente → 10 XP. Voltar para Rafael mostra 20 XP
  intocado; voltar para Daniel mostra 10 XP intocado.
- Trocar de conta pelo modal de login em `aulas.html` atualiza a lista/XP/
  barra de progresso na hora, sem F5 (bug acima corrigido).
- Logout/login na landing atualiza o texto do CTA na hora.
- Comentário postado por Rafael numa aula aparece também quando Daniel abre
  a mesma aula (e vice-versa) — confirma que só o progresso é isolado, não o
  conteúdo do fórum.

## 6. Auditoria técnica completa (equipe sênior)

Auditoria full-stack simulada (Tech Lead, Backend, Frontend, Segurança, QA,
Performance, Code Review, DevOps) sobre os 2502 linhas de código do projeto.
Enquadramento: é um site 100% estático, sem backend/banco/API — várias
dimensões do template de auditoria (queries, JWT, Docker, N+1) não se
aplicam e foram declaradas como tal em vez de inventar achados.

**Bugs reais encontrados e corrigidos:**

1. 🔴 **CRÍTICO (verificado ao vivo com instrumentação):** `initLessonsPage()`
   registrava `click`/`keydown` listeners no container `#lesson-days` toda
   vez que era chamada — e ela chama a si mesma a cada toggle. Como o
   container nunca é recriado (só o `innerHTML` dele), os listeners se
   acumulavam exponencialmente (1 → 3 → 7 disparos por clique). Efeito
   visível: a partir do 2º clique, marcar uma aula como concluída parecia
   "não fazer nada" (toggles se cancelando em pares) ou a aba travava depois
   de várias interações. Corrigido com uma guarda (`container.dataset.listenersBound`)
   que registra os listeners uma única vez. Testado: 4 cliques → exatamente
   4 chamadas de `toggleLesson`, sem acúmulo.
2. 🟠 **ALTO (verificado):** `renderVideoPlaceholder()` inseria `video_url`
   sem escapar dentro de `<video src="...">` — permitia quebrar o atributo
   com aspas e injetar um handler `onerror` executável (XSS armazenado via
   URL de vídeo definida pelo admin). Ao tentar corrigir só nesse ponto,
   descobrimos que o próprio utilitário `escapeHtml()` (baseado em
   `textContent`→`innerHTML`) nunca escapava aspas — seguro para texto, mas
   **não** para dentro de atributos. Corrigido reescrevendo `escapeHtml()`
   para escapar também `"` e `'`, o que fecha esse vetor em todos os lugares
   que já reaproveitavam a função (inclusive o campo de edição de vídeo do
   admin). Testado com payload real (`x.mp4" onerror="..."`): antes da
   correção o atributo `onerror` aparecia no DOM; depois, não aparece mais.
3. 🟡 **MÉDIO:** `id: Date.now()` em comentários podia colidir se dois
   comentários fossem postados no mesmo milissegundo, fazendo
   `deleteComment` apagar ambos por engano. Corrigido somando uma fração
   aleatória (`Date.now() + Math.random()`), mantendo o id numérico (o
   código de exclusão faz `Number(...)` sobre ele).
4. 🟡 **MÉDIO:** as funções de leitura de `localStorage` já eram defensivas
   (try/catch), mas as de escrita (`saveState`, `saveContentOverride`,
   cadastro/sessão em `auth.js`) não eram — um `localStorage.setItem` falhando
   (quota cheia, storage bloqueado) quebraria o handler no meio da execução,
   como um clique que "não faz nada". Corrigido com o mesmo padrão
   silenciosamente-defensivo das leituras.

**Não corrigido, por ser risco já aceito e documentado pelo próprio usuário**
(não uma vulnerabilidade nova descoberta): senhas em texto puro e credencial
de admin fixa no código-fonte — decisão consciente da rodada de login
simulado, sem servidor, sem transmissão de rede.

**Registrado como melhoria futura, não como bug:** dividir `main.js` (565
linhas, várias responsabilidades) se o projeto continuar crescendo; escapar
`lesson.title`/`lesson.summary` na lista de aulas por consistência (hoje
inofensivo, pois vêm de conteúdo estático não editável); testes automatizados.

---

## Marca

Não usamos "curso.dev" (nome/logo). Marca própria escolhida: **core.php**.

Racional: "core" remete ao núcleo/fundamentos que o curso ensina; ".php" deixa
claro o tema. Visualmente vira `core<span class="accent">.php</span>`, ecoando a
sintaxe de uma tag PHP sem copiar identidade de terceiros.

---

## 1. Tech Lead / Arquiteto de Software

**Escopo avaliado:** produto de conteúdo (20 aulas de PHP) + gamificação leve (XP,
créditos de comentário) + progresso persistente. Não há necessidade de multiusuário,
autenticação ou dados sensíveis na v1 — isso favorece fortemente um app estático.

**Decisões:**

- **Stack:** HTML + CSS + JavaScript puro (sem framework, sem build step). Justificativa:
  escopo é pequeno/médio, conteúdo é majoritariamente estático, e um framework
  (React/Vue) adicionaria complexidade de build sem ganho real para 3 telas + 20 aulas
  renderizadas por template. Reavaliar em v2 se o curso crescer (múltiplos módulos,
  autenticação real, painel admin).
- **Estrutura de pastas:**
  ```
  /index.html          landing page
  /aulas.html           lista de aulas / trilha
  /aula.html            template único de aula (recebe ?id=N)
  /css/style.css        design system + estilos
  /js/data.js           dados das 20 aulas (fonte única de verdade)
  /js/progress.js       progresso, XP, streak (localStorage)
  /js/forum.js          fórum mock + créditos de comentário
  /js/main.js           header compartilhado, render da lista, render da aula
  /assets/              ícones/ilustrações originais (SVG inline, sem assets de terceiros)
  ```
- **Aula como template único em vez de 20 arquivos HTML:** as 20 "páginas/telas de aula"
  são entregues como 20 *entradas de dados* completas (explicação, código, desafio,
  vídeo) renderizadas por `aula.html?id=N`. Isso evita duplicar ~20 arquivos HTML
  idênticos em estrutura (risco real de divergência/manutenção), mantendo o requisito
  funcional: cada aula tem sua própria URL, conteúdo completo e é navegável/linkável.
  Documentado aqui por ser um trade-off explícito pedido para registrar.
- **Persistência v1:** `localStorage`, chave `corephp:state`, contendo:
  `{ completedLessons: number[], xp: number, forumCredits: number, comments: [...] }`.
  Pontos de extensão para v2 (comentados no código):
  `// TODO v2: substituir por chamada a API (POST /progress, GET /me) quando houver backend`.
- **Sistema de XP:** 10 XP por aula concluída (constante `XP_PER_LESSON` em
  `progress.js`, configurável). Concluir uma aula já concluída não gera XP de novo —
  a marcação é idempotente (`Set` de IDs concluídos; XP só soma na transição
  não-concluído → concluído).
- **Faixas de XP (níveis):** simples, 4 faixas para dar sensação de progressão sem
  over-engineering:
  - 0–49 XP: Iniciante
  - 50–99 XP: Aprendiz
  - 100–149 XP: Intermediário
  - 150+ XP (20 aulas × 10 = 200 XP máx v1): Avançado
- **Créditos de comentário (fórum):** modelo escolhido — **"crédito rotativo"**:
  todo aluno começa com **1 crédito**; comentar **consome 1 crédito e devolve 1 crédito**
  (net zero), ou seja, na prática todo aluno pode sempre comentar, mas a transação de
  débito/crédito é real e auditável no estado (`forumCredits` nunca fica negativo nem
  cresce sem limite). Isso evita fricção (não queremos bloquear o aluno de participar)
  mas cumpre o requisito de "crédito consumido e crédito gerado por ação", já testável
  pelo QA. Regra exata implementada em `forum.js#postComment`:
  1. Verifica `forumCredits >= 1` (se não, comentário bloqueado — não deveria acontecer
     no fluxo normal, mas é a salvaguarda).
  2. Debita 1 crédito.
  3. Persiste o comentário.
  4. Credita 1 crédito de volta (recompensa por participar).
- **Vídeo das aulas:** cada aula tem `video_url: null` em `data.js`. O componente de
  player (`renderVideoPlaceholder`) checa esse campo: se `null`, mostra estado vazio
  ("Vídeo em breve" + ícone de play desabilitado); se preenchido, renderiza
  `<video src="...">` automaticamente. Nenhuma mudança estrutural será necessária
  para "ligar" os vídeos depois.

**Riscos levantados:**
- localStorage é por navegador/dispositivo — progresso não sincroniza entre
  aparelhos na v1 (aceito conscientemente, documentado para o usuário final).
- Sem backend, o "fórum" é per-device/mock — não há comentários compartilhados entre
  alunos reais. Adequado para v1 conforme pedido.

**Plano de entrega em fases:** Fase 1 (arquitetura/design system) → Fase 2 (landing)
→ Fase 3 (dados + lista de aulas) → Fase 4 (conteúdo das 20 aulas) → Fase 5 (QA).

---

## 2. Engenheiro Front-end / UI

**Design system (token summary):**

- **Cor:**
  - `--bg` `#070a14` (fundo quase-preto azulado)
  - `--bg-elevated` `#0d1428` (cards, header)
  - `--grid-line` `#1e3a8a` com glow em `#38bdf8` (grid neon azul da landing)
  - `--accent-purple` `#8892e0` (referência à cor oficial do elefante do PHP —
    usada em botões/CTAs e detalhes, criando uma ponte visual com a linguagem
    sem copiar nenhuma logo)
  - `--success` `#34d399` (checkmarks de conclusão)
  - `--text` `#e6e9f5`, `--text-muted` `#8a90ad`
- **Tipografia:**
  - Display/headlines: **JetBrains Mono** (peso 700/800) — monoespaçada por ser uma
    plataforma de código; os títulos "parecem" comandos/tags, reforçando o tema sem
    recorrer a um sans genérico.
  - Corpo: **Inter** — alta legibilidade para explicações longas.
  - Código: **JetBrains Mono** também nos blocos `<code>`, reaproveitando a fonte de
    display (coerência visual, uma família a menos para carregar).
- **Elemento assinatura:** um "terminal card" central na landing, com efeito de
  digitação (typing effect) rodando `echo "Olá, mundo!";` em loop lento, cursor
  piscante `_` reaproveitado também depois dos headlines da lista de aulas
  (`Aulas<span class="cursor">_</span>`). É o elemento mais memorável da UI e é
  gerado 100% em CSS/SVG/JS — nenhuma ilustração de terceiros.
- **Grid 3D:** perspectiva CSS (`transform: perspective(...) rotateX(...)`) com
  linhas horizontais/verticais animadas em `background-position`, glow via
  `box-shadow`/`filter: blur`. Em mobile (`prefers-reduced-motion` ou `max-width:640px`),
  o grid degrada para um gradiente estático mais sutil — sem perspectiva 3D pesada,
  evitando jank em GPUs fracas de celular.
- **Microinterações:** hover eleva os cards de aula (`translateY` + glow de borda),
  checkbox de conclusão tem animação de "check" (stroke-dashoffset), botão CTA tem
  glow pulsante sutil.
- **Responsividade:** grid de aulas em coluna única <768px; header colapsa
  busca/contadores em ícone; tipografia com `clamp()`.
- **Acessibilidade:** contraste mínimo AA verificado (texto principal sobre fundo
  escuro ≥ 7:1), todos os elementos interativos com `:focus-visible` visível
  (outline em `--accent-purple`), navegação por teclado testada no QA (tab order,
  Enter/Space ativam checkboxes).

---

## 3. Engenheiro Back-end

**Estrutura de dados das aulas** (`js/data.js`), um objeto por aula:
```js
{
  id: 1,
  day: 1,
  title: "Introdução ao PHP",
  summary: "...",
  explanation: "...",
  code: "<?php ... ?>",
  challenge: "...",
  video_url: null
}
```
20 entradas, agrupadas por `day` (1 a 8, conforme a trilha pedida) na tela de lista.

**Conteúdo técnico:** todo exemplo de código foi escrito para ser sintaticamente
válido em PHP 8+, sem dependências externas, executável via `php arquivo.php` na
CLI. Nenhum exemplo usa funções depreciadas.

**Rotas/API:** não há backend real na v1 (decisão do Tech Lead), então "rotas" aqui
são só as 3 páginas HTML + query string (`aula.html?id=N`). Funções de
`progress.js`/`forum.js` são desenhadas com assinatura de API
(`getState()`, `completeLesson(id)`, `postComment(lessonId, text)`) para que, em v2,
o corpo dessas funções troque `localStorage` por `fetch()` sem mudar quem as chama.

---

## 4. QA / Engenheiro de Qualidade

Checklist completo em `QA_CHECKLIST.md`. Cobre: cada tela, cada aula, XP sem
duplicação, crédito de comentário debitado/creditado, responsividade, contraste,
navegação por teclado, e verificação de sintaxe PHP dos 20 exemplos.

---

## 5.1 Revisão pós-lançamento (feedback do usuário)

Após o primeiro teste real da plataforma, três ajustes foram pedidos e implementados:

- **Botão "Continuar de onde parei":** identificado como uma lacuna real de UX — o
  aluno não tinha nenhum atalho para retomar o curso sem procurar manualmente a
  próxima aula pendente na trilha. Implementado como:
  - um card de destaque (`#continue-card`) no topo de `aulas.html`, logo abaixo da
    barra de progresso, calculado por `getNextLessonId()` (primeira aula não
    concluída, na ordem da trilha). Três estados: "Comece por aqui" (zero aulas
    concluídas), "Continuar de onde parei" (progresso parcial) e "Curso
    concluído" (as 20 aulas feitas, com opção de revisar a aula 1).
  - o CTA da landing (`index.html`) também passou a checar `localStorage`: se
    houver progresso salvo, o botão troca de "Entrar no curso →" para
    "Continuar de onde parei →" e leva direto para a próxima aula pendente,
    evitando um clique extra pela trilha.
- **Comentários por aula:** o código já isolava comentários corretamente por
  `lessonId` (`forum.js#getComments`/`postComment`), confirmado em teste manual
  no navegador (comentário feito na aula 1 não aparecia na aula 2). O pedido do
  usuário foi tratado como reforço de clareza visual: o título da seção agora é
  "Comentários desta aula" e cita explicitamente o nome da aula atual, para
  deixar o escopo óbvio sem depender de ler o código.
- **Ícones do header (XP e créditos de comentário):** os emojis genéricos (⚡ e 💬)
  foram substituídos por uma notação de código ligada à própria linguagem que o
  curso ensina — `$xp = N;` (uma atribuição de variável PHP) para XP, e `// N`
  (sintaxe de comentário de linha única do PHP) para créditos de fórum. Além de
  fugir do visual "genérico de IA" apontado pelo usuário, a escolha reforça a
  marca: o próprio header vira mais um pequeno trecho de "código".

## 5.2 Post de boas-vindas (estilo fórum)

O usuário enviou uma captura de tela de referência (post "Bem-vindo(a)!" do
curso.dev, com badges de autor/papel/dia/progresso, contador de votos, título,
corpo com lista numerada, aviso "ATENÇÃO" e uma seção recolhível de tópicos já
abordados) e pediu para trazer esse conteúdo/estilo para o sistema.

**Decisões:**
- Não copiamos o nome/handle do autor real da captura (é uma pessoa real,
  fundador de outra plataforma) — usamos `@equipe.php` como autor fictício do
  curso, mantendo o badge "instrutor" (rótulo genérico de papel, não uma
  identidade específica).
- O contador de votos é puramente decorativo nesta v1 (não há sistema de
  votação implementado — foge do escopo pedido); mostra um número pequeno e
  plausível, sem simular engajamento real de terceiros.
- Implementado como um componente novo (`renderWelcomePost` em `js/main.js`,
  estilos `.welcome-post`/`.badge-row`/`.attention-box`/`.post-details` em
  `css/style.css`) exibido **somente na Aula 1** (`aula.html?id=1`), acima da
  seção "Explicação" — é literalmente um post de boas-vindas à primeira aula,
  então não faz sentido repeti-lo nas outras 19.
- A seção recolhível usa `<details>/<summary>` nativo do HTML (acessível por
  teclado e leitor de tela por padrão, sem JS extra) em vez de reimplementar um
  accordion customizado.
- Não duplicamos os botões "Aula concluída"/"Próxima aula" dentro do post —
  eles já existem no rodapé padrão da página e apontam para a mesma lógica de
  `toggleLesson`/navegação; duplicar criaria dois controles de estado para a
  mesma ação.

## 5.3 Post generalizado para todas as aulas (2ª rodada de feedback)

O usuário pediu para o post de contexto (item 5.2) aparecer em **todas as 20
aulas**, não só na primeira, **embaixo do vídeo** (não mais no topo), e com
três pontos "vinculados" a dados reais em vez de fixos:

- **Badge "N de M aulas"**: antes mostrava sempre o total do dia (ex.: "3 de 3");
  agora `getDayProgress(day)` conta quantas aulas daquele dia já estão em
  `completedLessons` e atualiza ao vivo (`#post-progress-count`) assim que o
  aluno marca/desmarca qualquer aula do mesmo dia — testado: concluir a aula 1
  mudou o badge de "0 de 3" para "1 de 3", visível também na aula 2 (mesmo dia).
- **Contador de votos (▲)**: deixou de ser um número decorativo fixo (12) e
  passou a refletir `getComments(lesson.id).length` — o número real de
  comentários daquela aula — atualizado ao vivo (`#post-vote-count`) a cada
  comentário novo. Testado: comentar na aula 1 mudou o contador de 0 para 1.
- **Badge "Dia N"**: já usava `DAY_LABELS[lesson.day]` dinamicamente; ao passar
  a exibir o post em todas as aulas, esse vínculo agora é visível em todos os
  dias, não só no Dia 1.
- **Personalização por aula**: a Aula 1 mantém a mensagem de boas-vindas
  original; as demais 19 recebem um título ("Sobre esta aula: <título>"), um
  resumo (`lesson.summary`) e uma lista de ações específica daquela aula. A
  seção recolhível deixou de ser um texto fixo e passou a listar
  dinamicamente os títulos de todas as aulas **anteriores** à atual
  (`LESSONS.filter(l => l.id < lesson.id)`), simulando "o que o curso já
  cobriu até este ponto" — vazio apenas na Aula 1.
- **Posição**: o bloco saiu do topo (acima de "Explicação") e passou a ficar
  logo depois da seção "Vídeo da aula", antes do desafio ("Agora tente você"),
  em todas as 20 aulas.

## 5.4 Remoção do aviso "ATENÇÃO" e login simulado (admin/aluno)

O usuário pediu para remover o bloco "🔴 ATENÇÃO 🔴" de todas as aulas (feito —
removido de `renderWelcomePost` e do CSS `.attention-box`) e para adicionar
login de admin e de aluno, com o admin podendo editar a descrição das aulas,
excluir comentários e "fazer upload" de vídeo.

**Antes de implementar**, alertamos que o projeto é 100% estático (sem
servidor) e que login/autenticação de verdade não é possível com segurança
só no front-end — qualquer "senha" guardada no navegador pode ser lida via
DevTools, e dados não ficam compartilhados entre diferentes pessoas/navegadores.
Apresentamos 3 caminhos (simulado no navegador / backend próprio com Node +
banco de dados / serviço pronto como Firebase-Supabase) e o usuário escolheu
explicitamente o caminho **simulado no navegador**, ciente da limitação.

**O que foi implementado (v1, simulado, documentado como protótipo):**

- `js/auth.js`: sessão guardada em `localStorage` (`corephp:session`).
  Credenciais de admin **hardcoded no código-fonte** (`admin` /
  `corephp123`) — deliberadamente simples e visível, pois não há segredo real
  a proteger nesta v1. Aluno "loga" só informando um nome (sem senha), já que
  não há conta de verdade nem sincronização entre dispositivos.
- `js/content.js`: edições do admin (descrição/explicação da aula, URL do
  vídeo) guardadas como "overrides" em `localStorage`
  (`corephp:contentOverrides`), mescladas por cima do conteúdo original de
  `js/data.js` via `getEffectiveLesson()`. `js/data.js` nunca é mutado.
- `js/forum.js`: nova função `deleteComment(id)` para o admin remover
  comentários (sem mexer nos créditos de fórum, que já foram
  debitados/creditados no momento da postagem).
- Modal de login (`ensureLoginModal`/`openLoginModal` em `js/main.js`) com
  abas "Aluno" e "Administrador", acessível pelo botão "Entrar" no header de
  todas as páginas. Sessão ativa mostra nome + badge de papel + "sair".
- Na página de aula, quando `isAdmin()`: aparece um botão "✏️ Editar" ao lado
  de "Explicação" (abre um textarea, salva via `saveContentOverride`), um
  "✏️ Editar vídeo" ao lado de "Vídeo da aula" (campo de URL — não é upload de
  arquivo de verdade, e sim colar o link, já que não há onde armazenar um
  arquivo sem servidor) e um ícone 🗑 em cada comentário.
- Testado ao vivo: login como admin habilita os 3 controles; editar a
  explicação da Aula 1 e salvar atualiza a tela na hora e persiste após
  reload; excluir um comentário remove da lista imediatamente; logout faz os
  controles de admin sumirem (mas o conteúdo editado continua visível a
  todos, pois é o novo conteúdo "oficial" daquele navegador); login como
  aluno ("Daniel") funciona e não mostra nenhum controle de admin.

**Limitação explícita (documentar sempre que o tema voltar à tona):** isto
**não é segurança real**. Qualquer pessoa pode abrir o DevTools e chamar
`loginAsAdmin('admin','corephp123')` (as credenciais estão no código-fonte) ou
mesmo escrever diretamente em `localStorage` para se tornar admin. Edições de
conteúdo e exclusões de comentário só valem no navegador de quem fez a ação —
não são vistas por outros alunos. Migrar para autenticação e dados
compartilhados de verdade exige um dos caminhos com backend descartados nesta
rodada (fica registrado aqui para quando o usuário quiser avançar para v2).

## 5.5 Painel de login único, cadastro e comentários vinculados ao nome

Terceira rodada de feedback sobre o login: o usuário pediu (1) um **painel
único** de login para aluno e admin, sem abas separadas por papel, (2) que a
pessoa possa **se cadastrar** quando o nome ainda não existe, e (3) que os
**comentários fiquem vinculados ao nome** escolhido no login, além de (4)
melhorar o design do modal.

**Decisões:**

- `js/auth.js` foi reescrito para um modelo de **contas** (`corephp:users`,
  lista de `{name, password, role}`) em vez de dois fluxos de login
  separados. O painel de login agora é um único formulário (Nome + Senha):
  - **Entrar**: procura o nome na lista de contas. Se a senha bater, entra
    com o papel salvo naquela conta (aluno ou admin).
  - **Criar conta**: sempre cria papel `aluno` — não existe campo "sou admin"
    em lugar nenhum da UI. A única conta `admin` é semeada automaticamente
    (`admin` / `corephp123`) e é assim que o painel único continua permitindo
    testar o lado admin sem abas: basta logar com esse nome.
  - Se a pessoa tentar entrar com um nome que não existe, a mensagem de erro
    já oferece "Criar conta com esse nome" (preenche o formulário de cadastro
    com o que ela já tinha digitado, em vez de fazê-la redigitar).
- **Comentários vinculados ao nome**: `postComment` agora exige sessão ativa
  (`getSession()`) e grava `authorName` no comentário. Sem login, o
  formulário de comentário é substituído por um aviso "Faça login para
  comentar" com botão que abre o modal — não dá mais para comentar
  anonimamente. Comentários antigos sem `authorName` (de antes desta
  mudança) caem no rótulo "Anônimo" (retrocompatibilidade).
- **Design do modal**: barra de gradiente no topo (roxo → azul → verde, as
  mesmas cores do design system), avatar circular com a inicial do nome
  (atualiza ao digitar), microcopy que muda conforme o modo ("Entrar" vs.
  "Criar conta"), e um link de alternância entre os dois modos a qualquer
  momento (não só quando o login falha). O badge de sessão no header também
  ganhou um miniavatar do mesmo estilo.
- Testado ao vivo: cadastro de uma conta nova ("Marina") funciona, comentário
  aparece com "Marina" em destaque acima do texto; logout faz o formulário de
  comentário virar o aviso de login; login com a conta admin semeada
  continua funcionando no mesmo painel (sem nenhuma aba de "sou admin").

## 5. Product/UX Reviewer

**Jornada validada:** Landing (`index.html`) → CTA "Entrar no curso" →
`aulas.html` (trilha com progresso) → clique numa aula → `aula.html?id=N`
(conteúdo + código + desafio + vídeo placeholder) → botão "Marcar como concluída"
→ volta para `aulas.html` com checkmark verde + contador atualizado + XP no header.
Fórum é acessível a partir da aula (comentários daquela aula) e soma pontos
próprios, sem interferir na trilha principal — evita confundir "progresso do curso"
com "participação no fórum".

**Ajuste pedido nesta revisão:** o header da lista de aulas deve deixar claro que
"XP" e "créditos de comentário" são coisas diferentes (dois números distintos,
rótulos curtos) para não confundir com o padrão do print de referência (que mistura
sequência/pontos). Implementado como dois badges separados no header.
