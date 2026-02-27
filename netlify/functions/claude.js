// ============================================================
// VYRALL v4 — Netlify Serverless Function
// All prompt assembly lives here. Client sends action + params.
// API key stays server-side. KB lives here too — not in browser.
// ============================================================

const MODEL   = 'claude-sonnet-4-20250514';
const TOKENS  = 1800;
const API_URL = 'https://api.anthropic.com/v1/messages';

// Per-action token overrides — heavy outputs need more room
const TOKEN_OVERRIDES = {
  sequence: 2800,   // 30-day calendar is the largest output
  remix:    2400,   // 5 full scripts
  adapt:    2200,   // multiple platform rewrites
  captions: 1400,
};

// ── VIRALITY KNOWLEDGE BASE ──────────────────────────────────
// Prompt-engineering layer — never sent to the client
const KB = `
=== VYRALL VIRALITY ENGINE — PROPRIETARY SYSTEM PROMPT ===

LAYER 1 — BRENDAN KANE FRAMEWORK:
Followers don't determine reach. Algorithms reward attention capture + retention.
FORMAT (Macro): Repeatable storytelling skeleton. Doesn't guarantee performance alone.
CONTEXT (Micro): Angle, framing, pacing, delivery INSIDE the format. Context = success or failure.
4 PERFORMANCE DRIVERS: (1) Perspective Shift — trigger "Wait…what?", avoid predictable.
(2) Delivery & Credibility — concise, confident, no filler. (3) Hook Strength — 1-2 sentences,
immediate tension, NO greetings. (4) Viewer Self-Reflection — viewer evaluates own life.
OUTPUT STRUCTURE: Hook → Perspective Shift → Core Explanation → Self-Reflection → Resolution/Payoff.
PROHIBITED: Clichés, rambling intros, hooks >2 sentences, over-explaining, filler words.

LAYER 2 — JONAH BERGER'S STEPPS (Wharton):
HIGH-AROUSAL emotions drive sharing: Awe, Anger, Anxiety/Fear, Amusement, Inspiration, Surprise.
LOW-AROUSAL suppress sharing: Sadness, Contentment, Nostalgia.
Anger → injustice/systemic problems. Awe → scale/unexpected greatness. Anxiety → risks/warnings.
Amusement → relatable absurdity. Inspiration → transformation. Surprise → counterintuitive outcomes.

LAYER 3 — SOCIAL CURRENCY: People share what makes THEM look good. Design for the sharer.
Types: Insider Knowledge, Intelligence Signal, Group Identity, Moral Positioning, Practical Wisdom.

LAYER 4 — SHARE TRIGGERS:
PRACTICAL_UTILITY, SOCIAL_POSITIONING, IDENTITY_EXPRESSION, MORAL_IMPERATIVE,
ENTERTAINMENT, INSIDER_KNOWLEDGE. Strongest content activates 2-3 simultaneously.

LAYER 5 — PLATFORM MECHANICS:
TIKTOK: Completion + rewatch rate = primary. 30s×2 > 2min×1. First 0-3s seeds algorithm.
YOUTUBE LONG: CTR from thumbnail = primary. Hook IS the thumbnail. Watch + session time = reach.
YOUTUBE SHORTS: Swipe-away in 0-2s critical. Loop-able endings increase completion.
INSTAGRAM REELS: Save rate = strongest virality signal. Trending audio carries momentum.
INSTAGRAM CAROUSEL: First slide = hook. Each slide earns next swipe.
FACEBOOK: Reshare rate = primary viral mechanic. First 3s hooks silently (autoplay muted).
  Groups amplify identity-based content. Comments + shares >> likes.
LINKEDIN: Dwell time in comments > likes. First-degree engagement 60-90min critical.
  Line-break text > video in many niches. End with question.
TWITTER/X: Reply velocity first 30min = critical signal. Bookmarks > retweets algorithmically.
NEWSLETTER: Subject line = only initial metric. Preview text = second hook.
PODCAST: First 90s determines listener commitment.

LAYER 6 — IDENTITY-BASED VIRALITY: Group identity content spreads exponentially within tribes.
Niche Paradox: hyper-specific content often goes more viral due to intense identification.

LAYER 7 — NETWORK SEEDING: Where content starts matters as much as what it says.

LAYER 8 — INFORMATION DENSITY: Single strong idea. Compression = intelligence + shareability.
Work-to-wow ratio must be minimal. Every sentence adds new value.

LAYER 9 — VRIN FRAMEWORK:
Valuable: delivers clear meaningful value. Rare: angle is uncommon, not posted daily.
Inimitable: depends on specific POV/data/voice. Non-substitutable: definitive take.
Score each 0-100. Low VRIN = algorithm ignores. High VRIN = stands out in saturated niches.

LAYER 10 — TREND INTELLIGENCE: Content aligned with rising trends = 40%+ higher initial engagement.
Spike-response principle: produce while wave is still rising.
Remix principle: same insight, different trend-angle entry points = 5x content from one idea.
Sequence principle: group into mini-series, space angles, map CTAs.

LAYER 11 — ATTENTION ENGINEERING (Sapolsky / Variable Reward Science):
Dopamine spikes HARDER in anticipation than in reward. The brain is wired for "something great
might happen" — not "something good just happened." This is the slot machine principle applied to content.

NEAR-MISS STRUCTURE: At the midpoint of every script, the viewer must feel the payoff is imminent
but not yet delivered. The answer is coming — but not yet. This compels completion.
"I'll tell you exactly what it is in a second — but first you need to understand why..."

VARIABLE REWARD PACING: Insights must NOT be evenly spaced. Drop an unexpected insight early,
then withhold, then drop another, then slow down, then deliver the payoff faster than expected.
Unpredictable pacing = higher dopamine response = longer watch time = algorithm reward.

ZERO-FRICTION ENTRY: The hook must require absolutely zero prior context. A viewer mid-scroll
with 1.5 seconds has no patience for setup. Any hook that requires explanation before the tension
lands has already lost. Test: "Could someone who knows nothing about this topic feel immediate
tension from word one?" If no — rewrite.

HOOK CATEGORIES (use the most potent for the topic):
— "You're Being Manipulated" → "You're not addicted — you're being engineered."
— Anticipation Gap → "I'm about to tell you something that will change how you see [X] forever."
— Near-Miss Reveal → "I almost missed this. Most people do."
— System Expose → "Here's what [platform/company/industry] doesn't want you to figure out."
— Identity Reframe → "You're not [negative label] — you're [reframe that flatters]."
— Consequence Preview → "This one thing is quietly costing you [specific loss]."

ANTIDOTE CTA PHILOSOPHY: When a creator has an offer, the most powerful CTA framing is not
a pitch — it is positioning the offer as the antidote to the manipulation or problem exposed in the content.
Instead of: "DM me to join my program."
Use: "If you want to take back control of [X], I've built something for exactly that."
This converts because the viewer has just been shown the problem viscerally — the CTA becomes relief.

FORMAT MATRIX:
Virality → Walking Listicle, Myth-Busting, Narrative Hook, Absurd Success Story, Short-Form Explainer
Authority → Professional Advice, Zero-Click Educational, Case Study, Tutorial/How-To
Trust → Philosophical FaceTime, Storytime, Day in the Life, Confessional
Sales → Testimonial, Case Study, If You Struggle With X, BTS
Relatability → POV, Skit/Micro-Drama, Man-on-Street, 3 Mistakes You're Making
Inspiration → Transformation, Things I Wish I Knew, Absurd Success Story
Attention Literacy → System Expose, Hidden Mechanism Reveal, Compare Two Systems, Offer the Antidote

META RULES:
1. NEVER ask user to choose emotion or share triggers — select autonomously.
2. Select SINGLE highest-arousal emotion that authentically fits topic.
3. Activate 2-3 share triggers naturally.
4. Generate punchiest, most optimized version FIRST. Never produce a mediocre draft.
5. All 11 layers applied simultaneously.
6. Always think: "What would make this impossible NOT to share?"
7. Apply near-miss structure at midpoint. Apply variable reward pacing throughout.
8. Hook must pass zero-friction entry test — no setup, immediate tension from word one.
`;

