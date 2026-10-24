# Personal portfolio — visual direction and reference review

Retained: ivory background, cobalt accent, Departure Mono typography, and the full-page signal field.

## Reviewed references

| Reference | Useful direction for this portfolio |
|---|---|
| [Bartosz Ciechanowski](https://ciechanow.ski/) / [Mechanical Watch](https://ciechanow.ski/mechanical-watch/) | Let a diagram reveal the mechanism; controls sit next to the explanation. |
| [Distill — Momentum](https://distill.pub/2017/momentum/) | Controls and quantitative feedback form one explanation. |
| [Explorable Explanations](https://explorabl.es/) | Learn a system by changing something. |
| [Nicky Case](https://ncase.me/) | Playable ideas, clear rules, short progressive explanations. |
| [The Pudding](https://pudding.cool/) | Editorial narratives driven by visual evidence. |
| [Lusion](https://lusion.co/) | Give featured work room to become a scene. |
| [Rauno Freiberg](https://rauno.me/) | Restrained interface craft and responsive feedback. |
| [Linear](https://linear.app/features) | Precise typography, boundaries, and product-oriented composition. |
| [Bruno Simon](https://bruno-simon.com/) | The portfolio itself can demonstrate a way of thinking. |
| [Arc Marumo](https://www.arcmarumo.com/) | Exploratory project navigation, keyboard access, monochrome treatment. |
| [Mosby Files / Mary Colter](https://www.mosbyfiles.com/cases/mary-colter) | A project presented as a visual editorial story. |
| [Axiom](https://axiom.peppermint.id/#archive) | An archive as an experience rather than a plain link list. |

These are independent references, not templates or copied source code. Visual browser review focused on the Ciechanowski explanation and the Distill example; the other references were also reviewed through their published page content. Lusion's browser view reached its loading screen, so its page content informed the composition rather than a claimed full animation review.

## Applied project treatment

- **Pointillism Gallery:** a directly controllable 2D point study with gather/scatter and subtle pointer response. This is a portfolio preview, not the gallery's depth renderer. Live gallery and implementation notes remain available.
- **Quantized CNN:** a precision selector updates a 256-cell storage display, actual measured storage/latency/accuracy, and the interpretation. Accuracy uses 0–100%; 4/2-bit container limitations remain visible.
- **RISC-V:** interactive stage annotations highlight personal modules. Measured benchmark inputs are preserved; timing estimates remain labeled. Execution-time and clock-period views show why the fastest clock does not win the benchmark.
- **AI NPC Detective Game:** a state-map based on the actual README, plus dialogue-pipeline exploration. No live model request is made by this portfolio diagram.
- **Odyssey:** role-based request exploration with personal backend/integration focus; shared team ownership remains explicit.
- **Supporting documents:** original reports, slides, ethics paper, and reflections are available through disclosure; the résumé is also optional on the main page.

## Evidence and media

- Existing portfolio source at commit `ef3b335` supplies CPU and CNN measurements and original team-role statements.
- [Pointillism Gallery README](https://github.com/devjwk/pointillism-gallery) and artwork source records reviewed on 2026-10-24.
- [AI NPC Detective Game README](https://github.com/devjwk/ai-npc-detective-game) reviewed on 2026-10-24; game state transitions and limitations come from that document.
- `assets/showcase/geumgangjeondo.jpg`: display derivative from the user's Pointillism Gallery repository. Jeong Seon, *Geumgangjeondo* (1734), public-domain source: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Jeong_Seon-Geumgangjeondo.jpg). Artist and source linked next to the preview.
- `assets/showcase/detective.png`: actual start-screen image from the user's game repository, retained in implementation notes. The primary feature uses an architecture diagram because the start screen alone does not explain the engine.

## Validation

Desktop and 390/320-pixel browser layouts were reviewed. No horizontal page overflow after mobile adjustments. Precision values, CPU metric switching, module annotations, game-state explanations, role switching, new/retained case readers, optional documents, and project deep links were checked. Reduced-motion behavior is implemented but was not separately emulated. Physical-device performance and print output were not measured.
