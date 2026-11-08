// Espelha ShopCatalog (shop_catalog.dart).
const SHOP_ITEMS = [
  { id: 'fifty_1', emoji: '✂️', title: '50%', description: 'Tira 2 opções erradas na Tradução', price: 30, fifty: 1, hint: 0 },
  { id: 'hint_1', emoji: '💡', title: 'Dica', description: 'Mostra a primeira letra da resposta', price: 20, fifty: 0, hint: 1 },
  {
    id: 'kit_3',
    emoji: '🎒',
    title: 'Kit do Explorador',
    description: '3× 50% + 3× Dica (economiza 30 moedas)',
    price: 120,
    fifty: 3,
    hint: 3,
  },
];

module.exports = { SHOP_ITEMS };
