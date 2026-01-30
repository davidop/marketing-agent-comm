// src/lib/copyScoring.ts

import type { BrandKit } from "@/lib/types";

export interface CopyScoringCriteria {
  clarity: number;         // 0-100
  specificity: number;     // 0-100
  differentiation: number; // 0-100
  audienceFit: number;     // 0-100
  brandVoiceFit: number;   // 0-100
}

export interface CopyScoreBreakdown extends CopyScoringCriteria {
  overall: number;         // 0-100
  notes: string[];
}

export interface CopyScoringWeights {
  clarity?: number;         // default 0.25
  specificity?: number;     // default 0.25
  differentiation?: number; // default 0.20
  audienceFit?: number;     // default 0.20
  brandVoiceFit?: number;   // default 0.10
}

export interface CopyScoringInput {
  text: string;
  // Opcional: si tienes datos de audiencia/brief para afinar audienceFit
  audienceKeywords?: string[];
  // Opcional: si quieres penalizar o premiar presencia de CTA
  requireCTA?: boolean;
}

const DEFAULT_WEIGHTS: Required<CopyScoringWeights> = {
  clarity: 0.25,
  specificity: 0.25,
  differentiation: 0.2,
  audienceFit: 0.2,
  brandVoiceFit: 0.1,
};

function clamp0to100(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, n));
}

function normalize(text: string): string {
  return (text || "").toLowerCase();
}

function countWords(text: string): number {
  const parts = normalize(text).trim().split(/\s+/).filter(Boolean);
  return parts.length;
}

function hasCTA(text: string): boolean {
  const t = normalize(text);
  return /(compra|compra ahora|regístrate|registro|apúntate|descarga|solicita|agenda|reserva|prueba|demo|suscríbete|haz clic|más info|contáctanos|contacta|buy|sign up|register|download|book|schedule|try|demo|subscribe|learn more|contact)/.test(
    t
  );
}

function scoreClarity(text: string): { score: number; notes: string[] } {
  const notes: string[] = [];
  const words = countWords(text);

  // Penaliza extremos: demasiado corto o demasiado largo suele ser menos claro
  let score = 70;

  if (words < 6) {
    score -= 20;
    notes.push("Muy corto: falta contexto para entender la propuesta.");
  } else if (words > 80) {
    score -= 15;
    notes.push("Muy largo: puede perder claridad. Simplifica.");
  }

  // Penaliza exceso de puntuación rara / mayúsculas
  const capsRatio = (text.match(/[A-ZÁÉÍÓÚÜÑ]/g) || []).length / Math.max(1, text.length);
  if (capsRatio > 0.25) {
    score -= 10;
    notes.push("Demasiadas mayúsculas: puede percibirse agresivo o confuso.");
  }

  // Bonus si hay estructura (saltos o bullets)
  if (/\n|- |\• /.test(text)) score += 8;

  return { score: clamp0to100(score), notes };
}

function scoreSpecificity(text: string): { score: number; notes: string[] } {
  const notes: string[] = [];
  const t = normalize(text);

  let score = 60;

  // Bonus por números (precio, porcentajes, fechas, métricas)
  const numbers = t.match(/\d+/g) || [];
  if (numbers.length >= 1) score += 15;
  if (numbers.length >= 3) score += 5;

  // Bonus por palabras concretas típicas (tiempo, cantidad, garantía)
  if (/(hoy|mañana|semanas|días|minutos|24\/7|garantía|envío|devolución|precio|desde)/.test(t)) {
    score += 10;
  }

  // Penaliza vaguedad
  const vague = [
    "increíble",
    "mejor",
    "top",
    "revolucionario",
    "único",
    "perfecto",
    "sin igual",
    "best",
    "amazing",
    "unique",
    "perfect",
  ];
  const vagueHits = vague.filter((w) => t.includes(w)).length;
  if (vagueHits >= 2) {
    score -= 10;
    notes.push("Demasiados adjetivos vagos: añade datos o prueba.");
  }

  return { score: clamp0to100(score), notes };
}

function scoreDifferentiation(text: string): { score: number; notes: string[] } {
  const notes: string[] = [];
  const t = normalize(text);

  let score = 55;

  // Bonus por comparativas o “por qué nosotros”
  if (/(a diferencia|en lugar de|mientras otros|no como|comparado con|vs\.?|versus)/.test(t)) {
    score += 15;
  }

  // Bonus por propuesta de valor explícita
  if (/(por eso|por fin|la forma de|solución|te ayuda a|para que puedas|consigue)/.test(t)) {
    score += 10;
  }

  // Penaliza clichés de IA/marketing
  const clichés = [
    "a otro nivel",
    "game changer",
    "la mejor solución",
    "todo en uno",
    "impulsa tu negocio",
    "crece más rápido",
  ];
  const cHits = clichés.filter((w) => t.includes(w)).length;
  if (cHits >= 1) score -= 8;

  return { score: clamp0to100(score), notes };
}

