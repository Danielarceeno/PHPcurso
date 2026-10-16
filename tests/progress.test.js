'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { createApp, toPlain } = require('./helpers/loadApp');

test('sem sessão, completar aula não dá XP nem marca conclusão', () => {
  const app = createApp();
  const state = app.completeLesson(1);
  assert.equal(state.xp, 0);
  assert.deepEqual(toPlain(state.completedLessons), []);
});

test('logado, completar uma aula dá +10 XP e marca como concluída', () => {
  const app = createApp();
  app.register('Daniel', 'senha123');
  const state = app.completeLesson(1);
  assert.equal(state.xp, 10);
  assert.deepEqual(toPlain(state.completedLessons), [1]);
});

test('XP não duplica: completar a mesma aula duas vezes soma XP uma única vez', () => {
  const app = createApp();
  app.register('Daniel', 'senha123');
  app.completeLesson(1);
  const state = app.completeLesson(1);
  assert.equal(state.xp, 10);
  assert.deepEqual(toPlain(state.completedLessons), [1]);
});

test('desmarcar uma aula concluída remove os 10 XP correspondentes', () => {
  const app = createApp();
  app.register('Daniel', 'senha123');
  app.completeLesson(1);
  const state = app.uncompleteLesson(1);
  assert.equal(state.xp, 0);
  assert.deepEqual(toPlain(state.completedLessons), []);
});

test('XP nunca fica negativo ao desmarcar uma aula não concluída', () => {
  const app = createApp();
  app.register('Daniel', 'senha123');
  const state = app.uncompleteLesson(1);
  assert.equal(state.xp, 0);
});

test('toggleLesson alterna entre concluir e desmarcar', () => {
  const app = createApp();
  app.register('Daniel', 'senha123');
  const afterFirst = app.toggleLesson(5);
  assert.deepEqual(toPlain(afterFirst.completedLessons), [5]);
  assert.equal(afterFirst.xp, 10);

  const afterSecond = app.toggleLesson(5);
  assert.deepEqual(toPlain(afterSecond.completedLessons), []);
  assert.equal(afterSecond.xp, 0);
});

test('XP é isolado por conta: progresso de uma conta não vaza para outra', () => {
  const app = createApp();

  app.register('Rafael', 'senha123');
  app.completeLesson(1);
  app.completeLesson(2);

  app.register('Daniel', 'senha456');
  app.completeLesson(3);

  const danielState = app.getState();
  assert.equal(danielState.xp, 10);
  assert.deepEqual(toPlain(danielState.completedLessons), [3]);

  app.login('Rafael', 'senha123');
  const rafaelState = app.getState();
  assert.equal(rafaelState.xp, 20);
  assert.deepEqual(toPlain(rafaelState.completedLessons), [1, 2]);
});

test('getLevelLabel reflete as faixas de XP documentadas', () => {
  const app = createApp();
  assert.equal(app.getLevelLabel(0), 'Iniciante');
  assert.equal(app.getLevelLabel(49), 'Iniciante');
  assert.equal(app.getLevelLabel(50), 'Aprendiz');
  assert.equal(app.getLevelLabel(99), 'Aprendiz');
  assert.equal(app.getLevelLabel(100), 'Intermediário');
  assert.equal(app.getLevelLabel(149), 'Intermediário');
  assert.equal(app.getLevelLabel(150), 'Avançado');
});

test('getProgressSummary agrega concluídas, total, xp, nível e créditos', () => {
  const app = createApp();
  app.register('Daniel', 'senha123');
  app.completeLesson(1);
  app.completeLesson(2);

  const summary = app.getProgressSummary(20);
  assert.equal(summary.completed, 2);
  assert.equal(summary.total, 20);
  assert.equal(summary.xp, 20);
  assert.equal(summary.level, 'Iniciante');
  assert.equal(summary.forumCredits, 1);
});
