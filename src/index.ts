export const minmax = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

export const inRange = (value: number, min: number, max: number) => {
  return Object.is(value, minmax(value, min, max));
};

export const chunk = <TElement>(list: TElement[], size: number) => {
  const result: TElement[][] = [];

  for (let start = 0; start < list.length; start += size) {
    result.push(list.slice(start, start + size));
  }

  return result;
};

type CallbackFn<TArgs extends unknown[], TReturn> = (...args: TArgs) => TReturn;

export const promiseTry = <TArgs extends unknown[], TReturn>(
  callbackFn: CallbackFn<TArgs, TReturn>,
  ...args: TArgs
) => {
  return new Promise<TReturn>((resolve) => {
    const result = callbackFn(...args);
    resolve(result);
  });
};

export const mapGroupBy = <TElement, TKey>(
  list: TElement[],
  callbackFn: CallbackFn<[TElement, number], TKey>
) => {
  const result = new Map<TKey, TElement[]>();

  Array.from(list).forEach((item, index) => {
    const key = callbackFn(item, index);
    const group = result.get(key);

    if (Array.isArray(group)) {
      group.push(item);
    } else {
      result.set(key, [item]);
    }
  });

  return result;
};

const bootstrap = async () => {
  const response = await fetch("http://127.0.0.1:8080", {
    body: JSON.stringify({ message: "xx" }),
    method: "POST",
  });
  const reader = response.body?.getReader();

  if (!reader) {
    throw new Error("reader is falsy");
  }

  const textDecoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    const data = textDecoder.decode(value, { stream: true });

    console.log("chunk: ", data);
  }

  textDecoder.decode();
};

import("./serve");
