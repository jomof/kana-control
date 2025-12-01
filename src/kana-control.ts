/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {LitElement, html, css} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import * as wanakana from 'wanakana';
import * as kuromoji from '@patdx/kuromoji';
import {tokenize} from './tokenize.js';
import {augmentTokenGroups} from './augment.js';

/**
 * A Token represents a parsed Japanese morpheme with optional marking state.
 */
export interface Token extends kuromoji.IpadicFeatures {
  marked: boolean | undefined;
}

/**
 * A Question contains the English prompt with furigana annotations and
 * multiple acceptable Japanese answers.
 */
export interface Question {
  english: string;
  japanese: string[];
  parsed: Token[][];
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
function findMatch(
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
): {matched: number[] | null};

/** Nested‐array overload */
export function markTokens(
  tokens: Token[][],
  str: string
): {matched: number[] | null}[];

/**
 * If given a flat Token[], tries to match & flip exactly as before.
 * If given Token[][], first picks only those sub‐arrays with the
 * **highest current count** of `marked===true`, and runs the flat logic
 * on them; all others return `{ matched: null }`.
 */
export function markTokens(
  tokens: Token[] | Token[][],
  str: string
): {matched: number[] | null} | {matched: number[] | null}[] {
  // ——— Nested case ———
  if (tokens.length > 0 && Array.isArray(tokens[0])) {
    const groups = tokens as Token[][];
    const candidateGroups = getGroupsWithMaxMarkedTokens(groups);

    return groups.map((g) => {
      if (candidateGroups.includes(g)) {
        return markTokens(g, str) as {matched: number[] | null};
      } else {
        return {matched: null};
      }
    });
  }

  // ——— Flat case ———
  const flat = tokens as Token[];
  const matchIndices = findMatch(flat, str, 0, 0);
  if (!matchIndices) {
    return {matched: null};
  }

  const newlyMarked: number[] = [];
  for (const idx of matchIndices) {
    if (!flat[idx].marked) {
      flat[idx].marked = true;
      newlyMarked.push(idx);
    }
  }
  return {matched: newlyMarked};
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
function anyMarked(result: {matched: number[] | null}[]): boolean {
  return result.some((r) => r.matched !== null && r.matched.length > 0);
}

/**
 * Selects the "best" token sequence from an array of candidate groups.
 * Criteria:
 *  1. Highest number of tokens with `marked === true`
 *  2. (Tiebreaker) Lowest number of tokens with `marked === false`
 */
export function selectBestGroup(groups: Token[][]): Token[] {
  if (groups.length === 0) throw new Error('No groups provided');

  const groupsWithMaxMarked = getGroupsWithMaxMarkedTokens(groups);

  if (groupsWithMaxMarked.length === 1) {
    return groupsWithMaxMarked[0];
  }

  let bestGroup = groupsWithMaxMarked[0];
  let minTotalTokens = bestGroup.length;

  for (let i = 1; i < groupsWithMaxMarked.length; i++) {
    const currentGroup = groupsWithMaxMarked[i];
    if (currentGroup.length < minTotalTokens) {
      bestGroup = currentGroup;
      minTotalTokens = currentGroup.length;
    }
  }

  return bestGroup;
}

/**
 * Returns true if every non-punctuation token in the array is marked.
 */
function isCompleted(tokens: Token[]): boolean {
  return tokens.every((t) => t.pos === '記号' || t.marked);
}

/**
 * Creates a Question object from an English prompt and Japanese answer(s).
 * English can include furigana annotations in brackets: "word[ふりがな]"
 *
 * @param english - English text with optional furigana annotations
 * @param japanese - Array of acceptable Japanese answers
 * @returns A Question object with tokenized and augmented Japanese
 *
 * @example
 * ```ts
 * const q = await makeQuestion('I live[すむ] in Seattle[シアトル].', [
 *   '私 は シアトル に 住んでいます。',
 *   '私 は シアトル に 住んでる。',
 * ]);
 * ```
 */
export async function makeQuestion(
  english: string,
  japanese: string[]
): Promise<Question> {
  const groups = await Promise.all(
    japanese.map(async (it) => await tokenize(it))
  );
  const parsed = (await augmentTokenGroups(groups)) as Token[][];
  parsed.forEach((group) => group.forEach((token) => (token.marked = false)));
  return {
    english: english,
    japanese: japanese,
    parsed: parsed,
  } as Question;
}

/**
 * A Japanese kana input control component with optional question/progress display.
 * Converts romaji input to kana using WanaKana IME mode.
 *
 * @fires count-changed - Indicates when the count changes
 * @slot - This element has a slot
 * @csspart button - The button
 * @csspart kana-input - The kana input field
 * @csspart english - The English prompt/question display
 * @csspart skeleton - The progress skeleton display
 */
@customElement('kana-control')
export class KanaControl extends LitElement {
  static override styles = css`
    :host {
      display: block;
      border: solid 1px gray;
      padding: 16px;
      max-width: 800px;
      /* Allow both light & dark; rely on page color scheme */
    }

    input#kana-input {
      box-sizing: border-box;
      width: 100%;
      padding-left: 2.5em;
      padding-right: 2.5em;
      border-radius: 8px;

      font-family: 'Noto Sans JP', sans-serif;
      font-size: 22px;
      line-height: 33px;
      text-align: center;
    }

    #english {
      font-family: 'Noto Sans JP', sans-serif;
      font-size: 30px;
      text-align: center;
      width: 100%;
      margin-bottom: 10px;
    }

    .english-word[has-furigana] {
      cursor: pointer;
    }

    #skeleton {
      font-family: 'Noto Sans JP', sans-serif;
      font-size: 22px;
      text-align: center;
      width: 100%;
      margin-bottom: 10px;
    }

      #skeleton .skeleton {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.2em;
        flex-wrap: wrap;
      }

      #skeleton .token {
        font-weight: normal;
        color: #999;
      }

      #skeleton .token.marked {
        font-weight: bold;
        color: #000;
      }

      #skeleton .completed {
        color: #4caf50;
        font-size: 1.5em;
        margin-left: 0.3em;
      }

      /* Dark mode adjustments */
      @media (prefers-color-scheme: dark) {
        :host {
          background-color: #121212;
          border-color: #444;
        }
        #skeleton .token.marked {
          color: #eee;
        }
        #skeleton .token {
          color: #888;
        }
        span#english, #english {
          color: #eee;
        }
      }
  `;

  /**
   * The current question being displayed/answered.
   */
  @state()
  private question: Question | null = null;

  /**
   * Parsed English parts with furigana annotations.
   */
  @state()
  parsedEnglish: ParsedEnglish = [];

  /**
   * Visibility state for each furigana annotation.
   */
  @state()
  private _furiganaVisibility: boolean[] = [];

  /**
   * Supply a new question to display.
   *
   * @param question - The question to display
   *
   * @example
   * ```ts
   * const control = document.querySelector('kana-control');
   * const q = await makeQuestion('I live[すむ] in Seattle[シアトル].', [
   *   '私 は シアトル に 住んでいます。',
   * ]);
   * control.supplyQuestion(q);
   * ```
   */
  async supplyQuestion(question: Question) {
    this.question = structuredClone(question);
    this.parsedEnglish = this._parseEnglishString(question.english);
    this._furiganaVisibility = new Array(this.parsedEnglish.length).fill(false);
    this.requestUpdate();
  }

  override render() {
    return html`
      ${this.parsedEnglish.length > 0
        ? html`
            <div id="english" part="english">
              ${this.parsedEnglish.map(
                (part, index) => html`
                  <span
                    class="english-word"
                    ?has-furigana=${part.furigana !== ''}
                    @click=${() => this._handleEnglishWordClick(index)}
                  >
                    ${this._furiganaVisibility[index] && part.furigana
                      ? html`<ruby
                          ><rb>${part.englishWord}</rb
                          ><rt>${part.furigana}</rt></ruby
                        >`
                      : part.englishWord}
                  </span>
                `
              )}
            </div>
          `
        : html`<div id="english" part="english" style="color: #999;">
            Loading question...
          </div>`}
      ${this.question
        ? html`<div id="skeleton" part="skeleton">${this._renderSkeleton()}</div>`
        : null}
      <input
        id="kana-input"
        part="kana-input"
        type="text"
        autocapitalize="none"
        autocomplete="off"
        spellcheck="false"
        placeholder="日本語"
        @keydown=${this._handleKeydown}
      />
    `;
  }

  override firstUpdated(): void {
    const input = this.renderRoot.querySelector(
      '#kana-input'
    ) as HTMLInputElement | null;
    if (input) {
      // Bind WanaKana IME to convert romaji to kana as user types
      wanakana.bind(input, {IMEMode: true});
    }
  }

  private _handleKeydown(e: KeyboardEvent): void {
    if (!this.question || e.key !== 'Enter') return;

    const input = e.target as HTMLInputElement;
    const value = input.value;
    const katakana = wanakana.toKatakana(value);
    
    const groups = this.question.parsed as Token[][];
    const marked = markTokens(groups, katakana);
    
    if (anyMarked(marked)) {
      input.value = '';
      const best = selectBestGroup(groups);
      if (isCompleted(best)) {
        console.log('Question completed!');
        // Trigger re-render to update skeleton
        this.requestUpdate();
      }
    } else {
      console.log('No match found');
    }
    
    // Always trigger re-render to update skeleton
    this.requestUpdate();
  }

  private _parseEnglishString(eng: string): ParsedEnglish {
    const regex = /(\w+)\s*(?:\[([^\]]+)\])?/g;
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

  private _handleEnglishWordClick(index: number) {
    if (
      this.parsedEnglish &&
      this.parsedEnglish[index] &&
      this.parsedEnglish[index].furigana
    ) {
      if (index < this._furiganaVisibility.length) {
        this._furiganaVisibility[index] = !this._furiganaVisibility[index];
      }
    }
    this.requestUpdate();
  }

  private _renderSkeleton() {
    if (!this.question) {
      return html`<div>Loading question...</div>`;
    }

    const groups = this.question.parsed as Token[][];
    const best = selectBestGroup(groups);
    const completed = isCompleted(best);

    return html`
      <div class="skeleton">
        ${best.map(
          (t) =>
            t.pos === '記号'
              ? html`${t.surface_form}`
              : html`<span class="token ${t.marked ? 'marked' : ''}"
                  >${t.marked
                    ? t.surface_form
                    : '_'.repeat(t.surface_form.length)}</span
                >`
        )}
        ${completed ? html`<span class="completed">✓</span>` : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kana-control': KanaControl;
  }
}
