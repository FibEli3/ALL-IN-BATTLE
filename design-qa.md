# Design QA — ALL IN BATTLE 5

## Evidence

- Source visual truth: `C:\Users\Vadim\Downloads\Ориентир.png`
- Source pixels: 1038 × 743
- Implementation: `http://127.0.0.1:3000/`
- Implementation capture: Codex in-app browser capture surfaced inline in the task; the browser does not expose a persistent screenshot path.
- Desktop viewport: 1440 × 900 CSS px at device scale 1.
- Normalized comparison: source and implementation were placed side by side at a shared 1038 × 743 hero viewport and scaled equally for the comparison capture.
- Tablet viewport: 834 × 1112 CSS px at device scale 1.
- Mobile viewport: 390 × 844 CSS px at device scale 1.
- State: initial hero, closed navigation; mobile menu, registration form, and payment screen checked separately.

## Required Fidelity Surfaces

- Fonts and typography: Hauora is used throughout. The restrained weight, tight display tracking, uppercase hierarchy, and small metadata match the approved minimal direction. The implementation keeps the title slightly more compact to make room for the event descriptor and persistent navigation.
- Spacing and layout rhythm: the hero preserves the reference's centered title and bottom portrait mass. Section spacing, hairline dividers, and large headings form a consistent editorial rhythm below the fold. No horizontal overflow was found at desktop or mobile widths.
- Colors and visual tokens: background `#190e01`, accent `#e53000`, warm white `#f3eee5`, and low-opacity separators consistently match the supplied visual language.
- Image quality and asset fidelity: all supplied portraits, logo, and wood graphics are used as real raster assets through `next/image`; no placeholder or code-drawn substitutes are present. Crops remain sharp and stable on desktop and mobile.
- Copy and content: the page uses the event dates, city, roles, program, categories, prices, invited trios, venue, and registration fields from the supplied DOCX. Known missing Day 1 address is labeled transparently as “Будет объявлен.”

## Full-view Comparison

The source and implementation share the same dominant hierarchy: restrained header, oversized two-line event name, three monochrome figures, dark-brown field, orange accents, and an outlined registration CTA. The implementation deliberately adds an event descriptor and more functional navigation, as requested by the user.

## Focused Region Evidence

No additional crop was needed for the hero because the title, portraits, edge graphics, header, and CTA were all legible in the normalized side-by-side capture. Separate browser captures checked the mobile hero, open menu, form controls, calculated total, and payment summary.

## Comparison History

### Pass 1

- [P2] The wood graphics were too far outside the hero and read as tiny fragments rather than intentional edge details.
- Fix: moved both graphic layers inward while preserving portrait and title dominance.

### Pass 2

- Post-fix evidence: the left wood form now reads clearly in the shared comparison, and the right-side motif remains a restrained edge accent.
- No actionable P0, P1, or P2 differences remain.

### Pass 3 — user feedback

- [P1] The baked dark backgrounds of the three hero portraits overlapped and visually cropped adjacent figures.
- Fix: the hero portraits now composite into the page background as cutouts and sit higher on desktop, tablet, and mobile breakpoints.
- [P2] The central “Contest 3×3” card used a saturated red field that dominated the program section.
- Fix: replaced it with a muted clay/terracotta surface while retaining strong text contrast.
- [P2] The interface felt too rigid because most content blocks used square corners.
- Fix: introduced a shared soft-radius system across portraits, program cards, invited-team cards, category rows, pricing, registration controls, and receipt upload.
- Post-fix evidence: desktop and 390 × 844 mobile captures show all three hero figures, a readable floating CTA, calm program-card contrast, and consistent rounded geometry without horizontal overflow.

### Pass 4 — transparent portraits, type spacing, and responsive polish

