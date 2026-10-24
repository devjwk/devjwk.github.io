# Navigation and layout review

The existing ivory/cobalt palette, typography, signal field, interactive exhibits, and original project records are retained.

## Navigation changes

- Featured-project links use project names. A labeled selector replaces the long row on narrow screens; All projects remains available beside it.
- The header navigation is labeled Menu; the archive layout control is labeled Grid to avoid two unrelated Index controls.
- Every exhibit links to its neighbors and the complete archive.
- The reader keeps its origin hash, scroll position, focus, archive filter, and layout. Previous/next project changes replace the current reader history entry, so Back exits to the origin and Forward restores the reader.
- Reader controls are available in the sticky header and footer. Each reader also links to its interactive exhibit, the complete archive, and relevant reports/slides when available.
- Internal document navigation opens disclosures before scrolling. Mobile sticky-header heights are measured rather than assumed.
- Controlled layout/select inputs are disabled until their handlers are ready.

## Layout corrections

- Odyssey role buttons occupy four corners and no longer collide with the central hub. Orbit decoration fits the map.
- Intrinsic grid minimums, long-link wrapping, card images, table containers, and small-screen headings are constrained.
- Grid/Shelf mode changes do not animate cards through intermediate overlapping layouts.
- Mobile reader headers and footer navigation wrap within the viewport.

## Browser checks

| Viewport width | Main page horizontal overflow | Grid cards outside container / overlapping each other |
|---|---|---|
| 320 px | None observed | None observed |
| 390 px | None observed | None observed |
| 600 px | None observed | None observed |
| 768 px | None observed | None observed |
| 1024 px | None observed | None observed |
| 1280 px | None observed | None observed |
| 1600 px | None observed | None observed |

The main page was checked with supporting documents and résumé expanded. Quantization-reader tables were opened at all seven widths: the reader's scroll width matched its available width. Controls and adjacent grid items were inspected by DOM bounds, with representative screenshots reviewed. The intentional Shelf fan remains inside its clipped presentation area.

Functional checks covered mobile project selection, Grid switching, reader previous/next controls, browser Back/Forward, closing from an empty page hash after manual scrolling, direct project-link reload, returning to the interactive exhibit, and navigating from reader to expanded reports/slides. Original 22 slides remain present; all internal anchor targets are present and no duplicate IDs were found. JavaScript syntax and whitespace checks passed.

Browser emulation covers layout and interaction; physical-device performance and printed output were not measured.

## 2026-10-24 — archive containment and evidence links

- Replaced each whole-card anchor with an article containing a case opener and a separate resource navigation. No nested anchors.
- Allocated independent grid rows to the title, image, case action, stack label, and resource links. Removed the floating pseudo-element action that covered the image.
- Browser-checked Shelf and Grid at 320, 390, 600, 768, 1024, 1280, and 1600 px: all seven cards passed title/image/action separation, title/card vertical containment, and resource horizontal containment. Grid pages had no horizontal overflow. The ten study/exhibit/workbench resource wrappers also passed horizontal containment at every width.
- Checked keyboard case opening, previous-case navigation, Back to the archive, study-tab resource changes, and the Odyssey presentation shortcut opening its disclosure without opening a case. External resource activation opened GitHub separately.
- Scoped the Odyssey role handlers to role buttons; archive contribution metadata must never enter the role-control handler.
- Verified 15 linked document/source file paths using GitHub's contents API. Report labels distinguish the CPU single-cycle .doc report, CNN Lab 4 PDF, NPC performance report, and Pointillism validation notes. Workbench projects without a formal report link to their README; FPGA links to generated timing/utilization reports.
- Odyssey retains its actual university GitLab repository. Its presentation shortcut points to the existing portfolio presentation/context section; it does not imply a separate report file.
- Existing six study-model tests passed; changed JavaScript passed syntax checks and git diff whitespace checks.

Resource mappings live in `resources.js`; document links are shared across study, exhibit, archive, and case views.
