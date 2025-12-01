/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
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

    input#kana-input {
      box-sizing: border-box;
      width: 100%;
      padding-left: 2.5em;
      padding-right: 2.5em;
      border-radius: 8px;

      font-family: 'Noto Sans JP', sans-serif;
      font-size: 22px;
      line-height: 33px;
      text-align: center;
    }
  `;

  @property({type: String, reflect: true})
  english: string = '';

  override render() {
    return html`
      ${this.english
        ? html`<div id="english" part="english">${this.english}</div>`
        : null}
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
