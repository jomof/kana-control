/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { KanaControl, makeQuestion } from '../kana-control.js';
import { fixture, assert } from '@open-wc/testing';
import { html } from 'lit/static-html.js';
import { TEST_GRAMMAR } from './fixtures.js';

suite('kana-control', () => {
  test('is defined', () => {
    const el = document.createElement('kana-control');
    assert.instanceOf(el, KanaControl);
  });

  test('renders with default values', async () => {
    const el = (await fixture(
      html`<kana-control></kana-control>`
    )) as KanaControl;
    const input = el.shadowRoot!.querySelector('#kana-input');
    assert.ok(input, 'kana input should exist');
  });

  test('styling applied', async () => {
    const el = (await fixture(
      html`<kana-control></kana-control>`
    )) as KanaControl;
    await el.updateComplete;
    assert.equal(getComputedStyle(el).paddingTop, '16px');
  });

  test('wanakana converts romaji input to kana', async () => {
    const el = (await fixture(
      html`<kana-control></kana-control>`
    )) as KanaControl;
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector(
      '#kana-input'
    ) as HTMLInputElement;
    // Type romaji and trigger input event to let WanaKana convert it
    input.value = 'konnnichiha';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    // Expect conversion to Japanese kana
    assert.equal(input.value, 'こんにちは');
  });

  test('makeQuestion creates a question object', async () => {
    const q = await makeQuestion('I am a student[がくせい].', [
      '私は学生です。',
    ], TEST_GRAMMAR);
    assert.equal(q.english, 'I am a student[がくせい].');
    assert.deepEqual(q.japanese, ['私は学生です。']);
    assert.isArray(q.parsed);
    assert.isTrue(q.parsed.length > 0);
    // Check that tokens are marked as false initially
    q.parsed.forEach((group) => {
      group.forEach((token) => {
        assert.isFalse(token.marked);
      });
    });
  });

  test('supplyQuestion parses English with furigana annotations', async () => {
    const el = (await fixture(
      html`<kana-control></kana-control>`
    )) as KanaControl;
    const q = await makeQuestion('I live[すむ] in Seattle[シアトル].', [
      '私はシアトルに住んでいます。',
    ], TEST_GRAMMAR);
    await el.supplyQuestion(q);
    await el.updateComplete;

    assert.equal(el.parsedEnglish.length, 4);
    assert.deepEqual(el.parsedEnglish, [
      { englishWord: 'I', furigana: '' },
      { englishWord: 'live', furigana: 'すむ' },
      { englishWord: 'in', furigana: '' },
      { englishWord: 'Seattle', furigana: 'シアトル' },
    ]);
  });

  test('English prompt displays with furigana annotations', async () => {
    const el = (await fixture(
      html`<kana-control></kana-control>`
    )) as KanaControl;
    const q = await makeQuestion('I eat[たべる] sushi[すし].', [
      '私は寿司を食べます。',
    ], TEST_GRAMMAR);
    await el.supplyQuestion(q);
    await el.updateComplete;

    const englishDiv = el.shadowRoot!.querySelector('#english');
    assert.ok(englishDiv, 'English prompt div should exist');

    const wordSpans = englishDiv!.querySelectorAll('.english-word');
    assert.equal(wordSpans.length, 3, 'Should have 3 word spans');

    // Check that words with furigana have the has-furigana attribute
    const eatSpan = wordSpans[1] as HTMLElement;
    assert.isTrue(
      eatSpan.hasAttribute('has-furigana'),
      'eat word should have has-furigana attribute'
    );

    const sushiSpan = wordSpans[2] as HTMLElement;
    assert.isTrue(
      sushiSpan.hasAttribute('has-furigana'),
      'sushi word should have has-furigana attribute'
    );
  });

  test('Clicking word with furigana toggles display', async () => {
    const el = (await fixture(
      html`<kana-control></kana-control>`
    )) as KanaControl;
    const q = await makeQuestion('Hello[こんにちは] World', ['こんにちは'], TEST_GRAMMAR);
    await el.supplyQuestion(q);
    await el.updateComplete;

    const wordSpans = el.shadowRoot!.querySelectorAll('.english-word');
    const helloSpan = wordSpans[0] as HTMLElement;

    // Initially, furigana should not be visible
    assert.isFalse(
      helloSpan.innerHTML.includes('<ruby>'),
      'Furigana should not be visible initially'
    );

    // Click to show furigana
    helloSpan.click();
    await el.updateComplete;

    const ruby = helloSpan.querySelector('ruby');
    assert.ok(ruby, 'Ruby element should be present after click');
    const rb = helloSpan.querySelector('rb');
    const rt = helloSpan.querySelector('rt');
    assert.equal(rb?.textContent, 'Hello', 'English word should be in rb');
    assert.equal(rt?.textContent, 'こんにちは', 'Furigana should be in rt');

    // Click again to hide furigana
    helloSpan.click();
    await el.updateComplete;

    assert.isFalse(
      helloSpan.innerHTML.includes('<ruby>'),
      'Furigana should be hidden after second click'
    );
  });

  test('Skeleton displays progress for question', async () => {
    const el = (await fixture(
      html`<kana-control></kana-control>`
    )) as KanaControl;
    const q = await makeQuestion('I am a student.', ['私は学生です。'], TEST_GRAMMAR);
    await el.supplyQuestion(q);
    await el.updateComplete;

    const skeleton = el.shadowRoot!.querySelector('#skeleton');
    assert.ok(skeleton, 'Skeleton div should exist');

    // Initially all tokens should be unmarked (showing as underscores)
    const skeletonText = skeleton!.textContent?.trim();
    assert.ok(skeletonText, 'Skeleton should have text');
    assert.ok(skeletonText.includes('_'), 'Skeleton should contain underscores for unmarked tokens');
  });

  test('Question with marked tokens shows progress in skeleton', async () => {
    const el = (await fixture(
      html`<kana-control></kana-control>`
    )) as KanaControl;
    const q = await makeQuestion('I am a student.', ['私は学生です。'], TEST_GRAMMAR);

    // Mark some tokens manually for testing
    if (q.parsed[0] && q.parsed[0].length > 0) {
      q.parsed[0][0].marked = true; // Mark first token
    }

    await el.supplyQuestion(q);
    await el.updateComplete;

    const skeleton = el.shadowRoot!.querySelector('#skeleton');
    const skeletonText = skeleton!.textContent?.trim();

    // Should contain both revealed characters and underscores
    assert.ok(skeletonText, 'Skeleton should have text');
    assert.notEqual(skeletonText, '', 'Skeleton text should not be empty');
  });

  test('Multiple questions with different furigana annotations', async () => {
    const el = (await fixture(
      html`<kana-control></kana-control>`
    )) as KanaControl;

    // First question
    const q1 = await makeQuestion('I am a teacher[せんせい].', [
      '私は先生です。',
    ], TEST_GRAMMAR);
    await el.supplyQuestion(q1);
    await el.updateComplete;

    assert.equal(el.parsedEnglish.length, 4);
    assert.equal(el.parsedEnglish[3].englishWord, 'teacher');
    assert.equal(el.parsedEnglish[3].furigana, 'せんせい');

    // Second question
    const q2 = await makeQuestion('I can speak[はなす] Japanese[にほんご].', [
      '私は日本語を話せます。',
    ], TEST_GRAMMAR);
    await el.supplyQuestion(q2);
    await el.updateComplete;

    assert.equal(el.parsedEnglish.length, 4);
    assert.equal(el.parsedEnglish[2].englishWord, 'speak');
    assert.equal(el.parsedEnglish[2].furigana, 'はなす');
    assert.equal(el.parsedEnglish[3].englishWord, 'Japanese');
    assert.equal(el.parsedEnglish[3].furigana, 'にほんご');
  });

  test('validates user answers and marks tokens', async () => {
    const el = (await fixture(
      html`<kana-control></kana-control>`
    )) as KanaControl;

    // Create a simple question
    const q = await makeQuestion('I am a student[がくせい].', [
      '私は学生です。',
    ], TEST_GRAMMAR);
    await el.supplyQuestion(q);
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector('#kana-input') as HTMLInputElement;

    // Type "watashi" and press enter
    input.value = 'わたくし';
    const event1 = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
    input.dispatchEvent(event1);
    await el.updateComplete;

    // Input should be cleared after successful match
    assert.equal(input.value, '');

    // The skeleton should now show "私" as marked
    const skeleton = el.shadowRoot!.querySelector('#skeleton');
    assert.ok(skeleton?.textContent?.includes('私'), 'skeleton should show marked token');

    // Type "ha" and press enter
    input.value = 'は';
    const event2 = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
    input.dispatchEvent(event2);
    await el.updateComplete;

    // Continue typing the rest
    input.value = 'がくせい';
    const event3 = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
    input.dispatchEvent(event3);
    await el.updateComplete;

    input.value = 'です';
    const event4 = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
    input.dispatchEvent(event4);
    await el.updateComplete;

    // Should show completion indicator
    const completed = skeleton?.textContent?.includes('✓');
    assert.ok(completed, 'skeleton should show completion indicator');
  });

  test('tracks attempts and fires question-complete with details', async () => {
    const el = (await fixture(
      html`<kana-control></kana-control>`
    )) as KanaControl;

    const q = await makeQuestion('I am a student[がくせい].', [
      '私は学生です。',
    ], TEST_GRAMMAR);
    await el.supplyQuestion(q);
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector('#kana-input') as HTMLInputElement;

    // Make a wrong attempt
    input.value = 'wrong';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await el.updateComplete;

    // Make correct attempts
    const answers = ['わたくし', 'は', 'がくせい', 'です'];
    for (const ans of answers) {
      input.value = ans;
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      await el.updateComplete;
    }

    // Listen for events
    let completeEventDetail: any = null;
    let nextEventFired = false;

    el.addEventListener('question-complete', (e: any) => {
      completeEventDetail = e.detail;
    });
    el.addEventListener('request-next-question', () => {
      nextEventFired = true;
    });

    // Press Enter again to finish
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await el.updateComplete;

    assert.isNotNull(completeEventDetail);
    assert.equal(completeEventDetail.wrongAttempts, 1);
    assert.equal(completeEventDetail.correctAttempts.length, 4);
    assert.include(completeEventDetail.finalSkeleton, '私');
    assert.isTrue(nextEventFired);
  });

  test('fires question-skipped with details when skip button clicked', async () => {
    const el = (await fixture(
      html`<kana-control></kana-control>`
    )) as KanaControl;

    const q = await makeQuestion('I am a student[がくせい].', [
      '私は学生です。',
    ], TEST_GRAMMAR);
    await el.supplyQuestion(q);
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector('#kana-input') as HTMLInputElement;

    // Make a wrong attempt
    input.value = 'wrong';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await el.updateComplete;

    // Make one correct attempt
    input.value = 'わたくし';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await el.updateComplete;

    // Click skip button
    const button = el.shadowRoot!.querySelector('#action-button') as HTMLButtonElement;
    assert.ok(button);
    // Since we made progress, it should be a hint button first
    assert.include(button.className, 'hint');

    let skippedEventDetail: any = null;
    let nextEventFired = false;

    el.addEventListener('question-skipped', (e: any) => {
      skippedEventDetail = e.detail;
    });
    el.addEventListener('request-next-question', () => {
      nextEventFired = true;
    });

    // First click reveals answer
    button.click();
    await el.updateComplete;

    // Button should now be skip
    assert.include(button.className, 'skip');
    assert.isNull(skippedEventDetail);

    // Second click skips
    button.click();
    await el.updateComplete;

    assert.isNotNull(skippedEventDetail);
    assert.equal(skippedEventDetail.wrongAttempts, 1);
    assert.equal(skippedEventDetail.correctAttempts.length, 1);
    assert.include(skippedEventDetail.correctAttempts, 'わたくし');
    assert.isTrue(nextEventFired);
  });

  test('action button changes state to complete', async () => {
    const el = (await fixture(
      html`<kana-control></kana-control>`
    )) as KanaControl;

    const q = await makeQuestion('I am a student[がくせい].', [
      '私は学生です。',
    ], TEST_GRAMMAR);
    await el.supplyQuestion(q);
    await el.updateComplete;

    const button = el.shadowRoot!.querySelector('#action-button') as HTMLButtonElement;
    assert.include(button.className, 'skip');
    assert.equal(button.textContent?.trim(), '⏭');

    const input = el.shadowRoot!.querySelector('#kana-input') as HTMLInputElement;
    const answers = ['わたくし', 'は', 'がくせい', 'です'];
    for (const ans of answers) {
      input.value = ans;
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      await el.updateComplete;
    }

    assert.include(button.className, 'complete');
    assert.equal(button.textContent?.trim(), '➜');

    // Clicking it now should fire complete event
    let completeEventDetail: any = null;
    el.addEventListener('question-complete', (e: any) => {
      completeEventDetail = e.detail;
    });

    button.click();
    assert.isNotNull(completeEventDetail);
  });

  test('resets attempts tracking when a new question is supplied', async () => {
    const el = (await fixture(
      html`<kana-control></kana-control>`
    )) as KanaControl;

    // First question
    const q1 = await makeQuestion('I am a student.', ['私は学生です。'], TEST_GRAMMAR);
    await el.supplyQuestion(q1);
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector('#kana-input') as HTMLInputElement;

    // Q1: 1 wrong, 1 correct
    input.value = 'wrong';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await el.updateComplete;

    input.value = 'わたくし';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await el.updateComplete;

    // Supply second question
    const q2 = await makeQuestion('I am a teacher.', ['私は先生です。'], TEST_GRAMMAR);
    await el.supplyQuestion(q2);
    await el.updateComplete;

    // Q2: 1 wrong, 1 correct
    input.value = 'wrong again';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await el.updateComplete;

    input.value = 'わたくし';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await el.updateComplete;

    // Skip to check stats for Q2
    const button = el.shadowRoot!.querySelector('#action-button') as HTMLButtonElement;

    let skippedEventDetail: any = null;
    el.addEventListener('question-skipped', (e: any) => {
      skippedEventDetail = e.detail;
    });

    // First click reveals answer (since we have progress)
    button.click();
    await el.updateComplete;

    // Second click skips
    button.click();
    await el.updateComplete;

    // Should reflect only Q2 stats
    assert.equal(skippedEventDetail.wrongAttempts, 1);
    assert.equal(skippedEventDetail.correctAttempts.length, 1);
    assert.equal(skippedEventDetail.correctAttempts[0], 'わたくし');
  });

  test('tracks revealed hints and includes them in event details', async () => {
    const el = (await fixture(
      html`<kana-control></kana-control>`
    )) as KanaControl;

    const q = await makeQuestion('I live[すむ] in Seattle[シアトル].', [
      '私はシアトルに住んでいます。',
    ], TEST_GRAMMAR);
    await el.supplyQuestion(q);
    await el.updateComplete;

    // Click on "live" (index 1) and "Seattle" (index 3)
    const wordSpans = el.shadowRoot!.querySelectorAll('.english-word');
    (wordSpans[1] as HTMLElement).click();
    (wordSpans[3] as HTMLElement).click();
    await el.updateComplete;

    // Toggle "live" off and on again to ensure it's still just counted once
    (wordSpans[1] as HTMLElement).click(); // off
    await el.updateComplete;
    (wordSpans[1] as HTMLElement).click(); // on
    await el.updateComplete;

    // Skip the question
    const button = el.shadowRoot!.querySelector('#action-button') as HTMLButtonElement;

    let skippedEventDetail: any = null;
    el.addEventListener('question-skipped', (e: any) => {
      skippedEventDetail = e.detail;
    });

    button.click();
    await el.updateComplete;

    assert.isNotNull(skippedEventDetail);
    assert.isArray(skippedEventDetail.englishHints);
    assert.equal(skippedEventDetail.englishHints.length, 2);
    assert.include(skippedEventDetail.englishHints, 'live');
    assert.include(skippedEventDetail.englishHints, 'Seattle');
    // Ensure order is preserved based on index
    assert.deepEqual(skippedEventDetail.englishHints, ['live', 'Seattle']);
  });

  test('updates button title based on state', async () => {
    const el = (await fixture(
      html`<kana-control></kana-control>`
    )) as KanaControl;

    const q = await makeQuestion('I am a student[がくせい].', [
      '私は学生です。',
    ], TEST_GRAMMAR);
    await el.supplyQuestion(q);
    await el.updateComplete;

    const button = el.shadowRoot!.querySelector('#action-button') as HTMLButtonElement;
    const input = el.shadowRoot!.querySelector('#kana-input') as HTMLInputElement;

    // 1. No progress -> Skip Question
    assert.equal(button.title, 'Skip Question');

    // 2. Progress made -> Reveal Answer
    input.value = 'わたくし';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await el.updateComplete;
    assert.equal(button.title, 'Reveal Answer');

    // 3. Reveal answer -> Next Question
    button.click();
    await el.updateComplete;
    assert.equal(button.title, 'Next Question');

    // Reset for completion test
    await el.supplyQuestion(q);
    await el.updateComplete;

    // 4. Completed -> Next Question
    const answers = ['わたくし', 'は', 'がくせい', 'です'];
    for (const ans of answers) {
      input.value = ans;
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      await el.updateComplete;
    }
    assert.equal(button.title, 'Next Question');
  });

  test('revealed answer shows furigana for missed kanji tokens', async () => {
    const el = (await fixture(
      html`<kana-control></kana-control>`
    )) as KanaControl;

    // Question with Kanji: 私 (watashi), 学生 (gakusei)
    const q = await makeQuestion('I am a student.', [
      '私は学生です。',
    ], TEST_GRAMMAR);
    await el.supplyQuestion(q);
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector('#kana-input') as HTMLInputElement;

    // Answer "watashi" (私) correctly
    input.value = 'わたくし';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await el.updateComplete;

    // Click the hint button (which appears because we have progress)
    const button = el.shadowRoot!.querySelector('#action-button') as HTMLButtonElement;
    assert.include(button.className, 'hint');
    button.click();
    await el.updateComplete;

    const skeleton = el.shadowRoot!.querySelector('#skeleton');
    const tokens = skeleton!.querySelectorAll('.token');

    // Token 0: 私 (marked, correct) -> should NOT have ruby (or at least not missed class)
    const token0 = tokens[0];
    assert.include(token0.className, 'marked');
    assert.notInclude(token0.className, 'missed');

    // Token 2: 学生 (missed) -> should have ruby because it's Kanji
    const token2 = tokens[2];
    assert.include(token2.className, 'missed');
    const ruby = token2.querySelector('ruby');
    assert.ok(ruby, 'Missed Kanji token should have ruby tag');
    assert.equal(ruby?.querySelector('rt')?.textContent, 'がくせい');

    // Token 3: です (missed) -> should NOT have ruby because it's Hiragana only
    const token3 = tokens[3];
    assert.include(token3.className, 'missed');
    assert.isNull(token3.querySelector('ruby'), 'Missed Hiragana token should not have ruby tag');
  });

  test('displays other possible answers when question is completed', async () => {
    const el = (await fixture(
      html`<kana-control></kana-control>`
    )) as KanaControl;

    // Question with two possible answers
    const q = await makeQuestion('Have you been to Japan?', [
      '日本に行ったことがありますか。',
      '日本に行ったことある。'
    ], TEST_GRAMMAR);
    await el.supplyQuestion(q);
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector('#kana-input') as HTMLInputElement;

    // Type the second answer readings concatenated (hiragana)
    // Readings from kotogram: 日本(ニッポン), に(ニ), 行っ(イッ), た(タ), こと(コト), ある(アル)
    // Hiragana: にっぽん + に + いっ + た + こと + ある
    input.value = 'にっぽんにいったことある';

    // Dispatch Enter to process the input
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await el.updateComplete;

    // Check if the question is completed
    const skeleton = el.shadowRoot!.querySelector('#skeleton');
    const completedCheck = skeleton!.querySelector('.completed');
    assert.ok(completedCheck, 'Question should be completed');

    // Check for possible answers section
    const possibleAnswersDiv = el.shadowRoot!.querySelector('#possible-answers');
    assert.ok(possibleAnswersDiv, 'Possible answers section should exist');

    // Check content of possible answers
    const answers = possibleAnswersDiv!.querySelectorAll('.possible-answer');
    assert.isTrue(answers.length >= 1, 'Should show at least one other possible answer');

    const combinedText = Array.from(answers).map(a => a.textContent).join(' ');
    assert.include(combinedText, '日本');
    assert.include(combinedText, 'あり');
    assert.include(combinedText, 'ます');

    // Check for furigana (ruby tags)
    // The other answer "日本 に 行った..." should have furigana for Kanji words
    const firstAnswer = answers[0];
    const rubies = firstAnswer.querySelectorAll('ruby');
    assert.isTrue(rubies.length > 0, 'Should have ruby tags for Kanji');

    // Check specific furigana
    // Based on tokenizer output:
    // "日本" -> "にっぽん"
    // "行った" -> "行っ" (reading "いっ") + "た"

    const hasNihon = Array.from(rubies).some(r => r.innerHTML.includes('日本') && r.querySelector('rt')?.textContent === 'にっぽん');
    const hasItta = Array.from(rubies).some(r => r.innerHTML.includes('行っ') && r.querySelector('rt')?.textContent === 'いっ');

    if (!hasNihon || !hasItta) {
      console.log('Rubies found:', Array.from(rubies).map(r => ({
        html: r.innerHTML,
        rt: r.querySelector('rt')?.textContent
      })));
    }

    assert.isTrue(hasNihon, 'Should have furigana for 日本 (ni-ppon)');
    assert.isTrue(hasItta, 'Should have furigana for 行っ (i-tt)');

    // Ensure the answer we just typed is NOT in the list
    Array.from(answers).forEach(a => {
      assert.notInclude(a.textContent, 'ある。');
    });
  });

  test('displays other possible answers when answer is revealed via hint', async () => {
    const el = (await fixture(
      html`<kana-control></kana-control>`
    )) as KanaControl;

    // Question with two possible answers
    const q = await makeQuestion('Have you been to Japan?', [
      '日本に行ったことがありますか。',
      '日本に行ったことある。'
    ], TEST_GRAMMAR);
    await el.supplyQuestion(q);
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector('#kana-input') as HTMLInputElement;

    // Type part of the second answer: "にっぽん" (from kotogram reading ニッポン)
    input.value = 'にっぽん';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await el.updateComplete;

    // Click the hint button
    const button = el.shadowRoot!.querySelector('#action-button') as HTMLButtonElement;
    assert.include(button.className, 'hint');
    button.click();
    await el.updateComplete;

    // Check for possible answers section
    const possibleAnswersDiv = el.shadowRoot!.querySelector('#possible-answers');
    assert.ok(possibleAnswersDiv, 'Possible answers section should exist when revealed');

    // Check content of possible answers
    const answers = possibleAnswersDiv!.querySelectorAll('.possible-answer');
    assert.isTrue(answers.length >= 1, 'Should show at least one other possible answer');

    const combinedText = Array.from(answers).map(a => a.textContent).join(' ');
    assert.include(combinedText, 'あり');
  });

  test('skeleton prefills punctuation tokens', async () => {
    const el = (await fixture(
      html`<kana-control></kana-control>`
    )) as KanaControl;
    const q = await makeQuestion('I am a student.', [
      '私は学生です。',
    ], TEST_GRAMMAR);
    await el.supplyQuestion(q);
    await el.updateComplete;

    const skeleton = el.shadowRoot!.querySelector('.skeleton');
    assert.ok(skeleton, 'Skeleton should exist');
    assert.include(skeleton!.textContent!, '。', 'Skeleton should immediately contain punctuation');
  });
});
