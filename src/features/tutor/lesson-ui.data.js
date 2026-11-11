// Frases fixas do tutor por idioma da aula. `{name}`, `{key}` e `{text}` são substituídos pelo motor.
module.exports = {
  en: {
    right: "Correct, {name}! Let's move on to the next one.",
    wrong: 'Almost, {name}. The correct answer is {key}) {text}.',
    pick: 'Choose A, B or C to answer, {name}.',
  },
  es: {
    right: '¡Correcto, {name}! Vamos con la siguiente.',
    wrong: 'Casi, {name}. La respuesta correcta es {key}) {text}.',
    pick: 'Elige A, B o C para responder, {name}.',
  },
  fr: {
    right: 'Correct, {name} ! Passons à la suite.',
    wrong: 'Presque, {name}. La bonne réponse est {key}) {text}.',
    pick: 'Choisis A, B ou C pour répondre, {name}.',
  },
  it: {
    right: 'Corretto, {name}! Passiamo alla prossima.',
    wrong: 'Quasi, {name}. La risposta corretta è {key}) {text}.',
    pick: 'Scegli A, B o C per rispondere, {name}.',
  },
  ru: {
    right: 'Верно, {name}! Переходим дальше.',
    wrong: 'Почти, {name}. Правильный ответ {key}) {text}.',
    pick: 'Выбери A, B или C, {name}.',
  },
};
