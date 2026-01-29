export interface BrandKit {
  tone: 'cercano' | 'profesional' | 'premium' | 'canalla' | 'tech'
  formality: number
  useEmojis: boolean
  emojiStyle: 'pocos' | 'moderados' | 'muchos'
  forbiddenWords: string[]
  preferredWords: string[]
  allowedClaims: string[]
  notAllowedClaims: string[]
  brandExamplesYes: string[]
  brandExamplesNo: string[]
  preferredCTA: 'agenda-demo' | 'compra' | 'descarga' | 'suscribete' | 'contacta'
}

export interface CampaignBriefData {
  objective: string
  kpi: string
  segments: string
  pains: string
  objections: string
  buyingContext: string
  product: string
  price?: string
  promo?: string
  guarantee?: string
  usp?: string
  channels: string[]
  budget: string
  timing: string
  geography: string
  language: string
  tone: string
  brandVoice: string
  forbiddenWords: string
  allowedClaims: string
  legalRequirements: string
  availableAssets: string
  links: string
  audience: string
  goals: string
  mainPromise?: string
  proof?: string[]
  competitors?: string[]
  timeline?: string
  margin?: string
}

export interface CopyVariation {
  id: string
  angle: 'beneficio' | 'urgencia' | 'autoridad' | 'emocion' | 'objeciones'
  hook: string
  promise: string
  proof: string
  cta: string
  risk: 'bajo' | 'medio' | 'alto'
}

export interface ContentCalendarItem {
  date: string
  platform: string
  contentType: string
  objective: string
  funnelPhase: 'awareness' | 'consideration' | 'conversion' | 'retention'
  cta: string
  format: string
  description: string
}

export interface CreativeRoute {
  type: 'safe' | 'bold' | 'premium'
  bigIdea: string
  tagline: string
  hooks: string[]
  adExamples: {
    title: string
    body: string
    cta: string
  }[]
  risk: 'bajo' | 'medio' | 'alto'
  whenToUse: string
  expectedResults: string
}

export interface CampaignOutput {
  overview?: {
    objective: string
    kpi: string
    primaryAudience: string
    valueProposition: string
    mainMessage: string
    rtbs: string[]
    recommendedCTA: string
    launchPriority: string[]
    alerts: {
      tbds: string[]
      risks: string[]
    }
  }
  strategy: string
  creativeRoutes: string | CreativeRoute[]
  funnelBlueprint: string
  paidPack: string
  landingKit: string
  contentCalendar: ContentCalendarItem[]
  emailFlow: string
  whatsappFlow: string
  experimentPlan: string
  measurementUtms: string
  risks: string
  executionChecklist: string
}

export interface CampaignVersion {
  id: string
  briefData: CampaignBriefData
  timestamp: number
  outputs: CampaignOutput
  changelog: string
}
