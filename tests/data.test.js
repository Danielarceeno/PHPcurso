'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const { createApp, toPlain } = require('./helpers/loadApp');

/** LESSONS/DAY_LABELS são `const` de topo em data.js: existem no escopo do
 * sandbox, mas não como propriedade do contexto — por isso são lidos por
 * avaliação dentro dele. */
function loadData() {
  const app = createApp();
  return {
    app,
    lessons: toPlain(vm.runInContext('LESSONS', app)),
    dayLabels: toPlain(vm.runInContext('DAY_LABELS', app)),
  };
}

test('são 20 aulas com ids sequenciais de 1 a 20, sem repetição', () => {
  const { lessons } = loadData();
  assert.deepEqual(
    lessons.map((l) => l.id),
    Array.from({ length: 20 }, (_, i) => i + 1)
  );
});

test('toda aula tem os campos de texto obrigatórios preenchidos', () => {
  const { lessons } = loadData();
  for (const lesson of lessons) {
    for (const field of ['title', 'summary', 'explanation', 'code', 'challenge']) {
      assert.equal(typeof lesson[field], 'string', `aula ${lesson.id}: ${field} não é texto`);
      assert.ok(lesson[field].trim().length > 0, `aula ${lesson.id}: ${field} vazio`);
    }
  }
});

test('todo exemplo de código começa com a tag <?php', () => {
  const { lessons } = loadData();
  for (const lesson of lessons) {
    assert.ok(lesson.code.startsWith('<?php'), `aula ${lesson.id}: código não começa com <?php`);
  }
});

test('os dias vão de 1 a 8, em ordem crescente, e todos têm rótulo', () => {
  const { lessons, dayLabels } = loadData();
  const days = lessons.map((l) => l.day);

  assert.deepEqual([...new Set(days)], [1, 2, 3, 4, 5, 6, 7, 8]);
  assert.deepEqual(days, [...days].sort((a, b) => a - b));
  for (const day of new Set(days)) {
    assert.equal(dayLabels[day], `Dia ${day}`);
  }
});

test('video_url é null ou uma URL https', () => {
  const { lessons } = loadData();
  for (const lesson of lessons) {
    if (lesson.video_url === null) continue;
    assert.match(lesson.video_url, /^https:\/\/\S+$/, `aula ${lesson.id}: video_url inválida`);
  }
});

test('getLessonById aceita número ou texto e devolve undefined se não existir', () => {
  const { app } = loadData();
  assert.equal(app.getLessonById(3).id, 3);
  assert.equal(app.getLessonById('3').id, 3);
  assert.equal(app.getLessonById(999), undefined);
});

test('getLessonsByDay agrupa todas as aulas pelo dia', () => {
  const { app, lessons } = loadData();
  const byDay = toPlain(app.getLessonsByDay());

  assert.deepEqual(Object.keys(byDay), ['1', '2', '3', '4', '5', '6', '7', '8']);
  const total = Object.values(byDay).reduce((sum, list) => sum + list.length, 0);
  assert.equal(total, lessons.length);
  for (const [day, list] of Object.entries(byDay)) {
    assert.ok(list.every((l) => l.day === Number(day)));
  }
});
