// Aulas de inglês (tutor fala português). Formato: ver tutor-script.js.
const ex = (prompt, options, correct, why) => ({ prompt, options, correct, why });
const PRACTICE = 'Perfeito! Vamos praticar.';
const DOUBT = 'Tem alguma dúvida sobre essa explicação antes de praticarmos?';
const INTRO = 'Ótimo, {name}! Vamos direto ao ponto.';

module.exports = [
  {
    id: 'catching-up', title: 'Catching Up', icon: 'chat', order: 1,
    newWords: ['reconnect', 'reschedule', 'postpone', 'coordinate', 'availability'],
    greeting: 'Oi, {name}! Como está o seu dia até agora? Hoje, vamos aprender como usar "I\'ve been meaning to..." para falar sobre intenções recentes em inglês. Está pronto para começar?',
    intro: INTRO,
    explanations: [
      'Quando você quer dizer que está pensando em fazer algo há um tempo, mas ainda não fez, use "I\'ve been meaning to...".',
      'Depois, coloque a ação que você quer fazer, como reconnect (reconectar) ou reschedule (remarcar).',
      'Isso mostra que a intenção existe há algum tempo, mas por algum motivo foi adiada.',
    ],
    doubt: DOUBT, practice: PRACTICE,
    exercises: [
      ex('Complete a frase com a opção correta: "I\'ve been meaning to ___ our meeting, but I haven\'t checked your availability yet."',
        ['postpone', 'coordinate', 'reconnect'], 'A',
        '"Postpone" significa adiar e combina com "our meeting": a reunião foi deixada para depois.'),
      ex('Escolha a opção correta para completar: "I\'ve been meaning to ___ with you, but things kept getting in the way."',
        ['reconnect', 'availability', 'postpone'], 'A',
        '"Reconnect with you" significa retomar o contato; "availability" é um substantivo e "postpone" pede um objeto.'),
    ],
    closing: 'Aula concluída, {name}! Hoje você praticou "I\'ve been meaning to...". Até a próxima!',
  },
  {
    id: 'weekend-getaway', title: 'Weekend Getaway', icon: 'flight', order: 2,
    newWords: ['getaway', 'book', 'itinerary', 'beach', 'reservation'],
    greeting: 'Oi, {name}! Já pensou em viajar neste fim de semana? Hoje vamos aprender a falar de planos de viagem com "I\'m thinking of...". Pronto para começar?',
    intro: INTRO,
    explanations: [
      'Use "I\'m thinking of" para dizer que você está considerando um plano.',
      'Depois de "of", o verbo vai no -ing, como em "I\'m thinking of going to the beach".',
      'Para reservar hotel ou voo, use o verbo "book": "We should book a hotel".',
    ],
    doubt: DOUBT, practice: PRACTICE,
    exercises: [
      ex('Complete a frase: "I\'m thinking of ___ to the beach this weekend."', ['go', 'going', 'went'], 'B',
        'Depois de "thinking of" usamos o verbo com -ing: "going".'),
      ex('Escolha a opção correta: "We should ___ a hotel before it gets full."', ['book', 'books', 'booking'], 'A',
        'Depois de "should" usamos o verbo na forma base: "book".'),
    ],
    closing: 'Aula concluída, {name}! Hoje você praticou planos de viagem. Até a próxima!',
  },
  {
    id: 'thats-so-true', title: "That's So True", icon: 'thumb_up', order: 3,
    newWords: ['agree', 'exactly', 'absolutely', 'true', 'exhausting'],
    greeting: 'Oi, {name}! Como foi a sua semana? Hoje vamos aprender a concordar com alguém de forma natural, usando "That\'s so true". Vamos começar?',
    intro: INTRO,
    explanations: [
      'Para concordar com alguém, diga "That\'s so true!" ou "Exactly!".',
      'Uma forma mais forte é "I couldn\'t agree more", que significa "concordo totalmente".',
      'Esses jeitos de concordar deixam a conversa mais natural e amigável.',
    ],
    doubt: DOUBT, practice: PRACTICE,
    exercises: [
      ex('Seu amigo diz: "Traffic is terrible today." Escolha uma resposta que concorda:',
        ['I couldn\'t agree more.', 'I don\'t think so.', 'Not at all.'], 'A',
        '"I couldn\'t agree more" expressa concordância total; as outras opções discordam.'),
      ex('Complete: "Mondays are exhausting." — "___! I need coffee already."',
        ['That\'s so true', 'That\'s false', 'That\'s weird'], 'A',
        '"That\'s so true" é a forma natural de concordar com a frase do seu amigo.'),
    ],
    closing: 'Aula concluída, {name}! Hoje você praticou formas de concordar. Até a próxima!',
  },
  {
    id: 'spending-free-time', title: 'Spending Free Time', icon: 'sunny', order: 4,
    newWords: ['hobby', 'relax', 'weekend', 'usually', 'free time'],
    greeting: 'Oi, {name}! O que você mais gosta de fazer quando está livre? Hoje vamos falar sobre tempo livre e hobbies. Pronto para começar?',
    intro: INTRO,
    explanations: [
      'Para falar do seu tempo livre, comece com "In my free time, I like to...".',
      'Depois de "like to" use o verbo na forma base, como read, cook ou walk.',
      'Para hábitos, use "usually": "On weekends, I usually meet friends".',
    ],
    doubt: DOUBT, practice: PRACTICE,
    exercises: [
      ex('Complete a frase: "In my free time, I like to ___ books."', ['read', 'reads', 'reading'], 'A',
        'Depois de "like to" usamos o verbo na forma base: "read".'),
      ex('Escolha a opção correta: "On weekends, I usually ___ friends."', ['meeting', 'meet', 'meets'], 'B',
        'Com "I" o verbo fica na forma base: "meet".'),
    ],
    closing: 'Aula concluída, {name}! Hoje você praticou como falar do tempo livre. Até a próxima!',
  },
];
