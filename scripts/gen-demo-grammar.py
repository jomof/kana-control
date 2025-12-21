#!/usr/bin/env python3
"""Generate kotogram data for dev/index.html demo sentences, including augmentations grouped by prompt."""

import json
from kotogram import SudachiJapaneseParser, grammar, augment

# Base demo sentences with their English prompts
DEMO_SOURCES = [
    {"english": 'Have you been[いく] to Japan[にほん]?', "japanese": ["日本に行ったことがありますか。", "日本に行ったことある。"]},
    {"english": 'I live[すむ] in Seattle[シアトル].', "japanese": ['私はシアトルに住んでいます。', '私はシアトルに住んでる。']},
    {"english": 'I am a student[がくせい].', "japanese": ['私は学生です。']},
    {"english": 'I am a teacher[せんせい].', "japanese": ['私は先生です。']},
    {"english": 'I eat[たべる] sushi[すし] every[まい] day[にち].', "japanese": ['私は毎日寿司を食べます。', '私は毎日寿司を食べる。']},
    {"english": 'I can speak[はなす] Japanese[にほんご].', "japanese": ['私は日本語を話すことができます。', '私は日本語を話すことができる。', '私は日本語が話せます。', '私は日本語が話せる。']},
    {"english": 'I went[いく] to Tokyo[とうきょう] last year[きょねん].', "japanese": ['私は去年東京に行きました。', '私は去年東京にいった。']},
    {"english": 'I am reading[よむ] a book[ほん] right now[いま].', "japanese": ['私は今本を読んでいます。', '私は今本を読んでいる。']},
    {"english": 'I want to go[いく] to Japan[にほん].', "japanese": ['私は日本に行きたいです。']},
    {"english": 'I was a teacher[せんせい].', "japanese": ['私は先生でした。']},
    {"english": 'I do not eat[たべる] meat[にく].', "japanese": ['私は肉は食べません。']},
    {"english": 'I think[おもう] that[という] it is good[いい].', "japanese": ['私はいいと思います。']},
    {"english": 'She says[いう] that[という] she is busy[いそがしい].', "japanese": ['彼女は忙しいと言います。']},
    {"english": 'That is not a cat[ねこ].', "japanese": ['それは猫ではありません。']},
    {"english": 'Do you know[しる]?', "japanese": ['あなたは知っていますか。']},
]

def main():
    parser = SudachiJapaneseParser()
    
    grammar_data = {}
    questions_list = []
    
    print("Augmenting questions...")
    for source in DEMO_SOURCES:
        english = source["english"]
        japanese_bases = source["japanese"]
        
        # Get all variations for this particular question
        all_variants = augment(japanese_bases)
        print(f"English: {english} -> {len(all_variants)} variations")
        
        questions_list.append({
            "english": english,
            "japanese": all_variants
        })
        
        for variant in all_variants:
            if variant not in grammar_data:
                kotogram_str = parser.japanese_to_kotogram(variant)
                g = grammar(kotogram_str)
                
                grammar_data[variant] = {
                    "kotogram": kotogram_str,
                    "formality": g.formality.value,
                    "formality_score": g.formality_score,
                    "formality_is_pragmatic": g.formality_is_pragmatic,
                    "gender": g.gender.value,
                    "gender_score": g.gender_score,
                    "gender_is_pragmatic": g.gender_is_pragmatic,
                    "registers": [r.value for r in g.registers],
                    "register_scores": {k.value: v for k, v in g.register_scores.items()},
                    "is_grammatic": g.is_grammatic,
                    "grammaticality_score": g.grammaticality_score,
                }
    
    # Combined output
    output = {
        "questions": questions_list,
        "grammar": grammar_data
    }
    
    output_path = "dev/grammar.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    
    print(f"Wrote grammar data and question structure to {output_path}")

if __name__ == '__main__':
    main()
