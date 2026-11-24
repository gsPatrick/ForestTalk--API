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
  de: {
    hi: 'Hallo', ask: 'Wie geht es dir heute?',
    topic: (t) => `Heute sprechen wir über "${t}".`, scenario: (t) => `Üben wir dieses Szenario: "${t}".`,
    free: () => 'Lass uns plaudern.', lesson: () => 'Üben wir Deutsch.',
  },
  th: {
    hi: 'สวัสดี', ask: 'วันนี้เป็นอย่างไรบ้าง',
    topic: (t) => `วันนี้เรามาคุยกันเรื่อง "${t}"`, scenario: (t) => `มาฝึกสถานการณ์นี้กัน: "${t}"`,
    free: () => 'มาคุยกันเถอะ', lesson: () => 'มาฝึกภาษาไทยกัน',
  },
  ja: {
    hi: 'こんにちは', ask: '今日は元気ですか？',
    topic: (t) => `今日は「${t}」について話しましょう。`, scenario: (t) => `このシーンを練習しましょう：「${t}」`,
    free: () => 'おしゃべりしましょう。', lesson: () => '日本語を練習しましょう。',
  },
  zh: {
    hi: '你好', ask: '你今天怎么样？',
    topic: (t) => `今天我们聊聊"${t}"。`, scenario: (t) => `我们来练习这个场景："${t}"。`,
    free: () => '我们聊聊天吧。', lesson: () => '我们来练习中文吧。',
  },
};
