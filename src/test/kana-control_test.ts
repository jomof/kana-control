/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {KanaControl} from '../kana-control.js';
import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

suite('kana-control', () => {
  test('is defined', () => {
    const el = document.createElement('kana-control');
    assert.instanceOf(el, KanaControl);
  });

  test('renders with default values', async () => {
    const el = (await fixture(html`<kana-control></kana-control>`)) as KanaControl;
    const input = el.shadowRoot!.querySelector('#kana-input');
    assert.ok(input, 'kana input should exist');
  });

  test('styling applied', async () => {
    const el = (await fixture(html`<kana-control></kana-control>`)) as KanaControl;
    await el.updateComplete;
    assert.equal(getComputedStyle(el).paddingTop, '16px');
  });

  test('wanakana converts romaji input to kana', async () => {
    const el = (await fixture(html`<kana-control></kana-control>`)) as KanaControl;
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector('#kana-input') as HTMLInputElement;
    // Type romaji and trigger input event to let WanaKana convert it
    input.value = 'konnnichiha';
    input.dispatchEvent(new Event('input', {bubbles: true, composed: true}));
    // Expect conversion to Japanese kana
    assert.equal(input.value, 'こんにちは');
  });
});