const SYS = `${KB}\nYou are VYRALL's proprietary AI engine. Apply ALL 11 virality layers including Attention Engineering. Return ONLY valid JSON. No markdown fences, no explanation — raw JSON only.`;

// ── JSON PARSER ───────────────────────────────────────────────
function parseJSON(txt) {
  if (typeof txt === 'object') return txt;
  const c = txt.replace(/```json|```/g, '').trim();
  const start = c.indexOf('{'), end = c.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('No JSON object found in response');
  return JSON.parse(c.substring(start, end + 1));
}

// ── ANTHROPIC CALL ─────────────────────────────────────────────
async function callClaude(userPrompt, maxTokens = TOKENS) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      system: SYS,
      messages: [{ role: 'user', content: userPrompt }]
    })
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
  if (!data.content?.[0]?.text) throw new Error('No content returned from API');
  return parseJSON(data.content[0].text);
}

// ── PROMPT BUILDERS ────────────────────────────────────────────
// All prompt assembly here. Client sees none of this.

const PROMPTS = {

  // ── Trend Intelligence ────────────────────────────────────
  trends: ({ niche, region, topic }) => `
TREND INTELLIGENCE ENGINE — simulate Google Trends analysis.
${niche ? `Niche: "${niche}"` : `Topic: "${topic}" — infer the niche from this topic, then apply trend analysis to that niche.`}
Region: ${region}

Generate 6 rising content angles a creator in ${region} should make TODAY for this niche.
Each must be specific and searchable — not generic.
Bad: "AI side hustle" → Good: "AI side hustle for NHS nurses in the UK"

For each: phrase (specific searchable angle), why (1 sentence, specific to ${region}),
status ("hot"=breakout|"rising"=growing|"stable"), emotion (awe|anger|anxiety|amusement|inspiration|surprise),
vrin (0-100, how rare content on this angle would be).

Return JSON: {"inferred_niche":"...","angles":[{"phrase":"...","why":"...","status":"hot","emotion":"...","vrin":0}]}`,

  // ── Virality Analysis ─────────────────────────────────────
  analyze: ({ topic, niche, goal, tone, platform, trendAngle, persona }) => `
VIRALITY INTELLIGENCE ANALYSIS — apply all 11 layers including VRIN and Trend Intelligence.
Topic: "${topic}"
${niche
  ? `Niche: "${niche}"`
  : `Niche: NOT PROVIDED. Infer the single most specific niche this topic belongs to.
     Be precise — not "health" but "women's hormonal health"; not "money" but "UK first-time buyer mortgages".
     Use that inferred niche for all decisions and return it in the inferred_niche field.`}
Goal: ${goal}
Tone: ${tone}
Platform: ${platform}
${trendAngle ? `Trend Context: This angle is "${trendAngle.status}" in the selected region. Lean into it.` : ''}
${persona ? `
AUDIENCE PERSONA — use this to sharpen every single decision:
Who they are: ${persona.who}
Primary pain point: ${persona.pain}
What they have already tried that failed: ${persona.tried}
What they secretly want to believe about themselves: ${persona.belief}
The sentence that makes them say that is exactly me: ${persona.mirror}
Write for this specific person. Not a general audience.` : ''}

TASKS:
1. Select single best storytelling format from the Format Matrix (including Attention Literacy pillar).
2. Autonomously select optimal high-arousal emotion (Layer 2 rules).
3. Autonomously select 2-3 share triggers (Layer 4).
4. Define social currency strategy (Layer 3).
5. Select the strongest hook category for this topic (Layer 11):
   "You're Being Manipulated" / Anticipation Gap / Near-Miss Reveal / System Expose / Identity Reframe / Consequence Preview
6. Score 5 dimensions (0-100): hook_strength, emotion_arousal, share_trigger, platform_fit, vrin_score.
7. VRIN breakdown — score Valuable/Rare/Inimitable/Non-substitutable (0-100) with one-sentence note each.
8. Generate 4 strategic insights (mix: 2 good, 1 info, 1 warn).
9. Generate 5 format requirements with <strong>bold term</strong> — explanation format.

Return JSON:
{
  "inferred_niche":"${niche ? niche : 'the niche you inferred — leave blank string if niche was provided'}",
  "primary_format":"...","backup_format":"...",
  "reason":"2-3 sentences why this exact format for this topic+goal+emotion+platform",
  "recommended_structure":["Hook","Perspective Shift","Near-Miss Bridge","...","Payoff"],
  "hook_category":"the hook category selected from Layer 11",
  "hook_category_reason":"one sentence why this hook category hits hardest for this topic",
  "format_requirements":["<strong>Term</strong> — explanation","...×5"],
  "selected_emotion":"awe|anger|anxiety|amusement|inspiration|surprise",
  "emotion_reasoning":"one sentence",
  "selected_triggers":["...","..."],
  "trigger_reasoning":"one sentence",
  "social_currency_strategy":"one sentence",
  "scores":{"hook_strength":0,"emotion_arousal":0,"share_trigger":0,"platform_fit":0,"vrin_score":0},
  "vrin":{"valuable":0,"valuable_note":"...","rare":0,"rare_note":"...","inimitable":0,"inimitable_note":"...","non_substitutable":0,"non_substitutable_note":"..."},
  "insights":[{"type":"good","text":"..."},{"type":"good","text":"..."},{"type":"info","text":"..."},{"type":"warn","text":"..."}]
}`,

  // ── Content Generation ────────────────────────────────────
  generate: ({ topic, niche, goal, tone, platform, format, structure, emotion, triggers, socialCurrency, offer, cta, trendAngle, persona }) => `
CONTENT GENERATION — punchiest, most optimized version. Final version, not a draft.

Topic: "${topic}"
${niche
  ? `Niche: "${niche}"`
  : `Niche: Infer from topic. Write with the specific insider authority of someone who knows this niche deeply — use its real language, real pain points, real context.`}
Goal: ${goal}
Tone: "${tone}" — embody this in every word and sentence rhythm
Platform: ${platform}
Format: ${format}
Structure: ${structure.join(' → ')}
Selected emotion: ${emotion} — viscerally FELT, never stated
Selected triggers: ${triggers.join(', ')} — activate naturally
Social currency: ${socialCurrency}
${offer ? `Offer: "${offer}" | CTA: "${cta || 'natural next step'}"` : 'No offer — pure value content.'}
${trendAngle ? `Trend angle: "${trendAngle.phrase}" — lean into this specific angle throughout.` : ''}
${persona ? `
AUDIENCE PERSONA — write for this specific person:
Who they are: ${persona.who}
Their pain: ${persona.pain}
What they have tried: ${persona.tried}
What they want to believe about themselves: ${persona.belief}
The mirror sentence: ${persona.mirror}
Every word, every example, every metaphor should speak directly to this person.` : ''}

GENERATION RULES (all 11 layers simultaneously):
— Hook: 1-2 sentences. "Wait…what?" in first 3 words. No greetings. Immediate tension.
  ZERO-FRICTION TEST: requires zero prior context. Mid-scroll viewer with 1.5s must feel tension instantly.
  Choose from hook categories: "You're Being Manipulated" / Anticipation Gap / Near-Miss Reveal /
  System Expose / Identity Reframe / Consequence Preview — whichever hits hardest for this topic.
— Perspective Shift: Most surprising, counterintuitive angle. NOT what they expect.
— Core: Tight, compressed. Every sentence adds new value. Nothing redundant.
— NEAR-MISS STRUCTURE: At the midpoint, the payoff must feel imminent but not yet delivered.
  Use a bridge like "I'll tell you exactly what this means in a second — but first you need to see why..."
  This compels completion. Do not skip this.
— VARIABLE REWARD PACING: Drop an unexpected insight early. Then withhold. Then drop another.
  Slow down briefly. Then deliver the payoff faster than expected. Uneven spacing = higher dopamine response.
— Self-Reflection: Viewer evaluates their own life situation specifically.
— Payoff: Clear, satisfying, memorable aha moment. Arrives faster than expected.
— Micro-hooks: Every 3-7 seconds of spoken content — a new tension or surprise.
— Emotion ${emotion}: Activated through word choice and rhythm — never stated.
— Platform ${platform}: Optimize for this platform's specific algorithm mechanics.
${offer
  ? '— CTA (Antidote framing): Position the offer as the relief to the problem just exposed — not as a pitch. "If you want to take back control of [X]..." not "DM me to join..."'
  : '— End with thought-provoking question that makes viewer reflect AND share.'}
— Social currency: The sharer gains social benefit. Design for the sharer.

Return JSON:
{
  "aligned_script":"full final script including hook",
  "cta":"${offer ? 'standalone CTA sentence' : ''}",
  "share_explanation":"one sentence: which trigger fires first and exact psychological reason they forward this"
}`,

  // ── Thumbnail Concepts ────────────────────────────────────
  thumbnails: ({ script, format, platform, emotion }) => `
THUMBNAIL CONCEPT GENERATOR.
Script: ${script}
Format: ${format}
Platform: ${platform}
Emotion: ${emotion}

Generate 3 completely distinct thumbnail concepts for maximum CTR on ${platform}.
Each uses different psychological trigger: curiosity gap, bold claim, emotional reaction shot.

For each: headline (max 6 words, ALL CAPS overlay text), visual (specific description — composition, pose, colour, mood), why (one sentence on why this drives clicks on ${platform}).

Return JSON: {"concepts":[{"headline":"...","visual":"...","why":"..."}]}`,

  // ── Shot List ─────────────────────────────────────────────
  shotlist: ({ script, format, platform, emotion }) => `
SHOT LIST / FILMING GUIDE.
Script: ${script}
Format: ${format}
Platform: ${platform}

Practical shot-by-shot guide for a solo creator with a smartphone.
For each shot: type (talking head|b-roll|text overlay|walkthrough), description (what to film and how),
camera (close-up|wide|POV|over-shoulder), broll (optional b-roll suggestion), pacing (fast cut|hold 3s|slow push in).
Keep it immediately actionable. No ambiguity.

Return JSON: {"shots":[{"type":"...","description":"...","camera":"...","broll":"...","pacing":"..."}]}`,

  // ── Platform Adaptation ───────────────────────────────────
  adapt: ({ script, platforms, emotion }) => `
PLATFORM ADAPTATION ENGINE.
Original script: ${script}
Adapt for: ${platforms.join(', ')}
Core emotion: ${emotion}

For EACH platform rewrite to match that platform's specific mechanics, format, length, and algorithm signals.
Preserve core idea, perspective shift, and emotion (${emotion}). Each must feel native — not just resized.

Return JSON: {"adaptations":[{"platform":"...","script":"..."}]}`,

  // ── Caption Variants ──────────────────────────────────────
  captions: ({ script, platform, emotion }) => `
CAPTION VARIANT GENERATOR.
Script: ${script}
Platform: ${platform}
Emotion: ${emotion}

5 caption variants, each using a completely different hook style:
1. CURIOSITY GAP — withhold to force the read
2. BOLD STATEMENT — declarative, strong position
3. QUESTION — makes reader self-reflect
4. STAT / NUMBER — surprising figure opens
5. STORY OPENER — pulls from the narrative

Optimize for ${platform}'s mechanics and audience behaviour. Include hashtag strategy note for each.

Return JSON: {"captions":[{"style":"...","text":"...","hashtag_note":"..."}]}`,

  // ── Remix Engine ──────────────────────────────────────────
  remix: ({ script, niche, region, platform, emotion, persona }) => `
REMIX ENGINE — Remix and Sequence methodology.
Original script: ${script}
Niche: ${niche} | Region: ${region} | Platform: ${platform} | Emotion: ${emotion}
${persona ? `Audience: ${persona.who} — pain: ${persona.pain}` : ''}

Generate 5 remix variations targeting different rising trend angles for ${niche} in ${region}.
Each remix = same core insight, different entry point angle:
- By audience (students, parents, professionals, specific roles)
- By geography (city-level, diaspora angle, regional costs/institutions)
- By urgency (warning vs opportunity version)
- By format trigger (myth-busting vs storytime vs listicle)
- By cultural context (${region}-specific references)

Each must feel completely fresh. Preserve perspective shift and payoff.

Return JSON: {"remixes":[{"angle":"...","hook":"opening sentence","script":"full 30-40s script","why":"one sentence what makes this angle different"}]}`,

  // ── 30-Day Sequence ───────────────────────────────────────
  sequence: ({ script, platform, niche, emotion }) => `
30-DAY CONTENT SEQUENCE BUILDER.
Core script: ${script}
Platform: ${platform} | Niche: ${niche} | Emotion: ${emotion}

Build 30-day posting sequence using Remix and Sequence methodology:
WEEK 1 (Days 1-7): Big picture / awareness — hook new viewers, establish authority
WEEK 2 (Days 8-14): Tactical / how-to — deliver value to new followers
WEEK 3 (Days 15-21): Objection killers + social proof — handle skeptics, build trust
WEEK 4 (Days 22-30): Conversion push — drive action

Rules: group similar into mini-series of 3-4. Space similar angles 3+ days apart.
Include 2-3 rest days. CTA types: follow|comment|save|share|DM|link

Return JSON: {"weeks":[{"week":1,"theme":"...","days":[{"day":1,"type":"awareness|tactical|objection|conversion|rest","hook":"...","cta":"follow|comment|save|share|DM|link","note":"..."}]}]}`,

  // ── Hook Rewrite ──────────────────────────────────────────
  regenHook: ({ script, emotion }) => `
HOOK OPTIMIZER (Layer 11 — Attention Engineering). Selected emotion: ${emotion}.
Rewrite ONLY the hook. Keep body unchanged.

REQUIREMENTS:
— Zero-friction entry: requires no prior context whatsoever. Mid-scroll viewer, 1.5 seconds, immediate tension.
— "Wait…what?" activated in first 3 words.
— ${emotion} felt from word one — never stated.
— 1-2 sentences max. No greetings. No setup.
— Choose the hook category that hits hardest for this content:
  "You're Being Manipulated" / Anticipation Gap / Near-Miss Reveal / System Expose / Identity Reframe / Consequence Preview

Current full script: ${script}
Return JSON: {"improved_hook":"...","hook_category":"...","reason":"one sentence on why this hook category and why it is stronger"}`,

  // ── Full Regeneration ─────────────────────────────────────
  regenFull: ({ topic, goal, tone, platform, format, emotion, offer, cta, original }) => `
FULL REGENERATION — completely different angle. Do NOT reuse any phrasing.
Topic: "${topic}" | Goal: ${goal} | Tone: "${tone}" | Platform: ${platform} | Format: ${format}
${offer ? `Offer: "${offer}" | CTA: "${cta || 'natural next step'}"` : 'No offer — pure value.'}
Original (avoid entirely): ${original}…
Select optimal emotion autonomously. Activate 2-3 triggers. Apply all 10 layers. Punchiest version.
Return JSON: {"aligned_script":"...","cta":"${offer ? '...' : ''}","share_explanation":"..."}`,

  // ── Compression ───────────────────────────────────────────
  compress: ({ script, cta }) => `
COMPRESSION OPTIMIZER (Layer 8). Make this script significantly punchier.
Strip filler. Minimum viable sentence form. Increase tension. Micro-hooks between paragraphs.
Remove anything not adding new value. Single strong idea per section. Effortless work-to-wow.
Current script: ${script}
Return JSON: {"aligned_script":"...","cta":"${cta || ''}"}`,

  // ── Emotion Shift ─────────────────────────────────────────
  shiftEmotion: ({ script, cta, fromEmo, toEmo }) => `
EMOTION SHIFT. Rewrite script to trigger ${toEmo} instead of ${fromEmo || 'current emotion'}.
Per Berger STEPPS, ${toEmo} is high-arousal and drives sharing. Same topic, same insight, different emotional mechanism.
Current script: ${script}
Return JSON: {"aligned_script":"...","cta":"${cta || ''}"}`

};

// ── HANDLER ───────────────────────────────────────────────────
exports.handler = async (event) => {
  const CORS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { action, params } = JSON.parse(event.body || '{}');

    if (!action) throw new Error('No action specified');
    if (!PROMPTS[action]) throw new Error(`Unknown action: ${action}`);
    if (!process.env.ANTHROPIC_API_KEY) throw new Error('API key not configured');

    const prompt = PROMPTS[action](params || {});
    const tokenLimit = TOKEN_OVERRIDES[action] || TOKENS;
    const result = await callClaude(prompt, tokenLimit);

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({ result })
    };
  } catch (err) {
    console.error('VYRALL function error:', err.message);
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: err.message })
    };
  }
};
