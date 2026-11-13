'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { createApp, toPlain } = require('./helpers/loadApp');

// Só as funções puras de main.js são testadas aqui (sem DOM). O que depende
// de `document` — modal de login, listas, página de aula — é verificado no
// navegador.

test('escapeHtml escapa os cinco caracteres perigosos, inclusive aspas', () => {
  const app = createApp();
  assert.equal(
    app.escapeHtml(`<img src="x" onerror='a&b'>`),
    '&lt;img src=&quot;x&quot; onerror=&#39;a&amp;b&#39;&gt;'
  );
  assert.equal(app.escapeHtml(42), '42');
});

test('getDriveEmbedUrl converte links de arquivo do Drive para a URL de preview', () => {
  const app = createApp();
  assert.equal(
    app.getDriveEmbedUrl('https://drive.google.com/file/d/AbC_123-x/view?usp=sharing'),
    'https://drive.google.com/file/d/AbC_123-x/preview'
  );
  assert.equal(
    app.getDriveEmbedUrl('https://drive.google.com/open?id=AbC_123-x'),
    'https://drive.google.com/file/d/AbC_123-x/preview'
  );
});

test('getDriveEmbedUrl devolve null para o que não é arquivo do Drive', () => {
  const app = createApp();
  assert.equal(app.getDriveEmbedUrl('https://exemplo.com/video.mp4'), null);
  assert.equal(app.getDriveEmbedUrl('https://drive.google.com/drive/folders/AbC123'), null);
});

test('isDriveFolderUrl reconhece só links de pasta', () => {
  const app = createApp();
  assert.equal(app.isDriveFolderUrl('https://drive.google.com/drive/folders/AbC123'), true);
  assert.equal(app.isDriveFolderUrl('https://drive.google.com/file/d/AbC123/view'), false);
  assert.equal(app.isDriveFolderUrl('https://exemplo.com/video.mp4'), false);
});

test('renderVideoPlaceholder escolhe o formato certo para cada tipo de URL', () => {
  const app = createApp();

  const empty = app.renderVideoPlaceholder(null);
  assert.match(empty, /Vídeo em breve/);
  assert.doesNotMatch(empty, /<iframe|<video/);

  const drive = app.renderVideoPlaceholder('https://drive.google.com/file/d/AbC123/view?usp=sharing');
  assert.match(drive, /<iframe src="https:\/\/drive\.google\.com\/file\/d\/AbC123\/preview"/);

  const folder = app.renderVideoPlaceholder('https://drive.google.com/drive/folders/AbC123');
  assert.match(folder, /<a href="https:\/\/drive\.google\.com\/drive\/folders\/AbC123"/);
  assert.doesNotMatch(folder, /<iframe|<video/);

  const direct = app.renderVideoPlaceholder('https://exemplo.com/video.mp4');
  assert.match(direct, /<video controls src="https:\/\/exemplo\.com\/video\.mp4">/);
});

test('renderVideoPlaceholder não deixa a URL escapar do atributo (XSS)', () => {
  const app = createApp();
  const html = app.renderVideoPlaceholder('x.mp4" onerror="alert(1)');
  assert.doesNotMatch(html, /" onerror="/);
  assert.match(html, /src="x\.mp4&quot; onerror=&quot;alert\(1\)"/);
});

test('toda aula com vídeo em data.js vira um player embutido do Drive', () => {
  const app = createApp();
  for (let id = 1; id <= 20; id++) {
    const lesson = app.getLessonById(id);
    if (!lesson.video_url) continue;
    assert.match(
      app.renderVideoPlaceholder(lesson.video_url),
      /<iframe src="https:\/\/drive\.google\.com\/file\/d\/[\w-]+\/preview"/,
      `aula ${id}: vídeo não virou player embutido`
    );
  }
});

test('getNextLessonId devolve a primeira aula pendente, na ordem da trilha', () => {
  const app = createApp();
  app.register('Daniel', 'senha123');
  assert.equal(app.getNextLessonId(), 1);

  app.completeLesson(1);
  app.completeLesson(2);
  app.completeLesson(4);
  assert.equal(app.getNextLessonId(), 3);
});

test('getNextLessonId devolve null quando o curso inteiro foi concluído', () => {
  const app = createApp();
  app.register('Daniel', 'senha123');
  for (let id = 1; id <= 20; id++) app.completeLesson(id);
  assert.equal(app.getNextLessonId(), null);
});

test('getDayProgress conta só as aulas concluídas daquele dia', () => {
  const app = createApp();
  app.register('Daniel', 'senha123');
  assert.deepEqual(toPlain(app.getDayProgress(1)), { done: 0, total: 3 });

  app.completeLesson(1);
  app.completeLesson(2);
  app.completeLesson(4); // aula do dia 2
  assert.deepEqual(toPlain(app.getDayProgress(1)), { done: 2, total: 3 });
  assert.deepEqual(toPlain(app.getDayProgress(2)), { done: 1, total: 3 });
  assert.deepEqual(toPlain(app.getDayProgress(4)), { done: 0, total: 2 });
});
