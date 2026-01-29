export interface BrandKit {
  tone: string
  voice?: string
  formality?: string
  doList: string[]
  dontList: string[]
  forbiddenWords: string[]
  allowedClaims: string[]
  useEmojis: boolean
  examples?: string[]
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

export interface CampaignOutput {
  strategy: string
  creativeRoutes: string
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
