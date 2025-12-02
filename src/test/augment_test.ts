import { augmentTokenGroups } from '../augment.js';
import { setTokenizer, resetTokenizer } from '../tokenize.js';
import { assert } from 'chai';
import { IpadicFeatures } from '@patdx/kuromoji';

function makeToken(surface: string, pos: string = '名詞'): IpadicFeatures {
  return {
    surface_form: surface,
    reading: surface,
    pos: pos,
    pos_detail_1: '',
    pos_detail_2: '',
    pos_detail_3: '',
    conjugated_type: '',
    conjugated_form: '',
    basic_form: surface,
    pronunciation: surface,
    word_id: 0,
    word_type: 'KNOWN',
    word_position: 0
  };
}

suite('augment', () => {
  setup(() => {
    setTokenizer(async (text) => {
      // Simple mock: split by space
      return text.trim().split(/\s+/).map(w => makeToken(w));
    });
  });

  teardown(() => {
    resetTokenizer();
  });

  test('replaces 私 with 僕, 俺, etc.', async () => {
    const input = [[makeToken('私'), makeToken('は')]];
    const result = await augmentTokenGroups(input);
    
    const surfaces = result.map(g => g.map(t => t.surface_form).join(' '));
    assert.include(surfaces, '私 は');
    assert.include(surfaces, '僕 は');
    assert.include(surfaces, '俺 は');
    assert.include(surfaces, 'あたし は');
  });

  test('augmentDropWatashiHa drops "私 は"', async () => {
      const input = [[makeToken('私'), makeToken('は'), makeToken('行く')]];
      const result = await augmentTokenGroups(input);
      const surfaces = result.map(g => g.map(t => t.surface_form).join(' '));
      
      assert.include(surfaces, '私 は 行く');
      assert.include(surfaces, '行く');
  });

  test('augmentDesuDaTokens replaces です with だ', async () => {
      // Need to satisfy the guard in augmentDesuDaTokens
      // desuIndex !== tokens.length - 1 ...
      // It seems it wants 'です' NOT at the very end? Or checks if it IS at the end?
      
      /*
      if (
        desuIndex !== tokens.length - 1 &&
        (desuIndex !== tokens.length - 2 ||
          (tokens[tokens.length - 1].pos !== '記号' &&
            tokens[tokens.length - 1].pos !== '名詞'))
      ) { return []; }
      */
      
      // So if desu is at end (index == length-1), it proceeds.
      // If desu is at length-2, next must be symbol or noun.
      
      const input = [[makeToken('そう'), makeToken('です')]];
      const result = await augmentTokenGroups(input);
      const surfaces = result.map(g => g.map(t => t.surface_form).join(' '));
      
      assert.include(surfaces, 'そう です');
      assert.include(surfaces, 'そう だ');
  });

  test('augmentDropWatashiHa does not drop "僕 は"', async () => {
      const input = [[makeToken('僕'), makeToken('は'), makeToken('行く')]];
      const result = await augmentTokenGroups(input);
      const surfaces = result.map(g => g.map(t => t.surface_form).join(' '));
      
      assert.include(surfaces, '僕 は 行く');
      // Should not drop "僕 は" because the guard only checks for "私"
      assert.notInclude(surfaces, '行く');
  });

  test('augmentDesuDaTokens does not replace です when followed by verb', async () => {
      const input = [[makeToken('そう'), makeToken('です'), makeToken('行く', '動詞')]];
      const result = await augmentTokenGroups(input);
      const surfaces = result.map(g => g.map(t => t.surface_form).join(' '));
      
      assert.include(surfaces, 'そう です 行く');
      assert.notInclude(surfaces, 'そう だ 行く');
  });

  test('augmentDesuDaTokens replaces です when followed by symbol', async () => {
      const input = [[makeToken('そう'), makeToken('です'), makeToken('。', '記号')]];
      const result = await augmentTokenGroups(input);
      const surfaces = result.map(g => g.map(t => t.surface_form).join(' '));
      
      assert.include(surfaces, 'そう です 。');
      assert.include(surfaces, 'そう だ 。');
  });

  test('augmentDesuDaTokens replaces です when followed by noun', async () => {
      const input = [[makeToken('そう'), makeToken('です'), makeToken('人', '名詞')]];
      const result = await augmentTokenGroups(input);
      const surfaces = result.map(g => g.map(t => t.surface_form).join(' '));
      
      assert.include(surfaces, 'そう です 人');
      assert.include(surfaces, 'そう だ 人');
  });

  test('augmentDesuDaTokens does not replace です when followed by multiple tokens ending in symbol', async () => {
      const input = [[makeToken('そう'), makeToken('です'), makeToken('ね', '助詞'), makeToken('。', '記号')]];
      const result = await augmentTokenGroups(input);
      const surfaces = result.map(g => g.map(t => t.surface_form).join(' '));
      
      assert.include(surfaces, 'そう です ね 。');
      assert.notInclude(surfaces, 'そう だ ね 。');
  });

  test('augmentDesuDaTokens does not replace です when preceded by adjective', async () => {
      const input = [[makeToken('高い', '形容詞'), makeToken('です')]];
      const result = await augmentTokenGroups(input);
      const surfaces = result.map(g => g.map(t => t.surface_form).join(' '));
      
      assert.include(surfaces, '高い です');
      assert.notInclude(surfaces, '高い だ');
  });

  test('augmentDesuDaTokens does not replace です when preceded by "たい"', async () => {
      const input = [[makeToken('行き', '動詞'), makeToken('たい', '助動詞'), makeToken('です')]];
      const result = await augmentTokenGroups(input);
      const surfaces = result.map(g => g.map(t => t.surface_form).join(' '));
      
      assert.include(surfaces, '行き たい です');
      assert.notInclude(surfaces, '行き たい だ');
  });

  test('augmentDesuDaTokens replaces です at start', async () => {
      const input = [[makeToken('です')]];
      const result = await augmentTokenGroups(input);
      const surfaces = result.map(g => g.map(t => t.surface_form).join(' '));
      
      assert.include(surfaces, 'です');
      assert.include(surfaces, 'だ');
  });

  test('augmentDropWatashiHa does not drop "私" (single token)', async () => {
      const input = [[makeToken('私')]];
      const result = await augmentTokenGroups(input);
      // Should not contain empty group
      const emptyGroups = result.filter(g => g.length === 0);
      assert.equal(emptyGroups.length, 0);
  });

  test('makeReadingModifierAugmenter modifies reading', async () => {
      const input = [[makeToken('日本')]];
      const result = await augmentTokenGroups(input);
      
      const readings = result.map(g => g[0].reading);
      assert.include(readings, 'ニッポン');
      assert.include(readings, 'ニホン');
  });

  test('makeReadingModifierAugmenter modifies reading when token is not at start', async () => {
      const input = [[makeToken('これ'), makeToken('は'), makeToken('日本')]];
      const result = await augmentTokenGroups(input);
      
      const modifiedGroup = result.find(g => g.length > 2 && g[2].reading === 'ニッポン');
      assert.exists(modifiedGroup);
      assert.equal(modifiedGroup![0].reading, 'これ');
  });

  test('replaces あなた with 君 and vice versa', async () => {
      const input = [[makeToken('あなた'), makeToken('は')]];
      const result = await augmentTokenGroups(input);
      const surfaces = result.map(g => g.map(t => t.surface_form).join(' '));
      
      assert.include(surfaces, 'あなた は');
      assert.include(surfaces, '君 は');
      
      const input2 = [[makeToken('君'), makeToken('は')]];
      const result2 = await augmentTokenGroups(input2);
      const surfaces2 = result2.map(g => g.map(t => t.surface_form).join(' '));
      
      assert.include(surfaces2, '君 は');
      assert.include(surfaces2, 'あなた は');
  });
});
