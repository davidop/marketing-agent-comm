export const translations = {
  en: {
    header: {
      title: 'Marketing Command Center',
      connected: 'Connected',
      disconnected: 'Disconnected'
    },
    campaignBrief: {
      title: 'Campaign Brief',
      subtitle: 'Define your campaign parameters',
      product: 'Product/Service',
      productPlaceholder: 'e.g., Premium Headphones',
      audience: 'Target Audience',
      audiencePlaceholder: 'e.g., Music enthusiasts 25-40',
      goals: 'Campaign Goals',
      goalsPlaceholder: 'e.g., Increase brand awareness, Drive online sales',
      budget: 'Budget',
      budgetPlaceholder: 'e.g., €50,000',
      channels: 'Marketing Channels',
      channelsPlaceholder: 'e.g., Instagram, Google Ads, Email',
      generate: 'Generate Campaign',
      generating: 'Generating...'
    },
    outputs: {
      title: 'Campaign Outputs',
      subtitle: 'AI-generated marketing materials',
      strategy: 'Strategy',
      copy: 'A/B Copy',
      calendar: 'Calendar',
      kpis: 'KPIs',
      strategyEmpty: 'Generate a campaign to see the strategy',
      copyEmpty: 'Generate a campaign to see A/B copy variations',
      calendarEmpty: 'Generate a campaign to see the content calendar',
      kpisEmpty: 'Generate a campaign to see KPI recommendations',
      versionA: 'Version A - Emotional',
      versionB: 'Version B - Rational'
    },
    chat: {
      title: 'Live Agent Chat',
      subtitle: 'Ask questions and refine your campaigns',
      placeholder: 'Type your message...',
      empty: 'Start a conversation with your AI marketing agent'
    }
  },
  es: {
    header: {
      title: 'Centro de Comando Marketing',
      connected: 'Conectado',
      disconnected: 'Desconectado'
    },
    campaignBrief: {
      title: 'Brief de Campaña',
      subtitle: 'Define los parámetros de tu campaña',
      product: 'Producto/Servicio',
      productPlaceholder: 'ej., Auriculares Premium',
      audience: 'Público Objetivo',
      audiencePlaceholder: 'ej., Entusiastas de la música 25-40',
      goals: 'Objetivos de Campaña',
      goalsPlaceholder: 'ej., Aumentar conciencia de marca, Impulsar ventas online',
      budget: 'Presupuesto',
      budgetPlaceholder: 'ej., €50.000',
      channels: 'Canales de Marketing',
      channelsPlaceholder: 'ej., Instagram, Google Ads, Email',
      generate: 'Generar Campaña',
      generating: 'Generando...'
    },
    outputs: {
      title: 'Resultados de Campaña',
      subtitle: 'Materiales de marketing generados por IA',
      strategy: 'Estrategia',
      copy: 'Copy A/B',
      calendar: 'Calendario',
      kpis: 'KPIs',
      strategyEmpty: 'Genera una campaña para ver la estrategia',
      copyEmpty: 'Genera una campaña para ver las variaciones de copy A/B',
      calendarEmpty: 'Genera una campaña para ver el calendario de contenidos',
      kpisEmpty: 'Genera una campaña para ver las recomendaciones de KPIs',
      versionA: 'Versión A - Emocional',
      versionB: 'Versión B - Racional'
    },
    chat: {
      title: 'Chat en Vivo con Agente',
      subtitle: 'Haz preguntas y refina tus campañas',
      placeholder: 'Escribe tu mensaje...',
      empty: 'Inicia una conversación con tu agente de marketing IA'
    }
  }
}

export type Language = keyof typeof translations
export type TranslationKey = typeof translations.en

export function useTranslation(lang: Language) {
  return translations[lang] || translations.en
}
