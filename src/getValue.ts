export function getValue(...params: number[]) {
  const list = [...new Set(params)];
  const result: number[] = [];

  const startPoint = list.find((i) => {
    const restList = list.filter((el) => el !== i);
    const centerExcepted = i + 10;
    const endExcepted = centerExcepted + 5;

    const centerValue = restList.find((item) =>
      isInRange(item, centerExcepted - 3, centerExcepted + 3)
    );

    const endValue = restList.find((item) =>
      isInRange(item, endExcepted - 3, endExcepted + 3)
    );

    if (centerValue && endValue) {
      result[0] = i;
      result[1] = centerValue;
      result[2] = endValue;
      return true;
    }

    return false;
  });

  if (!startPoint) {
    return getFallback(...params);
  }

  return result;
}

function isInRange(value: number, min: number, max: number) {
  return value === minmax(value, min, max);
}

function minmax(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getFallback(...params: number[]) {
  const list = [...new Set(params)];
  const minValue = Math.min(...list);
  const maxValue = Math.max(...list);
  const midExcepted = ((minValue + maxValue) / 2) + 2.5;
  const midValue =
    list.sort((p, n) =>
      Math.abs(p - midExcepted) - Math.abs(n - midExcepted)
    )[0];

  return [minValue, midValue, maxValue];
}

console.log(
  getValue(185, 196, 201, 185),
);
