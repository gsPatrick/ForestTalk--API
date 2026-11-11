/**
 * Voz de cada personagem do chat (ids das vozes prontas da conta ElevenLabs), escolhida pela personalidade.
 * `settings` ajusta estabilidade (mais baixa = mais expressiva), estilo e velocidade da fala.
 */
const CHARACTER_VOICES = {
  fox: { voice: 'FGY2WhTYpPnrIDTdsKH5', name: 'Laura', settings: { stability: 0.4, style: 0.4 } }, // Raposa Rita: curiosa, animada
  bear: { voice: 'nPczCjzI2devNBz1zQrb', name: 'Brian', settings: { stability: 0.7, speed: 0.85 } }, // Urso Bento: calmo, devagar
  owl: { voice: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily', settings: { stability: 0.65 } }, // Coruja Lúcia: sábia, carinhosa
  frog: { voice: 'N2lVS1w4EtoT3dr4eOWO', name: 'Callum', settings: { stability: 0.3, style: 0.5 } }, // Sapo Zeca: brincalhão
  teacher_marina: { voice: 'Xb7hH8MSUJpSbSDYk0k2', name: 'Alice', settings: { stability: 0.6, speed: 0.95 } }, // passo a passo
  // Animais do Professor de IA: cada um com voz própria (todas já existem na conta).
  lion: { voice: 'pNInz6obpgDQGcFmaJgB', name: 'Adam', settings: { stability: 0.6, speed: 0.92 } }, // Leão Rei: firme, majestoso
  cat: { voice: 'cgSgspJ2msm6clMCkdW9', name: 'Jessica', settings: { stability: 0.45, style: 0.3 } }, // Gata: brincalhona
  dog: { voice: 'TX3LPaxmHKxFdv7VOQHJ', name: 'Liam', settings: { stability: 0.4, style: 0.4 } }, // Cachorro: animado
  rabbit: { voice: 'hpp4J3VqNfWAUOO0d1Us', name: 'Bella', settings: { stability: 0.5, style: 0.3 } }, // Coelho: doce, alegre
  elephant: { voice: 'pqHfZKP75CvOlQylNhV4', name: 'Bill', settings: { stability: 0.7, speed: 0.88 } }, // Elefante: sábio, calmo
  giraffe: { voice: 'XrExE9yKIg1WjnnlVkGX', name: 'Matilda', settings: { stability: 0.55 } }, // Girafa: educada
  horse: { voice: 'CwhRBWXzGAHq8TQ4Fs17', name: 'Roger', settings: { stability: 0.6, speed: 0.95 } }, // Cavalo: tranquilo
  kangaroo: { voice: 'IKne3meq5aSn9XLyUdCD', name: 'Charlie', settings: { stability: 0.4, style: 0.4 } }, // Canguru: energético
  teacher_carlos: { voice: 'cjVigY5qzO86Huf0OWal', name: 'Eric', settings: { stability: 0.6, speed: 0.95 } }, // pronúncia, dia a dia
};

const CHARACTER_IDS = Object.keys(CHARACTER_VOICES);

/** Voz do personagem, ou null (usa a voz padrão do .env). */
const voiceFor = (characterId) => CHARACTER_VOICES[characterId] ?? null;

module.exports = { CHARACTER_VOICES, CHARACTER_IDS, voiceFor };
