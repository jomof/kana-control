/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { splitKotogram, extractTokenFeatures } from 'kotogram';
import * as wanakana from 'wanakana';

/**
 * A Token represents a parsed Japanese morpheme with optional marking state.
 */
export interface Token {
  marked: boolean | undefined;
  surface_form: string;
  reading?: string;
  pos?: string;
}

/**
 * Grammar analysis for a Japanese answer sentence.
 * Contains linguistic information about formality, gender, register, etc.
 */
export interface GrammarAnalysis {
  /** Linguistic encoding of the sentence in kotogram format */
  kotogram: string;
  /** Formality level of the sentence */
  formality: 'formal' | 'neutral' | 'casual';
  /** Raw formality score, approximately -1.0 to 1.0 */
  formality_score: number;
  /** Whether formality is context-dependent */
  formality_is_pragmatic: boolean;
  /** Gender tendency of the sentence */
  gender: 'masculine' | 'feminine' | 'neutral';
  /** Raw gender score, approximately -1.0 to 1.0 */
  gender_score: number;
  /** Whether gender is context-dependent */
  gender_is_pragmatic: boolean;
  /** Register categories, e.g., ["neutral"], ["danseigo"], ["kansaiben"] */
  registers: string[];
  /** Score for each possible register */
  register_scores: Record<string, number>;
  /** Whether the sentence is grammatically correct */
  is_grammatic: boolean;
  /** Grammaticality confidence score, typically 0.0 to 1.0 */
  grammaticality_score: number;
}

/**
 * A Question contains the English prompt with furigana annotations and
 * multiple acceptable Japanese answers.
 */
export interface Question {
  english: string;
  japanese: string[];
  parsed: Token[][];
  /** Map from answer text to its grammar analysis */
  answerGrammar: Record<string, GrammarAnalysis>;
}

/**
 * ParsedEnglishPart represents a word in the English prompt, optionally
 * with furigana (reading) attached.
 */
export interface ParsedEnglishPart {
  englishWord: string;
  furigana: string;
}

export type ParsedEnglish = ParsedEnglishPart[];

/**
 * Recursive helper to find matching tokens.
 * @returns an array of token‐indices if `str` can be covered by a subsequence
 *          of `tokens[i].reading`, or `null` otherwise.
 */
export function findMatch(
  tokens: Token[],
  str: string,
  startIdx: number,
  pos: number
): number[] | null {
  if (pos === str.length) return [];
  for (let i = startIdx; i < tokens.length; i++) {
    const r = tokens[i].reading!;
    if (str.startsWith(r, pos)) {
      const rest = findMatch(tokens, str, i + 1, pos + r.length);
      if (rest) return [i, ...rest];
    }
  }
  return null;
}

/** Flat‐array overload */
export function markTokens(
  tokens: Token[],
  str: string
): { matched: number[] | null };

/** Nested‐array overload */
export function markTokens(
  tokens: Token[][],
  str: string
): { matched: number[] | null }[];

/**
 * If given a flat Token[], tries to match & flip exactly as before.
 * If given Token[][], first picks only those sub‐arrays with the
 * **highest current count** of `marked===true`, and runs the flat logic
 * on them; all others return `{ matched: null }`.
 */
export function markTokens(
  tokens: Token[] | Token[][],
  str: string
): { matched: number[] | null } | { matched: number[] | null }[] {
  // ——— Nested case ———
  if (tokens.length > 0 && Array.isArray(tokens[0])) {
    const groups = tokens as Token[][];
    const candidateGroups = getGroupsWithMaxMarkedTokens(groups);

    return groups.map((g) => {
      if (candidateGroups.includes(g)) {
        return markTokens(g, str) as { matched: number[] | null };
      } else {
        return { matched: null };
      }
    });
  }

  // ——— Flat case ———
  const flat = tokens as Token[];
  const matchIndices = findMatch(flat, str, 0, 0);
  if (!matchIndices) {
    return { matched: null };
  }

  const newlyMarked: number[] = [];
  for (const idx of matchIndices) {
    if (!flat[idx].marked) {
      flat[idx].marked = true;
      newlyMarked.push(idx);
    }
  }
  return { matched: newlyMarked };
}

/**
 * Filters an array of token groups, returning only those with the maximum
 * number of marked tokens.
 */
export function getGroupsWithMaxMarkedTokens(groups: Token[][]): Token[][] {
  if (groups.length === 0) {
    return [];
  }

  const markedCounts = groups.map((g) =>
    g.reduce((n, t) => n + (t.marked ? 1 : 0), 0)
  );
  const maxMarkedCount = Math.max(...markedCounts);

  return groups.filter((_, i) => markedCounts[i] === maxMarkedCount);
}

/**
 * Returns true if any token was newly marked.
 */
export function anyMarked(result: { matched: number[] | null }[]): boolean {
  return result.some((r) => r.matched !== null && r.matched.length > 0);
}

/**
 * Selects the "best" token sequence from an array of candidate groups.
 * Criteria:
 *  1. Highest number of tokens with `marked === true`
 *  2. (Tiebreaker) Minimize formality_score^2 + gender_score^2 (prefers neutral)
 *  3. (Tiebreaker) Lexically shortest (surface form length)
 */
