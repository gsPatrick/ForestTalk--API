// Pacotes de moedas (compra com dinheiro real). Espelham o catálogo da loja do app.
const PRODUCT_PREFIX = 'com.foresttalk.app.';

const pack = (id, p) => ({ id, fifty: 0, hint: 0, badge: null, storeProductId: `${PRODUCT_PREFIX}${id}`, ...p });

const COIN_PACKS = [
  pack('coins_400', { title: '400 moedas', coins: 400, price: 'R$ 6,90', priceCents: 690, emoji: '🪙' }),
  pack('coins_1200', { title: '1.200 moedas', coins: 1200, price: 'R$ 17,90', priceCents: 1790, emoji: '💰' }),
  pack('coins_2750', {
    title: '2.750 moedas', coins: 2750, price: 'R$ 34,90', priceCents: 3490, emoji: '🎁', badge: 'Mais popular',
  }),
  pack('coins_6000', { title: '6.000 moedas', coins: 6000, price: 'R$ 69,90', priceCents: 6990, emoji: '🧰' }),
  pack('coins_17500', {
    title: '17.500 moedas', coins: 17500, price: 'R$ 169,90', priceCents: 16990, emoji: '👑', badge: 'Melhor custo',
  }),
  pack('pack_explorer', {
    title: 'Pacote Explorador', coins: 1500, fifty: 10, hint: 10, price: 'R$ 19,90', priceCents: 1990, emoji: '🎒', badge: 'Pacote',
  }),
];

module.exports = { COIN_PACKS, PRODUCT_PREFIX };
