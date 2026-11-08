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
  teacher_carlos: { voice: 'cjVigY5qzO86Huf0OWal', name: 'Eric', settings: { stability: 0.6, speed: 0.95 } }, // pronúncia, dia a dia
};

const CHARACTER_IDS = Object.keys(CHARACTER_VOICES);

/** Voz do personagem, ou null (usa a voz padrão do .env). */
const voiceFor = (characterId) => CHARACTER_VOICES[characterId] ?? null;

module.exports = { CHARACTER_VOICES, CHARACTER_IDS, voiceFor };
