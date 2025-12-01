/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {LitElement, html, css} from 'lit';
import {customElement} from 'lit/decorators.js';
import * as wanakana from 'wanakana';

/**
 * An example element.
 *
 * @fires count-changed - Indicates when the count changes
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('kana-control')
export class KanaControl extends LitElement {
  static override styles = css`
    :host {
      display: block;
      border: solid 1px gray;
      padding: 16px;
      max-width: 800px;
    }
  `;

  override render() {
    return html`
      <input
        id="kana-input"
        part="kana-input"
        type="text"
        autocapitalize="none"
        autocomplete="off"
        autocorrect="off"
        spellcheck="false"
        placeholder="日本語"
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
}

declare global {
  interface HTMLElementTagNameMap {
    'kana-control': KanaControl;
  }
}