- [P1] The hero still depended on dark-brown pixels baked into the three source PNG files, so their rectangular canvases could become visible where figures overlapped.
- Fix: generated dedicated `*-cutout.png` assets with real alpha transparency while preserving each supplied portrait, monochrome treatment, red outline, and collage fragments. The hero now uses those files directly with no blend-mode workaround.
- [P2] The hero name read too much like a single compact wordmark.
- Fix: relaxed display tracking, added explicit word spacing, and tuned line height independently for desktop, tablet, and mobile widths.
- [P2] The side graphics were too timid on desktop and exposed unrelated top/bottom labels when enlarged.
- Fix: moved the wood forms farther into frame, clipped the unused source-label area, and balanced their scale at 1440, 834, and 390 px widths.
- [P2] Supporting labels in the program, invited teams, categories, and price card were undersized.
- Fix: raised their type sizes and line heights without changing the primary hierarchy.
- Post-fix evidence: 1440 × 900, 834 × 1112, and 390 × 844 captures show all three transparent portraits, clean title separation, readable small copy, stable cards, and no document-level horizontal overflow.

### Pass 5 — real-device iPhone feedback

- Source visual truth: `C:\Users\Vadim\Pictures\allin1.jpg`, `allin2.jpg`, and `allin3.jpg` (1177 × 2560 px device screenshots from a standard iPhone 17 in the VK in-app browser).
- Implementation evidence: the local production build was checked in the Codex browser at 402 × 874 CSS px, device scale 1. Only the app-owned viewport was compared because the source screenshots include native iOS and VK browser chrome.
- [P1] Unicode diagonal arrows were rendered by iOS as blue square emoji beside hero/program CTAs and footer social links.
- Fix: replaced every visible Unicode navigation arrow with Phosphor SVG icons, including hero and program actions, footer links, payment status pages, and the admin export control.
- [P2] The three hero portraits ended too high above the bottom divider on the reported phone width.
- Fix: lowered the portrait group only at the mobile breakpoint; the side figures now terminate within 4–9 px of the hero divider while the center portrait intentionally crops below it.
- [P2] The two-line “ПЕРВЫЙ ДЕНЬ” and “ВТОРОЙ ДЕНЬ” headings had insufficient leading on phones.
- Fix: raised the mobile heading line-height to 1, producing two 76 px lines with a 152 px total heading box at the verification viewport.
- Post-fix typography: display size, weight, tracking, copy, and warm-white/orange hierarchy remain unchanged; only mobile leading changed.
- Post-fix layout and image quality: all supplied cutout portraits remain sharp, the hero has no horizontal overflow, and the desktop/tablet positioning rules are untouched.
- Post-fix interaction evidence: hero CTA, Day 1 card CTA, footer social links, and “Наверх” all render crisp monochrome vector icons; the body contains no remaining `↘`, `↗`, or `↑` characters.
- Post-fix runtime evidence: no browser console errors, framework overlay, or horizontal document overflow were observed at 402 × 874.

### Pass 6 — media line-up, laptop hero, and contest registration

- Source visual truth: `C:\Users\Vadim\Downloads\Снимок экрана 2026-09-24 в 16.57.26.png` (2920 × 1078) and `C:\Users\Vadim\Downloads\Снимок экрана 2026-09-24 в 16.57.20.png` (2938 × 1518), plus the supplied portraits `Алеся.png`, `Радон.png`, and `Лена.png`.
- Implementation evidence: Codex in-app browser captures surfaced inline at 1460 × 539, 1469 × 709, and 402 × 874 CSS px; the browser does not expose a persistent screenshot path.
- [P1] At short, wide laptop aspect ratios the portrait group entered the title/subtitle zone and reduced legibility.
- Fix: added a height/aspect-ratio-specific hero composition with a viewport-aware title scale and an independently anchored portrait group. Measured post-fix gaps from subtitle to first portrait pixel are 104 px at 1460 × 539 and 73 px at 1469 × 709, with zero horizontal overflow.
- [P2] The former saturated Contest 3×3 surface dominated the Day 1 cards.
- Fix: mapped the accent card to the warm milk token `#eee7dc` with dark text and orange interaction color. The resulting surface keeps the approved editorial palette and preserves contrast.
- [P2] The production line-up did not include the newly supplied media team.
- Fix: added an existing-pattern `Медиа` section after MC with real supplied raster assets and role labels: ALESYAAA / Видео, RADON / Видео, YASHNAYA ELENA / Фото. All three assets completed loading at 455 px intrinsic render width; no placeholders or code-drawn substitutes are used.
- Responsive evidence: at 402 × 874 the media cards stack to 351 px within 18–33 px page gutters, the hero keeps a 152 px subtitle-to-portrait gap, and the document has zero horizontal overflow.
- Interaction evidence: the two Contest 3×3 categories are mutually exclusive; selecting either category plus JAM renders JAM as `Бесплатно` and keeps the total at 3,000 ₽. Removing the contest selection restores JAM to 800 ₽. The server independently rejects a request containing both category IDs with HTTP 400.
- Copy and content evidence: workshop price is 3,200 ₽, `PRO 16+` is replaced by `PRO`, and `Настя Sowa` replaces `Senya` in the invited TEENS trio.
- Post-fix runtime evidence: no browser console errors or framework overlay were observed; `npm run lint` and `npm run build` pass.

