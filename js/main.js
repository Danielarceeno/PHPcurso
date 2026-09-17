/**
 * main.js — renderização compartilhada: header (XP/créditos/login), lista de
 * aulas e página individual de aula. Depende de data.js, progress.js,
 * auth.js e content.js (e forum.js nas páginas de aula) já carregados antes
 * deste arquivo.
 */

const CHECK_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

function renderHeaderStats() {
  const summary = getProgressSummary(LESSONS.length);
  const xpEl = document.getElementById('stat-xp');
  const creditsEl = document.getElementById('stat-credits');
  if (xpEl) xpEl.textContent = summary.xp;
  if (creditsEl) creditsEl.textContent = summary.forumCredits;
}

/* ---------------- Autenticação (login simulado, painel único) ---------------- */

function ensureLoginModal() {
  if (document.getElementById('login-modal')) return;

  const dialog = document.createElement('dialog');
  dialog.id = 'login-modal';
  dialog.innerHTML = `
    <button type="button" class="login-close" aria-label="Fechar">✕</button>
    <div class="login-modal-body">
      <div class="login-modal-head">
        <div class="login-avatar" id="login-avatar">?</div>
        <h3 id="login-modal-title">Entrar</h3>
        <p class="login-modal-sub" id="login-modal-sub">Acesse com o nome e a senha que você escolheu.</p>
      </div>
      <form id="login-form" class="login-form">
        <div class="login-field">
          <label for="login-name">Nome</label>
          <input type="text" id="login-name" autocomplete="username" required>
        </div>
        <div class="login-field">
          <label for="login-password">Senha</label>
          <input type="password" id="login-password" autocomplete="current-password" required>
        </div>
        <button type="submit" id="login-submit-btn">Entrar</button>
      </form>
      <p class="login-error" id="login-error"></p>
      <p class="login-switch">
        <span id="login-switch-text">Ainda não tem conta?</span>
        <button type="button" class="login-switch-btn" id="login-switch-btn">Criar conta</button>
      </p>
      <p class="login-hint">Ambiente de demonstração — a conta admin já existe: <code>admin</code> / <code>corephp123</code>.</p>
    </div>
  `;
  document.body.appendChild(dialog);

  const nameInput = dialog.querySelector('#login-name');
  const passwordInput = dialog.querySelector('#login-password');
  const avatarEl = dialog.querySelector('#login-avatar');
  const titleEl = dialog.querySelector('#login-modal-title');
  const subEl = dialog.querySelector('#login-modal-sub');
  const submitBtn = dialog.querySelector('#login-submit-btn');
  const switchText = dialog.querySelector('#login-switch-text');
  const switchBtn = dialog.querySelector('#login-switch-btn');
  const errorEl = dialog.querySelector('#login-error');
  const form = dialog.querySelector('#login-form');

  let mode = 'entrar';

  function setMode(newMode) {
    mode = newMode;
    errorEl.innerHTML = '';
    if (mode === 'entrar') {
      titleEl.textContent = 'Entrar';
      subEl.textContent = 'Acesse com o nome e a senha que você escolheu.';
      submitBtn.textContent = 'Entrar';
      switchText.textContent = 'Ainda não tem conta?';
      switchBtn.textContent = 'Criar conta';
    } else {
      titleEl.textContent = 'Criar conta';
      subEl.textContent = 'Escolha um nome — é ele que vai aparecer nos seus comentários.';
      submitBtn.textContent = 'Criar conta';
      switchText.textContent = 'Já tem conta?';
      switchBtn.textContent = 'Entrar';
    }
  }

  nameInput.addEventListener('input', () => {
    const v = nameInput.value.trim();
    avatarEl.textContent = v ? v[0].toUpperCase() : '?';
  });

  switchBtn.addEventListener('click', () => setMode(mode === 'entrar' ? 'cadastro' : 'entrar'));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = nameInput.value;
    const password = passwordInput.value;
    const result = mode === 'entrar' ? login(name, password) : register(name, password);

    if (result.ok) {
      dialog.close();
      form.reset();
      avatarEl.textContent = '?';
      setMode('entrar');
      renderAuthControl();
      refreshAccountDependentUI();
    } else if (result.error === 'notfound') {
      errorEl.innerHTML = `Não encontramos ninguém com esse nome. <button type="button" id="go-register-btn">Criar conta com esse nome</button>`;
      errorEl.querySelector('#go-register-btn').addEventListener('click', () => setMode('cadastro'));
    } else {
      errorEl.textContent = result.error;
    }
  });

  dialog.querySelector('.login-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    form.reset();
    avatarEl.textContent = '?';
    setMode('entrar');
  });
}

