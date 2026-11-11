// Aulas de inglês: o tutor fala só inglês (simples e claro). Formato: ver tutor-script.js.
const ex = (prompt, options, correct, why) => ({ prompt, options, correct, why });
const PRACTICE = "Perfect! Let's practice.";
const DOUBT = 'Do you have any questions about this explanation before we practice?';
const INTRO = "Great, {name}! Let's get straight to the point.";

module.exports = [
  {
    id: 'catching-up', title: 'Catching Up', icon: 'chat', order: 1,
    newWords: ['reconnect', 'reschedule', 'postpone', 'coordinate', 'availability'],
    greeting: 'Hi, {name}! How is your day going so far? Today, we are going to learn how to use "I\'ve been meaning to..." to talk about recent intentions. Are you ready to start?',
    intro: INTRO,
    explanations: [
      'When you want to say that you have been thinking about doing something for a while, but you have not done it yet, use "I\'ve been meaning to...".',
      'Then add the action you want to do, like reconnect or reschedule.',
      'It shows that the intention has been there for some time, but it was delayed for some reason.',
    ],
    doubt: DOUBT, practice: PRACTICE,
    exercises: [
      ex('Complete the sentence with the correct option: "I\'ve been meaning to ___ our meeting, but I haven\'t checked your availability yet."',
        ['postpone', 'coordinate', 'reconnect'], 'A',
        '"Postpone" means to move something to a later time, and it fits "our meeting".'),
      ex('Choose the correct option to complete: "I\'ve been meaning to ___ with you, but things kept getting in the way."',
        ['reconnect', 'availability', 'postpone'], 'A',
        '"Reconnect with you" means to get back in touch. "Availability" is a noun, and "postpone" needs an object.'),
    ],
    closing: 'Lesson complete, {name}! Today you practiced "I\'ve been meaning to...". See you next time!',
  },
  {
    id: 'weekend-getaway', title: 'Weekend Getaway', icon: 'flight', order: 2,
    newWords: ['getaway', 'book', 'itinerary', 'beach', 'reservation'],
    greeting: 'Hi, {name}! Have you thought about traveling this weekend? Today we are going to talk about travel plans with "I\'m thinking of...". Ready to start?',
    intro: INTRO,
    explanations: [
      'Use "I\'m thinking of" to say that you are considering a plan.',
      'After "of", the verb ends in -ing, like in "I\'m thinking of going to the beach".',
      'To reserve a hotel or a flight, use the verb "book": "We should book a hotel".',
    ],
    doubt: DOUBT, practice: PRACTICE,
    exercises: [
      ex('Complete the sentence: "I\'m thinking of ___ to the beach this weekend."', ['go', 'going', 'went'], 'B',
        'After "thinking of" we use the -ing form: "going".'),
      ex('Choose the correct option: "We should ___ a hotel before it gets full."', ['book', 'books', 'booking'], 'A',
        'After "should" we use the base form of the verb: "book".'),
    ],
    closing: 'Lesson complete, {name}! Today you practiced travel plans. See you next time!',
  },
  {
    id: 'thats-so-true', title: "That's So True", icon: 'thumb_up', order: 3,
    newWords: ['agree', 'exactly', 'absolutely', 'true', 'exhausting'],
    greeting: 'Hi, {name}! How was your week? Today we are going to learn how to agree with someone in a natural way, using "That\'s so true". Shall we start?',
    intro: INTRO,
    explanations: [
      'To agree with someone, say "That\'s so true!" or "Exactly!".',
      'A stronger way is "I couldn\'t agree more", which means "I totally agree".',
      'These ways of agreeing make the conversation more natural and friendly.',
    ],
    doubt: DOUBT, practice: PRACTICE,
    exercises: [
      ex('Your friend says: "Traffic is terrible today." Choose an answer that agrees:',
        ['I couldn\'t agree more.', 'I don\'t think so.', 'Not at all.'], 'A',
        '"I couldn\'t agree more" shows total agreement. The other options disagree.'),
      ex('Complete: "Mondays are exhausting." - "___! I need coffee already."',
        ['That\'s so true', 'That\'s false', 'That\'s weird'], 'A',
        '"That\'s so true" is the natural way to agree with your friend.'),
    ],
    closing: 'Lesson complete, {name}! Today you practiced ways to agree. See you next time!',
  },
  {
    id: 'spending-free-time', title: 'Spending Free Time', icon: 'sunny', order: 4,
    newWords: ['hobby', 'relax', 'weekend', 'usually', 'free time'],
    greeting: 'Hi, {name}! What do you like to do the most when you are free? Today we are going to talk about free time and hobbies. Ready to start?',
    intro: INTRO,
    explanations: [
      'To talk about your free time, start with "In my free time, I like to...".',
      'After "like to", use the base form of the verb, like read, cook or walk.',
      'For habits, use "usually": "On weekends, I usually meet friends".',
    ],
    doubt: DOUBT, practice: PRACTICE,
    exercises: [
      ex('Complete the sentence: "In my free time, I like to ___ books."', ['read', 'reads', 'reading'], 'A',
        'After "like to" we use the base form of the verb: "read".'),
      ex('Choose the correct option: "On weekends, I usually ___ friends."', ['meeting', 'meet', 'meets'], 'B',
        'With "I", the verb stays in the base form: "meet".'),
    ],
    closing: 'Lesson complete, {name}! Today you practiced how to talk about free time. See you next time!',
  },
];
