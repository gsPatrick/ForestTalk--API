// Personagens (espelham mock_chat_characters.dart). `persona` é só do servidor e nunca sai na API.
const CHARACTERS = [
  { id: 'fox', emoji: '🦊', name: 'Raposa Rita', description: 'Curiosa e animada. Adora um papo leve.', kind: 'animal', persona: 'a curious, cheerful fox who loves light chit-chat' },
  { id: 'bear', emoji: '🐻', name: 'Urso Bento', description: 'Calmo e paciente. Fala bem devagar.', kind: 'animal', persona: 'a calm, patient bear who speaks slowly with very simple words' },
  { id: 'owl', emoji: '🦉', name: 'Coruja Lúcia', description: 'Sábia e atenta. Corrige com carinho.', kind: 'animal', persona: 'a wise, attentive owl who gently corrects mistakes' },
  { id: 'frog', emoji: '🐸', name: 'Sapo Zeca', description: 'Brincalhão. Conversa cheia de graça.', kind: 'animal', persona: 'a playful frog whose chat is full of humor' },
  { id: 'teacher_marina', emoji: '👩‍🏫', name: 'Profa. Marina', description: 'Explica tudo passo a passo.', kind: 'teacher', persona: 'Professor Marina, a teacher who explains everything step by step' },
  { id: 'teacher_carlos', emoji: '👨‍🏫', name: 'Prof. Carlos', description: 'Foco em pronúncia e dia a dia.', kind: 'teacher', persona: 'Professor Carlos, a teacher focused on pronunciation and everyday language' },
];

const LANGUAGE_NAMES = { en: 'English', es: 'Spanish', fr: 'French', it: 'Italian', ru: 'Russian' };
const MAX_TEXT = 500;
// Memória: quantas trocas (aluno + personagem) vão no prompt e quantas mensagens ficam guardadas.
const HISTORY_TURNS = 6;
const KEEP_MESSAGES = 40;

const publicCharacters = () => CHARACTERS.map(({ persona, ...pub }) => pub);

module.exports = { CHARACTERS, LANGUAGE_NAMES, MAX_TEXT, HISTORY_TURNS, KEEP_MESSAGES, publicCharacters };