### Pass 7 — desktop hero height and right decorative edge

- Source visual truth: `C:\Users\Vadim\AppData\Local\Temp\codex-clipboard-0601978a-f1fe-40f1-acfd-db7036f599d7.png` (1862 × 931) plus the focused right-edge crop `codex-clipboard-3e2275bd-da67-4b10-ace5-d26fdaa8b4cd.png`.
- Implementation evidence: Codex in-app browser capture surfaced inline at the matching 1862 × 931 CSS viewport, device scale 1; the browser does not expose a persistent screenshot path.
- [P2] On the supplied wide-PC viewport the portrait group entered the screen too late and left excessive empty space below the subtitle.
- Fix: raised the portrait group only for desktop viewports at least 1200 px wide with a 19:10-or-wider aspect ratio. Post-fix portrait boxes begin at 475–478 px, while the subtitle ends at 422 px, preserving a 54 px protected gap.
- [P2] The right red wood graphic was inset from the desktop viewport edge.
- Fix: set the right decorative asset to the desktop content edge (`right: 0`); its measured right boundary now matches the 1847 px client edge after accounting for the 15 px browser scrollbar.
- Guard evidence: at 402 × 874 the original mobile portrait bottom remains 4 px, the mobile wood offset remains -205 px, document horizontal overflow is zero, and no console errors were recorded.
- Fonts, title spacing, copy, palette, image scale, portrait horizontal positions, CTA, tablet rules, and mobile rules remain unchanged.
- Post-fix result: no actionable P0, P1, or P2 differences remain for the requested desktop adjustment.

### Pass 8 — mutually disabled Contest 3×3 choices

- Source visual truth: `C:\Users\Vadim\AppData\Local\Temp\codex-clipboard-317c54b5-572a-4dfc-9fd1-db08754af2dd.png`.
- Implementation evidence: Codex in-app browser at 402 × 874 CSS px.
- Selecting `Contest 3×3 — до 18 лет` keeps that choice active and natively disables `Contest 3×3 — PRO`; the unavailable row uses the existing form-disabled treatment at 0.36 opacity.
- Deselecting the active category restores both choices. Selecting `Contest 3×3 — PRO` reverses the disabled state, so the behavior is symmetric and never leaves both contest categories selected.
- JAM and all Day 2 availability rules remain unchanged. The page has zero horizontal overflow, no framework overlay, and no console errors.
- `npm run lint`, `npm run build`, and `git diff --check` complete successfully.

### Pass 9 — mobile side-portrait crop

- Source visual truth: `C:\Users\Vadim\Pictures\f9JL6ZsEbRsc-hUPu2Lkf3Z52V82-sie9GgjKURzHlu-C7NosXBwn3lMbpgwiABQ8PsPVZngP_ssuuhniDIRhat3.jpg` (1177 × 2560 px device capture, approximately 3× density / 393 × 853 CSS px). The reference is the reported problem state; the user's written direction defines the corrected target.
- Implementation evidence: Codex in-app browser capture surfaced inline at 393 × 853 CSS px, device scale 1; the browser surface does not expose a persistent screenshot path.
- State: home-page hero at the default top position. Only app-owned content was compared; the source image's iOS/browser chrome and its different scroll position were excluded from fidelity judgments.
- Full-view comparison evidence: before the fix, the left and right portraits began 133.6 px and 137.5 px outside the 393 px viewport, leaving roughly half of each side figure visible. Their lower edges ended 4–8 px above the hero boundary, exposing the supplied asset crop.
- [P2] The mobile side portraits were over-cropped horizontally and sat too high relative to the hero boundary.
- Fix: within the existing `max-width: 480px` breakpoint, moved the left/right figures inward from `-34/-35vw` to `-25/-26vw` and lowered them from `4/8px` to `-20/-16px` bottom offsets. The center portrait, copy, CTA, tablet, and desktop rules remain unchanged.
- Post-fix visual evidence: at 393 × 853 the side figures now expose approximately 67–71% of their width, start 24 px lower, and extend 15–19 px behind the hero boundary so their lower crop is hidden. The collage remains balanced around the unchanged center portrait and CTA.
- Responsive guard evidence: 360, 393, 480, and 640 px checks report zero document-level horizontal overflow and no framework overlay or console errors. A separate focused crop was unnecessary because the affected portrait edges and hero boundary are fully legible in the full mobile capture.
- Fidelity surfaces: typography, palette/tokens, supplied portrait assets and image sharpness, and all copy remain unchanged; only the requested mobile spacing/crop was adjusted.
- `npm run lint`, `npm run build`, and `git diff --check` complete successfully.
- Final comparison result: no actionable P0, P1, or P2 differences remain for the requested mobile portrait adjustment.

