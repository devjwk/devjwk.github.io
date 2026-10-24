# Motion and interaction refinement

The existing portfolio palette, Departure Mono typography, ambient wave, project records, and navigation are retained.

## Reference order

1. **GSAP / project presentation:** [GSAP Showcase](https://gsap.com/showcase/) and [Guillaume Colombel](https://guillaumecolombel.fr/). The large project preview and editorial hierarchy informed the treatment; the portfolio's entrance timing is an original implementation. GSAP 3.13.0 and ScrollTrigger are bundled locally. [ScrollTrigger documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) informed lifecycle and refresh behavior.
2. **WebGL / atmosphere:** [Dérive](https://derive-ocean.com/) and its [making-of](https://derive-ocean.com/en/making-of). The relevant principle is a procedural, responsive surface with depth and a restrained interface. The portfolio uses its own low-poly wire surface and original shaders, without Dérive assets or code.
3. **CSS / interface detail:** [Rauno Freiberg](https://rauno.me/) informed restraint and feedback. Borders, link states, contained card-image zoom, button responses, and pointer lighting are implemented locally.

Reference pages were inspected in the browser. Other candidates were screened through the official GSAP showcase and published page content; inaccessible/loading-only pages were not treated as verified interaction references.

## Applied

- A contained WebGL signal study in the hero. Signals, Inference, and Interaction each link to the corresponding actual project.
- Pointer response and tap ripples on an original wire mesh. The figure is labeled conceptual, with no measured-data or model-output claim.
- GSAP title/diagram entrances and per-project progress strokes, without changing layout or replacing normal page scrolling.
- Subtle feedback when diagram controls change, plus contained hover treatments.
- The main motion control synchronizes the ambient field, signal study, and entrance choreography. Reduced-motion preferences are respected. Offscreen/hidden surface animation stops.
- A static SVG remains available if WebGL cannot initialize or the context is lost.

## Validation

320, 390, 600, 768, 1024, 1280, and 1600 px: no page horizontal overflow or hero-column overlap observed. WebGL initialized in all tested viewports. Browser tests covered theme selection, linked project navigation, pause/resume, existing quantization controls, next-project reader navigation, and returning to the originating exhibit. A local QA control deliberately lost the WebGL context; the SVG fallback appeared and project links continued working.

All local assets are served from this repository. Existing presentation slides and internal links are retained. Physical-device frame rate and operating-system reduced-motion emulation were not measured.
