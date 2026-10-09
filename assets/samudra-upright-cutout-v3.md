# Upright portrait — original-reference preview v3

Created with built-in imagegen, not CLI/API fallback. Uses only the two original
photos requested by the user, not previously generated faces:

- Edit target: `/Users/mac/Downloads/WhatsApp Image 2026-10-09 at 09.27.59.jpeg`
  (mustard shirt, downward-looking café portrait).
- Identity reference: `/Users/mac/Downloads/WhatsApp Image 2026-10-09 at 09.30.58.jpeg`
  (near-frontal mirror selfie with clear metal glasses and black jacket).

Saved: `samudra-upright-cutout-v3.png` (1086 × 1448, alpha) and optimized
`samudra-upright-cutout-v3.webp` (cwebp quality 88, alpha quality 100).
Existing images were not overwritten. Preview only: website and hero rotation
remain unchanged pending review of likeness. Changed pose reconstructs facial
features and does not guarantee an exact likeness.

## Final generation prompt

Use case: identity-preserve.
Asset type: one photorealistic portrait cutout, pose-edit preview for a personal portfolio hero.
Input images: Image 1 is the ORIGINAL edit target: the person wearing a mustard overshirt, thin clear metal-frame glasses and black T-shirt, looking down in a café. Image 2 is a second ORIGINAL photo of the SAME PERSON taking a mirror selfie in clear metal-frame glasses and a black jacket; use this as the primary reference for his actual near-frontal facial geometry. Use only these two original photographs to establish likeness, not any previously generated face.
Primary request: redo the mustard-shirt portrait with a modestly raised, more upright head and a gentle near-camera gaze. Favor the real face and natural slightly tilted three-quarter head angle seen in Image 2 over forcing a perfectly frontal studio face. Keep the change of angle restrained and physically natural.
Highest priority — likeness: reproduce this specific person's actual facial geometry from BOTH originals: eye shape, eyelid openness, eye spacing, eyebrow shape, nose bridge/tip/width, lip shape and closed-mouth expression, cheek fullness, jaw and chin proportions, skin tone, natural asymmetric features and visible small moles. Do not enlarge or round his eyes, sharpen his jaw, narrow the nose, plump lips, smooth away skin texture, change his age or make him into a generic handsome model. Preserve his black hairstyle and original thin clear metal eyeglasses. Image 2 is a mirrored photo; use Image 1 to keep the side-specific landmarks consistent rather than duplicating cheek moles. Reconstruct only what the requested small pose change requires.
Clothing: keep ONLY Image 1's mustard overshirt and plain black crew-neck tee, original collar and fabric details. Do not copy Image 2's jacket, necklace, watch or phone.
Composition: vertical 3:4 transparent canvas; natural eye-level upper-body portrait from full hair down to waist, centered with both shoulders visible and comfortable transparent top and side margins. Moderate head size, about one third of the canvas width; no giant close-up selfie. Hands outside the crop, no new props.
Lighting: realistic soft warm key on the face, modestly muted ochre-gold shirt, subtle cool teal shadow fill and very faint cyan edge light for the existing navy/teal portfolio. Maintain real skin pores, eyeglass transparency and fabric wrinkles. Likeness takes priority over stylized lighting.
Background: remove all café and mirror surroundings, other people, phone and furniture; genuinely transparent alpha with clean fine hair edges. No baked gradient, checkerboard, opaque rectangle, halo, text, watermark, fantasy costume, anime treatment or illustration.
Output: one final edited photograph with transparency.
