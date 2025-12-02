/**
 * @license
 * Copyright 2025 Jomo Fisher
 * SPDX-License-Identifier: BSD-3-Clause
 */
import { tokenize } from './tokenize.js';
/**
 * Creates a TokenAugmenter by:
 *  – checking `guard(tokens)`
 *  – joining tokens → raw string
 *  – running replacer(raw) → [variant1, variant2…]
 *  – tokenizing each variant → Token[]
 */
function makeTokenAugmenter(guard, replacer) {
    return async (tokens) => {
        if (!guard(tokens))
            return [];
        const raw = tokens.map((t) => t.surface_form).join(' ');
        const variants = replacer(raw);
        const out = [];
        for (const text of variants) {
            const toks = await tokenize(text);
            out.push(toks);
        }
        return out;
    };
}
async function augmentDesuDaTokens(tokens) {
    const desuIndex = tokens.findIndex((t) => t.surface_form === 'です');
    if (desuIndex !== tokens.length - 1 &&
        (desuIndex !== tokens.length - 2 ||
            (tokens[tokens.length - 1].pos !== '記号' &&
                tokens[tokens.length - 1].pos !== '名詞'))) {
        return Promise.resolve([]);
    }
    if (desuIndex > 0) {
        const prior = tokens[desuIndex - 1];
        if (prior.pos !== '名詞') {
            return Promise.resolve([]);
        }
    }
    const replacement = tokens
        .map((t, i) => {
        if (i === desuIndex)
            return 'だ';
        return t.surface_form;
    })
        .join(' ');
    const replacementTokens = await tokenize(replacement);
    return Promise.resolve([replacementTokens]);
}
function makeReplaceWholeToken(search, replacement) {
    async function replace(tokens) {
        const result = [];
        for (const token of tokens) {
            if (token.surface_form === search) {
                result.push(replacement);
            }
            else {
                result.push(token.surface_form);
            }
        }
        return Promise.resolve([await tokenize(result.join(' '))]);
    }
    return replace;
}
const augmentDropWatashiHa = makeTokenAugmenter(
// Guard: first two tokens are 私 + は, and there's at least one more token
(tokens) => tokens.length > 1 && tokens[0].surface_form === '私', 
// Replacer: lexically cut off the leading "私は"
(raw) => {
    const dropped = raw.slice('私 は '.length);
    return [dropped];
});
export function makeReadingModifierAugmenter(surfaceForm, newReading) {
    return async (tokens) => {
        const tokenIndex = tokens.findIndex((t) => t.surface_form === surfaceForm);
        if (tokenIndex === -1) {
            return Promise.resolve([]);
        }
        const newGroup = structuredClone(tokens);
        newGroup[tokenIndex].reading = newReading;
        return Promise.resolve([newGroup]);
    };
}
const tokenAugmenters = [
    makeReplaceWholeToken('私', '僕'),
    makeReplaceWholeToken('僕', '俺'),
    makeReplaceWholeToken('あなた', '君'),
    makeReplaceWholeToken('君', 'あなた'),
    makeReplaceWholeToken('私', 'あたし'),
    augmentDesuDaTokens,
    augmentDropWatashiHa,
    makeReadingModifierAugmenter('日本', 'ニッポン'),
    makeReadingModifierAugmenter('日本', 'ニホン'),
    // Bidirectional copula variants
    // です → だ handled by augmentDesuDaTokens; add だ → です
    async (tokens) => {
        const daIndex = tokens.findIndex((t) => t.surface_form === 'だ');
        if (daIndex === -1)
            return [];
        // Only allow at end or followed by 名詞/記号
        if (daIndex !== tokens.length - 1 &&
            (daIndex !== tokens.length - 2 ||
                (tokens[tokens.length - 1].pos !== '記号' &&
                    tokens[tokens.length - 1].pos !== '名詞'))) {
            return [];
        }
        // Prior should be a noun when exists
        if (daIndex > 0 && tokens[daIndex - 1].pos !== '名詞')
            return [];
        const replacement = tokens
            .map((t, i) => (i === daIndex ? 'です' : t.surface_form))
            .join(' ');
        const replacementTokens = await tokenize(replacement);
        return [replacementTokens];
    },
    // Contractions/exapansions: では ↔ じゃ (whole-token only)
    async (tokens) => {
        const idx = tokens.findIndex((t) => t.surface_form === 'では');
        if (idx === -1)
            return [];
        const out = tokens.map((t, i) => (i === idx ? 'じゃ' : t.surface_form)).join(' ');
        return [await tokenize(out)];
    },
    async (tokens) => {
        const idx = tokens.findIndex((t) => t.surface_form === 'じゃ');
        if (idx === -1)
            return [];
        const out = tokens.map((t, i) => (i === idx ? 'では' : t.surface_form)).join(' ');
        return [await tokenize(out)];
    },
    // Progressive: apply only to final verb token
    async (tokens) => {
        // Handle split tokens ending with て/で + いる → て/で + る
        if (tokens.length >= 2) {
            const last = tokens[tokens.length - 1];
            const prev = tokens[tokens.length - 2];
            if (last.pos === '動詞' && last.surface_form === 'いる' && prev.surface_form.match(/^([て|で])$/)) {
                const out = tokens
                    .map((t, i) => {
                    if (i === tokens.length - 1)
                        return 'る';
                    return t.surface_form;
                })
                    .join(' ');
                return [await tokenize(out)];
            }
        }
        const last = tokens[tokens.length - 1];
        if (!last || last.pos !== '動詞')
            return [];
        if (!last.surface_form.includes('ている') && !last.surface_form.includes('でいる'))
            return [];
        const repl = last.surface_form.replace(/ている/g, 'てる').replace(/でいる/g, 'でる');
        const out = tokens.map((t, i) => (i === tokens.length - 1 ? repl : t.surface_form)).join(' ');
        return [await tokenize(out)];
    },
    async (tokens) => {
        const last = tokens[tokens.length - 1];
        if (!last || last.pos !== '動詞')
            return [];
        if (!last.surface_form.includes('てる') && !last.surface_form.includes('でる'))
            return [];
        const repl = last.surface_form.replace(/てる/g, 'ている').replace(/でる/g, 'でいる');
        const out = tokens.map((t, i) => (i === tokens.length - 1 ? repl : t.surface_form)).join(' ');
        return [await tokenize(out)];
    },
    // Basic negatives and politeness toggles
    // Copula negatives: だ/です ↔ じゃない/ではない
    // Safer: operate per-token with POS/context guards
    async (tokens) => {
        const idx = tokens.findIndex((t) => t.surface_form === 'だ');
        if (idx === -1)
            return [];
        // end or followed by 名詞/記号
        if (idx !== tokens.length - 1 &&
            (idx !== tokens.length - 2 ||
                (tokens[tokens.length - 1].pos !== '記号' &&
                    tokens[tokens.length - 1].pos !== '名詞'))) {
            return [];
        }
        if (idx > 0 && tokens[idx - 1].pos !== '名詞')
            return [];
        const replaced = tokens.map((t, i) => (i === idx ? 'じゃない' : t.surface_form)).join(' ');
        return [await tokenize(replaced)];
    },
    async (tokens) => {
        const idx = tokens.findIndex((t) => t.surface_form === 'です');
        if (idx === -1)
            return [];
        // end or followed by 名詞/記号
        if (idx !== tokens.length - 1 &&
            (idx !== tokens.length - 2 ||
                (tokens[tokens.length - 1].pos !== '記号' &&
                    tokens[tokens.length - 1].pos !== '名詞'))) {
            return [];
        }
        if (idx > 0 && tokens[idx - 1].pos !== '名詞')
            return [];
        const replaced = tokens.map((t, i) => (i === idx ? 'ではない' : t.surface_form)).join(' ');
        return [await tokenize(replaced)];
    },
    makeTokenAugmenter((tokens) => tokens.some((t) => t.surface_form === 'じゃない'), (raw) => [raw.replaceAll(' じゃない', ' だ')]),
    makeTokenAugmenter((tokens) => tokens.some((t) => t.surface_form === 'ではない'), (raw) => [raw.replaceAll(' ではない', ' です')]),
    // Verb negatives: naive transform ～る → ～ない, ～う-stem verbs not handled exhaustively
    // For this project scope, apply simple string-level replacements for examples
    async (tokens) => {
        // naive -る verbs in dictionary form to -ない
        // guard: single-token sentence or final token is 動詞 and ends with る
        const last = tokens[tokens.length - 1];
        if (!last || last.pos !== '動詞' || !/る$/.test(last.surface_form))
            return [];
        // Exclude irregular verbs that don't follow standard -る → -ない conjugation
        if (last.surface_form === 'する' || last.surface_form === 'くる' || last.surface_form === 'ある')
            return [];
        const replaced = tokens
            .map((t, i) => (i === tokens.length - 1 ? t.surface_form.replace(/る$/, 'ない') : t.surface_form))
            .join(' ');
        return [await tokenize(replaced)];
    },
    async (tokens) => {
        // naive reverse: -ない back to dictionary -る only when preceding token suggests ichidan stem
        const last = tokens[tokens.length - 1];
        if (!last || last.pos !== '動詞' || !/ない$/.test(last.surface_form))
            return [];
        // heuristic: if reading/basic_form ends with る, prefer that
        const candidate = /る$/.test(last.basic_form || '')
            ? last.basic_form
            : last.surface_form.replace(/ない$/, 'る');
        const replaced = tokens
            .map((t, i) => (i === tokens.length - 1 ? candidate : t.surface_form))
            .join(' ');
        return [await tokenize(replaced)];
    },
    // Politeness: naive stem + ます ↔ dictionary form
    async (tokens) => {
        // polite → stem (remove trailing ます) on final token that endswith ます
        const last = tokens[tokens.length - 1];
        if (!last || last.pos !== '動詞' || !last.surface_form.endsWith('ます'))
            return [];
        const stem = last.surface_form.replace(/ます$/, '');
        const replaced = tokens
            .map((t, i) => (i === tokens.length - 1 ? stem : t.surface_form))
            .join(' ');
        return [await tokenize(replaced)];
    },
    async (tokens) => {
        // dictionary → polite (limited): handle 会う → 会います, 食べる → 食べます
        const last = tokens[tokens.length - 1];
        if (!last || last.pos !== '動詞')
            return [];
        let polite = null;
        if (/る$/.test(last.surface_form)) {
            // ichidan: remove る add ます
            polite = last.surface_form.replace(/る$/, 'ます');
        }
        else if (/う$/.test(last.surface_form)) {
            // godan う → い + ます (会う→会います)
            polite = last.surface_form.replace(/う$/, 'います');
        }
        if (!polite)
            return [];
        const replaced = tokens
            .map((t, i) => (i === tokens.length - 1 ? polite : t.surface_form))
            .join(' ');
        return [await tokenize(replaced)];
    },
];
export function toLexicalKey(tokens) {
    return JSON.stringify(tokens.map((t) => `${t.surface_form}(${t.reading})`));
}
export async function augmentTokenGroups(initialGroups) {
    // map rawSurface → tokens, to dedupe
    const map = new Map();
    // a queue of groups we still need to process
    const queue = [];
    function addToQueue(tokens) {
        const noWhitespace = tokens.filter((it) => it.surface_form.trim().length !== 0);
        const key = toLexicalKey(noWhitespace);
        if (!map.has(key)) {
            map.set(key, noWhitespace);
            queue.push(noWhitespace);
        }
    }
    // seed with the originals
    for (const grp of initialGroups) {
        addToQueue(grp);
    }
    // process until no new groups are produced
    while (queue.length > 0) {
        const grp = queue.shift();
        for (const plugin of tokenAugmenters) {
            const results = await plugin(grp);
            for (const newGrp of results) {
                addToQueue(newGrp);
            }
        }
    }
    const result = Array.from(map.values());
    result.sort((a, b) => toLexicalKey(a).localeCompare(toLexicalKey(b)));
    return result;
}
//# sourceMappingURL=augment.js.map