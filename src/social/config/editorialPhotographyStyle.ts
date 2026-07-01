/**
 * Official Infinite Home Lending — Editorial Photography Style
 *
 * Canonical visual standard for every hero image in the 30-day social campaign.
 * Reference this module when sourcing, generating, or post-processing hero assets
 * so the Instagram / Facebook / LinkedIn grid reads as one premium collection.
 *
 * @see buildEditorialHeroImagePrompt — pass scene-specific direction
 * @see EDITORIAL_HERO_IMAGE_AVOID — hard exclusions for every asset
 */

export const EDITORIAL_PHOTOGRAPHY_STYLE = {
  lighting: {
    summary: "Bright natural daylight with soft window light",
    qualities: [
      "Bright natural daylight",
      "Soft window light whenever possible",
      "Airy, optimistic atmosphere",
      "No harsh shadows",
      "No overly dramatic or moody lighting",
    ],
  },

  whiteBalance: {
    summary: "Consistent warm-neutral white balance",
    target: [
      "Soft whites (never bluish)",
      "Slight warm daylight tone",
      "Gentle golden highlights",
      "Natural wood tones",
      "Premium residential or modern office environments",
    ],
    avoid: [
      "Cool blue color casts",
      "Green tint",
      "Orange/yellow oversaturation",
    ],
  },

  exposure: {
    summary: "Bright, clean, and inviting — slightly high-key",
    target: [
      "Slightly high-key exposure",
      "Preserve detail in highlights",
      "Preserve contrast",
      "No washed-out appearance",
    ],
  },

  color: {
    summary: "Natural, warm, consistent campaign palette",
    skinTones: ["Natural", "Warm", "Healthy", "Authentic"],
    environment: [
      "Neutral whites",
      "Warm woods",
      "Navy accents when appropriate",
      "Gold accents only when naturally present",
    ],
    avoid: ["Overly saturated colors"],
  },

  mood: {
    communicate: [
      "Trust",
      "Guidance",
      "Conversation",
      "Confidence",
      "Calm professionalism",
      "Human connection",
      "Hope",
      "Optimism",
    ],
    avoid: [
      "Corporate",
      "Sales-driven",
      "Cold",
      "Overly staged",
      "Stock-photo cliché",
    ],
  },

  composition: {
    use: [
      "Lifestyle photography",
      "Genuine interactions",
      "Collaborative conversations",
      "Natural smiles",
      "Comfortable body language",
    ],
    camera: [
      "Avoid people looking directly into the camera unless intentionally creating a portrait",
    ],
  },
} as const;

/** Hard exclusions — apply to every hero image in the series. */
export const EDITORIAL_HERO_IMAGE_AVOID = [
  "Handshakes",
  "Signing paperwork",
  "Sold signs",
  "House keys",
  "Closing celebrations",
  "Exaggerated or stock-photo smiles",
  "Generic posed expressions",
  "Readable text on documents or screens",
  "Direct eye contact with camera (unless intentional portrait)",
  "Cool blue or green color casts",
  "Moody or dramatic lighting",
  "Overly saturated colors",
  "Sales-presentation body language",
] as const;

/**
 * Approved CSS treatment applied in flagship templates after photography.
 * Matches Days 2–4 people-editorial and conversation-editorial posts.
 */
export const EDITORIAL_HERO_IMAGE_CSS = {
  /** Default flagship hero filter (people-editorial-v1) */
  filter: "brightness(1.03) saturate(1.04)",
  /** Conversation template uses a touch more lift for lifestyle outdoor scenes */
  filterConversation: "brightness(1.04) saturate(1.05)",
  objectFit: "cover" as const,
  scale: 1.08,
  scaleConversation: 1.16,
} as const;

/**
 * Post-processing when a source asset reads darker than the approved series.
 * Apply to the PNG only — never via layout/CSS changes.
 */
export const EDITORIAL_HERO_IMAGE_POST_PROCESS = {
  /** Linear brightness factor (~2–3% lift). Use when matching Days 2–3 grid brightness. */
  brightnessFactor: 1.025,
  /** Do not adjust saturation in post — preserve natural grading. */
  adjustSaturation: false,
} as const;

const PROMPT_PREAMBLE = `Premium editorial lifestyle photograph for the Infinite Home Lending 30-day social media campaign. High-end luxury magazine photography with beautiful depth of field, warm sophisticated color grading, and horizontal composition suitable for a social media hero crop.`;

const PROMPT_LIGHTING = `LIGHTING: Bright natural daylight, soft window light, airy optimistic atmosphere, no harsh shadows, no moody or dramatic lighting.`;

const PROMPT_WHITE_BALANCE = `WHITE BALANCE: Warm-neutral — soft whites (never bluish), slight warm daylight tone, gentle golden highlights, natural wood tones, premium residential or modern office setting.`;

const PROMPT_EXPOSURE = `EXPOSURE: Slightly high-key — bright, clean, inviting; preserve highlight detail and contrast; not washed out.`;

const PROMPT_COLOR = `COLOR: Natural warm authentic skin tones; neutral whites and warm woods; navy or gold accents only when naturally present; avoid oversaturation, cool blue casts, green tint, or orange/yellow oversaturation.`;

const PROMPT_MOOD = `MOOD: Trust, guidance, conversation, confidence, calm professionalism, human connection, hope, optimism — never corporate, sales-driven, cold, overly staged, or stock-photo cliché.`;

const PROMPT_COMPOSITION = `COMPOSITION: Lifestyle photography with genuine interactions, collaborative conversations, natural smiles, and comfortable body language; subjects engaged with each other or materials, not looking at camera.`;

const PROMPT_AVOID = `AVOID: Handshakes, signing paperwork, sold signs, house keys, closing celebrations, exaggerated smiles, generic stock poses, readable text on documents, direct camera eye contact, harsh shadows, moody lighting, cool color casts.`;

/**
 * Build a complete image-generation prompt for a campaign hero asset.
 *
 * @example
 * buildEditorialHeroImagePrompt(
 *   "A Hispanic couple in their early 30s seated beside a mortgage advisor reviewing financing options at a bright contemporary office table with laptop, coffee mugs, and printed documents."
 * )
 */
export function buildEditorialHeroImagePrompt(sceneDescription: string): string {
  return [
    PROMPT_PREAMBLE,
    "",
    sceneDescription.trim(),
    "",
    PROMPT_LIGHTING,
    PROMPT_WHITE_BALANCE,
    PROMPT_EXPOSURE,
    PROMPT_COLOR,
    PROMPT_MOOD,
    PROMPT_COMPOSITION,
    PROMPT_AVOID,
  ].join("\n");
}

/** One-line reference for content authors and AI image tools. */
export const EDITORIAL_PHOTOGRAPHY_STYLE_SUMMARY =
  "Bright warm-neutral daylight · slightly high-key · natural skin tones · airy editorial lifestyle · trust and conversation · never sales-driven or stock-photo";
