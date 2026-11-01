// Pure logic for The Darkroom prompt library (Wizard compiler, Fix command builder, Checklist scorer, Search highlighter)

export const catTemplates: Record<string, string> = {
  prod: "Professional commercial product photography, shot on Canon EOS R5 with a 100mm macro lens, f/8, ISO 100, large softbox lighting at 45 degrees with subtle rim light, soft realistic reflections and natural shadow falloff, visible material texture, true-to-life colors, subtle film grain, slight imperfections, unretouched RAW photo, high-end advertising quality.",
  ppl: "Candid editorial portrait photograph, shot on Sony A7R IV with an 85mm f/1.8 lens, ISO 200, soft diffused window light, natural skin texture with visible pores, fine peach fuzz, subtle blemishes, under-eye shadows, flyaway hairs, slightly asymmetrical features, natural expression, Kodak Portra 400 film look, subtle film grain, unretouched RAW photo.",
  food: "Professional food photography, shot on Canon EOS R5 with a 100mm macro lens, f/4, ISO 100, soft natural window light from the side, visible steam, natural moisture and glossy highlights, crumbs and small drips, slightly imperfect plating, fresh and appetizing true-to-life colors, shallow depth of field, subtle film grain, unretouched RAW photo.",
  int: "Professional architectural interior photography, shot on Canon EOS R5 with a 24mm tilt-shift lens, f/11, ISO 100, natural daylight through windows balanced with soft ambient light, straight vertical lines, realistic materials, lived-in details, true-to-life colors, subtle film grain, unretouched RAW photo.",
  white: "E-commerce catalog product photograph on a pure white seamless background, shot on Canon EOS R5 with a 100mm macro lens, f/11, ISO 100, two large softboxes at 45 degrees with a white fill card, even soft lighting, product centered with small margin, soft contact shadow directly under product, tack-sharp focus, unretouched RAW photo.",
  jewel: "Luxury jewelry macro photograph, shot on Canon EOS R5 with a 100mm macro lens, f/11 with focus stacking, ISO 100, soft diffused light from large softbox above with small white cards, crisp specular highlights on polished metal, true gemstone color, fine micro-scratches, shallow depth of field, resting on dark slate, unretouched RAW photo.",
  beauty: "Premium skincare and cosmetics product photograph, shot on Canon EOS R5 with a 100mm macro lens, f/8, ISO 100, soft window-style light from left with bounce card on right, soft gradient shadows, realistic frosted glass and matte plastic textures, product swatch with natural thickness, a few dew drops, unretouched RAW photo.",
  drink: "Professional beverage photography, shot on Canon EOS R5 with a 100mm macro lens, f/5.6, ISO 100, strong backlight from behind through the glass with soft fill from front, natural condensation droplets, real ice cubes with air bubbles, a few fizz bubbles, unretouched RAW photo.",
  fashion: "Editorial fashion photograph, shot on Sony A7R IV with an 85mm f/2 lens, ISO 200, soft open-shade daylight with subtle reflector fill, natural fabric behavior: realistic folds, seams and visible weave, garment fits naturally with wrinkles at joints, natural skin texture, Kodak Portra 400 film look, unretouched RAW photo.",
  car: "Professional automotive photograph, shot on Canon EOS R5 with a 70-200mm lens at 135mm, f/5.6, ISO 100, low three-quarter front angle, golden hour sunlight from behind-left with soft reflections in paint, real tire texture and light road dust, contact shadows under tires, unretouched RAW photo.",
  land: "Landscape travel photograph, shot on Sony A7R IV with a 24-70mm lens at 35mm, f/9, ISO 100, sharp from foreground to horizon, natural low-angle sunlight at golden hour with long soft shadows, visible terrain texture, subtle film grain, unretouched RAW photo.",
  street: "Candid street documentary photograph, shot on Fujifilm X100V with a 35mm equivalent lens, f/4, ISO 400, available natural light with hard sunlight and deep real shadows, people caught mid-motion, natural clutter and textures of a real place, visible film grain, unretouched RAW photo."
};

export const standardExcl = "cartoon, illustration, 3D render, CGI, digital art, painting, plastic skin, airbrushed, overly smooth, oversaturated, HDR look, glowing edges, perfect symmetry, watermark, text, logo, distorted hands, extra fingers, deformed, blurry";

export function compileWizardPrompt(subject: string, category: string, tool: string, ratio: string): string {
  const subj = subject.trim();
  const base = catTemplates[category] || catTemplates['prod'];
  const combined = subj ? `${subj}. ${base}` : base;

  if (tool === 'midjourney') {
    return `${combined} --style raw --stylize 50 --ar ${ratio} --no ${standardExcl}`;
  } else if (tool === 'flux') {
    return `${combined} Highly authentic photograph, natural lighting, true optical depth of field, natural material textures, unretouched real camera sensor capture.`;
  } else if (tool === 'stablediffusion') {
    return `${combined}, (natural textures:1.2), (subtle film grain:1.1), RAW photo, high-end commercial capture`;
  } else {
    return `${combined} Avoid and exclude: cartoon, CGI, 3D render, plastic skin, airbrushed, oversaturated, blurry.`;
  }
}

export function interpolateFixTemplate(template: string, values: Record<string, string>): string {
  let res = template;
  for (const [key, rawVal] of Object.entries(values)) {
    const val = (rawVal || '').trim() || `[${key}]`;
    res = res.replace(new RegExp(`\\[${key}\\]`, 'g'), val);
  }
  return res;
}

export function formatSearchCountArabic(count: number): string {
  if (count === 0) return 'مفيش نتايج، جرب كلمة تانية';
  return `لقيت ${count} نتايج`;
}

export function calculateChecklistProgress(checked: number, total: number): { pct: number; label: string } {
  if (total <= 0) return { pct: 0, label: 'نسبة الجاهزية للتسليم: 0% (0 من 0)' };
  const pct = Math.round((checked / total) * 100);
  return {
    pct,
    label: `نسبة الجاهزية للتسليم: ${pct}% (${checked} من ${total})`
  };
}
