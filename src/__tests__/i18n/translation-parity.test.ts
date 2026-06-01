import { describe, it, expect } from 'vitest';
import en from '../../locales/en/translation.json';
import pt from '../../locales/pt/translation.json';

type JsonObject = Record<string, unknown>;

function getAllLeafKeys(obj: JsonObject, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      return getAllLeafKeys(value as JsonObject, path);
    }
    return [path];
  });
}

function getNestedValue(obj: JsonObject, path: string): unknown {
  return path.split('.').reduce((cur: unknown, key) => {
    if (cur !== null && typeof cur === 'object') {
      return (cur as JsonObject)[key];
    }
    return undefined;
  }, obj as unknown);
}

describe('i18n translation parity', () => {
  const enKeys = getAllLeafKeys(en as JsonObject);
  const ptKeys = getAllLeafKeys(pt as JsonObject);

  it('PT contains every key present in EN', () => {
    const missing = enKeys.filter((k) => getNestedValue(pt as JsonObject, k) === undefined);
    expect(missing, `Keys in EN but missing in PT:\n${missing.join('\n')}`).toHaveLength(0);
  });

  it('EN contains every key present in PT', () => {
    const missing = ptKeys.filter((k) => getNestedValue(en as JsonObject, k) === undefined);
    expect(missing, `Keys in PT but missing in EN:\n${missing.join('\n')}`).toHaveLength(0);
  });

  it('no EN value is empty string', () => {
    const empty = enKeys.filter((k) => getNestedValue(en as JsonObject, k) === '');
    expect(empty, `Empty strings in EN:\n${empty.join('\n')}`).toHaveLength(0);
  });

  it('no PT value is empty string', () => {
    const empty = ptKeys.filter((k) => getNestedValue(pt as JsonObject, k) === '');
    expect(empty, `Empty strings in PT:\n${empty.join('\n')}`).toHaveLength(0);
  });
});
