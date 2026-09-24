# Cindi design system

This document defines the visual and interaction foundation for Cindi, an agentic assistant for personal and business work. Cindi should feel capable, calm, and trustworthy: clear about what it is doing, careful around consequential actions, and never theatrical.

The token and component layer lives in `client/src/index.css`. It is namespaced with `cindi-` and is opt-in. Existing Mainframe landing-page styles and the Spline scene have not been restyled as part of this pass.

## Brand foundations

- **Character:** capable, composed, transparent, considerate.
- **Primary accent:** Harbor teal. Use it for primary actions, selected navigation, focus indicators, and small identity marks—not as a large decorative wash.
- **Surfaces:** cool, near-neutral backgrounds with white/light surfaces; dark mode uses deep blue-charcoal rather than pure black.
- **Information hierarchy:** typography, spacing, and explicit status labels do the work. Avoid glow, excessive gradients, gratuitous motion, and “AI magic” language.

### Color tokens

The complete values are CSS custom properties in `client/src/index.css`. The default theme is light. Apply `data-theme="dark"` or `class="dark"` to the document root to activate dark values; the same attributes can scope a dark region. Components consume semantic tokens so they change with the theme.

| Token role | Light | Dark |
| --- | --- | --- |
| Primary | `#176B68` | `#67C7BE` |
| Primary hover / active | `#115956` / `#0D4947` | `#82D5CD` / `#A0E1DB` |
| Primary foreground | `#FFFFFF` | `#0E141B` |
| Page background | `#F6F8FA` | `#0E141B` |
| Surface | `#FFFFFF` | `#151E28` |
| Raised surface | `#F0F3F6` | `#1B2733` |
| Main text | `#15202B` | `#E7EDF3` |
| Muted text | `#64748B` | `#9AA9B8` |
| Border / strong border | `#DCE3EA` / `#AAB6C2` | `#2C3947` / `#4B5B6B` |
| Success / subtle / border | `#177245` / `#EAF6EF` / `#B8DFC6` | `#56D996` / `#10291D` / `#28533B` |
| Warning / subtle / border | `#8A5A00` / `#FFF6E5` / `#F0D79E` | `#F0BE65` / `#30250F` / `#66501E` |
| Error / subtle / border | `#B42318` / `#FFF0EF` / `#F2C4C0` | `#FF8A80` / `#351C1B` / `#71312C` |
| Info / subtle / border | `#245BB8` / `#EFF5FF` / `#C4D6F4` | `#84B5FF` / `#17273D` / `#2F4A6C` |

On-color text is also themed: primary actions use white in light mode and `#0E141B` in dark mode; destructive actions use white in light mode and `#351C1B` in dark mode.

Reserve semantic colors for states and data meaning. Do not use success green as a generic decoration or warning amber as the default call to action. Never rely on color alone: pair a status color with a readable label or icon.

## Typography

Keep the landing page’s loaded Helvetica Now pairing: Helvetica Now Display Medium for headings and Helvetica Now Display Regular for body/UI text. It has a neutral, legible voice suited to a tool that handles serious work. The CSS uses the existing Helvetica/Arial fallback chain. Use the system monospace stack for code, execution output, IDs, and aligned figures.

| Style | Size / line height | Letter spacing | Use |
| --- | --- | --- | --- |
| Display | `40 / 48 px` | `-0.03em` | One page-level statement, sparingly |
| H1 | `32 / 40 px` | `-0.025em` | Page title |
| H2 | `24 / 32 px` | `-0.02em` | Major section title |
| H3 | `20 / 28 px` | `-0.01em` | Card or subsection title |
| Body | `16 / 24 px` | `0` | Default interface copy |
| Small | `14 / 20 px` | `0` | Supporting copy and controls |
| Caption | `12 / 16 px` | `0.02em` | Metadata and timestamps |
| Code/data | `13 / 20 px` | `0` | Commands, technical output, tabular figures |

Use sentence case. Keep long-form text at a comfortable reading width. Use tabular numerals for changing metrics and avoid using all caps for ordinary labels.

The scale is available through `--cindi-text-*`, `--cindi-leading-*`, and `--cindi-tracking-*` variables and the `.cindi-type-*` utility classes.

## Voice and microcopy

Cindi speaks in concise, specific language. State what happened, what will happen next, and what the user needs to decide. Avoid cuteness, fake enthusiasm, anthropomorphic claims, unexplained technical jargon, and ambiguous “working on it” feedback.

- **Confirmations:** name the completed action and outcome. Example: “Report exported to Downloads.”
- **Permission:** disclose the exact action, target, and meaningful consequence before execution. Example: “Allow Cindi to run `npm test` in `~/projects/atlas`? This will execute the project’s test scripts.”
- **Errors:** say what failed, what was not changed if relevant, and offer a safe next step. Example: “The export failed. No file was created. Check the destination folder and try again.”
- **Empty states:** explain what will appear here and give one useful next action. Example: “No tasks yet. Ask Cindi to summarize a report or prepare a follow-up.”
- **Loading:** describe the current operation when known. Example: “Reading the selected spreadsheet…” Prefer progress or a step name to generic “Thinking…”.

## Component styles

These classes are ready for future app components; this pass does not replace the existing hero or intake markup.

### Buttons

Use `.cindi-btn` with one variant: `.cindi-btn--primary`, `--secondary`, `--destructive`, or `--ghost`. Keep the primary action singular and specific. Destructive styling is for irreversible or high-impact actions and should not be used merely to make a button stand out.