function openLoginModal() {
  ensureLoginModal();
  document.getElementById('login-modal').showModal();
}

/**
 * Como o progresso/XP agora é por conta (ver progress.js), trocar de conta
 * (login/cadastro/logout) precisa re-renderizar tudo que depende disso na
 * página atual — não só o badge do header. Sem isto, a tela de aulas (ou a
 * aula aberta) continuaria mostrando o progresso da conta anterior até um
 * F5, mesmo já estando logado como outra pessoa.
 */
function refreshAccountDependentUI() {
  renderHeaderStats();
  if (document.getElementById('lesson-root')) {
    initLessonPage();
  }
  if (document.getElementById('lesson-days')) {
    initLessonsPage();
    renderProgressSummary();
    renderContinueCard();
  }
  if (typeof adaptCta === 'function') {
    adaptCta();
  }
}

function renderAuthControl() {
  const el = document.getElementById('auth-control');
  if (!el) return;

  const session = getSession();

  if (!session) {
    el.innerHTML = `<button type="button" class="auth-btn" id="open-login-btn">Entrar</button>`;
    el.querySelector('#open-login-btn').addEventListener('click', openLoginModal);
    return;
  }

  el.innerHTML = `
    <span class="session-badge">
      <span class="mini-avatar">${escapeHtml(session.name[0].toUpperCase())}</span>
      <span class="session-name">${escapeHtml(session.name)}</span>
      <span class="role-tag ${session.role}">${session.role}</span>
      <button type="button" class="logout-link" id="logout-btn">sair</button>
    </span>`;

  el.querySelector('#logout-btn').addEventListener('click', () => {
    logout();
    renderAuthControl();
    refreshAccountDependentUI();
  });
}

/**
 * Retorna a próxima aula não concluída, na ordem da trilha, ou null se o
 * curso inteiro já foi concluído. Usado pelo botão "Continuar de onde parei".
 */
function getNextLessonId() {
  const completed = new Set(getState().completedLessons);
  const next = LESSONS.find((l) => !completed.has(l.id));
  return next ? next.id : null;
}

/* ---------------- Lista de aulas (aulas.html) ---------------- */

function renderContinueCard() {
  const el = document.getElementById('continue-card');
  if (!el) return;

  const summary = getProgressSummary(LESSONS.length);
  const nextId = getNextLessonId();

  if (!nextId) {
    el.innerHTML = `
      <div class="continue-info">
        <span class="continue-eyebrow">Curso concluído</span>
        <span class="continue-title">Você terminou as 20 aulas. Bom trabalho!</span>
      </div>
      <a class="continue-btn" href="aula.html?id=1">Revisar aula 1 →</a>`;
    return;
  }

  const nextLesson = getLessonById(nextId);
  const eyebrow = summary.completed === 0 ? 'Comece por aqui' : 'Continuar de onde parei';

  el.innerHTML = `
    <div class="continue-info">
      <span class="continue-eyebrow">${eyebrow}</span>
      <span class="continue-title">${nextLesson.title}</span>
    </div>
    <a class="continue-btn" href="aula.html?id=${nextLesson.id}">${summary.completed === 0 ? 'Começar' : 'Continuar'} →</a>`;
}

