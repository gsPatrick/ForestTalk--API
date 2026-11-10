// Uma aula curta de saudações por idioma; o tutor fala no próprio idioma da aula.
const ex = (prompt, options, correct, why) => ({ prompt, options, correct, why });

module.exports = {
  es: [{
    id: 'saludos', title: 'Saludos', icon: 'chat', order: 1,
    newWords: ['hola', 'buenos días', 'gracias', 'por favor', 'adiós'],
    greeting: '¡Hola, {name}! ¿Cómo estás hoy? Hoy vamos a aprender a saludar en español. ¿Listo para empezar?',
    intro: '¡Muy bien, {name}! Vamos al grano.',
    explanations: [
      'Por la mañana se dice "Buenos días".',
      'Para dar las gracias se dice "Gracias", y para pedir algo con educación, "Por favor".',
      'Con amigos puedes decir simplemente "Hola".',
    ],
    doubt: '¿Tienes alguna duda antes de practicar?', practice: '¡Perfecto! Vamos a practicar.',
    exercises: [
      ex('Elige la opción correcta: Por la mañana digo "___".', ['Buenos días', 'Buenas noches', 'Hasta luego'], 'A',
        '"Buenos días" se usa por la mañana; "Buenas noches" es para la noche.'),
      ex('Completa: "___ por tu ayuda."', ['Hola', 'Gracias', 'Adiós'], 'B', '"Gracias" se usa para agradecer.'),
    ],
    closing: '¡Lección completada, {name}! Hoy practicaste los saludos. ¡Hasta la próxima!',
  }],
  fr: [{
    id: 'salutations', title: 'Salutations', icon: 'chat', order: 1,
    newWords: ['bonjour', 'merci', "s'il vous plaît", 'au revoir', 'bonsoir'],
    greeting: "Salut, {name} ! Comment vas-tu aujourd'hui ? Aujourd'hui, nous allons apprendre à saluer en français. Prêt à commencer ?",
    intro: 'Très bien, {name} ! Allons droit au but.',
    explanations: [
      'Le matin ou en journée, on dit "Bonjour".',
      'Pour remercier, on dit "Merci", et pour être poli, "S\'il vous plaît".',
      'Pour dire au revoir, on dit "Au revoir".',
    ],
    doubt: 'As-tu des questions avant de pratiquer ?', practice: 'Parfait ! Pratiquons.',
    exercises: [
      ex('Choisis la bonne option : Le matin, je dis "___".', ['Bonjour', 'Bonsoir', 'Au revoir'], 'A',
        '"Bonjour" se dit le matin ; "Bonsoir" se dit le soir.'),
      ex('Complète : "___ pour ton aide."', ['Bonjour', 'Merci', 'Salut'], 'B', '"Merci" sert à remercier quelqu\'un.'),
    ],
    closing: "Leçon terminée, {name} ! Aujourd'hui, tu as pratiqué les salutations. À bientôt !",
  }],
  it: [{
    id: 'saluti', title: 'Saluti', icon: 'chat', order: 1,
    newWords: ['ciao', 'buongiorno', 'grazie', 'per favore', 'arrivederci'],
    greeting: 'Ciao, {name}! Come stai oggi? Oggi impariamo a salutare in italiano. Pronto a iniziare?',
    intro: 'Benissimo, {name}! Andiamo dritti al punto.',
    explanations: [
      'Al mattino si dice "Buongiorno".',
      'Per ringraziare si dice "Grazie", e per essere gentili "Per favore".',
      'Per salutare quando si va via si dice "Arrivederci".',
    ],
    doubt: 'Hai dubbi prima di esercitarci?', practice: 'Perfetto! Esercitiamoci.',
    exercises: [
      ex('Scegli l\'opzione corretta: Al mattino dico "___".', ['Buongiorno', 'Buonanotte', 'Arrivederci'], 'A',
        '"Buongiorno" si usa al mattino; "Buonanotte" si dice prima di dormire.'),
      ex('Completa: "___ per il tuo aiuto."', ['Ciao', 'Grazie', 'Arrivederci'], 'B', '"Grazie" si usa per ringraziare.'),
    ],
    closing: 'Lezione completata, {name}! Oggi hai praticato i saluti. A presto!',
  }],
  ru: [{
    id: 'privetstviya', title: 'Приветствия', icon: 'chat', order: 1,
    newWords: ['привет', 'здравствуйте', 'спасибо', 'пожалуйста', 'до свидания'],
    greeting: 'Привет, {name}! Как дела сегодня? Сегодня мы научимся здороваться по-русски. Готов начать?',
    intro: 'Отлично, {name}! Сразу к делу.',
    explanations: [
      'Утром говорят "Доброе утро", а в любое время — "Здравствуйте".',
      'Чтобы поблагодарить, говорят "Спасибо", а чтобы быть вежливым, "Пожалуйста".',
      'На прощание говорят "До свидания".',
    ],
    doubt: 'Есть вопросы перед практикой?', practice: 'Отлично! Давай практиковаться.',
    exercises: [
      ex('Выбери правильный вариант: Утром я говорю "___".', ['Доброе утро', 'Спокойной ночи', 'До свидания'], 'A',
        '"Доброе утро" говорят утром, а "Спокойной ночи" — перед сном.'),
      ex('Закончи фразу: "___ за помощь."', ['Привет', 'Спасибо', 'Пока'], 'B', '"Спасибо" говорят, чтобы поблагодарить.'),
    ],
    closing: 'Урок завершён, {name}! Сегодня ты практиковал приветствия. До встречи!',
  }],
};
