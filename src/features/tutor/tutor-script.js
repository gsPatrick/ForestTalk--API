// Máquina de estados determinística de uma aula com roteiro.
// Estado: { step }. 0 = espera resposta à saudação; 1 = espera resposta à dúvida; 2+i = espera o exercício i.
const { KEYS } = require('./tutor.constants');
const { parseAnswer } = require('./tutor-answer');

const fill = (s, vars) => s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
const m = (type, text, extra) => ({ type, text, ...extra });

function exerciseMessage(ex) {
  const options = ex.options.map((text, i) => ({ key: KEYS[i], text }));
  const lines = options.map((o) => `${o.key}) ${o.text}`);
  return m('exercise', [ex.prompt, ...lines].join('\n'), { options, correctKey: ex.correct });
}

const stepName = (step) => (step < 2 ? 'lesson' : 'practice');

function start(lesson, name) {
  return { messages: [m('question', fill(lesson.greeting, { name }))], state: { step: 0 } };
}

function explain(lesson, name) {
  return [
    m('feedback', fill(lesson.intro, { name })),
    m('explanation', lesson.explanations.join('\n')),
    m('question', lesson.doubt),
  ];
}

/** Mensagens que levam ao passo seguinte ao terminar o exercício `i`. */
function advance(lesson, name, i) {
  const next = lesson.exercises[i + 1];
  return next ? { tail: [exerciseMessage(next)], done: false } : { tail: [m('feedback', fill(lesson.closing, { name }))], done: true };
}

function answer(lesson, name, step, text, source) {
  const i = step - 2;
  const ex = lesson.exercises[i];
  const key = parseAnswer(text, ex.options);
  const voice = source === 'voice' ? 1 : 0;
  if (!key) {
    return { messages: [m('feedback', fill(lesson.ui.pick, { name }))], step, done: false, delta: { suggestions: 1, pronunciation: voice } };
  }
  const { tail, done } = advance(lesson, name, i);
  const nextStep = step + 1;
  if (key === ex.correct) {
    const head = i + 1 < lesson.exercises.length ? [m('feedback', fill(lesson.ui.right, { name }))] : [];
    return { messages: [...head, ...tail], step: nextStep, done, delta: {} };
  }
  const text2 = ex.options[KEYS.indexOf(ex.correct)];
  const head = [m('feedback', fill(lesson.ui.wrong, { name, key: ex.correct, text: text2 })), m('explanation', ex.why)];
  return { messages: [...head, ...tail], step: nextStep, done, delta: { grammar: 1, pronunciation: voice } };
}

/** Um turno do usuário. Devolve mensagens do tutor, novo passo, `done` e incrementos de métricas. */
function turn(lesson, name, state, text, source) {
  const { step } = state;
  if (step === 0) return { messages: explain(lesson, name), step: 1, done: false, delta: {} };
  if (step === 1) {
    return { messages: [m('feedback', lesson.practice), exerciseMessage(lesson.exercises[0])], step: 2, done: false, delta: {} };
  }
  return answer(lesson, name, step, text, source);
}

module.exports = { start, turn, stepName };