function initLessonsPage() {
  const container = document.getElementById('lesson-days');
  const byDay = getLessonsByDay();
  const loggedIn = !!getSession();

  container.innerHTML = Object.keys(byDay)
    .sort((a, b) => a - b)
    .map((day) => {
      const lessons = byDay[day];
      const items = lessons
        .map((lesson) => {
          const done = isLessonCompleted(lesson.id);
          const label = loggedIn
            ? `Marcar aula '${lesson.title}' como concluída`
            : `Faça login para marcar '${lesson.title}' como concluída`;
          return `
          <li class="lesson-row" data-lesson-id="${lesson.id}">
            <button class="lesson-dot ${done ? 'checked' : ''}"
                    aria-pressed="${done}"
                    aria-label="${label}"
                    title="${label}"
                    data-toggle="${lesson.id}">
              ${done ? CHECK_SVG : ''}
            </button>
            <a class="lesson-title-link" href="aula.html?id=${lesson.id}">${lesson.title}</a>
          </li>`;
        })
        .join('');

      return `
      <div class="day-block">
        <h2 class="day-heading">${DAY_LABELS[day]}</h2>
        <ul class="lesson-list">${items}</ul>
      </div>`;
    })
    .join('');

  // `initLessonsPage()` é chamada de novo a cada toggle (para re-renderizar a
  // lista). Sem esta guarda, os listeners abaixo seriam anexados de novo a
  // cada chamada — como ficam presos ao `container` (que nunca é recriado,
  // só o innerHTML dele), eles se acumulariam e cada clique futuro dispararia
  // o toggle múltiplas vezes.
  if (!container.dataset.listenersBound) {
    container.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-toggle]');
      if (!btn) return;

      if (!getSession()) {
        openLoginModal();
        return;
      }

      const id = Number(btn.dataset.toggle);
      toggleLesson(id);
      initLessonsPage();
      renderHeaderStats();
      renderProgressSummary();
      renderContinueCard();
    });

    container.addEventListener('keydown', (e) => {
      const btn = e.target.closest('[data-toggle]');
      if (!btn) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });

    container.dataset.listenersBound = 'true';
  }
}

function renderProgressSummary() {
  const summary = getProgressSummary(LESSONS.length);
  const textEl = document.getElementById('progress-text');
  const fillEl = document.getElementById('progress-fill');
  if (textEl) {
    textEl.innerHTML = `<strong>${summary.completed}/${summary.total}</strong> concluídas · nível ${summary.level}`;
  }
  if (fillEl) {
    const pct = summary.total ? (summary.completed / summary.total) * 100 : 0;
    fillEl.style.width = `${pct}%`;
  }
}

/* ---------------- Página de aula (aula.html) ---------------- */

function getLessonIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return Number(params.get('id')) || 1;
}

function renderVideoPlaceholder(videoUrl) {
  if (!videoUrl) {
    return `
    <div class="video-placeholder">
      <span class="play-icon" aria-hidden="true">▶</span>
      <span>Vídeo em breve</span>
    </div>`;
  }
  return `
  <div class="video-placeholder">
    <video controls src="${escapeHtml(videoUrl)}"></video>
  </div>`;
}

