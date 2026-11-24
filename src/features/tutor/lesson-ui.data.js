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
  de: {
    right: 'Richtig, {name}! Weiter zur nächsten.',
    wrong: 'Fast, {name}. Die richtige Antwort ist {key}) {text}.',
    pick: 'Wähle A, B oder C, {name}.',
  },
  th: {
    right: 'ถูกต้อง {name}! ไปข้อต่อไปกัน',
    wrong: 'เกือบถูกแล้ว {name} คำตอบที่ถูกคือ {key}) {text}',
    pick: 'เลือก A, B หรือ C เพื่อตอบ {name}',
  },
  ja: {
    right: '正解です、{name}さん！次に進みましょう。',
    wrong: '惜しいです、{name}さん。正解は {key}) {text} です。',
    pick: 'A、B、Cから選んでください、{name}さん。',
  },
  zh: {
    right: '答对了，{name}！我们继续下一题。',
    wrong: '差一点，{name}。正确答案是 {key}) {text}。',
    pick: '请选择 A、B 或 C，{name}。',
  },
};
