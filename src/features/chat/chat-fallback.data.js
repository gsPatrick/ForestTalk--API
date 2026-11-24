// Roteiro de teste (sem OPENAI_API_KEY), portado de chat_script_*.dart. Cicla quando acaba.
const L = (text, translation, transliteration) => (transliteration ? { text, translation, transliteration } : { text, translation });

module.exports = {
  en: {
    greeting: L("Hi! I'm happy to talk with you. What is your name?", 'Oi! Fico feliz em conversar com você. Qual é o seu nome?'),
    turns: [
      { user: L('My name is Ana. Nice to meet you!', 'Meu nome é Ana. Prazer em conhecer você!'), ai: L('Nice to meet you, Ana! How are you today?', 'Prazer, Ana! Como você está hoje?') },
      { user: L('I am fine, thank you. And you?', 'Estou bem, obrigada. E você?'), ai: L('I am great! Do you like animals?', 'Estou ótimo! Você gosta de animais?') },
      { user: L('Yes, I love animals!', 'Sim, eu adoro animais!'), ai: L("Me too! Let's talk again soon. Bye!", 'Eu também! Vamos conversar de novo em breve. Tchau!') },
    ],
  },
  es: {
    greeting: L('¡Hola! Me alegra hablar contigo. ¿Cómo te llamas?', 'Olá! Fico feliz em falar com você. Qual é o seu nome?'),
    turns: [
      { user: L('Me llamo Ana. ¡Mucho gusto!', 'Meu nome é Ana. Muito prazer!'), ai: L('¡Mucho gusto, Ana! ¿Cómo estás hoy?', 'Muito prazer, Ana! Como você está hoje?') },
      { user: L('Estoy bien, gracias. ¿Y tú?', 'Estou bem, obrigada. E você?'), ai: L('¡Muy bien! ¿Te gustan los animales?', 'Muito bem! Você gosta de animais?') },
      { user: L('¡Sí, me encantan los animales!', 'Sim, eu adoro os animais!'), ai: L('¡A mí también! Hablamos pronto. ¡Adiós!', 'Eu também! Falamos em breve. Tchau!') },
    ],
  },
  fr: {
    greeting: L('Salut ! Je suis content de parler avec toi. Comment tu t\'appelles ?', 'Oi! Fico feliz em falar com você. Como você se chama?'),
    turns: [
      { user: L("Je m'appelle Ana. Enchantée !", 'Meu nome é Ana. Muito prazer!'), ai: L('Enchanté, Ana ! Comment ça va aujourd\'hui ?', 'Prazer, Ana! Como vai você hoje?') },
      { user: L('Ça va bien, merci. Et toi ?', 'Vou bem, obrigada. E você?'), ai: L('Très bien ! Tu aimes les animaux ?', 'Muito bem! Você gosta de animais?') },
      { user: L("Oui, j'adore les animaux !", 'Sim, eu adoro animais!'), ai: L('Moi aussi ! À bientôt. Au revoir !', 'Eu também! Até breve. Tchau!') },
    ],
  },
  it: {
    greeting: L('Ciao! Sono felice di parlare con te. Come ti chiami?', 'Oi! Fico feliz em falar com você. Qual é o seu nome?'),
    turns: [
      { user: L('Mi chiamo Ana. Piacere!', 'Meu nome é Ana. Prazer!'), ai: L('Piacere, Ana! Come stai oggi?', 'Prazer, Ana! Como você está hoje?') },
      { user: L('Sto bene, grazie. E tu?', 'Estou bem, obrigada. E você?'), ai: L('Benissimo! Ti piacciono gli animali?', 'Ótimo! Você gosta de animais?') },
      { user: L('Sì, adoro gli animali!', 'Sim, eu adoro os animais!'), ai: L('Anch\'io! A presto. Ciao!', 'Eu também! Até breve. Tchau!') },
    ],
  },
  ru: {
    greeting: L("Привет! Я рад поговорить с тобой. Как тебя зовут?", 'Oi! Fico feliz em falar com você. Qual é o seu nome?', "Privet! Ya rad pogovorit' s toboy. Kak tebya zovut?"),
    turns: [
      { user: L('Меня зовут Ана. Очень приятно!', 'Meu nome é Ana. Muito prazer!', "Menya zovut Ana. Ochen' priyatno!"), ai: L('Очень приятно, Ана! Как дела сегодня?', 'Muito prazer, Ana! Como vai você hoje?', "Ochen' priyatno, Ana! Kak dela segodnya?") },
      { user: L('Хорошо, спасибо. А у тебя?', 'Bem, obrigada. E você?', 'Khorosho, spasibo. A u tebya?'), ai: L('Отлично! Ты любишь животных?', 'Ótimo! Você gosta de animais?', "Otlichno! Ty lyubish' zhivotnykh?") },
      { user: L('Да, я люблю животных!', 'Sim, eu amo animais!', 'Da, ya lyublyu zhivotnykh!'), ai: L('Я тоже! До скорой встречи. Пока!', 'Eu também! Até breve. Tchau!', 'Ya tozhe! Do skoroy vstrechi. Poka!') },
    ],
  },
  de: {
    greeting: L('Hallo! Ich freue mich, mit dir zu sprechen. Wie heißt du?', 'Oi! Fico feliz em falar com você. Qual é o seu nome?'),
    turns: [
      { user: L('Ich heiße Ana. Freut mich!', 'Meu nome é Ana. Prazer!'), ai: L('Freut mich, Ana! Wie geht es dir heute?', 'Prazer, Ana! Como você está hoje?') },
      { user: L('Mir geht es gut, danke. Und dir?', 'Estou bem, obrigada. E você?'), ai: L('Sehr gut! Magst du Tiere?', 'Muito bem! Você gosta de animais?') },
      { user: L('Ja, ich liebe Tiere!', 'Sim, eu adoro animais!'), ai: L('Ich auch! Bis bald. Tschüss!', 'Eu também! Até breve. Tchau!') },
    ],
  },
  th: {
    greeting: L('สวัสดี! ฉันดีใจที่ได้คุยกับคุณ คุณชื่ออะไร', 'Oi! Fico feliz em falar com você. Qual é o seu nome?', 'Sawatdi! Chan di chai thi dai khui kap khun. Khun chue arai?'),
    turns: [
      { user: L('ฉันชื่ออานา ยินดีที่ได้รู้จัก', 'Meu nome é Ana. Prazer!', 'Chan chue Ana. Yindi thi dai ru chak.'), ai: L('ยินดีที่ได้รู้จักเหมือนกัน อานา วันนี้เป็นอย่างไรบ้าง', 'Prazer, Ana! Como você está hoje?', 'Yindi thi dai ru chak muean kan, Ana. Wan ni pen yangrai bang?') },
      { user: L('สบายดี ขอบคุณ แล้วคุณล่ะ', 'Estou bem, obrigada. E você?', 'Sabai di, khop khun. Laeo khun la?'), ai: L('ดีมาก! คุณชอบสัตว์ไหม', 'Muito bem! Você gosta de animais?', 'Di mak! Khun chop sat mai?') },
      { user: L('ชอบ ฉันรักสัตว์!', 'Sim, eu adoro animais!', 'Chop, chan rak sat!'), ai: L('ฉันก็เหมือนกัน! แล้วคุยกันใหม่นะ ลาก่อน', 'Eu também! Até breve. Tchau!', 'Chan ko muean kan! Laeo khui kan mai na. La kon.') },
    ],
  },
  ja: {
    greeting: L('こんにちは！あなたと話せてうれしいです。お名前は？', 'Oi! Fico feliz em falar com você. Qual é o seu nome?', 'Konnichiwa! Anata to hanasete ureshii desu. O-namae wa?'),
    turns: [
      { user: L('アナです。はじめまして！', 'Meu nome é Ana. Prazer!', 'Ana desu. Hajimemashite!'), ai: L('はじめまして、アナさん！今日は元気ですか？', 'Prazer, Ana! Como você está hoje?', 'Hajimemashite, Ana-san! Kyō wa genki desu ka?') },
      { user: L('元気です、ありがとう。あなたは？', 'Estou bem, obrigada. E você?', 'Genki desu, arigatō. Anata wa?'), ai: L('とても元気です！動物は好きですか？', 'Muito bem! Você gosta de animais?', 'Totemo genki desu! Dōbutsu wa suki desu ka?') },
      { user: L('はい、動物が大好きです！', 'Sim, eu adoro animais!', 'Hai, dōbutsu ga daisuki desu!'), ai: L('私もです！また話しましょう。さようなら！', 'Eu também! Até breve. Tchau!', 'Watashi mo desu! Mata hanashimashō. Sayōnara!') },
    ],
  },
  zh: {
    greeting: L('你好！很高兴和你聊天。你叫什么名字？', 'Oi! Fico feliz em falar com você. Qual é o seu nome?', 'Nǐ hǎo! Hěn gāoxìng hé nǐ liáotiān. Nǐ jiào shénme míngzi?'),
    turns: [
      { user: L('我叫安娜。很高兴认识你！', 'Meu nome é Ana. Prazer!', 'Wǒ jiào Ānnà. Hěn gāoxìng rènshi nǐ!'), ai: L('很高兴认识你，安娜！你今天怎么样？', 'Prazer, Ana! Como você está hoje?', 'Hěn gāoxìng rènshi nǐ, Ānnà! Nǐ jīntiān zěnmeyàng?') },
      { user: L('我很好，谢谢。你呢？', 'Estou bem, obrigada. E você?', 'Wǒ hěn hǎo, xièxie. Nǐ ne?'), ai: L('我也很好！你喜欢动物吗？', 'Muito bem! Você gosta de animais?', 'Wǒ yě hěn hǎo! Nǐ xǐhuan dòngwù ma?') },
      { user: L('喜欢，我爱动物！', 'Sim, eu adoro animais!', 'Xǐhuan, wǒ ài dòngwù!'), ai: L('我也是！下次再聊。再见！', 'Eu também! Até breve. Tchau!', 'Wǒ yě shì! Xià cì zài liáo. Zàijiàn!') },
    ],
  },
};