### Pass 10 — tighter mobile hero composition

- Source visual truth: `C:\Users\Vadim\AppData\Local\Temp\codex-clipboard-3fa86d99-e20d-465d-ba2f-11bddb201314.png` (390 × 843 px). The user's written direction defines the corrected vertical rhythm: lower the portraits slightly and reduce the empty center by moving the copy downward.
- Implementation evidence: Codex in-app browser captures surfaced inline at 360 × 800, 390 × 843, 480 × 900, and 640 × 900 CSS viewports; the browser surface does not expose a persistent screenshot path.
- State: home-page hero at the default top position after entrance animations settle.
- [P2] At phone widths, the 160 px measured gap between the subtitle and the first portrait pixel left the hero center visually under-filled.
- Fix: within the existing `max-width: 480px` breakpoint, moved the complete hero copy from 128 px to 176 px from the top and lowered all three portraits by 20 px. Tablet and desktop positioning rules remain unchanged.
- Post-fix visual evidence: at the 390 px target the subtitle-to-portrait gap is 132 px, the date remains 96 px below the navigation divider, and the CTA stays visible above the viewport edge. At 360 px the gap is 126 px; at 480 px it is 82 px.
- Responsive guard evidence: 360, 390, 480, and 640 px checks report zero document-level horizontal overflow, no framework overlay, and no console errors. At 640 px the mobile-only override is inactive and the copy keeps its previous 128 px top position.
- Fidelity surfaces: typography, palette/tokens, supplied portrait assets and image sharpness, CTA styling, horizontal portrait placement, and all copy remain unchanged; only the requested phone-only vertical spacing was adjusted.
- `npm run lint`, `npm run build`, and `git diff --check` complete successfully.
- Final comparison result: no actionable P0, P1, or P2 differences remain for the requested mobile spacing adjustment.

### Pass 11 — stronger mobile hero correction and transparent menu mark

- Source visual truth: `C:\Users\Vadim\AppData\Local\Temp\codex-clipboard-779d80d6-62df-4daa-8744-916e9d89991a.png` (390 × 917 px) plus the user's written feedback that the prior mobile movement was not perceptible enough.
- Implementation evidence: Codex in-app browser checks at 360 × 800, 390 × 917, 480 × 900, and 640 × 900 CSS viewports; the browser surface does not expose a persistent screenshot path.
- [P2] The previous phone-only correction still left a 207 px empty band between the copy and the portrait group at the reported 390 × 917 viewport.
- Fix: within the existing `max-width: 480px` breakpoint, moved the hero copy from 176 px to a responsive 248–270 px top range and lowered the three portraits by a further 32–35 px. At 390 × 917 the copy now begins at 263 px, the portrait group begins at 584–593 px, and the empty band is reduced to 145 px without overlap.
- [P2] KHARKOVSKAYA appeared smaller than the other two mobile portraits.
- Fix: increased only the right portrait from 76vw to 84vw and adjusted its edge/bottom placement. At 390 px it renders at 328 px wide versus 296 px for the side peer, while the face and hoodie remain inside the intended crop.
- [P2] The mobile-menu logo carried the source image's near-black rectangular background onto the cream menu surface.
- Fix: generated `public/event/logo-transparent.png` from the approved mark with an alpha channel and used it only in the mobile menu. The header mark and all desktop assets remain unchanged.
- Responsive guard evidence: 360, 390, 480, and 640 px checks report no document-level horizontal overflow. At 640 px the phone-only positioning override remains inactive.
- Interaction evidence: after restarting the development server on `localhost`, the mobile menu opens with `aria-hidden=false`, locks page scroll, displays the transparent logo asset, closes with `aria-hidden=true`, and restores body overflow. No browser console warnings or errors were recorded.
- Fidelity surfaces: title typography, palette/tokens, copy, CTA styling, supplied portrait rasters, and all tablet/desktop rules remain unchanged.
- Final comparison result: no actionable P0, P1, or P2 differences remain for the requested mobile correction.

