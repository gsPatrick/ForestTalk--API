// Fases de particionamento do `Sort` do Dart (dart-sdk/lib/internal/sort.dart). Usado só por dart-sort.js.

function partitionDistinct(a, state, pivot1, pivot2, compare) {
  let { less, great } = state;
  for (let k = less; k <= great; k += 1) {
    const ak = a[k];
    if (compare(ak, pivot1) < 0) {
      if (k !== less) {
        a[k] = a[less];
        a[less] = ak;
      }
      less += 1;
    } else if (compare(ak, pivot2) > 0) {
      for (;;) {
        if (compare(a[great], pivot2) > 0) {
          great -= 1;
          if (great < k) break;
          continue;
        }
        if (compare(a[great], pivot1) < 0) {
          a[k] = a[less];
          a[less] = a[great];
          less += 1;
          a[great] = ak;
          great -= 1;
        } else {
          a[k] = a[great];
          a[great] = ak;
          great -= 1;
        }
        break;
      }
    }
  }
  return { less, great };
}

function partitionEqualPivots(a, state, pivot, compare) {
  let { less, great } = state;
  for (let k = less; k <= great; k += 1) {
    const ak = a[k];
    let comp = compare(ak, pivot);
    if (comp === 0) continue;
    if (comp < 0) {
      if (k !== less) {
        a[k] = a[less];
        a[less] = ak;
      }
      less += 1;
    } else {
      for (;;) {
        comp = compare(a[great], pivot);
        if (comp > 0) {
          great -= 1;
          continue;
        }
        if (comp < 0) {
          a[k] = a[less];
          a[less] = a[great];
          less += 1;
          a[great] = ak;
          great -= 1;
        } else {
          a[k] = a[great];
          a[great] = ak;
          great -= 1;
        }
        break;
      }
    }
  }
  return { less, great };
}

function partitionPivotValues(a, state, pivot1, pivot2, compare) {
  let { less, great } = state;
  for (let k = less; k <= great; k += 1) {
    const ak = a[k];
    if (compare(ak, pivot1) === 0) {
      if (k !== less) {
        a[k] = a[less];
        a[less] = ak;
      }
      less += 1;
    } else if (compare(ak, pivot2) === 0) {
      for (;;) {
        if (compare(a[great], pivot2) === 0) {
          great -= 1;
          if (great < k) break;
          continue;
        }
        if (compare(a[great], pivot1) < 0) {
          a[k] = a[less];
          a[less] = a[great];
          less += 1;
          a[great] = ak;
          great -= 1;
        } else {
          a[k] = a[great];
          a[great] = ak;
          great -= 1;
        }
        break;
      }
    }
  }
  return { less, great };
}

module.exports = { partitionDistinct, partitionEqualPivots, partitionPivotValues };
