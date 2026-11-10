const GOALS = [5, 10, 15, 20, 30];
const DEFAULT_GOAL = 10;
const KEYS = ['A', 'B', 'C'];
const MAX_DURATION_SECONDS = 6 * 3600;
const HISTORY_LIMIT = 20;
const HISTORY_CONTEXT = 12; // trocas guardadas para dar contexto à IA

// Tópicos de conversa livre (iguais em todos os idiomas).
const TOPICS = [
  { id: 'public-opinions', title: 'Public Opinions' },
  { id: 'negotiations', title: 'Negotiations' },
  { id: 'diplomatic-communication', title: 'Diplomatic Communication' },
  { id: 'media-and-public-opinion', title: 'Media and Public Opinion' },
  { id: 'business-negotiations', title: 'Business Negotiations' },
];

const LEVELS = { en: 'Avançado', es: 'Iniciante', fr: 'Iniciante', it: 'Iniciante', ru: 'Iniciante' };
const FREE_TITLE = 'Conversa Livre';

module.exports = { GOALS, DEFAULT_GOAL, KEYS, MAX_DURATION_SECONDS, HISTORY_LIMIT, HISTORY_CONTEXT, TOPICS, LEVELS, FREE_TITLE };