### Pass 12 — compact mobile hero height

- Source visual truth: `C:\Users\Vadim\Pictures\HcyvHa8bMSOq85LpX9tOaZeedMwH7e-ElJr4ceumV9OA3DQ9uYWISY9KQE6iusfpiTjBYfscJT3pSkoxoaoUBR59.jpg` (1177 × 2560 px device capture). The reported problem state and the user's written direction define the corrected target: remove the large empty band below the navigation and shorten the first screen.
- Implementation evidence: `http://localhost:3000/`, captured inline in the Codex in-app browser at 390 × 844 and 430 × 932 CSS px after the entrance animations settled; the browser surface does not expose a persistent screenshot path.
- State: home-page hero at the default top position, closed mobile navigation.
- [P2] The phone breakpoint forced the hero to at least the full viewport height and placed the copy 248–270 px from the top, producing a large visually empty band below the navigation on tall phones.
- Fix: changed the phone hero to a bounded responsive height of 700–760 px and moved the copy to a 112–132 px top range. The 481–640 px range now uses a bounded 760–820 px height instead of forcing at least 860 px or the full viewport.
- Post-fix full-view evidence: at 390 × 844 the hero ends at approximately 700 px and the event metadata begins directly below the navigation with a deliberate breathing gap; the next section is already visible. At 430 × 932 the hero ends at approximately 732 px with the same composition and no title/portrait collision.
- Focused region evidence: the navigation-to-copy band, title block, portrait heads, CTA, and bottom divider are all legible in the two full mobile captures, so a separate crop was unnecessary.
- Responsive guard evidence: portrait widths, horizontal offsets, CTA styling, tablet rules, and desktop rules are unchanged. No horizontal overflow or framework overlay was observed at either tested width.
- Fidelity surfaces: typography, colors/tokens, supplied portrait assets and sharpness, and all copy remain unchanged; only the requested mobile vertical rhythm and section height were adjusted.
- `npm run lint`, `npm run build`, and `git diff --check` complete successfully.
- Final comparison result: no actionable P0, P1, or P2 differences remain for the requested compact mobile hero adjustment.

### Pass 13 — mobile right-portrait scale balance

- Source visual truth: `C:\Users\Vadim\AppData\Local\Temp\codex-clipboard-626692ef-5a84-4ff0-8c57-a245f2b03556.png` (399 × 219 px focused hero crop). The screenshot identifies the undersized face in the right portrait; the user's written direction defines the corrected scale and allows vertical compensation.
- Implementation evidence: `http://localhost:3000/`, captured inline in the Codex in-app browser at 390 × 844 and 540 × 900 CSS px after the entrance animations settled; the browser surface does not expose a persistent screenshot path.
- State: home-page hero at the default top position, closed mobile navigation.
- [P2] KHARKOVSKAYA's face remained visually smaller than the other two heads because the hood and transparent padding occupy more of her source canvas.
- Iteration 1: increased the narrow-phone image from 84vw to 94vw and lowered the canvas to preserve the hood line. Evidence showed a better face scale but an overly low eye line.
- Iteration 2: increased the narrow-phone image to 104vw, shifted it farther beyond the right edge, and raised it by 90 px from the intermediate position. For 481–640 px, the portrait now uses 74vw with a milder compensated offset.
- Post-fix full-view evidence: at 390 px the right face is close to the central face in visual size, its eye line remains within the portrait cluster, and the larger hood does not collide with the subtitle. At 540 px all three portraits retain a deliberate overlapping hierarchy and the right face no longer reads as undersized.
- Focused region evidence: the supplied crop and the post-fix hero capture both expose the complete three-head cluster, so no additional crop was necessary.
- Responsive guard evidence: hero height, copy placement, left/center portraits, CTA, tablet, and desktop rules remain unchanged. No horizontal document overflow or framework overlay was observed.
- Fidelity surfaces: typography, palette/tokens, source portrait image quality, red outline, and all copy remain unchanged; only the requested right-portrait scale and mobile position were adjusted.
- `npm run lint`, `npm run build`, and `git diff --check` complete successfully.
- Final comparison result: no actionable P0, P1, or P2 differences remain for the requested mobile portrait balance.

