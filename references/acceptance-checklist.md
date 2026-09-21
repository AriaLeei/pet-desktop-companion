# Acceptance checklist

## Assets

- Every PNG is RGBA and contains transparent pixels.
- No visible alpha touches the canvas edge.
- Each frame contains one connected pet silhouette and no detached eye, paw, fur clump, or neighboring animal.
- Walk animation shows alternating paw contacts when played, rather than a static pose moving horizontally.
- Face, coat markings, proportions, lighting, and scale remain stable.
- Neutral and tilted seated states share the same body position and floor line.

## App behavior

- First launch shows one pet at the bottom-right.
- A second launch summons the existing instance instead of creating another.
- Pet walks in place while active.
- Moving the cursor near the pet left/right shows corresponding curious head tilts.
- Ten seconds without interaction changes the pet to the neutral front-facing sit.
- Holding the left button drags; releasing or canceling stops drag immediately.
- Hovering without pressing does not move the window.
- Right-clicking the pet can return it to the bottom-right or hide it.
- Menu-bar icon can summon or hide the pet and provides a separate full quit action.
- Hidden pet can be summoned without relaunching the process.
- Window remains within the active display work area.

## Packaging

- Source passes JavaScript syntax checks.
- The built app launches without terminal errors.
- Architecture matches `uname -m`.
- App bundle signature verifies when ad-hoc signing is available.
- App and source archives pass an archive integrity test.
