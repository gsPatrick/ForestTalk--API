/**
 * Voz de cada personagem do chat (ids das vozes prontas da conta ElevenLabs), escolhida pela personalidade.
 * Todas falam com os mesmos ajustes (os das amostras aprovadas): voz estável e um pouco mais lenta, boa para aprender.
 */
const SPEECH_SETTINGS = { stability: 0.5, similarity_boost: 0.75, speed: 0.95 };

const CHARACTER_VOICES = {
  fox: { voice: 'FGY2WhTYpPnrIDTdsKH5', name: 'Laura' }, // Raposa Rita: curiosa, animada
  bear: { voice: 'nPczCjzI2devNBz1zQrb', name: 'Brian' }, // Urso Bento: calmo, devagar
  owl: { voice: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily' }, // Coruja Lúcia: sábia, carinhosa
  frog: { voice: 'N2lVS1w4EtoT3dr4eOWO', name: 'Callum' }, // Sapo Zeca: brincalhão
  teacher_marina: { voice: 'Xb7hH8MSUJpSbSDYk0k2', name: 'Alice' }, // passo a passo
  // Animais do Professor de IA: cada um com voz própria (todas já existem na conta).
  lion: { voice: 'pNInz6obpgDQGcFmaJgB', name: 'Adam' }, // Leão Rei: firme, majestoso
  cat: { voice: 'cgSgspJ2msm6clMCkdW9', name: 'Jessica' }, // Gata: brincalhona
  dog: { voice: 'TX3LPaxmHKxFdv7VOQHJ', name: 'Liam' }, // Cachorro: animado
  rabbit: { voice: 'hpp4J3VqNfWAUOO0d1Us', name: 'Bella' }, // Coelho: doce, alegre
  elephant: { voice: 'pqHfZKP75CvOlQylNhV4', name: 'Bill' }, // Elefante: sábio, calmo
  giraffe: { voice: 'XrExE9yKIg1WjnnlVkGX', name: 'Matilda' }, // Girafa: educada
  horse: { voice: 'CwhRBWXzGAHq8TQ4Fs17', name: 'Roger' }, // Cavalo: tranquilo
  kangaroo: { voice: 'IKne3meq5aSn9XLyUdCD', name: 'Charlie' }, // Canguru: energético
  teacher_carlos: { voice: 'cjVigY5qzO86Huf0OWal', name: 'Eric' }, // pronúncia, dia a dia
};

const CHARACTER_IDS = Object.keys(CHARACTER_VOICES);

/** Voz do personagem, ou null (usa a voz padrão do .env). */
const voiceFor = (characterId) => CHARACTER_VOICES[characterId] ?? null;

module.exports = { CHARACTER_VOICES, CHARACTER_IDS, SPEECH_SETTINGS, voiceFor };
