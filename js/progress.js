/**
 * progress.js — progresso do aluno, XP e níveis, vinculados à conta logada.
 *
 * Cada conta (ver auth.js) tem seu próprio progresso, guardado sob uma chave
 * de localStorage própria (`corephp:progress:<nome>`). Sem login, o
 * progresso vai para uma conta "guest" separada — assim que a pessoa cria ou
 * entra numa conta, o app passa a ler/gravar o progresso daquela conta
 * especificamente: o XP e as aulas concluídas de "Rafael" nunca aparecem
 * para "Daniel", e vice-versa, mesmo no mesmo navegador.
 *
 * (Comentários do fórum NÃO ficam aqui — são conteúdo compartilhado entre
 * todas as contas do navegador, e vivem em `corephp:comments`, gerenciado
 * por forum.js. Só XP/aulas concluídas/créditos são pessoais.)
 *
 * v1: persistência em localStorage. v2: trocar o corpo de cada função por
 * chamadas fetch() a uma API real, mantendo as mesmas assinaturas.
 */

const PROGRESS_KEY_PREFIX = 'corephp:progress:';
const XP_PER_LESSON = 10;

const XP_LEVELS = [
  { min: 0, label: 'Iniciante' },
  { min: 50, label: 'Aprendiz' },
  { min: 100, label: 'Intermediário' },
  { min: 150, label: 'Avançado' },
];

/** Chave de localStorage do progresso da conta atualmente logada (ou "guest"
 * se ninguém estiver logado). */
function getProgressKey() {
  const session = typeof getSession === 'function' ? getSession() : null;
  const account = session ? session.name.trim().toLowerCase() : 'guest';
  return PROGRESS_KEY_PREFIX + account;
}

function defaultState() {
  return {
    completedLessons: [],
    xp: 0,
    forumCredits: 1,
  };
}

function getState() {
  // TODO v2: substituir por `await fetch('/api/me').then(r => r.json())`
  try {
    const raw = localStorage.getItem(getProgressKey());
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return { ...defaultState(), ...parsed };
  } catch (e) {
    return defaultState();
  }
}

function saveState(state) {
  // TODO v2: substituir por `await fetch('/api/progress', { method: 'POST', body: ... })`
  try {
    localStorage.setItem(getProgressKey(), JSON.stringify(state));
  } catch (e) {
    // localStorage cheio/bloqueado: falha silenciosamente (mesma postura
    // defensiva de getState) em vez de quebrar o handler que chamou isto.
  }
}

function isLessonCompleted(lessonId) {
  return getState().completedLessons.includes(lessonId);
}

/**
 * Marca uma aula como concluída. Idempotente: XP só é concedido na
 * transição não-concluído -> concluído (nunca duas vezes para a mesma aula).
 * Exige login: sem sessão ativa, não há conta para guardar o XP, então a
 * conclusão é ignorada (mesma regra já aplicada a comentários em forum.js).
 */
function completeLesson(lessonId) {
  const session = typeof getSession === 'function' ? getSession() : null;
  if (!session) {
    return getState();
  }

  const state = getState();
  if (state.completedLessons.includes(lessonId)) {
    return state; // já concluída, sem XP duplicado
  }
  state.completedLessons.push(lessonId);
  state.xp += XP_PER_LESSON;
  saveState(state);
  return state;
}

function uncompleteLesson(lessonId) {
  const state = getState();
  const idx = state.completedLessons.indexOf(lessonId);
  if (idx === -1) return state;
  state.completedLessons.splice(idx, 1);
  state.xp = Math.max(0, state.xp - XP_PER_LESSON);
  saveState(state);
  return state;
}

function toggleLesson(lessonId) {
  return isLessonCompleted(lessonId) ? uncompleteLesson(lessonId) : completeLesson(lessonId);
}

function getLevelLabel(xp) {
  let label = XP_LEVELS[0].label;
  for (const level of XP_LEVELS) {
    if (xp >= level.min) label = level.label;
  }
  return label;
}

function getProgressSummary(totalLessons) {
  const state = getState();
  return {
    completed: state.completedLessons.length,
    total: totalLessons,
    xp: state.xp,
    level: getLevelLabel(state.xp),
    forumCredits: state.forumCredits,
  };
}
