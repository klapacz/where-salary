export type Result<T = any, E extends Error = Error> = [E] | [undefined, T];

export function must<R>(result: Result<R>): R {
  const [err, data] = result;
  if (err) throw err;
  return data;
}

export async function wrap<T>(p: Promise<T>): Promise<Result<T>> {
  try {
    return [undefined, await p];
  } catch (err) {
    return [err as Error];
  }
}
