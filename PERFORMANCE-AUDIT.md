# Performance Baseline

Recorded on 14 October 2026 with Chrome at a 1680 × 962 CSS-pixel viewport and a device pixel ratio of 2. The page was served locally, the intro was skipped, and every main chapter was visited twice using the site's own smooth-scroll navigation:

`Character → Constellation → Creations → Journey → Contact → Home`

All cinematic effects remained enabled. This is a development baseline for the current machine and browser, not a universal benchmark for every device.

## Scroll baseline

| Area | Average FPS | p95 frame | Worst frame | Estimated dropped frames |
| --- | ---: | ---: | ---: | ---: |
| Full route | **58.8** | **17.6 ms** | **34.4 ms** | **12 / 614** |
| Home | 59.5 | 17.5 ms | 34.3 ms | 1 / 123 |
| Character / Tech Stack | 58.3 | 17.6 ms | 32.4 ms | 1 / 39 |
| Constellation | **56.1** | **33.3 ms** | **34.4 ms** | **9 / 127** |
| Project Archive | 60.0 | 17.5 ms | 17.6 ms | 0 / 118 |
| Quest Journal | 60.0 | 17.6 ms | 17.7 ms | 0 / 114 |
| Contact | 59.3 | 17.6 ms | 33.7 ms | 1 / 93 |

Additional signals:

- Frames at or below 30 FPS: 7 of 614.
- Frames below 20 FPS: 0.
- Long tasks: 2; 97 ms total blocking time; 105 ms worst task.
- Cumulative layout shift: 0.0303 (stable).
- Running animations at the final snapshot: 57.
- Loaded resources: 62; approximately 13.15 MB decoded in the browser. Transfer size was cache-affected, so it is not useful for a cold-load comparison.
- Browser console warnings/errors during the route: none.

## Findings

The current build is already close to the 60 FPS target. Project Archive and Quest Journal held 60 FPS in this run. The repeatable hotspot is the Constellation entrance: its p95 frame time rises to roughly two 60 Hz frames.

The likely pressure comes from effects that overlap specifically when the constellation enters the viewport:

1. A large blurred nebula layer animates continuously.
2. Multiple SVG paths use live glow filters while their strokes are revealed.
3. The narwhal artwork uses an SVG morphology/blur filter.
4. Dust particles, node entrances, route drawing, and the global chapter transition can become active in the same short window.
5. The viewport is rendered at DPR 2, increasing the number of pixels processed by large blur/filter surfaces.

This does **not** mean the constellation effect should be removed. The next polish pass should retain the same reveal and ambience while reducing simultaneous paint work: precompose the glow where possible, stagger heavy filter work by a few frames, pause only off-screen layers, and keep motion on transform/opacity compositor paths.

## Existing safeguards confirmed

The current performance layer already preserves the visuals while doing useful work:

- Large archive panels do not use live `backdrop-filter` during normal rendering.
- Nearly invisible full-viewport pointer gradients are disabled; local hover lighting remains.
- Ambient animations pause only while the page is actively scrolling, then resume.
- Fog, motes, and panel shimmer are removed only on smaller screens or when reduced motion is requested.

These safeguards were active during this baseline.

## Re-running the audit

Open:

`index.html?perf=1`

The recorder samples frames only while scrolling, plus a short tail after the final scroll event. It does not render an overlay. After a route, inspect either:

```js
window.__celestialPerformanceAudit.snapshot()
```

or the serialized DOM report:

```js
JSON.parse(document.documentElement.dataset.performanceSnapshot)
```

Without `?perf=1`, the audit module is not downloaded or executed.

## Motion-budget pass

After centralizing the timing bands and pausing idle animation only outside the active chapter, the same two-round desktop route produced:

| Metric | Baseline | Motion budget | Change |
| --- | ---: | ---: | ---: |
| Full-route average | 58.8 FPS | **59.3 FPS** | +0.5 FPS |
| Full-route p95 | 17.6 ms | **17.6 ms** | stable |
| Worst frame | 34.4 ms | **34.1 ms** | -0.3 ms |
| Estimated dropped frames | 12 / 614 | **7 / 619** | -41.7% |
| Constellation average | 56.1 FPS | **57.3 FPS** | +1.2 FPS |
| Constellation p95 | 33.3 ms | **17.7 ms** | one-frame cadence restored |
| Long-task blocking time | 97 ms | **23 ms** | -74 ms |
| Cumulative layout shift | 0.0303 | **0.0200** | stable |

