export const toArray = <T>(value: unknown): T[] => {
  if (Array.isArray(value)) {
    return value as T[];
  }

  if (isPlainObject(value)) {
    return Object.entries(value as Record<string, T>)
      .sort(([a], [b]) =>
        a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
      )
      .map(([, item]) => item);
  }

  return [];
};

export const mergeContent = <T>(base: T, override: unknown): T => {
  return merge(base, override) as T;
};

const merge = (base: unknown, override: unknown): unknown => {
  if (override === undefined) {
    return clone(base);
  }

  if (override === null) {
    return null;
  }

  if (Array.isArray(override)) {
    const result = Array.isArray(base)
      ? (base as unknown[]).map((item) => clone(item))
      : [];

    override.forEach((item, index) => {
      result[index] = merge(result[index], item);
    });

    return result;
  }

  if (isPlainObject(override)) {
    const entries = Object.entries(override as Record<string, unknown>);
    const allNumericKeys =
      entries.length > 0 && entries.every(([key]) => isNumericKey(key));

    if (Array.isArray(base) || allNumericKeys) {
      const result = Array.isArray(base)
        ? (base as unknown[]).map((item) => clone(item))
        : [];

      for (const [key, value] of entries) {
        const index = Number(key);
        result[index] = merge(result[index], value);
      }

      return result;
    }

    const result = isPlainObject(base)
      ? { ...(base as Record<string, unknown>) }
      : {};

    for (const [key, value] of entries) {
      result[key] = merge(result[key], value);
    }

    return result;
  }

  return override;
};

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const isNumericKey = (value: string): boolean => {
  return /^\d+$/.test(value);
};

const clone = <T>(value: T): T => {
  if (Array.isArray(value)) {
    return value.map((item) => clone(item)) as unknown as T;
  }

  if (isPlainObject(value)) {
    const result: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) {
      result[key] = clone(item);
    }
    return result as T;
  }

  return value;
};
