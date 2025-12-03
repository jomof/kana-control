/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {KanaControl, makeQuestion} from '../kana-control.js';
import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

suite('kana-control scoring', () => {
  let el: KanaControl;
  let input: HTMLInputElement;

  setup(async () => {
    el = (await fixture(html`<kana-control></kana-control>`)) as KanaControl;
    await el.updateComplete;
    input = el.shadowRoot!.querySelector('#kana-input') as HTMLInputElement;
  });

  test('initial score is -1 (hidden)', async () => {
    const q = await makeQuestion('Test', ['テスト']);
    await el.supplyQuestion(q);
    await el.updateComplete;
    
    assert.equal(el.score, -1);
    const scoreDiv = el.shadowRoot!.querySelector('#score');
    assert.isNull(scoreDiv);
  });

  test('correct guess updates score (95%)', async () => {
    // Question with multiple parts: 私 は 学生 です
    const q = await makeQuestion('I am a student.', ['私 は 学生 です。']);
    await el.supplyQuestion(q);
    await el.updateComplete;

    // Type "watashi" (私)
    input.value = 'わたし';
    input.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));
    await el.updateComplete;

    // Initial score 100 * 0.95 = 95
    assert.equal(el.score, 95);
    
    const scoreDiv = el.shadowRoot!.querySelector('#score');
    assert.ok(scoreDiv);
    assert.equal(scoreDiv!.textContent, '95');
  });

  test('incorrect guess updates score (70%)', async () => {
    const q = await makeQuestion('Test', ['テスト']);
    await el.supplyQuestion(q);
    await el.updateComplete;

    // Type wrong answer
    input.value = 'wrong';
    input.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));
    await el.updateComplete;

    // Initial score 100 * 0.7 = 70
    assert.equal(el.score, 70);
  });

  test('consecutive incorrect guesses reduce score further', async () => {
    const q = await makeQuestion('Test', ['テスト']);
    await el.supplyQuestion(q);
    await el.updateComplete;

    // First wrong guess
    input.value = 'wrong1';
    input.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));
    await el.updateComplete;
    assert.equal(el.score, 70);

    // Second wrong guess: 70 * 0.7 = 49
    input.value = 'wrong2';
    input.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));
    await el.updateComplete;
    assert.equal(el.score, 49);
  });

  test('one-shot correct answer gives 100 points', async () => {
    const q = await makeQuestion('Test', ['テスト']);
    await el.supplyQuestion(q);
    await el.updateComplete;

    // Type full correct answer
    input.value = 'てすと';
    input.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));
    await el.updateComplete;

    assert.equal(el.score, 100);
  });

  test('completing question preserves current score', async () => {
    // Question: 私 は 学生 です
    const q = await makeQuestion('I am a student.', ['私 は 学生 です。']);
    await el.supplyQuestion(q);
    await el.updateComplete;

    // 1. Correct guess: "watashi" -> 95
    input.value = 'わたし';
    input.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));
    await el.updateComplete;
    assert.equal(el.score, 95);

    // 2. Wrong guess -> 95 * 0.7 = 67 (rounded)
    input.value = 'wrong';
    input.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));
    await el.updateComplete;
    assert.equal(el.score, 67);

    // 3. Complete the rest: "wa gakusei desu"
    // Note: The component logic handles partial matches. 
    // Let's just finish it.
    // "wa"
    input.value = 'は';
    input.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));
    await el.updateComplete;
    // Correct guess, so 67 * 0.95 = 64 (rounded)
    assert.equal(el.score, 64);

    // "gakusei"
    input.value = 'がくせい';
    input.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));
    await el.updateComplete;
    // Correct guess, so 64 * 0.95 = 61
    assert.equal(el.score, 61);

    // "desu" (completes it)
    input.value = 'です';
    input.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));
    await el.updateComplete;
    
    // Should preserve score 61, not reduce it further
    assert.equal(el.score, 61);
  });

  test('revealing answer penalizes score for missing tokens', async () => {
    // Question: 私 は 学生 です (4 tokens: 私, は, 学生, です) + punctuation
    const q = await makeQuestion('I am a student.', ['私 は 学生 です。']);
    await el.supplyQuestion(q);
    await el.updateComplete;

    // Type "watashi" (1 token matched)
    input.value = 'わたし';
    input.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));
    await el.updateComplete;
    // Score: 95
    assert.equal(el.score, 95);

    // Reveal answer
    // Missing tokens: は, 学生, です (3 tokens)
    // Penalty: 95 * 0.7 * 0.7 * 0.7
    // 95 * 0.7 = 66.5 -> 67
    // 67 * 0.7 = 46.9 -> 47
    // 47 * 0.7 = 32.9 -> 33
    
    const actionButton = el.shadowRoot!.querySelector('#action-button') as HTMLButtonElement;
    // Button should be '?' (hint) because there is progress
    assert.equal(actionButton.textContent?.trim(), '?');
    
    actionButton.click();
    await el.updateComplete;

    assert.equal(el.score, 33);
  });
});
