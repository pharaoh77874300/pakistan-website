# Design Brief

## Direction

SocialHub — Professional social media platform with bold modern aesthetic, content-first card layout, vibrant purple accent on clean dark/light foundations.

## Tone

Bold Modern with editorial clarity — confident professional without corporate stiffness; content is the centerpiece, design supports without decoration.

## Differentiation

Smooth micro-interactions (fade-in, slide-up, pulse animations) combined with refined purple accent (0.68 L, 0.22 C, 295 H) elevate engagement without visual noise.

## Color Palette

| Token | OKLCH | Role |
|-------|-------|------|
| background (light) | 0.98 0.005 240 | Clean off-white canvas |
| background (dark) | 0.12 0.015 240 | Deep charcoal base |
| foreground (light) | 0.18 0.015 240 | Dark text on light |
| foreground (dark) | 0.92 0.01 240 | Bright text on dark |
| card (light) | 1.0 0.004 240 | Pure white content areas |
| card (dark) | 0.165 0.018 240 | Elevated dark cards |
| primary | 0.48/0.68 0.18/0.22 265 | Purple CTA (light/dark mode) |
| accent | 0.62/0.65 0.18 55 | Warm orange for highlights |
| muted | 0.94/0.2 0.01/0.02 240 | Secondary backgrounds |
| destructive | 0.55 0.22 25 | Error/delete red |
| border | 0.9/0.25 0.008/0.02 240 | Subtle dividers (light/dark) |

## Typography

- Display: Space Grotesk — modern geometric headings, tech-forward hierarchy
- Body: DM Sans — refined, highly readable, perfect for social content
- Mono: Geist Mono — code snippets, technical references
- Scale: hero `text-5xl md:text-7xl font-bold tracking-tight`, h2 `text-3xl font-bold tracking-tight`, label `text-sm font-semibold tracking-widest uppercase`, body `text-base`

## Elevation & Depth

Subtle lifted shadows (4–12px blur) create visual hierarchy without glow effects; card backgrounds elevated from page background; hover states trigger smooth scale + shadow transitions.

## Structural Zones

| Zone | Background | Border | Notes |
|------|------------|--------|-------|
| Header | card | `border-b border-border` | Navigation, logo, user menu |
| Feed/Content | background | — | Alternating card backgrounds; main post stream |
| Sidebar (desktop) | card | `border-r border-border` | Navigation links, explore, trending |
| Bottom Nav (mobile) | card | `border-t border-border` | Sticky mobile navigation |
| Footer | muted | `border-t border-border` | Copyright, settings, logout |

## Spacing & Rhythm

Content cards at 16px (1rem) padding; section gaps at 24px (1.5rem); micro-spacing (4–8px) for internal component grouping; density increases on mobile to 12px card padding.

## Component Patterns

- **Buttons**: Primary purple with white text, 8px rounded; hover: `opacity-90 shadow-elevated`; secondary variant: card background + border
- **Cards**: 8px rounded, `shadow-subtle` on light mode / `shadow-elevated` on dark; hover: `scale-105 shadow-elevated transition-smooth`
- **Avatars**: 32–64px, full circle, 2px border (primary color), lazy-load fallback initials
- **Badges**: 4px rounded (small), inline in metadata rows; accent for notifications/highlights, muted for tags
- **Input fields**: 8px rounded, 1px border, 12px padding; focus: `ring-2 ring-primary`

## Motion

- **Entrance**: Fade-in 0.3s on page load; slide-up 0.3s for cards during scroll
- **Hover**: All interactive elements transition-smooth (0.3s cubic-bezier); scale-105 on cards + buttons
- **Feedback**: Pulse-subtle 2s for loading states; destructive actions flash red briefly before execution

## Constraints

- No gradients except accent gradient (primary → orange) used sparingly on CTAs or hero sections
- All colors via CSS custom properties; no arbitrary color literals
- Mobile-first: `sm:` breakpoint at 640px for sidebar reveal
- Dark mode primary (0.68 L) vs. light mode primary (0.48 L) — both meet AA+ contrast
- Max 3 animations per viewport; motion-reduce respected for accessibility

## Signature Detail

Gradient accent button on hero/CTA zones (purple to orange, 135deg) — subtle luxury signal without corporate overreach; reinforces brand confidence and premium positioning.
