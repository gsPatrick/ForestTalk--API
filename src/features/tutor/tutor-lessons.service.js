const { TutorSession } = require('../../models');
const { lessonsOf, levelOf, TOPICS } = require('./tutor-catalog');

/** Ids das aulas já concluídas pelo aparelho no idioma (base do desbloqueio). */
async function completedLessonIds(deviceId, languageCode) {
  const rows = await TutorSession.findAll({
    where: { deviceId, languageCode, completed: true },
    attributes: ['lessonId'],
  });
  return new Set(rows.map((r) => r.lessonId).filter(Boolean));
}

/** Estado de cada aula: concluída; a 1ª não concluída é `available`; as demais `locked`. */
function withStatus(languageCode, done) {
  let currentTaken = false;
  return lessonsOf(languageCode).map((l) => {
    let status = 'locked';
    if (done.has(l.id)) status = 'completed';
    else if (!currentTaken) {
      status = 'available';
      currentTaken = true;
    }
    return { id: l.id, title: l.title, icon: l.icon, order: l.order, status };
  });
}

async function listLessons(deviceId, languageCode) {
  const done = await completedLessonIds(deviceId, languageCode);
  return { level: levelOf(languageCode), lessons: withStatus(languageCode, done), topics: TOPICS };
}

module.exports = { listLessons, completedLessonIds, withStatus };
