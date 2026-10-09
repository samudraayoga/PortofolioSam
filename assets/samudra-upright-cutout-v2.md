# Upright portrait — pose-edit preview v2

Created with built-in imagegen (not CLI/API fallback). Non-destructive pose edit
of `samudra-reflective-cutout-v1.png`, with the existing formal portrait as a
frontal identity/lighting reference and casual portrait as a finish reference.

Saved: `samudra-upright-cutout-v2.png` and optimized
`samudra-upright-cutout-v2.webp` (cwebp quality 88, alpha quality 100).
Preview asset only: website code and current hero rotation remain unchanged.
AI reconstructs features newly exposed by the changed head angle; the user
should review likeness before approving replacement in the hero.

## Final generation prompt

Use case: identity-preserve.
Asset type: a photorealistic transparent portrait cutout for an existing navy/teal/gold personal portfolio hero slideshow, one image only, not a website mockup.
Input images: Image 1 is the edit target: the previously edited young man in clear thin metal-frame eyeglasses, mustard-gold open overshirt and black T-shirt, currently looking down. Image 2 is the SAME PERSON's frontal formal portrait: use it to preserve his facial identity when changing the viewing angle, and to match restrained lighting and subject scale; do NOT copy its suit. Image 3 is a lighting/finish and portrait-scale reference only; do NOT copy its thick black glasses, seated pose, clothing, or expression.
Primary request: change the target's downward-looking pose into a natural upright editorial portrait suitable for the same hero slideshow. Lift his head, relax the shoulders into a subtle three-quarter stance, turn the face nearly toward the camera with only a slight turn, and have his eyes look gently at the camera. Keep a relaxed closed-mouth expression, no exaggerated smile.
Identity invariants: preserve the target person's recognizable face, natural skin tone and texture, facial proportions, cheek mole, black hairstyle and parting, original clear thin metal-frame glasses and their shape, age and physique. Use the frontal identity reference to reconstruct newly visible features faithfully; avoid beautification or making a different face.
Clothing invariants: keep the mustard/antique-gold open overshirt with its original collar and realistic folds, and plain black crew-neck T-shirt. No fantasy costume, suit, jewelry, new accessories or props.
Composition: eye-level camera, vertical 3:4 canvas. Center the person with full hair and BOTH shoulders comfortably visible and a little transparent margin; show the head and upper torso down to lower chest, with a natural bottom crop. Do not make the face a giant selfie: the head should be about one third of the canvas width, similar in scale and top headroom to Image 2; allow sufficient torso below the face for the website caption overlay. Hands are outside the crop, do not invent them.
Lighting/finish: match the existing references' photorealism, soft warm face light, muted antique-gold shirt, subtle cool teal fill in shadows and narrow understated cyan rim along hair and shoulders. Preserve skin pores, fine hair strands, credible neck anatomy, eyeglass transparency and cloth texture. This is a photographic pose edit, not anime or illustration.
Background: genuinely transparent alpha, also around fine hair and eyeglasses. No café, furniture, people, floor, gradient, opaque rectangle, simulated checkerboard, halo, frame, text, watermark or UI. Produce only the final edited portrait with transparency.
