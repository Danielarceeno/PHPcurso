'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { createApp } = require('./helpers/loadApp');

test('sem edição, getEffectiveLesson devolve o conteúdo original de data.js', () => {
  const app = createApp();
  const original = app.getLessonById(1);
  assert.equal(app.getEffectiveLesson(1).explanation, original.explanation);
  assert.equal(app.hasContentOverride(1, 'explanation'), false);
});

test('aula inexistente devolve null', () => {
  const app = createApp();
  assert.equal(app.getEffectiveLesson(999), null);
});

test('edição de admin é aplicada por cima sem mutar data.js', () => {
  const app = createApp();
  const originalExplanation = app.getLessonById(1).explanation;

  app.saveContentOverride(1, { explanation: 'Texto editado' });

  assert.equal(app.getEffectiveLesson(1).explanation, 'Texto editado');
  assert.equal(app.getLessonById(1).explanation, originalExplanation);
  assert.equal(app.hasContentOverride(1, 'explanation'), true);
  assert.equal(app.hasContentOverride(1, 'video_url'), false);
});

test('vídeo removido pelo admin (null) conta como edição', () => {
  const app = createApp();
  app.saveContentOverride(1, { video_url: null });
  assert.equal(app.getEffectiveLesson(1).video_url, null);
  assert.equal(app.hasContentOverride(1, 'video_url'), true);
});

test('clearContentOverride restaura o original só do campo pedido', () => {
  const app = createApp();
  const original = app.getLessonById(1);

  app.saveContentOverride(1, { explanation: 'Texto editado' });
  app.saveContentOverride(1, { video_url: 'https://exemplo.com/video.mp4' });

  app.clearContentOverride(1, 'explanation');
  assert.equal(app.getEffectiveLesson(1).explanation, original.explanation);
  assert.equal(app.getEffectiveLesson(1).video_url, 'https://exemplo.com/video.mp4');

  app.clearContentOverride(1, 'video_url');
  assert.equal(app.getEffectiveLesson(1).video_url, original.video_url);
  assert.equal(app.hasContentOverride(1, 'video_url'), false);
});

test('clearContentOverride em aula sem edição não quebra', () => {
  const app = createApp();
  app.clearContentOverride(5, 'explanation');
  assert.equal(app.hasContentOverride(5, 'explanation'), false);
});
