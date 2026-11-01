import test from 'node:test';
import assert from 'node:assert/strict';
import {
  compileWizardPrompt,
  interpolateFixTemplate,
  formatSearchCountArabic,
  calculateChecklistProgress
} from './darkroomLogic';

test('compileWizardPrompt formats Midjourney prompt with raw style and aspect ratio', () => {
  const out = compileWizardPrompt('A glass bottle', 'prod', 'midjourney', '4:5');
  assert.equal(out.startsWith('A glass bottle. Professional commercial product photography'), true);
  assert.equal(out.includes('--style raw --stylize 50 --ar 4:5 --no'), true);
});

test('compileWizardPrompt formats Flux and Stable Diffusion prompts properly', () => {
  const flux = compileWizardPrompt('A coffee cup', 'food', 'flux', '1:1');
  assert.equal(flux.includes('unretouched real camera sensor capture.'), true);

  const sd = compileWizardPrompt('A coffee cup', 'food', 'stablediffusion', '1:1');
  assert.equal(sd.includes('(natural textures:1.2), (subtle film grain:1.1)'), true);
});

test('interpolateFixTemplate replaces bracketed placeholders with values or keeps fallback', () => {
  const tpl = 'Fix [DEFECT] in [REFERENCE] with [MATERIAL].';
  const filled = interpolateFixTemplate(tpl, {
    DEFECT: 'warped cap',
    REFERENCE: 'cylinder',
    MATERIAL: ''
  });
  assert.equal(filled, 'Fix warped cap in cylinder with [MATERIAL].');
});

test('formatSearchCountArabic returns expected Egyptian Arabic strings', () => {
  assert.equal(formatSearchCountArabic(0), 'مفيش نتايج، جرب كلمة تانية');
  assert.equal(formatSearchCountArabic(4), 'لقيت 4 نتايج');
});

test('calculateChecklistProgress calculates percentage accurately', () => {
  const half = calculateChecklistProgress(7, 14);
  assert.equal(half.pct, 50);
  assert.equal(half.label, 'نسبة الجاهزية للتسليم: 50% (7 من 14)');
});
