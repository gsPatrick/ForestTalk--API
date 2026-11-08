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
};
