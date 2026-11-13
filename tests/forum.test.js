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

test('o autor pode excluir o próprio comentário', () => {
  const app = createApp();
  app.register('Daniel', 'senha123');
  app.postComment(1, 'Meu comentário');
  const [comment] = app.getComments(1);

  assert.equal(app.canDeleteComment(comment), true);
  assert.equal(app.deleteComment(comment.id).ok, true);
  assert.equal(app.getComments(1).length, 0);
});

test('outro aluno não pode excluir nem editar comentário alheio', () => {
  const app = createApp();
  app.register('Rafael', 'senha123');
  app.postComment(1, 'Comentário do Rafael');
  const [comment] = app.getComments(1);

  app.register('Daniel', 'senha456');
  assert.equal(app.canDeleteComment(comment), false);
  assert.equal(app.canEditComment(comment), false);

  const del = app.deleteComment(comment.id);
  assert.equal(del.ok, false);
  assert.equal(del.error, 'Você só pode excluir os seus próprios comentários.');

  const edit = app.editComment(comment.id, 'Texto trocado por outra pessoa');
  assert.equal(edit.ok, false);
  assert.equal(edit.error, 'Você só pode editar os seus próprios comentários.');

  assert.equal(app.getComments(1)[0].text, 'Comentário do Rafael');
});

test('sem sessão, não dá para excluir nem editar comentário', () => {
  const app = createApp();
  app.register('Daniel', 'senha123');
  app.postComment(1, 'Meu comentário');
  const [comment] = app.getComments(1);
  app.logout();

  assert.equal(app.deleteComment(comment.id).ok, false);
  assert.equal(app.editComment(comment.id, 'Outro texto').ok, false);
  assert.equal(app.getComments(1)[0].text, 'Meu comentário');
});

test('admin exclui comentário de qualquer aluno, mas não edita', () => {
  const app = createApp();
  app.register('Rafael', 'senha123');
  app.postComment(1, 'Comentário do Rafael');
  const [comment] = app.getComments(1);

  app.login('admin', 'corephp123');
  assert.equal(app.canEditComment(comment), false);
  assert.equal(app.editComment(comment.id, 'Reescrito pelo admin').ok, false);
  assert.equal(app.getComments(1)[0].text, 'Comentário do Rafael');

  assert.equal(app.canDeleteComment(comment), true);
  assert.equal(app.deleteComment(comment.id).ok, true);
  assert.equal(app.getComments(1).length, 0);
});

test('autor edita o próprio comentário: texto muda e fica marcado como editado', () => {
  const app = createApp();
  app.register('Daniel', 'senha123');
  app.postComment(1, 'Texto original');
  const [comment] = app.getComments(1);
  assert.equal(comment.editedAt, undefined);

  const result = app.editComment(comment.id, '  Texto corrigido  ');
  assert.equal(result.ok, true);

  const [edited] = app.getComments(1);
  assert.equal(edited.text, 'Texto corrigido');
  assert.equal(edited.authorName, 'Daniel');
  assert.equal(edited.id, comment.id);
  assert.equal(edited.createdAt, comment.createdAt);
  assert.equal(typeof edited.editedAt, 'string');
});

test('o dono do comentário é reconhecido mesmo logando com outra caixa no nome', () => {
  const app = createApp();
  app.register('Daniel', 'senha123');
  app.postComment(1, 'Meu comentário');
  app.logout();
  app.login('daniel', 'senha123');

  const [comment] = app.getComments(1);
  assert.equal(app.canEditComment(comment), true);
  assert.equal(app.editComment(comment.id, 'Editado').ok, true);
});

test('editar com texto vazio é bloqueado e salvar sem mudar não marca como editado', () => {
  const app = createApp();
  app.register('Daniel', 'senha123');
  app.postComment(1, 'Texto original');
  const [comment] = app.getComments(1);

  const empty = app.editComment(comment.id, '   ');
  assert.equal(empty.ok, false);
  assert.equal(empty.error, 'Escreva algo antes de salvar.');

  assert.equal(app.editComment(comment.id, 'Texto original').ok, true);
  assert.equal(app.getComments(1)[0].editedAt, undefined);
});

test('editar ou excluir não mexe em créditos nem em comentários de outras aulas', () => {
  const app = createApp();
  app.register('Daniel', 'senha123');
  app.postComment(1, 'Na aula 1');
  app.postComment(2, 'Na aula 2');

  app.editComment(app.getComments(1)[0].id, 'Na aula 1, editado');
  app.deleteComment(app.getComments(1)[0].id);

  assert.equal(app.getState().forumCredits, 1);
  assert.equal(app.getComments(2).length, 1);
  assert.equal(app.getComments(2)[0].text, 'Na aula 2');
});

test('comentário antigo sem autor: só o admin pode excluir', () => {
  const app = createApp();
  app.localStorage.setItem(
    'corephp:comments',
    JSON.stringify([{ id: 1, lessonId: 1, text: 'Legado', createdAt: '2026-01-01T00:00:00.000Z' }])
  );

  app.register('Daniel', 'senha123');
  assert.equal(app.deleteComment(1).ok, false);
  assert.equal(app.editComment(1, 'x').ok, false);

  app.login('admin', 'corephp123');
  assert.equal(app.deleteComment(1).ok, true);
});

test('excluir ou editar comentário inexistente devolve erro', () => {
  const app = createApp();
  app.register('Daniel', 'senha123');
  assert.equal(app.deleteComment(12345).ok, false);
  assert.equal(app.editComment(12345, 'x').ok, false);
});
