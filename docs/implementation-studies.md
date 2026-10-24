# Implementation studies — provenance and limits

The hero's earlier decorative wave presets have been replaced with three executable browser models of specific implementation decisions. The background, typography, navigation, and project pages are retained.

## 1. Pipeline — forwarding and load-use hazard handling

Sources reviewed on 2026-10-24:

- [forwarding_unit_all.vhd](https://github.com/devjwk/Project-Part-1/blob/main/proj/src/TopLevel/forwarding_unit_all.vhd): EX/MEM matching takes priority over MEM/WB, RegWrite must be set, and rd = x0 is excluded.
- [hazard_detection_unit.vhd](https://github.com/devjwk/Project-Part-1/blob/main/proj/src/TopLevel/hazard_detection_unit.vhd): a load in EX with a used destination in ID holds PC and IF/ID and flushes ID/EX.
- [Project ownership](https://github.com/devjwk/Project-Part-1#my-role): the forwarding/hazard units, pipeline registers, tests and benchmarking are attributed to Jongwoo; reports were shared with the teammate.

The browser implements those comparisons and control outcomes. The two-instruction schedules are illustrative teaching cases, not VHDL execution, captured waveforms, timing simulation, or benchmark data. Users can step through ALU dependence, load-use delay, independent registers, and the x0 exception. A load-use case holds the consumer once, shows the EX bubble, then shows MEM/WB forwarding.

## 2. Quantize — the actual Quant.h mapping and exported calibration

Sources:

- [Quant.h](https://github.com/devjwk/cpre487lab4/blob/main/lab4/framework/src/Quant.h)
- [8-bit parameters](https://github.com/devjwk/cpre487lab4/blob/main/lab4/framework/data/model/q8/quant_params.txt)
- [4-bit parameters](https://github.com/devjwk/cpre487lab4/blob/main/lab4/framework/data/model/q4/quant_params.txt)
- [2-bit parameters](https://github.com/devjwk/cpre487lab4/blob/main/lab4/framework/data/model/q2/quant_params.txt)

The conv2 **input** scale/zero pairs are 75.7477712 / -3, 4.175074 / 0, and 0.596439143 / 0. These are copied from the exported files, not inferred from the visual design.

The model applies float32 multiplication, nearest-even rounding, zero point, signed-bit-range clipping, and `(q - zero) / scale`. A user-selected input of 0.45 becomes integer 31, 2, or 0 respectively. The transfer plot and reconstructed values are calculated in the browser. This is a scalar rule demonstration, not a full CNN inference or a measurement of classification accuracy. The actual project measurements remain in the project exhibit. 4/2-bit values remain described as stored in int8 containers.

## 3. Pointillism — a persistent point pool and target interpolation

Sources:

- [Image analysis](https://github.com/devjwk/pointillism-gallery/blob/main/src/gallery/analysis/image-data.js)
- [Sampling](https://github.com/devjwk/pointillism-gallery/blob/main/src/gallery/sampling/stipple.js)
- [Transitions](https://github.com/devjwk/pointillism-gallery/blob/main/src/gallery/scene/transitions.js)

The reduced preview samples the existing *Geumgangjeondo* image using inverse luminance and the source density polynomial, preserves source RGB, and assigns 6,400 fixed point IDs. A deterministic sampler replaces the full gallery's variable-spacing/Lloyd stages for this small preview. Gather/scatter interpolates between fixed dispersed and painting targets; moving the control does not resample or regenerate the pool. It demonstrates the gallery's point-identity/target principle in 2D. It does not run the gallery's relative-depth, segmentation, or reconstruction pipeline.

GPU points use a single WebGL draw. When context is unavailable/lost, the same pool is drawn using Canvas 2D, preserving the interaction. Image provenance remains the gallery's public-domain Jeong Seon artwork source, linked in the main Pointillism exhibit and documented in portfolio-design.md.

## Verification

- Six Node tests cover producer priority, register-zero exclusion, used-register hazard flags, one-cycle delay schedules, nearest-even ties, exported-parameter sample values/clipping, and deterministic fixed-pool/source-color sampling.
- All three modes were tested at 320, 390, 600, 768, 1024, 1280, and 1600 px: no horizontal page or study-text overflow observed.
- Browser interactions confirmed ALU forwarding, load-use stall → bubble → WB forwarding, the x0 exception, scalar quantization to zero, fixed-pool gather/scatter, and source/project links.
- WebGL context loss was deliberately triggered in local QA; Canvas 2D took over with the same 6,400 points and working controls.

These tests do not replace the original projects' simulation, inference validation, or physical-board checks.