function scoreAudienceFit(
  text: string,
  audienceKeywords?: string[]
): { score: number; notes: string[] } {
  const notes: string[] = [];
  const t = normalize(text);

  let score = 60;

  if (audienceKeywords && audienceKeywords.length > 0) {
    const hits = audienceKeywords.filter((k) => k && t.includes(normalize(k))).length;
    const ratio = hits / Math.max(1, audienceKeywords.length);

    score += Math.round(ratio * 30);

    if (hits === 0) notes.push("No refleja keywords de la audiencia: ajusta pains/beneficios.");
  } else {
    // Heurística suave si no hay keywords
    if (/(tu|tus|para ti|contigo|te ayuda|you|your)/.test(t)) score += 8;
  }

  return { score: clamp0to100(score), notes };
}

function scoreBrandVoiceFit(text: string, brandKit?: BrandKit): { score: number; notes: string[] } {
  const notes: string[] = [];
  const t = normalize(text);

  // Si no hay brandKit, no penalizamos: dejamos neutral
  if (!brandKit) return { score: 70, notes };

  let score = 70;

  const forbidden: string[] =
    (brandKit as any).forbiddenWords || (brandKit as any).palabrasProhibidas || [];
  const preferred: string[] =
    (brandKit as any).preferredWords || (brandKit as any).palabrasPreferidas || [];
  const allowEmojis: boolean =
    (brandKit as any).allowEmojis ?? (brandKit as any).emojis ?? true;

  // Penaliza forbidden
  const forbiddenHits = forbidden.filter((w) => w && t.includes(normalize(w))).length;
  if (forbiddenHits > 0) {
    score -= Math.min(30, forbiddenHits * 10);
    notes.push("Incluye palabras prohibidas según Brand Kit.");
  }

  // Bonus por preferred
  const preferredHits = preferred.filter((w) => w && t.includes(normalize(w))).length;
  if (preferredHits > 0) score += Math.min(15, preferredHits * 5);

  // Emojis
  const hasEmoji = /[\u{1F300}-\u{1FAFF}]/u.test(text);
  if (!allowEmojis && hasEmoji) {
    score -= 10;
    notes.push("Incluye emojis y tu Brand Kit indica que no.");
  }
  if (allowEmojis && hasEmoji) score += 3;

  return { score: clamp0to100(score), notes };
}

export function calculateCopyScore(
  input: CopyScoringInput,
  brandKit?: BrandKit,
  weights?: CopyScoringWeights
): CopyScoreBreakdown {
  const w = { ...DEFAULT_WEIGHTS, ...(weights || {}) };

  const notes: string[] = [];
  const text = input?.text ?? "";

  const c1 = scoreClarity(text);
  const c2 = scoreSpecificity(text);
  const c3 = scoreDifferentiation(text);
  const c4 = scoreAudienceFit(text, input.audienceKeywords);
  const c5 = scoreBrandVoiceFit(text, brandKit);

  notes.push(...c1.notes, ...c2.notes, ...c3.notes, ...c4.notes, ...c5.notes);

  // CTA requirement (opcional)
  if (input.requireCTA && !hasCTA(text)) {
    notes.push("Falta CTA: añade una acción clara (p. ej., “Agenda demo”, “Descarga”, “Compra”).");
  }

  const overall =
    c1.score * w.clarity +
    c2.score * w.specificity +
    c3.score * w.differentiation +
    c4.score * w.audienceFit +
    c5.score * w.brandVoiceFit;

  return {
    clarity: c1.score,
    specificity: c2.score,
    differentiation: c3.score,
    audienceFit: c4.score,
    brandVoiceFit: c5.score,
    overall: clamp0to100(Math.round(overall)),
    notes: Array.from(new Set(notes)).slice(0, 12),
  };
}

export function scoreCopyVariations(
  variations: any[],
  brandKit?: BrandKit,
  audienceKeywords?: string[]
): any[] {
  if (!variations || !Array.isArray(variations)) return [];

  return variations.map((variation) => {
    const text = `${variation.hook || ""} ${variation.promise || ""} ${variation.cta || ""}`.trim();
    
    const score = calculateCopyScore(
      {
        text,
        audienceKeywords,
        requireCTA: true,
      },
      brandKit
    );

    return {
      ...variation,
      score: score.overall,
      scoreBreakdown: {
        clarity: score.clarity,
        specificity: score.specificity,
        differentiation: score.differentiation,
        audienceFit: score.audienceFit,
        brandVoiceFit: score.brandVoiceFit,
      },
      scoreNotes: score.notes,
    };
  });
}
