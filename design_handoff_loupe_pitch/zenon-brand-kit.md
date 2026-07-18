# Zenon brand kit (distilled from digitalSloth/zenon-design-system · zenon-brand.skill.md)

## Principle: the data is the hero
Numbers/addresses/hashes/stats: JetBrains Mono + tabular-nums, full precision. Even marketing stats render as on-chain data.

## Voice
Technical, confident, precise, calm. Sentence case headlines/buttons. UPPERCASE only for ledger-label texture. No emoji ever; functional glyphs only (… ≈ → − +); Lucide icons 24×24 ~2px stroke.

## Two signature moves (spend boldness ONLY here)
1. Plasma gradient: linear-gradient(180deg, hsl(120 86% 63%) 0%, hsl(145 100% 38%) 100%). ONLY the main thing: primary CTA OR hero halo OR one key stat — pick one focal use. Hover brighten filter 1.1, press .95.
2. Ledger labels (.text-ledger): mono, UPPERCASE, 11px (0.6875rem), letter-spacing .06em, weight 500 — eyebrows/kickers/stat captions only, never headlines/values.

## Color (semantic tokens, never raw hex in usage)
--zenon-green #00d557 (brand+success) · --zenon-blue #0061eb (info/links) · --zenon-pink #f91690 (one reserved accent, NEVER errors) · crimson hsl(352 84% 53%) = errors · --zenon-black #151515 base.
Dark mode tokens: --background hsl(0 0% 8%); --foreground hsl(0 0% 98%); --card hsl(0 0% 10%); --muted hsl(0 0% 15%); --muted-foreground hsl(0 0% 65%); --accent hsl(145 100% 15%); --border/--input hsl(0 0% 20%); --primary hsl(145 100% 42%); --primary-foreground hsl(0 0% 8%); --info hsl(214 100% 62%); --destructive hsl(352 86% 58%); --ring hsl(145 100% 42%).
Shadows dark: --shadow-sm: 0 2px 6px -1px hsl(0 0% 0%/.55), inset 0 1px 0 0 hsl(0 0% 100%/.04); --shadow-lg: 0 14px 32px -8px hsl(0 0% 0%/.65), inset 0 1px 0 0 hsl(0 0% 100%/.05). Cards on dark need the lit top edge.

## Type
Space Grotesk (UI/headlines/body; h1 36 extrabold → h6 16 semibold; body 16/1.75) + JetBrains Mono (all data + ledger labels). Google Fonts:
@import url("https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap");

## Form
Radius base 6px (md 4, xl 10; cards 10px, 1px solid --border, --shadow-sm). Flat solid backgrounds; only gradient is plasma. No colored left-border accents. Motion 150ms cubic-bezier(.4,0,.2,1); respect prefers-reduced-motion.

## Marks
ZNN = angular plasma-green "Z"; QSR = blue "Q". Use labelled placeholder [ ZNN mark ] if no SVG — never draw a fake.

## Checklist
Dark surface · plasma once · ledger labels on captions only · mono+tabular numbers · no emoji · tight radii · lit top edge on dark cards.