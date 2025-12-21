import { assert } from 'chai';
import { selectBestGroup, Token, GrammarAnalysis } from '../kana-control-logic.js';

suite('kana-control-logic selectBestGroup', () => {
    const token = (surface: string, marked = false): Token => ({
        surface_form: surface,
        marked,
    });

    const grammar = (formality: number, gender: number): GrammarAnalysis => ({
        kotogram: '',
        formality: 'neutral',
        formality_score: formality,
        formality_is_pragmatic: true,
        gender: 'neutral',
        gender_score: gender,
        gender_is_pragmatic: true,
        registers: [],
        register_scores: {},
        is_grammatic: true,
        grammaticality_score: 1.0,
    });

    test('prefer neutral (lower score^2 sum)', () => {
        const group1 = [token('私は学生です。', true)]; // neutral
        const group2 = [token('僕。', true)]; // masculine

        const grammarMap: Record<string, GrammarAnalysis> = {
            '私は学生です。': grammar(0, 0),
            '僕。': grammar(0, 0.8),
        };

        const best = selectBestGroup([group1, group2], grammarMap);
        assert.equal(best.map(t => t.surface_form).join(''), '私は学生です。');
    });

    test('tiebreaker: lexically shortest', () => {
        // Both neutral (score 0), but different lengths
        const group1 = [token('私は学生です。', true)];
        const group2 = [token('私。', true)];

        const grammarMap: Record<string, GrammarAnalysis> = {
            '私は学生です。': grammar(0, 0),
            '私。': grammar(0, 0),
        };

        const best = selectBestGroup([group1, group2], grammarMap);
        assert.equal(best.map(t => t.surface_form).join(''), '私。');
    });

    test('prioritize marked tokens over neutrality', () => {
        const group1 = [token('私', true), token('は', true)]; // 2 marked, neutral
        const group2 = [token('僕', true), token('。', true), token('!', true)]; // 3 marked, masculine

        const grammarMap: Record<string, GrammarAnalysis> = {
            '私は': grammar(0, 0),
            '僕。!': grammar(0, 0.8),
        };

        const best = selectBestGroup([group1, group2], grammarMap);
        assert.equal(best.map(t => t.surface_form).join(''), '僕。!');
    });

    test('handles missing grammar analysis with penalty', () => {
        const group1 = [token('A', true)]; // No grammar
        const group2 = [token('B', true)]; // Neutral grammar

        const grammarMap: Record<string, GrammarAnalysis> = {
            'B': grammar(0, 0),
        };

        const best = selectBestGroup([group1, group2], grammarMap);
        assert.equal(best.map(t => t.surface_form).join(''), 'B');
    });
});
