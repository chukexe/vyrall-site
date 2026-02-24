# VYRALL
### Content built to spread.

VYRALL is an AI-powered content generation engine that applies ten layers of virality science to produce publish-ready scripts, optimised for the platform, audience, and psychological triggers that drive real sharing behaviour.

---

## What it does

A creator enters a topic — or selects a trending angle from the Trend Intelligence layer — and VYRALL produces a complete, publish-ready script. Not a draft. Not a starting point. A final version that has had more strategic thought applied to it than most professional content teams would give it.

Every generation runs ten frameworks simultaneously:

| Layer | Framework | What it decides |
|---|---|---|
| 1 | Brendan Kane | Format, structure, hook strength |
| 2 | Jonah Berger STEPPS | Emotion selection (AI autonomous) |
| 3 | Social Currency Theory | Who the content is designed for — the sharer, not just the viewer |
| 4 | Share Trigger Psychology | The specific mechanism that makes someone forward it |
| 5 | Platform Mechanics | Algorithm-specific optimisation per platform |
| 6 | Identity-Based Virality | Tribal resonance and niche paradox |
| 7 | Network Seeding Theory | Angle selection for cross-community travel |
| 8 | Information Density | Compression, work-to-wow ratio |
| 9 | VRIN Framework | Rarity and inimitability scoring |
| 10 | Trend Intelligence | Rising angles in the user's niche and region |

The AI selects emotion and share triggers autonomously. The user never needs to understand the frameworks — they just get the output.

---

## On-demand tools

After generation, six additional tools are available:

- **Thumbnail Concepts** — three click-driving visual concepts using curiosity gap, bold claim, and emotional reaction triggers
- **Shot List** — scene-by-scene filming guide for a solo creator with a smartphone
- **Platform Adaptation** — native rewrites for other platforms, restructured for each algorithm
- **Caption Variants** — five hook styles (curiosity gap, bold statement, question, stat, story opener)
- **Remix Engine** — five trend-targeted variations of the script targeting different angles in the same niche
- **30-Day Sequence Builder** — full posting calendar with hook ideas, CTA types, content types per week, and rest days

---

## Architecture

```
your-repo/
├── index.html              # Full frontend — UI, virality philosophy display, render logic
└── netlify/
    └── functions/
        └── claude.js       # All prompt assembly, KB, API calls — server-side only
```

The frontend sends a clean `{ action, params }` object to the Netlify function. The function owns the knowledge base, system prompt, and all prompt construction. The Anthropic API key never reaches the browser. The proprietary prompt engineering is never visible in source.

---

## Deployment

### Prerequisites
- A [Netlify](https://netlify.com) account connected to this GitHub repo
- An [Anthropic API key](https://console.anthropic.com) — pay-as-you-go, no subscription required

### Setup

**1. Add your API key to Netlify**

Netlify dashboard → Site configuration → Environment variables → Add variable:

```
Key:    ANTHROPIC_API_KEY
Value:  sk-ant-...your key...
```

Trigger a redeploy after adding it.

**2. Confirm the function path**

Netlify requires the function to be at exactly:
```
netlify/functions/claude.js
```

If your functions aren't being detected, add a `netlify.toml` to the repo root:
```toml
[functions]
  directory = "netlify/functions"
```

**3. Push to GitHub**

```bash
git add .
git commit -m "deploy"
git push origin main
```

Netlify detects the push and redeploys automatically. Usually live within 60 seconds.

**4. Verify**

Netlify dashboard → Functions tab → `claude` should be listed. Check the Logs tab there if anything fails on first use.

---

## Cost

VYRALL uses Claude Sonnet via the Anthropic API. Approximate costs:

- Core generation (analysis + script) ≈ £0.002–0.004 per run
- Each on-demand tool (remix, sequence, thumbnails etc) ≈ £0.001–0.002 per call
- £10 credit covers roughly 2,000–4,000 generations

No monthly API fee. Pay only for usage.

---

## What the user sees vs what stays hidden

| Visible to user | Hidden server-side |
|---|---|
| The 10 virality frameworks (philosophy layer — it sells) | The actual system prompt and KB used for generation |
| Score labels, format names, emotion categories | All prompt construction logic |
| The generated script and analysis | The Format Matrix and decision rules |
| Trend angles and VRIN scores | API key |

The philosophy is visible because it builds trust and explains the output. The decision-making is hidden because it is the product.

---

## Version history

| Version | What changed |
|---|---|
| v1 | Core generation — Kane + Berger STEPPS |
| v2 | Platform mechanics, 40 format library, history |
| v3 | Autonomous emotion/trigger selection, Facebook platform |
| v4 | Trend Intelligence, VRIN scorer, Remix Engine, 30-Day Sequence Builder, server-side prompt assembly |
