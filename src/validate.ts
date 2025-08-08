const minmax = (num: number, min: number, max: number) => {
  return Math.min(Math.max(num, min), max);
};

const interval = (num: number, min: number, max: number) => {
  return Object.is(num, minmax(num, min, max));
};

type CellValue = null | number;
type CellValueTuple = [CellValue, CellValue, CellValue];

const getCellValue = (cursor: number, list: number[]): CellValueTuple => {
  const cursorInList = list.includes(cursor);

  if (!cursorInList) {
    return [null, null, null];
  }

  const second = params.find((i) => {
    const excepted = cursor + 10;
    return interval(i, excepted - 3, excepted + 3);
  });

  if (!second) {
    return [cursor, null, null];
  }

  const third = params.find((i) => {
    const excepted = second + 5;
    return interval(i, excepted - 3, excepted + 3);
  });

  if (!third) {
    return [cursor, second, null];
  }

  return [cursor, second, third];
};

const numbersToCellValueMap = (params: number[]) => {
  const numberToCellValueMap = new Map<number, CellValueTuple>();

  return params.reduce((numberToCellValueMap, i) => {
    const cellValues = getCellValue(i, params);
    numberToCellValueMap.set(i, cellValues);

    return numberToCellValueMap;
  }, numberToCellValueMap);
};

const getIsOk = (params: number[]) => {
  const numberToCellValueMap = numbersToCellValueMap(params);
  const isOk = [...numberToCellValueMap.entries()].some(([, tuple]) => {
    return tuple.every((value) => typeof value === "number");
  });
  return [isOk, numberToCellValueMap] as const;
};

// const params = [185, 195, 196, 200];
// const params = [209, 210, 198, 216];
// const params = [198, 209, 210, 209];
// const params = [210];
// const params = [190, 206, 200, 189];
// const params = [199, 189, 206];
const params = [205, 212, 194];
const [isOk, numberToCellValueMap] = getIsOk(params);

console.log(
  `Validation passed with cursors: ${JSON.stringify(
    Object.fromEntries(numberToCellValueMap.entries()),
    null,
    2
  )}`
);

console.log(
  `Validation result: ${isOk ? "OK" : "FAIL"} for params: ${params.join(", ")}`
);