### Pass 14 — mobile right-portrait vertical alignment

- Source visual truth: `C:\Users\Vadim\Pictures\HcyvHa8bMSOq85LpX9tOaZeedMwH7e-ElJr4ceumV9OA3DQ9uYWISY9KQE6iusfpiTjBYfscJT3pSkoxoaoUBR59.jpg` (1177 × 2560 px phone screenshot). The requested correction is limited to lowering the already-approved right-portrait scale.
- Implementation evidence: `http://localhost:3000/`, captured inline in the Codex in-app browser at 390 × 844 and 540 × 900 CSS px after the entrance animations settled; the browser surface does not expose a persistent screenshot path.
- State: home-page hero at the default top position, closed mobile navigation.
- [P2] At the narrow-phone state the top of KHARKOVSKAYA's hood sat visibly above the left cap and central head, making the right portrait appear vertically detached despite the corrected face scale.
- Fix: preserved the existing 104vw / 74vw image sizes and horizontal offsets, lowering only the right portrait by 22 px at up to 480 px and 20 px at 481–640 px.
- Post-fix full-view evidence: at 390 px the hood top now aligns with the left cap while the face remains close to the central face in scale; at 540 px the three portraits preserve their intended overlap and share a balanced top line.
- Focused region evidence: the supplied hero screenshot and both post-fix hero captures clearly expose the portrait head line, so no additional crop was required.
- Fidelity surfaces: typography, spacing outside the portrait cluster, palette/tokens, image quality, CTA placement, and copy are unchanged. Desktop and tablet rules above 640 px are untouched.
- Final comparison result: no actionable P0, P1, or P2 differences remain for the requested mobile vertical alignment.

### Pass 15 — stronger mobile face-and-shoulder alignment

- Source visual truth: `C:\Users\Vadim\Pictures\HcyvHa8bMSOq85LpX9tOaZeedMwH7e-ElJr4ceumV9OA3DQ9uYWISY9KQE6iusfpiTjBYfscJT3pSkoxoaoUBR59.jpg` (1177 × 2560 px phone screenshot), plus the user's follow-up that the portrait still read as too high after Pass 14.
- Implementation evidence: `http://localhost:3000/`, captured inline in the Codex in-app browser at 390 × 844 and 540 × 900 CSS px after the entrance animations settled; the browser surface does not expose a persistent screenshot path.
- State: home-page hero at the default top position, closed mobile navigation.
- [P2] Pass 14 aligned the hood apex, but the large hood canvas still made the right figure read higher when judged by the face-and-shoulder mass.
- Fix: preserved the approved portrait scale and horizontal crop, lowering KHARKOVSKAYA an additional 44 px at up to 480 px and 40 px at 481–640 px.
- Post-fix evidence: at both tested widths the right portrait is now visibly lower than the cap/head line rather than appearing above it; the face remains readable, the CTA remains unobstructed, and the source image continues to fill the hero bottom edge.
- Fidelity surfaces: fonts, copy, colors/tokens, image sharpness, CTA, hero height, and the other two portraits are unchanged. Rules above 640 px remain untouched.
- Final comparison result: no actionable P0, P1, or P2 differences remain for the user's requested stronger downward adjustment.

### Pass 16 — exact 15 px upward refinement