export function selectBestGroup(
  groups: Token[][],
  answerGrammar?: Record<string, GrammarAnalysis>
): Token[] {
  if (groups.length === 0) throw new Error('No groups provided');

  // 1. Highest number of marked tokens
  const maxMarked = Math.max(...groups.map((g) => g.filter((t) => t.marked).length));
  const candidates = groups.filter((g) => g.filter((t) => t.marked).length === maxMarked);

  if (candidates.length === 1) return candidates[0];

  // 2. Tiebreaker: Minimize formality_score^2 + gender_score^2
  const scoredCandidates = candidates.map((group) => {
    const surfaceForm = group.map((t) => t.surface_form).join('');
    const grammar = answerGrammar?.[surfaceForm];
    // If no grammar metrics available, use a penalty score
    const score =
      grammar && grammar.formality_score !== undefined && grammar.gender_score !== undefined
        ? grammar.formality_score ** 2 + grammar.gender_score ** 2
        : 1000;
    return { group, surfaceForm, score };
  });

  const minScore = Math.min(...scoredCandidates.map((c) => c.score));
  const scoreCandidates = scoredCandidates.filter((c) => Math.abs(c.score - minScore) < 1e-9);

  if (scoreCandidates.length === 1) return scoreCandidates[0].group;

  // 3. Tiebreaker: Lexically shortest
  let best = scoreCandidates[0];
  for (let i = 1; i < scoreCandidates.length; i++) {
    if (scoreCandidates[i].surfaceForm.length < best.surfaceForm.length) {
      best = scoreCandidates[i];
    }
  }

  return best.group;
}

/**
 * Returns true if every non-punctuation token in the array is marked.
 * Checks for common Japanese punctuation POS tags.
 */
export function isCompleted(tokens: Token[]): boolean {
  const punctuationPos = ['記号', 'aux-symbol', 'aux-symbol:period', 'aux-symbol:comma'];
  return tokens.every((t) => punctuationPos.some(p => t.pos?.startsWith(p)) || t.marked);
}

/**
 * Parses a kotogram string into an array of Tokens.
 * Uses splitKotogram and extractTokenFeatures from kotogram library.
 */
function parseKotogramToTokens(kotogram: string): Token[] {
  const tokenStrings = splitKotogram(kotogram);
  return tokenStrings.map((tokenStr) => {
    const features = extractTokenFeatures(tokenStr);
    // Convert katakana reading to hiragana for matching (user types hiragana)
    // If no reading is present, convert surface to hiragana (handles katakana words like テスト)
    const hiraganaReading = features.reading
      ? wanakana.toHiragana(features.reading)
      : wanakana.toHiragana(features.surface);
    return {
      surface_form: features.surface,
      reading: hiraganaReading,
      pos: features.pos,
      marked: false,
    };
  });
}

/**
 * Creates a Question object from an English prompt and Japanese answer(s).
 * English can include furigana annotations in brackets: "word[ふりがな]"
 *
 * @param english - English text with optional furigana annotations
 * @param japanese - Array of acceptable Japanese answers
 * @param answerGrammar - Map from answer text to grammar analysis.
 *                        Each answer MUST have a corresponding entry with kotogram data.
 * @returns A Question object with parsed Japanese tokens
 *
 * @example
 * ```ts
 * const q = await makeQuestion('I live[すむ] in Seattle[シアトル].', 
 *   ['私はシアトルに住んでいます。'],
 *   {
 *     '私はシアトルに住んでいます。': {
 *       kotogram: '⌈ˢ私ᵖpronʳワタシ⌉⌈ˢはᵖparticleʳハ⌉...',
 *       formality: 'formal',
 *       formality_score: 0.5,
 *       gender: 'neutral',
 *       gender_score: 0,
 *       formality_is_pragmatic: false,
 *       gender_is_pragmatic: false,
 *       registers: ['neutral'],
 *       register_scores: {},
 *       is_grammatic: true,
 *       grammaticality_score: 1.0,
 *     }
 *   }
 * );
 * ```
 */
export async function makeQuestion(
  english: string,
  japanese: string[],
  answerGrammar: Record<string, GrammarAnalysis>
): Promise<Question> {
  const parsed: Token[][] = japanese.map((answer) => {
    const grammar = answerGrammar[answer];
    if (!grammar?.kotogram) {
      throw new Error(`Missing kotogram data for answer: "${answer}"`);
    }
    return parseKotogramToTokens(grammar.kotogram);
  });

  return {
    english,
    japanese,
    parsed,
    answerGrammar,
  };
}

export function parseEnglishString(eng: string): ParsedEnglish {
  const regex = /([a-zA-Z0-9_']+)\s*(?:\[([^\]]+)\])?/g;
  const parts: ParsedEnglish = [];
  let match;
  while ((match = regex.exec(eng)) !== null) {
    parts.push({
      englishWord: match[1],
      furigana: match[2] || '',
    });
  }
  return parts;
}
