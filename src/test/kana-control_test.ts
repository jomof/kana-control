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

  test('renders english prompt above input', async () => {
    const el = (await fixture(
      html`<kana-control english="Hello world."></kana-control>`
    )) as KanaControl;
    await el.updateComplete;
    const sr = el.shadowRoot!;
    const english = sr.querySelector('#english') as HTMLElement | null;
    const input = sr.querySelector('#kana-input') as HTMLInputElement | null;
    assert.ok(english, 'english prompt should render when provided');
    assert.ok(input, 'input should exist');
    assert.equal(english!.textContent?.trim(), 'Hello world.');
    // Ensure english appears before input in the light DOM order
    const topChildren = Array.from(sr.children);
    const englishIndex = topChildren.indexOf(english!);
    const inputIndex = topChildren.indexOf(input!);
    assert.isBelow(englishIndex, inputIndex);
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
