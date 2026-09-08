const KINDS = ["key", "string", "number", "keyword", "plain"] as const;
const TOKEN = /("(?:[^"\\]|\\.)*")(?=\s*:)|("(?:[^"\\]|\\.)*")|(-?\d+(?:\.\d+)?)|(true|false|null)|([\s{}[\],:]+)/g;

export type Kind = (typeof KINDS)[number];
export type Token = { kind: Kind; text: string; at: number };

export const tokenize = (json: string): Token[] =>
    Array.from(json.matchAll(TOKEN), (match) => ({ kind: KINDS[match.slice(1).findIndex((group) => group !== undefined)], text: match[0], at: match.index }));
