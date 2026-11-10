// Apoio aos testes do Professor de IA.
const create = (c, extra = {}) => c.post('/v1/tutor/sessions', { languageCode: 'en', displayName: 'Bruno', ...extra });
const turn = (c, id, text, source) => c.post(`/v1/tutor/sessions/${id}/turn`, { text, source });

async function finishCatchingUp(c, duration = 120) {
  const { body } = await create(c, { lessonId: 'catching-up' });
  const id = body.data.id;
  for (const text of ['Estou bem', 'Não', 'A', 'A']) await turn(c, id, text);
  const done = await c.post(`/v1/tutor/sessions/${id}/complete`, { durationSeconds: duration, completed: true });
  return { done: done.body.data, id };
}

module.exports = { create, turn, finishCatchingUp };
