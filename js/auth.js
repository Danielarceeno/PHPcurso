/**
 * auth.js — contas e sessão de login simulados no navegador (v1, sem backend).
 *
 * Painel único: não existe "login de aluno" e "login de admin" separados —
 * é sempre nome + senha contra uma lista de contas guardada em localStorage.
 * O único jeito de virar admin é logar com a conta admin já existente
 * (semeada abaixo); qualquer cadastro novo feito pelo painel de "Criar conta"
 * sempre nasce como aluno.
 *
 * IMPORTANTE: isto NÃO é autenticação segura (senhas em texto puro, contas
 * guardadas no navegador de quem cadastrou). Serve para prototipar o fluxo
 * enquanto não há um backend real. Ver TEAM_NOTES.md para o plano de v2.
 */

const SESSION_KEY = 'corephp:session';
const USERS_KEY = 'corephp:users';
const SEED_ADMIN = { name: 'admin', password: 'corephp123', role: 'admin' };

/** Escreve em localStorage sem deixar uma exceção (storage cheio/bloqueado)
 * quebrar o fluxo de quem chamou — mesma postura defensiva já usada nas
 * leituras (getUsers/getSession). */
function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    // ignorado de propósito
  }
}

function getUsers() {
  let users;
  try {
    const raw = localStorage.getItem(USERS_KEY);
    users = raw ? JSON.parse(raw) : [];
  } catch (e) {
    users = [];
  }
  if (!users.some((u) => u.name.toLowerCase() === SEED_ADMIN.name)) {
    users.push(SEED_ADMIN);
    safeSetItem(USERS_KEY, JSON.stringify(users));
  }
  return users;
}

function findUser(name) {
  const normalized = (name || '').trim().toLowerCase();
  if (!normalized) return null;
  return getUsers().find((u) => u.name.toLowerCase() === normalized) || null;
}

function saveSession(user) {
  const session = { name: user.name, role: user.role };
  safeSetItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function isAdmin() {
  const session = getSession();
  return !!session && session.role === 'admin';
}

/**
 * @returns {{ok: true, session: object} | {ok: false, error: string}}
 * `error === 'notfound'` é um caso especial: a UI usa isso para oferecer
 * "criar conta com esse nome" em vez de só mostrar um erro genérico.
 */
function login(name, password) {
  const trimmedName = (name || '').trim();
  if (!trimmedName || !password) return { ok: false, error: 'Preencha nome e senha.' };

  const user = findUser(trimmedName);
  if (!user) return { ok: false, error: 'notfound' };
  if (user.password !== password) return { ok: false, error: 'Senha incorreta.' };

  return { ok: true, session: saveSession(user) };
}

function register(name, password) {
  const trimmedName = (name || '').trim();
  if (!trimmedName || !password) return { ok: false, error: 'Preencha nome e senha.' };
  if (password.length < 4) return { ok: false, error: 'A senha precisa ter pelo menos 4 caracteres.' };
  if (findUser(trimmedName)) return { ok: false, error: 'Esse nome já está em uso. Tente entrar ou escolha outro nome.' };

  const users = getUsers();
  const newUser = { name: trimmedName, password, role: 'aluno' };
  users.push(newUser);
  safeSetItem(USERS_KEY, JSON.stringify(users));

  return { ok: true, session: saveSession(newUser) };
}

function logout() {
  localStorage.removeItem(SESSION_KEY);
}
