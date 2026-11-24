// Espelham MockChapterCatalog e GameType do app Flutter (5 capítulos por jogo, 25 no total; títulos = chapterTitles dos currículos).
const CHAPTER_SEEDS = [
  { title: 'Natureza, Comida & Primeiros Contatos', theme: 'fox' },
  { title: 'Cores, Números & Cidade', theme: 'bear' },
  { title: 'Pessoas, Trabalho & Conversa', theme: 'dog' },
  { title: 'Terra, Céu & Ciência', theme: 'owl' },
  { title: 'Corpo, Cidade & Mundo', theme: 'lion' },
  { title: 'Bichos, Casa & Corpo', theme: 'cat' },
  { title: 'Dia a Dia & Lazer', theme: 'horse' },
  { title: 'Mundo, Ciência & Arte', theme: 'kangaroo' },
  { title: 'Ofícios, Viagem & Tecnologia', theme: 'rabbit' },
  { title: 'Cotidiano, Festa & Sabor', theme: 'giraffe' },
  { title: 'Verbos & Perguntas Básicas', theme: 'elephant' },
  { title: 'Dia a Dia & Situações', theme: 'owl' },
  { title: 'Expressões & Conversa Real', theme: 'lion' },
  { title: 'Trabalho, Viagem & Saúde', theme: 'fox' },
  { title: 'Argumentos & Idiomatismos', theme: 'bear' },
  { title: 'Fale & Brilhe', theme: 'frog' },
  { title: 'Conversa em Ação', theme: 'panda' },
  { title: 'Papo de Gente Grande', theme: 'parrot' },
  { title: 'Voz de Viajante', theme: 'dog' },
  { title: 'Falar com Confiança', theme: 'cat' },
  { title: 'Bichos & Natureza em Imagens', theme: 'panda' },
  { title: 'Comida & Casa em Imagens', theme: 'rabbit' },
  { title: 'Cidade & Transporte em Imagens', theme: 'horse' },
  { title: 'Gente & Ações em Imagens', theme: 'parrot' },
  { title: 'Mundo em Imagens', theme: 'frog' },
];

const GAME_TYPES = ['true_false', 'pairs', 'translation', 'pronunciation', 'image'];

module.exports = { CHAPTER_SEEDS, GAME_TYPES };