```html
<button class="cindi-btn cindi-btn--primary" type="button">Create summary</button>
<button class="cindi-btn cindi-btn--secondary" type="button">Cancel</button>
<button class="cindi-btn cindi-btn--destructive" type="button">Delete task</button>
<button class="cindi-btn cindi-btn--ghost" type="button">More options</button>
```

Hover, active, focus-visible, disabled, and `aria-busy="true"` loading states are included. Keep the button’s accessible name stable while busy; pair `aria-busy` with a live status message when the operation takes time. Use native `disabled` when the control cannot be activated.

### Inputs and chat textarea

Use `.cindi-field` as a label/hint/error wrapper, `.cindi-label` for its visible label, and `.cindi-input`, `.cindi-textarea`, or `.cindi-select` for controls. The textarea has a comfortable minimum height and vertical resize. The error state is enabled with `data-invalid="true"` on the field wrapper; associate the error text with the control using `aria-describedby`.

```html
<div class="cindi-field" data-invalid="false">
  <label class="cindi-label" for="prompt">What should I help with?</label>
  <textarea class="cindi-textarea" id="prompt" placeholder="Describe the task…"></textarea>
  <p class="cindi-field__hint">You can review actions before Cindi runs them.</p>
</div>
```

### Cards and data summaries

Use `.cindi-card` for summaries, insights, and task details. Structure content with `.cindi-card__eyebrow`, `__title`, `__value`, and `__meta`. Add `.cindi-card--interactive` only when the whole card is an actual control; make it a link or button and provide a visible focus state. Use `.cindi-code` or `.cindi-data` for technical output and aligned numeric values.

### Status badges

Use `.cindi-status` with a `data-status` value of `running`, `completed`, `permission`, or `failed`. Always include a readable label such as “Running” or “Needs permission”; the colored dot is supplemental. Running animation is intentionally subtle and is removed by the existing reduced-motion rule.

### Permission request

Use `.cindi-permission` as a focused, inline decision panel near the task that needs approval, not as a generic surprise modal. Include a clear title, plain-language explanation, the exact command/action and target in `.cindi-permission__command`, and explicit Allow and Deny actions. Use `.cindi-permission__note` for a short scope or safety note. Do not preselect Allow, hide the denial option, or bundle several unrelated actions under one approval.

```html
<section class="cindi-permission" aria-labelledby="permission-title">
  <div class="cindi-permission__header">
    <span class="cindi-permission__icon" aria-hidden="true">!</span>
    <div>
      <h2 class="cindi-permission__title" id="permission-title">Run the project tests?</h2>
      <p class="cindi-permission__description">Cindi will execute this command in the selected project.</p>
    </div>
  </div>
  <pre class="cindi-permission__command"><code>npm test</code></pre>
  <p class="cindi-permission__note">This may run scripts defined by the project. Review the command before allowing it.</p>
  <div class="cindi-permission__actions">
    <button class="cindi-btn cindi-btn--secondary" type="button">Deny</button>
    <button class="cindi-btn cindi-btn--primary" type="button">Allow once</button>
  </div>
</section>
```

If a permission request truly requires modal behavior, implement dialog semantics, focus trapping, Escape handling, and focus restoration in the component. The visual style alone does not make a panel a dialog.

### Navigation

For the multi-section product, use a persistent narrow left navigation rail on desktop with a Cindi lockup, clear section labels, and a distinct selected item. On small screens, collapse it into a top bar with a labeled menu button and a focused section list; do not compress the desktop rail into tiny icons without labels. Keep account/workspace controls visually separate from primary destinations. `.cindi-app-nav` and `.cindi-nav-link` provide the base styling; mark the active destination with `aria-current="page"`.

## Iconography

Use **Lucide** (`lucide-react`) for interface icons: its consistent, restrained line forms suit a precise product UI. Use a consistent 1.75–2 px stroke and 16/20/24 px sizing. Avoid mixing filled emoji-like icons with line icons. Give icon-only buttons an accessible name; hide decorative icons from assistive technology. No icon package was added as part of this token/style pass.

## Wordmark lockup

Use **CINDI** in uppercase Helvetica Now Display Medium with tight but readable tracking as the primary wordmark. Pair it with a small, simple custom monogram/mark only when space or context benefits from one; keep the mark geometric and quiet rather than using a robot face, sparkle, or generic AI glyph. Keep the wordmark and mark aligned on a shared optical center and preserve clear space around the complete lockup.

- **Navigation:** wordmark around `18–20 px`, optional mark around `22–24 px`.
- **Loading screen:** wordmark around `32–40 px`, no extra slogan or decorative animation.
- **Favicon/app icon:** use only the custom monogram in a square; verify it remains distinct at 16 px. Do not shrink the full wordmark into the favicon.
- Use `.cindi-wordmark`, `.cindi-wordmark--compact`, and `.cindi-wordmark--large` for text lockup sizing; `.cindi-wordmark__mark` is a neutral styling hook for a future approved mark. The current Spline artwork is not changed by this guidance.

## Accessibility and motion

Maintain visible keyboard focus, semantic HTML, explicit labels, sufficient text/background contrast, and text labels alongside semantic status colors. Keep errors associated with their fields and announce asynchronous results in a suitable live region. Respect `prefers-reduced-motion`; do not make animation the only indication that a task is running or complete.
