# Design System: Doctors and Patients Manager

## 1. Color Palette
The palette is rooted in high-contrast clarity, using "Medical Blues" as surgical strikes of intent. It follows a tonal layering approach to define structure without lines.

### Primary Colors
- **Primary**: `#0059bb` (Surgical Blue)
- **Primary Container**: `#0070ea`
- **On Primary**: `#ffffff`

### Secondary Colors
- **Secondary**: `#006a64` (Medical Teal)
- **Secondary Container**: `#77f4e8`
- **On Secondary Container**: `#006f68`

### Tertiary Colors
- **Tertiary**: `#9e3d00` (Action/Warning Clay)
- **Tertiary Container**: `#c64f00`

### Neutral & Surfaces
- **Surface / Background**: `#f4fafd`
- **Surface Container Low**: `#eef5f7`
- **Surface Container Lowest**: `#ffffff`
- **On Surface**: `#161d1f` (Soft Slate)
- **Outline Variant**: `#c1c6d7` (Used at 15% opacity for "Ghost Borders")

---

## 2. Typography
A dual-font strategy balancing geometric precision with clinical trust.

### Font Families
- **Headlines & Display**: **Manrope** (Geometric sans-serif)
- **Body & Titles**: **Public Sans** (High-trust, government-standard legibility)

### Type Scale & Rules
- **Authority Scale**: `display-md` (2.75rem) for critical data like heart rates or lab results.
- **Letter Spacing**: -0.02em tracking on headlines for a premium editorial feel.
- **Baseline Grid**: 4px baseline grid for all typographic elements.

---

## 3. Layout & UI Rules
The "Clinical Sanctuary" aesthetic prioritizes breathing room and eliminates visual noise.

### The "No-Line" Rule
- **Strict Mandate**: No 1px solid borders for containers.
- **Structure**: Created through **Background Color Shifts** (e.g., shifting from `surface` to `surface-container-low`).

### Surface Hierarchy & Layering
- **Base Layer**: `surface` (#f4fafd).
- **Elevated Content**: Cards should be `surface-container-lowest` (#ffffff) nested within `surface-container-low` (#eef5f7).
- **Tonal Depth**: Depth is achieved through tonal shifts rather than heavy drop shadows.

### Glass & Blur
- **Floating Modals/Nav**: 80% opacity with **20px backdrop-blur**.

### Whitespace (Breathing Room)
- **Section Spacing**: 64px to 80px between major sections to reduce cognitive load.
- **Card Padding**: 32px vertical padding is preferred over divider lines.

### Shapes & Roundness
- **Cards**: 12px (Standard) or 24px (Large hero sections).
- **Buttons**: Full pill-shaped (9999px) for primary actions.
- **Inputs**: 12px top-left/top-right radius with a minimal "No bottom line" style.

---

## 4. Interaction Patterns
- **Buttons**: Primary buttons use a 135-degree linear gradient from `primary` to `primary_container`.
- **Input Focus**: Background shifts to `surface-container-highest` with a 2px `primary` underline.
- **Hover Effects**: Apply a `surface-bright` inner glow to buttons.
- **Shadows**: Only for floating elements (FABs/Popovers). Use "Medical Mist" shadows: `0 12px 32px -4px rgba(22, 29, 31, 0.06)`.
