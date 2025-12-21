#!/usr/bin/env python3
"""Generate kotogram data for dev/index.html demo sentences."""

from kotogram import SudachiJapaneseParser, grammar

# All Japanese sentences used in dev demo (without spaces)
DEMO_SENTENCES = [
    # Have you been to Japan?
    "日本に行ったことがありますか。",
    "日本に行ったことある。",
    # I live in Seattle
    "私はシアトルに住んでいます。",
    "私はシアトルに住んでる。",
    # I am a student
    "私は学生です。",
    # I am a teacher
    "私は先生です。",
    # I eat sushi every day
    "私は毎日寿司を食べます。",
    "私は毎日寿司を食べる。",
    # I can speak Japanese
    "私は日本語を話すことができます。",
    "私は日本語を話すことができる。",
    "私は日本語が話せます。",
    "私は日本語が話せる。",
    # I went to Tokyo last year
    "私は去年東京に行きました。",
    "私は去年東京にいった。",
    # I am reading a book right now
    "私は今本を読んでいます。",
    "私は今本を読んでいる。",
    # I want to go to Japan
    "私は日本に行きたいです。",
    # I was a teacher
    "私は先生でした。",
    # I do not eat meat
    "私は肉は食べません。",
    # I think it is good
    "私はいいと思います。",
    # She says she is busy
    "彼女は忙しいと言います。",
    # That is not a cat
    "それは猫ではありません。",
    # Do you know?
    "あなたは知っていますか。",
]

def main():
    parser = SudachiJapaneseParser()
    
    print("// Demo grammar data - auto-generated")
    print("// Regenerate with: /Users/jomofisher/projects/kotogram/.venv/bin/python scripts/gen-demo-grammar.py")
    print("")
    print("const DEMO_GRAMMAR = {")
    
    for sentence in DEMO_SENTENCES:
        kotogram = parser.japanese_to_kotogram(sentence)
        g = grammar(kotogram)
        
        # Escape quotes
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
