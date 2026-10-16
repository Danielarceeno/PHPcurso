'use strict';

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

/**
 * localStorage mínimo compatível com a API usada por auth.js/progress.js/
 * forum.js (getItem/setItem/removeItem), isolado por instância — cada
 * chamada a createApp() parte de um armazenamento vazio, simulando um
 * navegador novo/sem dados salvos.
 */
class MemoryLocalStorage {
  constructor() {
    this.store = new Map();
  }
  getItem(key) {
    return this.store.has(key) ? this.store.get(key) : null;
  }
  setItem(key, value) {
    this.store.set(key, String(value));
  }
  removeItem(key) {
    this.store.delete(key);
  }
}

const JS_DIR = path.join(__dirname, '..', '..', 'js');

/**
 * Carrega auth.js, progress.js e forum.js (código real do app, sem
 * reimplementar a lógica) num sandbox de vm com localStorage mockado, e
 * devolve o contexto com todas as funções globais que eles definem
 * (login, register, getSession, completeLesson, postComment, etc.).
 */
function createApp() {
  const context = {
    localStorage: new MemoryLocalStorage(),
    console,
  };
  vm.createContext(context);

  for (const file of ['auth.js', 'progress.js', 'forum.js']) {
    const code = fs.readFileSync(path.join(JS_DIR, file), 'utf8');
    vm.runInContext(code, context, { filename: file });
  }

  return context;
}

/**
 * auth.js/progress.js/forum.js rodam num realm de vm separado (vm.createContext),
 * isolado de propósito para não vazar globals entre testes. Efeito colateral:
 * arrays/objetos que saem de lá têm um Array/Object "estrangeiro" ao realm
 * principal do Node, e `assert.deepEqual` (que compara protótipos) os
 * considera diferentes mesmo com o mesmo conteúdo. `toPlain` normaliza o
 * valor de volta para Array/Object do realm principal antes da asserção.
 */
function toPlain(value) {
  return JSON.parse(JSON.stringify(value));
}

module.exports = { createApp, toPlain };
