const { LEVELS, TOPICS } = require('./tutor.constants');
const UI = require('./lesson-ui.data');
const english = require('./lessons-en.data');
const others = require('./lessons-other.data');

const CATALOG = { en: english, ...others };

/** Aulas do idioma em ordem, já com as frases fixas (`ui`) do idioma. */
const lessonsOf = (code) => (CATALOG[code] ?? []).map((l) => ({ ...l, ui: UI[code] }));
const findLesson = (code, id) => lessonsOf(code).find((l) => l.id === id) ?? null;
const levelOf = (code) => LEVELS[code];

module.exports = { lessonsOf, findLesson, levelOf, TOPICS };
