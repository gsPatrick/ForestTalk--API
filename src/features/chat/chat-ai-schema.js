// JSON Schema (Structured Outputs, modo estrito) da fala devolvida pela IA: `ChatLine` do app.
// No modo estrito toda propriedade é obrigatória e `additionalProperties` é false.
function chatLineSchema(languageCode) {
  const properties = { text: { type: 'string' }, translation: { type: 'string' } };
  if (languageCode === 'ru') properties.transliteration = { type: 'string' };
  return {
    name: 'chat_line',
    schema: { type: 'object', properties, required: Object.keys(properties), additionalProperties: false },
  };
}

module.exports = { chatLineSchema };