/**
 * Escapa uma string para uso seguro tanto em texto quanto dentro de atributos
 * HTML delimitados por aspas (ex: `src="${escapeHtml(url)}"`). A técnica
 * anterior (textContent -> innerHTML) escapava `< > &` mas NÃO escapava `"`,
 * o que permitia quebrar para fora de um atributo `src="..."`/`value="..."`
 * — corrigido escapando também aspas simples e duplas.
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderComments(lessonId) {
  const listEl = document.getElementById('comment-list');
  const comments = getComments(lessonId);
  const admin = isAdmin();

  listEl.innerHTML = comments.length
    ? comments
        .slice()
        .reverse()
        .map(
          (c) => `
        <li class="comment-item">
          ${admin ? `<button type="button" class="comment-delete-btn" data-delete-comment="${c.id}" title="Excluir comentário (admin)">🗑</button>` : ''}
          <span class="comment-author">${escapeHtml(c.authorName || 'Anônimo')}</span>
          <p>${escapeHtml(c.text)}</p>
          <time datetime="${c.createdAt}">${new Date(c.createdAt).toLocaleString('pt-BR')}</time>
        </li>`
        )
        .join('')
    : `<li class="comment-item">Nenhum comentário ainda. Seja o primeiro a comentar!</li>`;

  if (admin) {
    listEl.querySelectorAll('[data-delete-comment]').forEach((btn) => {
      btn.addEventListener('click', () => {
        deleteComment(Number(btn.dataset.deleteComment));
        renderComments(lessonId);
        const voteEl = document.getElementById('post-vote-count');
        if (voteEl) voteEl.textContent = getComments(lessonId).length;
      });
    });
  }
}

/**
 * Progresso do dia ao qual a aula pertence: quantas aulas daquele dia já
 * foram concluídas, sobre o total de aulas do dia. Usado no badge
 * "N de M aulas" do post de cada aula.
 */
function getDayProgress(day) {
  const dayLessons = LESSONS.filter((l) => l.day === day);
  const completed = new Set(getState().completedLessons);
  const done = dayLessons.filter((l) => completed.has(l.id)).length;
  return { done, total: dayLessons.length };
}

/**
 * Post de contexto exibido embaixo do vídeo de cada aula, no estilo de post
 * de fórum (autor, badges, votos, aviso e seção recolhível), inspirado na
 * apresentação visual de plataformas como o curso.dev. Conteúdo é
 * personalizado por aula: a primeira aula recebe uma mensagem de boas-vindas;
 * as demais, um convite a praticar/comentar específico daquela aula.
 */
function renderWelcomePost(lesson) {
  const progress = getDayProgress(lesson.day);
  const commentCount = getComments(lesson.id).length;
  const isFirst = lesson.id === 1;
  const priorLessons = LESSONS.filter((l) => l.id < lesson.id);

  const title = isFirst ? 'Bem-vindo(a)!' : `Sobre esta aula: ${escapeHtml(lesson.title)}`;

  const bodyHtml = isFirst
    ? `<p>Seja muito bem-vindo(a) ou bem-vinda à primeira aula do <strong>core.php</strong>! 🎉🤝👍</p>
       <p>Esta primeira aula serve para você:</p>
       <ol>
         <li><strong>Aquecer os motores</strong></li>
         <li>Fazer o seu <strong>primeiro comentário</strong></li>
         <li>E coletar os seus primeiros <strong>Pontos de Experiência (XP)</strong> ao marcar a aula como <strong>concluída</strong>.</li>
       </ol>`
    : `<p>${escapeHtml(lesson.summary)}</p>
       <p>Depois de assistir o vídeo (ou revisar o material acima), aproveite para:</p>
       <ol>
         <li>Rodar o <strong>exemplo de código</strong> na sua máquina</li>
         <li>Deixar um <strong>comentário</strong> aqui embaixo, com dúvida ou resultado</li>
         <li>Marcar a aula como <strong>concluída</strong> e coletar mais <strong>+10 XP</strong></li>
       </ol>`;

  const detailsBody =
    priorLessons.length === 0
      ? `<p>Como esta é a primeira aula, ainda não há nada para revisar — a lista vai crescendo a cada dia de estudo.</p>`
      : `<p>Até aqui, o curso já passou por:</p>
         <ul>${priorLessons.map((l) => `<li>${escapeHtml(l.title)}</li>`).join('')}</ul>`;

  return `
  <div class="welcome-post">
    <div class="vote-col">
      <span class="vote-arrow">▲</span>
      <span class="vote-count" id="post-vote-count">${commentCount}</span>
    </div>
    <div class="post-main">
      <div class="badge-row">
        <span class="badge badge-user">@equipe.php</span>
        <span class="badge badge-role">instrutor</span>
        <span class="badge badge-day">${DAY_LABELS[lesson.day]}</span>
        <span class="badge badge-progress"><span class="dot">●</span> <span id="post-progress-count">${progress.done}</span> de ${progress.total} aulas</span>
      </div>

      <h2>${title}</h2>

      <div class="post-body">${bodyHtml}</div>

      <details class="post-details">
        <summary>Clique aqui para visualizar quais Tecnologias e Assuntos já foram abordados no curso até o momento 💪💪💪</summary>
        <div class="details-body">${detailsBody}</div>
      </details>
    </div>
  </div>`;
}

