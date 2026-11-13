/**
 * forum.js — comentários do fórum e sistema de créditos.
 *
 * Diferente do progresso (XP/aulas concluídas, em progress.js), os
 * comentários são conteúdo COMPARTILHADO entre todas as contas do
 * navegador — guardados numa chave própria (`corephp:comments`), separada do
 * progresso de cada conta, para que todo mundo continue vendo os comentários
 * de todo mundo na mesma aula, independente de quem está logado agora.
 *
 * Os créditos de comentário (`forumCredits`), por outro lado, são pessoais
 * (ver progress.js) — cada conta tem os seus.
 *
 * Regra de crédito (decidida pelo Tech Lead, ver TEAM_NOTES.md):
 * todo aluno começa com 1 crédito. Cada comentário: debita 1 crédito, salva
 * o comentário, credita 1 crédito de volta. Isso garante que a transação de
 * débito/crédito é real e testável, sem nunca bloquear a participação do
 * aluno em uso normal.
 */

const COMMENTS_KEY = 'corephp:comments';

function getSharedComments() {
  try {
    const raw = localStorage.getItem(COMMENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveSharedComments(comments) {
  try {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
  } catch (e) {
    // localStorage cheio/bloqueado: falha silenciosamente.
  }
}

function getComments(lessonId) {
  return getSharedComments().filter((c) => c.lessonId === lessonId);
}

/**
 * @returns {{ok: boolean, error?: string, state: object}}
 */
function postComment(lessonId, text) {
  const trimmed = (text || '').trim();
  if (!trimmed) {
    return { ok: false, error: 'Escreva algo antes de comentar.', state: getState() };
  }

  const session = getSession();
  if (!session) {
    return { ok: false, error: 'Faça login para comentar.', state: getState() };
  }

  const state = getState(); // progresso da conta logada (é dali que sai o crédito)

  if (state.forumCredits < 1) {
    // Salvaguarda: não deveria ocorrer no fluxo normal (crédito é sempre reposto).
    return { ok: false, error: 'Sem créditos de comentário no momento.', state };
  }

  // 1. debita (do progresso pessoal da conta logada)
  state.forumCredits -= 1;

  // 2. persiste o comentário no armazenamento compartilhado, vinculado ao
  // nome escolhido no login (Date.now() sozinho pode colidir se dois
  // comentários forem postados no mesmo milissegundo; somar uma fração
  // aleatória evita isso mantendo o id numérico, como o resto do código
  // espera ao comparar/excluir por id).
  const comments = getSharedComments();
  comments.push({
    id: Date.now() + Math.random(),
    lessonId,
    text: trimmed,
    authorName: session.name,
    createdAt: new Date().toISOString(),
  });
  saveSharedComments(comments);

  // 3. credita de volta (recompensa por participar)
  state.forumCredits += 1;

  saveState(state);
  return { ok: true, state };
}

/**
 * O comentário é "de quem está logado" quando o nome do autor bate com o nome
 * da conta da sessão (sem diferenciar maiúsculas, como auth.js faz com
 * contas). Comentários antigos sem `authorName` não pertencem a ninguém.
 */
function isCommentAuthor(comment) {
  const session = getSession();
  if (!session || !comment || !comment.authorName) return false;
  return comment.authorName.trim().toLowerCase() === session.name.trim().toLowerCase();
}

/** Só o próprio autor edita o texto — nem o admin reescreve comentário alheio. */
function canEditComment(comment) {
  return isCommentAuthor(comment);
}

/** O autor exclui o próprio comentário; o admin exclui qualquer um (moderação). */
function canDeleteComment(comment) {
  return isCommentAuthor(comment) || isAdmin();
}

/**
 * Remove um comentário (o próprio autor ou o admin). Não mexe em
 * forumCredits — o crédito já foi devolvido no momento da postagem, então
 * apagar um comentário não deve puni-lo nem beneficiá-lo de novo.
 *
 * @returns {{ok: boolean, error?: string}}
 */
function deleteComment(commentId) {
  const comments = getSharedComments();
  const target = comments.find((c) => c.id === commentId);
  if (!target) return { ok: false, error: 'Comentário não encontrado.' };
  if (!canDeleteComment(target)) {
    return { ok: false, error: 'Você só pode excluir os seus próprios comentários.' };
  }
  saveSharedComments(comments.filter((c) => c.id !== commentId));
  return { ok: true };
}

/**
 * Troca o texto de um comentário (só o próprio autor). Registra `editedAt`
 * para a UI poder sinalizar que o comentário foi editado.
 *
 * @returns {{ok: boolean, error?: string}}
 */
function editComment(commentId, text) {
  const trimmed = (text || '').trim();
  if (!trimmed) return { ok: false, error: 'Escreva algo antes de salvar.' };

  const comments = getSharedComments();
  const target = comments.find((c) => c.id === commentId);
  if (!target) return { ok: false, error: 'Comentário não encontrado.' };
  if (!canEditComment(target)) {
    return { ok: false, error: 'Você só pode editar os seus próprios comentários.' };
  }

  if (target.text !== trimmed) {
    target.text = trimmed;
    target.editedAt = new Date().toISOString();
    saveSharedComments(comments);
  }
  return { ok: true };
}
