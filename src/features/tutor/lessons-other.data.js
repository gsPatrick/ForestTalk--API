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
  de: [{
    id: 'begruessungen', title: 'Begrüßungen', icon: 'chat', order: 1,
    newWords: ['Hallo', 'Guten Morgen', 'Danke', 'Bitte', 'Tschüss'],
    greeting: 'Hallo, {name}! Wie geht es dir heute? Heute lernen wir, auf Deutsch zu grüßen. Bereit?',
    intro: 'Sehr gut, {name}! Fangen wir gleich an.',
    explanations: [
      'Am Morgen sagt man "Guten Morgen".',
      'Zum Danken sagt man "Danke", und um höflich zu sein, "Bitte".',
      'Zum Abschied sagt man "Tschüss".',
    ],
    doubt: 'Hast du noch eine Frage vor dem Üben?', practice: 'Perfekt! Üben wir.',
    exercises: [
      ex('Wähle die richtige Antwort: Am Morgen sage ich "___".', ['Guten Morgen', 'Gute Nacht', 'Tschüss'], 'A',
        '"Guten Morgen" sagt man am Morgen; "Gute Nacht" sagt man vor dem Schlafen.'),
      ex('Ergänze: "___ für deine Hilfe."', ['Hallo', 'Danke', 'Tschüss'], 'B', '"Danke" sagt man, um sich zu bedanken.'),
    ],
    closing: 'Lektion beendet, {name}! Heute hast du Begrüßungen geübt. Bis bald!',
  }],
  th: [{
    id: 'kan-thak-thai', title: 'การทักทาย', icon: 'chat', order: 1,
    newWords: ['สวัสดี', 'ขอบคุณ', 'ขอโทษ', 'ลาก่อน', 'ยินดีที่ได้รู้จัก'],
    greeting: 'สวัสดี {name}! วันนี้เป็นอย่างไรบ้าง วันนี้เราจะเรียนการทักทายเป็นภาษาไทย พร้อมไหม',
    intro: 'เยี่ยมมาก {name}! เริ่มกันเลย',
    explanations: [
      'เวลาพบกันเราพูดว่า "สวัสดี"',
      'เวลาขอบคุณเราพูดว่า "ขอบคุณ" และเวลาขอโทษเราพูดว่า "ขอโทษ"',
      'เวลาจากกันเราพูดว่า "ลาก่อน"',
    ],
    doubt: 'มีคำถามก่อนเริ่มฝึกไหม', practice: 'ยอดเยี่ยม! มาฝึกกันเลย',
    exercises: [
      ex('เลือกคำตอบที่ถูก: เมื่อพบเพื่อน ฉันพูดว่า "___"', ['สวัสดี', 'ลาก่อน', 'ขอโทษ'], 'A',
        '"สวัสดี" ใช้เมื่อพบกัน ส่วน "ลาก่อน" ใช้เมื่อจากกัน'),
      ex('เติมคำ: "___ ที่ช่วยฉัน"', ['สวัสดี', 'ขอบคุณ', 'ลาก่อน'], 'B', '"ขอบคุณ" ใช้เมื่อต้องการขอบคุณ'),
    ],
    closing: 'จบบทเรียนแล้ว {name}! วันนี้คุณฝึกการทักทาย แล้วพบกันใหม่',
  }],
  ja: [{
    id: 'aisatsu', title: 'あいさつ', icon: 'chat', order: 1,
    newWords: ['こんにちは', 'おはよう', 'ありがとう', 'すみません', 'さようなら'],
    greeting: 'こんにちは、{name}さん！今日は元気ですか？今日は日本語のあいさつを勉強します。準備はいいですか？',
    intro: 'いいですね、{name}さん！さっそく始めましょう。',
    explanations: [
      '朝は「おはよう」と言います。',
      'お礼を言うときは「ありがとう」、謝るときは「すみません」と言います。',
      '別れるときは「さようなら」と言います。',
    ],
    doubt: '練習の前に質問はありますか？', practice: 'すばらしい！練習しましょう。',
    exercises: [
      ex('正しい答えを選んでください：朝、私は「___」と言います。', ['おはよう', 'おやすみ', 'さようなら'], 'A',
        '「おはよう」は朝に言います。「おやすみ」は寝る前に言います。'),
      ex('文を完成させてください：「手伝ってくれて___」', ['こんにちは', 'ありがとう', 'さようなら'], 'B', '「ありがとう」は感謝を伝えるときに使います。'),
    ],
    closing: 'レッスン終了です、{name}さん！今日はあいさつを練習しました。またね！',
  }],
  zh: [{
    id: 'wenhou', title: '问候', icon: 'chat', order: 1,
    newWords: ['你好', '早上好', '谢谢', '不客气', '再见'],
    greeting: '你好，{name}！你今天怎么样？今天我们来学习用中文打招呼。准备好了吗？',
    intro: '太好了，{name}！我们马上开始。',
    explanations: [
      '早上见面时说"早上好"。',
      '表示感谢时说"谢谢"，别人谢你时可以说"不客气"。',
      '分别的时候说"再见"。',
    ],
    doubt: '练习之前有问题吗？', practice: '很好！我们开始练习吧。',
    exercises: [
      ex('选择正确的答案：早上我说"___"。', ['早上好', '晚安', '再见'], 'A',
        '"早上好"在早上说，"晚安"在睡觉前说。'),
      ex('完成句子："___你的帮助。"', ['你好', '谢谢', '再见'], 'B', '"谢谢"用来表示感谢。'),
    ],
    closing: '课程结束了，{name}！今天你练习了问候语。下次见！',
  }],
};
