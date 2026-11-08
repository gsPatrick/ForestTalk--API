// Porte fiel de `List.sort` do Dart (dart-sdk/lib/internal/sort.dart). Ele NÃO é estável acima de
// 33 elementos; replicar o algoritmo mantém os distratores do jogo Tradução idênticos aos do app.
const { partitionDistinct, partitionEqualPivots, partitionPivotValues } = require('./dart-sort-partitions');

const THRESHOLD = 32;

function insertionSort(a, left, right, compare) {
  for (let i = left + 1; i <= right; i += 1) {
    const el = a[i];
    let j = i;
    while (j > left && compare(a[j - 1], el) > 0) {
      a[j] = a[j - 1];
      j -= 1;
    }
    a[j] = el;
  }
}

function doSort(a, left, right, compare) {
  if (right - left <= THRESHOLD) insertionSort(a, left, right, compare);
  else dualPivotQuicksort(a, left, right, compare);
}

/** Ordena 5 elementos candidatos a pivô (rede de comparações do Dart). Devolve [e1..e5]. */
function sortFive(e, compare) {
  const swap = (x, y) => {
    if (compare(e[x], e[y]) > 0) [e[x], e[y]] = [e[y], e[x]];
  };
  swap(0, 1);
  swap(3, 4);
  swap(0, 2);
  swap(1, 2);
  swap(0, 3);
  swap(2, 3);
  swap(1, 4);
  swap(1, 2);
  swap(3, 4);
  return e;
}

function dualPivotQuicksort(a, left, right, compare) {
  const sixth = Math.trunc((right - left + 1) / 6);
  const index1 = left + sixth;
  const index5 = right - sixth;
  const index3 = Math.trunc((left + right) / 2);
  const index2 = index3 - sixth;
  const index4 = index3 + sixth;
  const [el1, el2, el3, el4, el5] = sortFive([a[index1], a[index2], a[index3], a[index4], a[index5]], compare);
  const pivot1 = el2;
  const pivot2 = el4;
  a[index1] = el1;
  a[index3] = el3;
  a[index5] = el5;
  a[index2] = a[left];
  a[index4] = a[right];

  const pivotsAreEqual = compare(pivot1, pivot2) === 0;
  const start = { less: left + 1, great: right - 1 };
  let { less, great } = pivotsAreEqual
    ? partitionEqualPivots(a, start, pivot1, compare)
    : partitionDistinct(a, start, pivot1, pivot2, compare);

  a[left] = a[less - 1];
  a[less - 1] = pivot1;
  a[right] = a[great + 1];
  a[great + 1] = pivot2;

  doSort(a, left, less - 2, compare);
  doSort(a, great + 2, right, compare);
  if (pivotsAreEqual) return;

  if (less < index1 && great > index5) {
    while (compare(a[less], pivot1) === 0) less += 1;
    while (compare(a[great], pivot2) === 0) great -= 1;
    ({ less, great } = partitionPivotValues(a, { less, great }, pivot1, pivot2, compare));
  }
  doSort(a, less, great, compare);
}

/** `list..sort(compare)` do Dart, em uma cópia. */
function dartSort(list, compare) {
  const copy = [...list];
  doSort(copy, 0, copy.length - 1, compare);
  return copy;
}

module.exports = { dartSort };
