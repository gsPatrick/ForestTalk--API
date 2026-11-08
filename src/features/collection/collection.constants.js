// Espelha AnimalCatalog (animal_catalog.dart): ordem em que os baús entregam as cartas.
// Mascote inicial: sempre desbloqueado e NÃO é carta de baú.
const STARTER_ID = 'lion';
const STARTER = { id: STARTER_ID, name: 'Leão Rei', emoji: '🦁', phrase: 'Fale com coragem: o idioma é seu!', rarity: 'common' };

const ANIMALS = [
  { id: 'rabbit', name: 'Coelho', emoji: '🐰', phrase: 'Pequenos saltos todos os dias chegam longe.', rarity: 'common' },
  { id: 'fox', name: 'Raposa', emoji: '🦊', phrase: 'Esperta é quem nunca para de aprender.', rarity: 'common' },
  { id: 'cat', name: 'Gata', emoji: '🐱', phrase: 'Curiosidade é o primeiro passo da fluência.', rarity: 'common' },
  { id: 'dog', name: 'Cachorro', emoji: '🐶', phrase: 'Quem pratica com alegria nunca desiste.', rarity: 'common' },
  { id: 'bear', name: 'Urso', emoji: '🐻', phrase: 'Devagar e sempre: cada palavra conta.', rarity: 'rare' },
  { id: 'owl', name: 'Coruja', emoji: '🦉', phrase: 'Quem revisa com calma aprende com sabedoria.', rarity: 'rare' },
  { id: 'horse', name: 'Cavalo', emoji: '🐴', phrase: 'Galopa longe quem tem constância.', rarity: 'rare' },
  { id: 'kangaroo', name: 'Canguru', emoji: '🦘', phrase: 'Dê um grande salto: errar faz parte!', rarity: 'epic' },
  { id: 'giraffe', name: 'Girafa', emoji: '🦒', phrase: 'Olhe mais longe: seu vocabulário não para de crescer!', rarity: 'epic' },
  { id: 'elephant', name: 'Elefante', emoji: '🐘', phrase: 'Quem tem boa memória vai longe.', rarity: 'epic' },
  { id: 'frog', name: 'Sapinho', emoji: '🐸', phrase: 'Todo grande falante começou com um pulinho!', rarity: 'legendary' },
];

module.exports = { STARTER_ID, STARTER, ANIMALS };
