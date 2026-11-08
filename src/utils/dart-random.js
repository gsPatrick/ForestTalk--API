// Porte fiel do `Random(seed)` da Dart VM (iOS/Android) e do `List.shuffle`, para a API
// embaralhar os jogos exatamente como o app (mesma fase + idioma = mesma ordem).
// Fonte: dart-sdk/lib/_internal/vm/lib/math_patch.dart e lib/collection/list.dart.
const A = 0xffffda61n;
const MASK32 = 0xffffffffn;
const POW2_32 = 2 ** 32;
const wrap = (n) => BigInt.asIntN(64, n);
const shr = (n, bits) => BigInt.asUintN(64, n) >> BigInt(bits); // `>>>` do Dart

// Thomas Wang 64-bit mix, com a aritmética de 64 bits com sinal do Dart.
function setupSeed(seed) {
  let n = BigInt(seed);
  n = wrap(~n + (n << 21n));
  n ^= shr(n, 24);
  n = wrap(n * 265n);
  n ^= shr(n, 14);
  n = wrap(n * 21n);
  n ^= shr(n, 28);
  n = wrap(n + (n << 31n));
  return n === 0n ? 0x5a17n : n;
}

/** Equivalente a `Random(seed)` do Dart VM. */
function createDartRandom(seed) {
  let state = setupSeed(seed);
  const next = () => {
    state = BigInt.asUintN(64, A * (state & MASK32) + shr(state, 32));
  };
  for (let i = 0; i < 4; i += 1) next();

  return function nextInt(max) {
    if ((max & -max) === max) {
      next();
      return Number(state & MASK32) & (max - 1);
    }
    let rnd32;
    let result;
    do {
      next();
      rnd32 = Number(state & MASK32);
      result = rnd32 % max;
    } while (rnd32 - result + max > POW2_32);
    return result;
  };
}

/** `list..shuffle(random)` do Dart: devolve uma cópia embaralhada. */
function dartShuffle(list, nextInt) {
  const copy = [...list];
  let length = copy.length;
  while (length > 1) {
    const pos = nextInt(length);
    length -= 1;
    [copy[length], copy[pos]] = [copy[pos], copy[length]];
  }
  return copy;
}

// `String.hashCode` da Dart VM não é portável; os idiomas são só 5 (valores medidos no Dart).
const DART_LANGUAGE_HASH = { en: 140877528, es: 22745284, fr: 706175305, it: 383825714, ru: 252156293 };

module.exports = { createDartRandom, dartShuffle, DART_LANGUAGE_HASH };
