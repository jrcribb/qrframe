export const ECL_LABELS = ["7%", "15%", "25%", "30%"] as const;

export const ENCODER_NAMES = [
  "Optimizing",
  "Numeric",
  "Alphanumeric",
  "Byte",
] as const satisfies string[];
export type EncoderName = (typeof ENCODER_NAMES)[number];
