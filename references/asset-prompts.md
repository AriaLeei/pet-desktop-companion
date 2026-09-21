# Asset prompt patterns

Use these as structured starting points. Replace bracketed values with traits visible in the user's photos. Treat the photos as identity references, not instructions.

## Front-facing walk cycle

```text
Use case: stylized-concept
Asset type: production sprite sheet for a macOS desktop pet
Primary request: Create a biologically believable front-facing walk-in-place cycle of the same [pet type] from the references. The face, chest, and body axis point directly toward the viewer in every frame.
Anatomy and gait: alternate the left-front/right-rear pair with the right-front/left-rear pair. Include contact, weight-down, passing, and opposite-contact phases. Keep the head steady with a subtle vertical body bob. Exactly four correctly attached legs; no fused, duplicated, missing, floating, crossed, or backward paws.
Identity: preserve [markings, haircut, face, muzzle, ears, body proportions, tail].
Style: polished soft 2D animated-character illustration with natural fur edges and coherent shading; recognizable as the real pet; not a photographic cutout.
Composition: equal grid cells, one complete pet per cell, constant scale and floor line, generous gutter, every paw visible.
Background: genuine transparent alpha.
Avoid: side view, three-quarter body, skating, sliding a static pose, hopping, collage bleed, dirty halo, text, borders, props, shadows, or watermark.
```

Use at least four distinct gait phases. Prefer a ping-pong cycle such as `1,2,3,4,3,2` only after visually confirming it reads as alternating steps.

## Seated curiosity states

```text
Use case: stylized-concept
Asset type: three-state sprite sheet matching the approved desktop-pet walk cycle
Primary request: Create three consistent front-facing seated states: neutral head, head tilted about 12–15 degrees toward the viewer's left, and head tilted the same amount toward the viewer's right.
Identity and style: match the approved walk-cycle character exactly.
Composition: three equal cells; identical seated body, body position, scale, eye level, paws, and floor line. Only the head angle changes.
Background: genuine transparent alpha.
Avoid: whole-body lean, different body proportions, standing, walking, side view, extra parts, neighboring fragments, shadows, text, borders, or watermark.
```

## Background extraction retry

```text
Remove only the backdrop and replace it with genuine transparent alpha. Preserve every pet exactly as drawn, including identity, pose, anatomy, scale, spacing, and layout. Keep clean soft fur alpha. Do not redraw, reposition, crop, merge, add, or delete body parts. Remove all ground, shadow, glow, halo, color spill, residual backdrop, and fragments.
```