No visual effect was removed. The budget coordinates four timing bands—feedback, reveal, sequence, and cinematic—and pauses only continuous idle animation owned by chapters outside the viewport. A second verification pass confirmed that Loadout activation, Character Codex tabs, Constellation awakening, Project Archive projection, and Quest Journal playback all still reach their intended final states.

## Scroll and ambience pass

The scroll-driven UI now uses one shared `requestAnimationFrame` scheduler. World progress, chapter state, and active navigation subscribe to that frame instead of running separate scroll loops. The scheduler also owns the scroll/settle lifecycle, so continuous ambience pauses while the viewport is moving and resumes 150 ms after the final scroll event (or immediately after native `scrollend`). Pointer-driven fog, motes, and cursor particles also skip work while scrolling or while the document is hidden.

A clean desktop route at 1680 × 906 CSS pixels produced:

| Metric | Result |
| --- | ---: |
| Full-route average | **59.0 FPS** |
| Full-route p95 | **17.4 ms** |
| Worst frame | **33.4 ms** |
| Estimated dropped frames | **6 / 348** |
| Frames below 20 FPS | **0** |
| Character / Tech Stack | **60.0 FPS** |
| Constellation | **57.8 FPS** |
| Project Archive | **59.4 FPS** |
| Quest Journal | **60.0 FPS** |
| Contact | **60.0 FPS** |

The 390 × 844 mobile verification route produced **57.9 FPS**, a **17.1 ms** p95 frame, no horizontal overflow, and no frames below 20 FPS. Mobile still keeps the intended lightweight policy: global fog, mote field, and panel shimmer are not rendered below the 800 px breakpoint, while the core reveals and interaction states remain available.

Browser verification also confirmed that `is-scrolling` is cleared after settling, world and motion chapter state return to the correct section, active navigation remains synchronized, and the console reports no warnings or errors.

## Mobile validation and adjustment pass

The final responsive pass was checked at 320 × 700, 390 × 844, and 768 × 1024 CSS pixels. It keeps the cinematic reveals, constellation awakening, archive projections, and ley-line playback intact while making the surrounding interface more compact and touch-safe.

- The 320 px layout has no document-level horizontal overflow, and all 43 rendered links and buttons meet a minimum 44 px touch dimension.
- At 320 px the full wordmark becomes the existing celestial star mark, preventing the brand from being clipped between the four header controls.
- The mobile navigation now opens as a full-width overlay with four 44 px rows. A later motion rule had previously changed its positioning context and compressed it into a narrow column.
- The eight-item Tech Stack is now a 4 × 2 loadout tray on phones. Its grid height is 175 px and the complete arsenal block is approximately 229 px at 390 px wide, down from roughly 443 px, without removing sigils or resonance animation.
- Character Codex, Project Archive, and Quest Journal tabs use native momentum scrolling, proximity snap, contained horizontal overscroll, and partial next-card visibility as an affordance.
- Quest detail copy is 11 px with a 1.72 line height on phones.
- Contact actions form a stable two-row layout: conversation and copy actions share the first row, while LinkedIn receives the second row. Email and footer links retain 44 px touch height.
- Project selection, Quest selection, Character Codex tabs, Tech Stack activation, Constellation awakening, and the mobile menu were exercised successfully.
- The 768 px tablet layout keeps its desktop navigation, four-column loadout, and stacked cinematic hero without horizontal overflow.

After a warm-up, the 390 × 844 mobile scroll route produced:

| Metric | Result |
| --- | ---: |
| Average | **59.3 FPS** |
| p95 frame | **17.6 ms** |
| Worst frame | **33.8 ms** |
| Estimated dropped frames | **4 / 268** |
| Frames below 20 FPS | **0** |
| Long tasks | **0** |
| Cumulative layout shift | **0.0047** |

The browser console reported no warnings or errors. The viewport override used for testing was reset afterward.