- Source visual truth: the accepted Pass 15 mobile composition plus the user's explicit request to move only KHARKOVSKAYA 15 px upward.
- Implementation evidence: `http://localhost:3000/`, captured inline in the Codex in-app browser at 390 × 844 CSS px after the entrance animations settled; the browser surface does not expose a persistent screenshot path.
- State: home-page hero at the default top position, closed mobile navigation.
- Fix: increased the right portrait's `bottom` anchor by exactly 15 px in both mobile ranges: `-184px → -169px` at up to 480 px and `-84px → -69px` at 481–640 px.
- Post-fix evidence: the requested small upward correction is visible without changing scale, crop, CTA clearance, hero height, or the positions of the other portraits.
- Fidelity surfaces: typography, copy, colors/tokens, image quality, horizontal crop, and desktop/tablet rules remain unchanged.
- Final comparison result: the requested 15 px refinement is implemented with no actionable P0, P1, or P2 regression.

### Pass 17 — short-phone portrait alignment and stacking

- Source visual truth: the accepted Pass 16 mobile composition, the earlier supplied iPhone hero captures, and the user's explicit correction that KHARKOVSKAYA still reads too low on shorter phones and must sit behind PRADAZOMBIE.
- Implementation evidence: `http://localhost:3001/`, captured inline in the Codex in-app browser at 393 × 852 and 393 × 700 CSS px after the entrance animation settled; the browser surface does not expose a persistent screenshot path.
- State: home-page hero at the default top position, closed mobile navigation.
- [P2] At short mobile heights, the larger transparent canvas around KHARKOVSKAYA left the visible hood/head line below the center portrait; the original right-side z-index also placed her above PRADAZOMBIE where the images overlap.
- Fix: added a short-phone correction through 860 px viewport height, raising only the right portrait by 23 px (`-169px → -146px`). On narrow phones the center portrait now uses z-index 4, the left portrait 2, and the right portrait 1.
- Post-fix full-view evidence: at both tested heights the visible hood apex aligns with the PRADAZOMBIE head line, the portraits still fill the hero bottom edge, and PRADAZOMBIE visibly owns the foreground overlap.
- Focused region evidence: the complete three-portrait cluster and CTA are legible in the full mobile captures, so an additional crop was not required.
- Fidelity surfaces: typography, copy, colors/tokens, supplied image sharpness, portrait scale, horizontal crop, hero height, CTA, and rules above 480 px remain unchanged.
- Final comparison result: no actionable P0, P1, or P2 differences remain for the requested short-phone alignment and layer order.

### Pass 18 — continuous phone-width portrait balance

- Source visual truth: `C:\Users\Vadim\AppData\Local\Temp\codex-clipboard-a0b0681e-dbef-4772-8ba7-43747950875b.png` (382 × 755 px problem-state capture) plus the user's written direction that KHARKOVSKAYA should remain visually balanced across popular phone sizes.
- Implementation evidence: `C:\Users\Vadim\Documents\ALLINBATTLE\.layero\qa\qa-mobile-382x766.png` (382 × 766 px, device scale 1) and the normalized side-by-side comparison `C:\Users\Vadim\Documents\ALLINBATTLE\.layero\qa\qa-mobile-382x766-comparison.png`.
- State: home-page hero at the default top position after entrance animations settle, closed mobile navigation.
- [P2] The former `104vw` right-portrait size was silently capped by the global image `max-width: 100%`, while a separate `max-height: 860px` correction abruptly changed its vertical anchor. This made the composition sensitive to small device and browser-viewport differences.
- Fix: removed the height-based switch and replaced the right portrait with a continuous phone-width model: `width: 92vw`, `right: -34vw`, and `bottom: calc(-65px - 16vw)`. The center remains the foreground layer (`z-index: 4`) and KHARKOVSKAYA remains behind it (`z-index: 1`).
- Full-view comparison evidence: at 382 px the hood apex, central head, and left cap occupy one visual band; KHARKOVSKAYA is slightly less dominant, remains readable, and no longer changes scale or vertical position at an arbitrary height threshold.
- Responsive matrix: 320 × 568, 360 × 800, 375 × 667, 382 × 766, 390 × 844, 393 × 852, 412 × 915, and 430 × 932 were checked. Across the matrix the computed right portrait scale progresses smoothly from 294 px to 396 px, its bottom anchor from -116 px to -134 px, and the stacking order remains 4/2/1 for center/left/right.
- Focused region evidence: the full hero comparison clearly exposes all three head lines, the foreground overlap, crop, and CTA clearance, so a separate detail crop was unnecessary.
- Fidelity surfaces: typography, copy, colors/tokens, original portrait assets and sharpness, hero height, CTA treatment, and all rules above 480 px remain unchanged.
- Runtime evidence: the browser reports meaningful page content, no Next.js error overlay, and no page errors at the 382 px target.
- Final comparison result: no actionable P0, P1, or P2 differences remain for the requested multi-device portrait balance.

