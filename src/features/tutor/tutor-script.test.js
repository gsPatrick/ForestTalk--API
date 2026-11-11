const { test } = require('node:test');
const assert = require('node:assert/strict');
const script = require('./tutor-script');
const { parseAnswer } = require('./tutor-answer');
const { findLesson, lessonsOf } = require('./tutor-catalog');

const lesson = findLesson('en', 'catching-up');
const texts = (r) => r.messages.map((m) => m.text);
const types = (r) => r.messages.map((m) => m.type);

function run(inputs) {
  let state = script.start(lesson, 'Bruno').state;
  const outs = [];
  for (const [text, source] of inputs) {
    const r = script.turn(lesson, 'Bruno', state, text, source);
    state = { step: r.step };
    outs.push(r);
  }
  return outs;
}

test('saudação exata', () => {
  const { messages } = script.start(lesson, 'Bruno');
  assert.equal(messages.length, 1);
  assert.equal(messages[0].type, 'question');
  assert.equal(
    messages[0].text,
    'Hi, Bruno! How is your day going so far? Today, we are going to learn how to use "I\'ve been meaning to..." to talk about recent intentions. Are you ready to start?',
  );
});

test('sequência exata até a conclusão (A, A)', () => {
  const [a, b, c, d] = run([['Estou bem'], ['Não'], ['A'], ['a)']]);
  assert.deepEqual(types(a), ['feedback', 'explanation', 'question']);
  assert.equal(a.messages[0].text, "Great, Bruno! Let's get straight to the point.");
  assert.equal(a.messages[1].text.split('\n').length, 3);
  assert.match(a.messages[1].text, /^When you want to say that you have been thinking about doing something/);
  assert.equal(a.messages[2].text, 'Do you have any questions about this explanation before we practice?');
  assert.equal(script.stepName(a.step), 'lesson');
  assert.deepEqual(texts(b)[0], "Perfect! Let's practice.");
  const ex1 = b.messages[1];
  assert.equal(ex1.type, 'exercise');
  assert.equal(ex1.correctKey, 'A');
  assert.deepEqual(ex1.options, [{ key: 'A', text: 'postpone' }, { key: 'B', text: 'coordinate' }, { key: 'C', text: 'reconnect' }]);
  assert.match(ex1.text, /^Complete the sentence with the correct option: "I've been meaning to ___ our meeting/);
  assert.equal(script.stepName(b.step), 'practice');
  assert.equal(c.messages[0].text, "Correct, Bruno! Let's move on to the next one.");
  assert.match(c.messages[1].text, /^Choose the correct option to complete: "I've been meaning to ___ with you/);
  assert.deepEqual(c.messages[1].options.map((o) => o.text), ['reconnect', 'availability', 'postpone']);
  assert.equal(c.done, false);
  assert.deepEqual(texts(d), ['Lesson complete, Bruno! Today you practiced "I\'ve been meaning to...". See you next time!']);
  assert.equal(d.done, true);
  assert.deepEqual(d.delta, {});
});

test('resposta errada: correção, grammar +1 e segue', () => {
  const [, , wrong] = run([['oi'], ['ok'], ['B']]);
  assert.equal(wrong.messages[0].text, 'Almost, Bruno. The correct answer is A) postpone.');
  assert.equal(wrong.messages[1].type, 'explanation');
  assert.equal(wrong.messages[2].type, 'exercise');
  assert.deepEqual(wrong.delta, { grammar: 1, pronunciation: 0 });
  assert.equal(wrong.done, false);
});

test('erro no último exercício conclui a aula', () => {
  const outs = run([['oi'], ['ok'], ['A'], ['c']]);
  const last = outs[3];
  assert.equal(last.done, true);
  assert.match(last.messages[0].text, /^Almost, Bruno\. The correct answer is A\) reconnect\.$/);
  assert.match(last.messages.at(-1).text, /^Lesson complete, Bruno!/);
  assert.equal(last.delta.grammar, 1);
});

test('entrada inválida pede A, B ou C e não avança', () => {
  const outs = run([['oi'], ['ok'], ['talvez']]);
  assert.equal(outs[2].step, 2);
  assert.equal(outs[2].done, false);
  assert.equal(outs[2].messages.length, 1);
  assert.match(outs[2].messages[0].text, /A, B or C/);
  assert.deepEqual(outs[2].delta, { suggestions: 1, pronunciation: 0 });
});

test('voz com resposta que não bate soma pronunciation', () => {
  const outs = run([['oi'], ['ok'], ['coordinate', 'voice'], ['hmm', 'voice']]);
  assert.equal(outs[2].delta.pronunciation, 1);
  assert.equal(outs[3].delta.pronunciation, 1);
});

test('parseAnswer aceita letra, a), maiúscula e o texto da alternativa', () => {
  const opts = ['postpone', 'coordinate', 'reconnect'];
  for (const t of ['A', 'a', 'a)', ' A) ', 'a. ', 'a) postpone', 'postpone', 'Postpone.']) assert.equal(parseAnswer(t, opts), 'A', t);
  assert.equal(parseAnswer('c', opts), 'C');
  assert.equal(parseAnswer('reconnect', opts), 'C');
  for (const t of ['d', 'ab', 'cc', '', 'coord']) assert.equal(parseAnswer(t, opts), null, t);
});

test('catálogo: todo idioma tem aula com roteiro válido (3 alternativas e correta)', () => {
  for (const code of ['en', 'es', 'fr', 'it', 'ru']) {
    const lessons = lessonsOf(code);
    assert.ok(lessons.length >= 1, code);
    for (const l of lessons) {
      assert.ok(l.exercises.length >= 1 && l.newWords.length > 0);
      for (const e of l.exercises) {
        assert.equal(e.options.length, 3);
        assert.ok(['A', 'B', 'C'].includes(e.correct));
      }
    }
  }
  assert.deepEqual(lessonsOf('en').map((l) => l.title), ['Catching Up', 'Weekend Getaway', "That's So True", 'Spending Free Time']);
});
