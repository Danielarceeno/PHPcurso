/**
 * content.js — edições de admin sobre o conteúdo das aulas (v1, sem backend).
 *
 * js/data.js continua sendo a fonte "oficial" de conteúdo. Edições feitas
 * pelo admin (descrição, URL do vídeo) são guardadas separadamente como
 * "overrides" em localStorage e mescladas por cima da aula original na hora
 * de exibir. Isso evita mutar LESSONS diretamente e deixa claro o que é
 * conteúdo original vs. editado.
 *
 * Limitação conhecida (documentada em TEAM_NOTES.md): por não haver backend,
 * essas edições ficam só no navegador de quem editou — não são vistas por
 * outros alunos. Corrigir isso é parte do plano de v2 (backend real).
 */

const CONTENT_OVERRIDES_KEY = 'corephp:contentOverrides';

function getContentOverrides() {
  try {
    const raw = localStorage.getItem(CONTENT_OVERRIDES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveContentOverride(lessonId, patch) {
  const all = getContentOverrides();
  all[lessonId] = { ...(all[lessonId] || {}), ...patch };
  try {
    localStorage.setItem(CONTENT_OVERRIDES_KEY, JSON.stringify(all));
  } catch (e) {
    // localStorage cheio/bloqueado: falha silenciosamente em vez de quebrar
    // o handler de "Salvar" no meio da execução.
  }
}

/**
 * Retorna a aula com as edições de admin já aplicadas por cima do conteúdo
 * original de js/data.js.
 */
function getEffectiveLesson(lessonId) {
  const base = getLessonById(lessonId);
  if (!base) return null;
  const override = getContentOverrides()[lessonId];
  return override ? { ...base, ...override } : base;
}
