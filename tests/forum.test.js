'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { createApp, toPlain } = require('./helpers/loadApp');

test('comentar com texto vazio é bloqueado e não mexe em créditos', () => {
  const app = createApp();
  app.register('Daniel', 'senha123');

  const result = app.postComment(1, '   ');
  assert.equal(result.ok, false);
  assert.equal(result.error, 'Escreva algo antes de comentar.');
  assert.equal(app.getComments(1).length, 0);
  assert.equal(app.getState().forumCredits, 1);
});

test('sem sessão, comentar é bloqueado com pedido de login', () => {
  const app = createApp();
  const result = app.postComment(1, 'Ótima aula!');
  assert.equal(result.ok, false);
  assert.equal(result.error, 'Faça login para comentar.');
  assert.equal(app.getComments(1).length, 0);
});

test('comentário válido é salvo, vinculado ao nome da conta logada', () => {
  const app = createApp();
  app.register('Marina', 'senha123');

  const result = app.postComment(1, 'Dúvida sobre a aula 1');
  assert.equal(result.ok, true);

  const comments = app.getComments(1);
  assert.equal(comments.length, 1);
  assert.equal(comments[0].text, 'Dúvida sobre a aula 1');
  assert.equal(comments[0].authorName, 'Marina');
  assert.equal(comments[0].lessonId, 1);
});

test('crédito de comentário é debitado e devolvido (fica em 1 antes e depois)', () => {
  const app = createApp();
  app.register('Daniel', 'senha123');

  assert.equal(app.getState().forumCredits, 1);
  const result = app.postComment(1, 'Comentário de teste');
  assert.equal(result.ok, true);
  assert.equal(result.state.forumCredits, 1);
  assert.equal(app.getState().forumCredits, 1);
});

test('forumCredits nunca fica negativo mesmo após vários comentários', () => {
  const app = createApp();
  app.register('Daniel', 'senha123');

  for (let i = 0; i < 5; i++) {
    const result = app.postComment(1, `Comentário ${i}`);
    assert.equal(result.ok, true);
    assert.ok(result.state.forumCredits >= 0);
  }
  assert.equal(app.getComments(1).length, 5);
});

test('comentários são isolados por aula (lessonId)', () => {
  const app = createApp();
  app.register('Daniel', 'senha123');

  app.postComment(1, 'Comentário na aula 1');
  app.postComment(2, 'Comentário na aula 2');

  assert.equal(app.getComments(1).length, 1);
  assert.equal(app.getComments(2).length, 1);
  assert.equal(app.getComments(1)[0].text, 'Comentário na aula 1');
  assert.equal(app.getComments(2)[0].text, 'Comentário na aula 2');
});

test('comentários são compartilhados entre contas diferentes (não isolados por usuário)', () => {
  const app = createApp();

  app.register('Rafael', 'senha123');
  app.postComment(1, 'Comentário do Rafael');

  app.register('Daniel', 'senha456');
  app.postComment(1, 'Comentário do Daniel');

  const comments = app.getComments(1);
  assert.equal(comments.length, 2);
  const authors = toPlain(comments.map((c) => c.authorName)).sort();
  assert.deepEqual(authors, ['Daniel', 'Rafael']);
});

test('deleteComment remove o comentário sem afetar forumCredits', () => {
  const app = createApp();
  app.register('Daniel', 'senha123');
  app.postComment(1, 'Comentário a ser apagado');

  const [comment] = app.getComments(1);
  const creditsBefore = app.getState().forumCredits;

  app.deleteComment(comment.id);

  assert.equal(app.getComments(1).length, 0);
  assert.equal(app.getState().forumCredits, creditsBefore);
});
