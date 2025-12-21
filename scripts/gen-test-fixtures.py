#!/usr/bin/env python3
"""Generate kotogram test fixtures from Japanese sentences.

Uses the kotogram Python library's grammar() function to generate
complete GrammarAnalysis data for test fixtures.
"""

from kotogram import SudachiJapaneseParser, grammar

# All Japanese sentences used in tests
TEST_SENTENCES = [
    '私はシアトルに住んでいます。',
    '私は学生です。',
    '私は寿司を食べます。',
    'こんにちは',
    '私は先生です。',
    '私は日本語を話せます。',
    '日本に行ったことがありますか。',
    '日本に行ったことある。',
    'テスト',  # Used in score tests
]

def main():
    parser = SudachiJapaneseParser()
    
    print("// TypeScript test fixtures - auto-generated")
    print("// DO NOT EDIT - regenerate with:")
    print("// /Users/jomofisher/projects/kotogram/.venv/bin/python scripts/gen-test-fixtures.py > src/test/fixtures.ts")
    print("")
    print("import { GrammarAnalysis } from '../kana-control-logic.js';")
    print("")
    print("export const TEST_GRAMMAR: Record<string, GrammarAnalysis> = {")
    
    for sentence in TEST_SENTENCES:
        kotogram = parser.japanese_to_kotogram(sentence)
        g = grammar(kotogram)
        
        # Escape quotes in kotogram
        kotogram_escaped = kotogram.replace("\\", "\\\\").replace("'", "\\'")
        
        print(f"  '{sentence}': {{")
        print(f"    kotogram: '{kotogram_escaped}',")
        print(f"    formality: '{g.formality.value}',")
        print(f"    formality_score: {g.formality_score},")
        print(f"    formality_is_pragmatic: {'true' if g.formality_is_pragmatic else 'false'},")
        print(f"    gender: '{g.gender.value}',")
        print(f"    gender_score: {g.gender_score},")
        print(f"    gender_is_pragmatic: {'true' if g.gender_is_pragmatic else 'false'},")
        registers = ', '.join(f"'{r.value}'" for r in g.registers)
        print(f"    registers: [{registers}],")
        scores = ', '.join(f"'{k.value}': {v}" for k, v in g.register_scores.items())
        print(f"    register_scores: {{{scores}}},")
        print(f"    is_grammatic: {'true' if g.is_grammatic else 'false'},")
        print(f"    grammaticality_score: {g.grammaticality_score},")
        print(f"  }},")
    
    print("};")

if __name__ == '__main__':
    main()