function initLessonPage() {
  const id = getLessonIdFromUrl();
  const lesson = getEffectiveLesson(id);
  const admin = isAdmin();

  if (!lesson) {
    document.getElementById('lesson-root').innerHTML = '<p>Aula não encontrada.</p>';
    return;
  }

  document.title = `${lesson.title} — core.php`;

  document.getElementById('lesson-root').innerHTML = `
    <p class="lesson-breadcrumb"><a href="aulas.html">Aulas</a> / ${DAY_LABELS[lesson.day]}</p>

    <div class="lesson-header">
      <h1>${lesson.title}</h1>
      <p class="lesson-meta">${DAY_LABELS[lesson.day]} · Aula ${lesson.id} de ${LESSONS.length}</p>
    </div>

    <section class="lesson-section">
      <h2>Explicação${admin ? '<button type="button" class="admin-edit-btn" id="edit-explanation-btn">✏️ Editar</button>' : ''}</h2>
      <div id="explanation-display">
        ${lesson.explanation
          .split('\n\n')
          .map((p) => `<p>${escapeHtml(p).replace(/\n/g, ' ')}</p>`)
          .join('')}
      </div>
    </section>

    <section class="lesson-section">
      <h2>Exemplo de código</h2>
      <pre class="code-block"><code>${escapeHtml(lesson.code)}</code></pre>
    </section>

    <section class="lesson-section">
      <h2>Vídeo da aula${admin ? '<button type="button" class="admin-edit-btn" id="edit-video-btn">✏️ Editar vídeo</button>' : ''}</h2>
      <div id="video-display">${renderVideoPlaceholder(lesson.video_url)}</div>
    </section>

    ${renderWelcomePost(lesson)}

    <section class="lesson-section">
      <h2>Agora tente você</h2>
      <div class="challenge-box"><strong>Desafio:</strong> ${escapeHtml(lesson.challenge)}</div>
    </section>

    <div class="lesson-actions">
      <button id="complete-btn" class="complete-btn"></button>
      <div class="nav-buttons">
        <a class="nav-btn" id="prev-btn" href="#">← Anterior</a>
        <a class="nav-btn" id="next-btn" href="#">Próxima →</a>
      </div>
    </div>

    <section class="lesson-section forum-section">
      <h2>Comentários desta aula</h2>
      <p class="forum-hint">Visíveis só aqui, em "${escapeHtml(lesson.title)}". Comentar rende 1 ponto de participação no fórum.</p>
      ${
        getSession()
          ? `<form id="comment-form" class="comment-form">
               <label class="sr-only" for="comment-text">Seu comentário</label>
               <textarea id="comment-text" placeholder="Escreva um comentário sobre esta aula..." required></textarea>
               <button type="submit">Comentar</button>
             </form>`
          : `<div class="comment-login-prompt">
               <span>Faça login para comentar — seu nome aparece junto do comentário.</span>
               <button type="button" class="auth-btn" id="comment-login-btn">Entrar</button>
             </div>`
      }
      <ul id="comment-list" class="comment-list"></ul>
    </section>
  `;

  function updateCompleteButton() {
    const btn = document.getElementById('complete-btn');
    if (!getSession()) {
      btn.textContent = 'Entrar para marcar como concluída';
      btn.classList.remove('done');
      btn.setAttribute('aria-pressed', 'false');
      return;
    }
    const done = isLessonCompleted(lesson.id);
    btn.textContent = done ? '✓ Aula concluída' : 'Marcar como concluída (+10 XP)';
    btn.classList.toggle('done', done);
    btn.setAttribute('aria-pressed', String(done));
  }
  updateCompleteButton();

  if (admin) {
    const editExplanationBtn = document.getElementById('edit-explanation-btn');
    if (editExplanationBtn) {
      editExplanationBtn.addEventListener('click', () => {
        document.getElementById('explanation-display').innerHTML = `
          <div class="admin-edit-form">
            <textarea id="explanation-edit-area">${escapeHtml(lesson.explanation)}</textarea>
            <div class="admin-edit-actions">
              <button type="button" class="save-btn" id="save-explanation-btn">Salvar</button>
              <button type="button" class="cancel-btn" id="cancel-explanation-btn">Cancelar</button>
            </div>
          </div>`;
        document.getElementById('save-explanation-btn').addEventListener('click', () => {
          const newText = document.getElementById('explanation-edit-area').value;
          saveContentOverride(lesson.id, { explanation: newText });
          initLessonPage();
        });
        document.getElementById('cancel-explanation-btn').addEventListener('click', initLessonPage);
      });
    }

    const editVideoBtn = document.getElementById('edit-video-btn');
    if (editVideoBtn) {
      editVideoBtn.addEventListener('click', () => {
        document.getElementById('video-display').innerHTML = `
          <div class="admin-edit-form">
            <input type="text" id="video-url-edit" placeholder="https://..." value="${lesson.video_url ? escapeHtml(lesson.video_url) : ''}">
            <div class="admin-edit-actions">
              <button type="button" class="save-btn" id="save-video-btn">Salvar</button>
              <button type="button" class="cancel-btn" id="cancel-video-btn">Cancelar</button>
            </div>
          </div>`;
        document.getElementById('save-video-btn').addEventListener('click', () => {
          const newUrl = document.getElementById('video-url-edit').value.trim();
          saveContentOverride(lesson.id, { video_url: newUrl || null });
          initLessonPage();
        });
        document.getElementById('cancel-video-btn').addEventListener('click', initLessonPage);
      });
    }
  }

  document.getElementById('complete-btn').addEventListener('click', () => {
    if (!getSession()) {
      openLoginModal();
      return;
    }
    toggleLesson(lesson.id);
    updateCompleteButton();
    renderHeaderStats();
    renderContinueCard();

    const progressEl = document.getElementById('post-progress-count');
    if (progressEl) progressEl.textContent = getDayProgress(lesson.day).done;
  });

  const prevLesson = getLessonById(lesson.id - 1);
  const nextLesson = getLessonById(lesson.id + 1);
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  if (prevLesson) prevBtn.href = `aula.html?id=${prevLesson.id}`;
  else prevBtn.setAttribute('aria-disabled', 'true');
  if (nextLesson) nextBtn.href = `aula.html?id=${nextLesson.id}`;
  else nextBtn.setAttribute('aria-disabled', 'true');

  renderComments(lesson.id);

  const commentForm = document.getElementById('comment-form');
  if (commentForm) {
    commentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const textarea = document.getElementById('comment-text');
      const result = postComment(lesson.id, textarea.value);
      if (result.ok) {
        textarea.value = '';
        renderComments(lesson.id);
        renderHeaderStats();

        const voteEl = document.getElementById('post-vote-count');
        if (voteEl) voteEl.textContent = getComments(lesson.id).length;
      } else {
        alert(result.error);
      }
    });
  }

  const commentLoginBtn = document.getElementById('comment-login-btn');
  if (commentLoginBtn) commentLoginBtn.addEventListener('click', openLoginModal);
}
