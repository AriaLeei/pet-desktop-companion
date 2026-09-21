---
name: pet-desktop-companion
description: Turn a user's real pet photos into a personalized, interactive macOS desktop companion with clean character sprites, believable animation states, drag controls, idle behavior, and a packaged app. Use when the user asks to make their dog, cat, or other pet into a desktop pet or computer companion.
---

# Pet Desktop Companion

Build a recognizable macOS desktop companion from the user's own pet photos. The finished pet should feel animated rather than like a cutout sliding across the screen.

## Intake

Ask for a clear front-facing, full-body pet photo if none is supplied. Strongly recommend one side view and one rear or tail view for identity consistency. Use the pet's real markings, haircut, proportions, face, and tail.

If the user gives no interaction preferences, use these defaults:

- 190 × 190 transparent always-on-top window
- pet faces the viewer
- appears at the bottom-right and walks in place
- mouse movement near the pet triggers seated left/right head tilts
- after 10 seconds without interaction, the pet sits facing the viewer
- movement requires holding the left mouse button; releasing stops movement
- pet context menu: return to bottom-right, hide pet
- menu-bar icon: summon, hide, fully quit
- opening the app again while it is running summons the existing pet instead of starting a duplicate

## Workflow

1. Generate a coherent visual identity from the reference photos. Use the available image-generation capability for raster character assets.
2. Generate an animation-ready front-facing walk cycle. The legs must articulate and alternate naturally; translating one static cutout is not acceptable.
3. Generate matching seated states: neutral, head tilted left, and head tilted right. Keep the body fixed and change only the head angle.
4. Require genuine transparent alpha. Clean each sprite independently; never crop multiple pets from an overlapping collage without component cleanup.
5. Read [references/asset-prompts.md](references/asset-prompts.md) when generating the walk and seated states.
6. Use `scripts/prepare_sprites.py` to split, isolate, align, and normalize sprite sheets. Use one call per sheet.
7. Run `scripts/validate_assets.py` before assembling the app. Fix or regenerate failed assets; do not hide visual defects with CSS.
8. Run `scripts/scaffold_project.py` to copy the Electron starter, then place the validated frames in its `assets/walk/` and `assets/sit/` folders.
9. Install dependencies, launch the app, and verify the observable behaviors in [references/acceptance-checklist.md](references/acceptance-checklist.md).
10. Detect the Mac architecture with `uname -m`, package for `arm64` or `x64`, ad-hoc sign the local build when possible, and deliver both the app archive and source archive.

## Visual invariants

- Preserve one recognizable pet identity across every frame.
- Keep the face directed toward the viewer unless the user explicitly requests another orientation.
- Use consistent scale, eye level, body proportions, lighting, and ground contact.
- Each frame must contain exactly one complete pet. Reject extra eyes, paws, tails, partial animals, neighboring fragments, colored specks, halos, and hard rectangular edges.
- Validate animation by viewing it in motion. A sprite sheet that looks plausible as stills can still produce an anatomically wrong gait.
- Do not upload the user's photos or generated pet assets to a public repository unless the user explicitly asks to publish those specific assets.

## Interaction invariants

- Hover alone must never drag the pet.
- Drag only while the primary mouse button is held; stop immediately on release or cancellation.
- “Hide” keeps the menu-bar process alive so the pet can be summoned again.
- “Fully quit” ends the process. Keep this distinct from hiding.
- Idling and curiosity timers pause or reset during direct dragging.
- Keep the window within the active display's work area.

## Deliverables

Return a directly runnable macOS app, its source, and a short usage note. When the user asks to open it, launch the built app instead of telling them to download it.

Report which photos were used, which visual assets were generated, the final behavior defaults, validation results, and the saved artifact paths.
