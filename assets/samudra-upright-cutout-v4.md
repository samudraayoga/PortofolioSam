# Upright portrait — abu/merah-reference preview v4

Created using built-in imagegen, not CLI/API fallback. Uses the newly supplied
original frontal photos rather than earlier generated faces:

- Primary edit target, face and pose: `/Users/mac/myData/Foto/abu.jpeg`.
- Secondary facial reference: `/Users/mac/myData/Foto/merah.png`.
- Clothing/eyeglass reference only:
  `/Users/mac/Downloads/WhatsApp Image 2026-10-09 at 09.27.59.jpeg`.

Preserves the upright pose of the primary reference and changes clothing to the
mustard overshirt with black crew-neck tee, adds thin clear metal glasses, and
removes the background. Likeness takes priority over stylized lighting.

Saved `samudra-upright-cutout-v4.png` (1086 × 1448 with alpha) and optimized
`samudra-upright-cutout-v4.webp` (cwebp quality 88, alpha quality 100).
Preview only: website code and hero rotation have not been changed. Earlier
versions and original images remain intact. User review of likeness is required
before using this variant; generative edits do not guarantee exact likeness.

## Final generation prompt

Use case: identity-preserve.
Asset type: one photorealistic transparent portrait cutout, revised mustard-shirt hero portrait.
Input images: Image 1 (abu.jpeg, grey suit) is the PRIMARY EDIT TARGET and authoritative source for the face, hairstyle, body proportions, eye-level camera angle and upright pose. Image 2 (merah.png, red-background formal headshot) is a SECONDARY IDENTITY CHECK for the same person's true eye, nose, mouth and jaw proportions; do not average these faces or make a younger version. Image 3 (original café photo, mustard shirt and clear thin metal glasses) is a CLOTHING AND EYEGLASS REFERENCE ONLY. Do not copy its face, long-looking hairstyle, lowered head or café.
Primary request: keep the real person's face and upright pose from Image 1 intact, replace the grey suit and black collared shirt with the mustard/ochre open overshirt and plain black crew-neck T-shirt from Image 3, add his thin clear metal-frame glasses from Image 3, and remove the background.
Likeness invariants, highest priority: preserve Image 1's facial structure, expression, exact natural eye shape and size, eyelid folds, eyebrow shape, nose bridge and tip, lips, jawline, cheek contours, ears, skin tone and texture, hair parting and hair length, natural asymmetry and actual small skin marks. Keep its camera-facing head angle unchanged. Do not redesign or beautify the face, enlarge eyes, narrow the nose, change age, sharpen the jaw, airbrush skin, add a prominent cheek mole from Image 3, or invent a generic face. Use Image 2 to check likeness, not to replace Image 1's features.
Glasses: faithfully reproduce Image 3's thin metal frame with clear transparent lenses, properly fitted to Image 1's face, no lens magnification or facial distortion and no heavy colored reflections. Do not alter the underlying eyes to fit the glasses.
Composition: retain Image 1's vertical 3:4 framing and moderate head scale, full hair with top headroom, both shoulders and torso down to waist; maintain its subtle body angle and relaxed stance. No dramatic pose change, no selfie crop or giant head. Hands need not be added; crop naturally at the bottom.
Lighting/finish: keep Image 1's natural photorealistic face lighting and pores, gently mute the mustard overshirt to antique gold, with only restrained cool teal fill and a faint cyan hair/shoulder rim for the existing portfolio. Preserve believable cloth texture and folds. Identity accuracy matters more than cinematic polish.
Background: genuinely transparent alpha, including fine hair edges. Remove grey/red/café backgrounds entirely. No ground, floor, gradient, solid rectangle, checkerboard, glow halo, fantasy costume, text, watermark or UI.
Output: only one final edited photograph with transparency.
