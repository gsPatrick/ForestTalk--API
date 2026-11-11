// Saudação da conversa livre/tópico/cenário: sempre no idioma estudado (o tutor não mistura português).
module.exports = {
  en: {
    hi: 'Hi', ask: 'How are you today?',
    topic: (t) => `Today let's talk about "${t}".`, scenario: (t) => `Let's practice this scenario: "${t}".`,
    free: () => "Let's have a chat.", lesson: () => "Let's practice English.",
  },
  es: {
    hi: 'Hola', ask: '¿Cómo estás hoy?',
    topic: (t) => `Hoy hablamos de "${t}".`, scenario: (t) => `Vamos a practicar este escenario: "${t}".`,
    free: () => 'Vamos a charlar.', lesson: () => 'Vamos a practicar español.',
  },
  fr: {
    hi: 'Salut', ask: "Comment vas-tu aujourd'hui ?",
    topic: (t) => `Aujourd'hui, parlons de "${t}".`, scenario: (t) => `Pratiquons ce scénario : "${t}".`,
    free: () => 'Discutons un peu.', lesson: () => 'Pratiquons le français.',
  },
  it: {
    hi: 'Ciao', ask: 'Come stai oggi?',
    topic: (t) => `Oggi parliamo di "${t}".`, scenario: (t) => `Esercitiamoci con questo scenario: "${t}".`,
    free: () => 'Facciamo due chiacchiere.', lesson: () => "Esercitiamoci con l'italiano.",
  },
  ru: {
    hi: 'Привет', ask: 'Как дела сегодня?',
    topic: (t) => `Сегодня поговорим о "${t}".`, scenario: (t) => `Давай отработаем этот сценарий: "${t}".`,
    free: () => 'Давай поболтаем.', lesson: () => 'Давай практиковать русский.',
  },
};