### Pass 19 — global hero layer order

- Source visual truth: the approved hero composition plus the user's explicit direction that KHARKOVSKAYA must remain behind the other portraits at every responsive size.
- Implementation evidence: `http://localhost:3000/`, checked in the Codex in-app browser after entrance animations settled.
- [P2] The base desktop/tablet styles still assigned KHARKOVSKAYA the highest portrait z-index even though the narrow-phone override placed her behind PRADAZOMBIE.
- Fix: made the portrait hierarchy global: PRADAZOMBIE `z-index: 4`, GLADI `z-index: 2`, and KHARKOVSKAYA `z-index: 1`. Existing phone overrides resolve to the same values.
- Responsive evidence: computed styles were verified at 1920 × 1080, 1440 × 900, 1024 × 768, 834 × 1112, 540 × 900, and 382 × 766. Every viewport reports the same 4/2/1 center/left/right hierarchy and no document-level horizontal overflow.
- Fidelity surfaces: portrait positions, scale, crop, source assets, typography, colors, copy, CTA, and section height are unchanged; only overlap order changed.
- Final comparison result: no actionable P0, P1, or P2 differences remain for the requested global layer hierarchy.

### Pass 20 — registration refund notice

- Source visual truth: `C:\Users\Vadim\AppData\Local\Temp\codex-clipboard-f217b06a-d4fd-4434-b262-e19a977e7979.png` plus the user's explicit copy and placement request.
- Implementation evidence: `http://localhost:3000/#registration`, captured inline in the Codex in-app browser at 1366 × 768 and 390 × 844 CSS px; the browser surface does not expose a persistent screenshot path.
- Fix: inserted “Возврат денежных средств возможен до 10 октября” immediately before the existing legal footnote and presented it as a compact orange-outlined pill with a subtle accent wash and semibold type.
- Responsive evidence: on desktop the notice remains a compact single line aligned with the total; at 390 px it wraps cleanly to two lines, stays inside the registration card, and leaves clear separation from the legal copy.
- Fidelity surfaces: total, payment CTA, legal copy, form controls, typography hierarchy, palette, and surrounding section layout remain unchanged.
- Runtime evidence: the registration section renders meaningful content without a framework error overlay or document-level horizontal overflow.
- Final comparison result: no actionable P0, P1, or P2 differences remain for the requested refund notice.

## Interaction Verification

- Home route rendered meaningful content with no framework error overlay.
- Desktop, tablet, and mobile layouts rendered without document-level horizontal overflow.
- Mobile menu opened, exposed all navigation links, and closed/navigated correctly.
- Registration accepted all four required fields, selected Contest 3×3, and calculated 3,000 ₽.
- “Перейти к оплате” carried the draft to `/payment/manual`; the selected item and 3,000 ₽ total rendered correctly.
- Receipt upload remains intentionally disabled until a file is selected.
- No browser console errors were observed. A former LCP warning was addressed with eager/high-priority loading for the central hero portrait.
- `npm run lint` and `npm run build` both completed successfully after the responsive pass.
- The optimized multipart flow was exercised against an isolated local PGlite database: POST returned 201, a warm submission reported `parse;dur=1.9` and `db;dur=2.3`, and the admin API reported the new record with `hasReceipt: true`.
- Backward compatibility was verified with the former JSON/base64 request shape: POST returned 201 with `parse;dur=1.4` and `db;dur=2.8`, so an already-open browser tab will not lose a submission during deployment.
- The stored binary receipt was downloaded through the admin receipt route with status 200 and the exact original 4,148-byte payload.

## Follow-up Polish

- P3: replace the Day 1 venue placeholder once the address is confirmed.
- P3: replace or confirm the existing payment card number before production launch.

final result: passed
