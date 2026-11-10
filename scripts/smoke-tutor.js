/* eslint-disable no-console */
// Passo do smoke test: Professor de IA (aula Catching Up completa, progresso e meta).
module.exports = async function tutorStep({ call, expect, expectOk, lang }) {
  const lessons = await call('GET', `/v1/tutor/lessons?languageCode=${lang}`);
  expectOk(lessons, 'tutor/lessons');
  expect(lessons.data.lessons[0].status === 'available', 'primeira aula deveria estar disponível');
  const s = await call('POST', '/v1/tutor/sessions', { languageCode: lang, lessonId: 'catching-up', displayName: 'Smoke' });
  expectOk(s, 'tutor/sessions');
  for (const text of ['Estou bem', 'Não', 'B', 'A']) {
    expectOk(await call('POST', `/v1/tutor/sessions/${s.data.id}/turn`, { text, source: 'text' }), 'tutor/turn');
  }
  const end = await call('POST', `/v1/tutor/sessions/${s.data.id}/complete`, { durationSeconds: 60, completed: true });
  expectOk(end, 'tutor/complete');
  expect(end.data.unlockedLessonId === 'weekend-getaway', 'próxima aula não desbloqueou');
  expectOk(await call('PUT', '/v1/tutor/settings', { dailyGoalMinutes: 15 }), 'tutor/settings');
  const p = await call('GET', `/v1/tutor/progress?languageCode=${lang}`);
  expectOk(p, 'tutor/progress');
  expect(p.data.callTime.totalSeconds >= 60 && p.data.callTime.dailyGoalMinutes === 15, 'progresso do tutor incorreto');
  expect(p.data.history.length >= 1, 'histórico vazio');
};
