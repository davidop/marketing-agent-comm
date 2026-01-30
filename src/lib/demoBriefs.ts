import type { CampaignBriefData, BrandKit } from './types'

export interface DemoBrief {
  id: string
  name: string
  description: string
  category: 'saas-b2b' | 'ecommerce' | 'evento-curso'
  briefData: CampaignBriefData
  brandKit: BrandKit
}

export const demoBriefs: DemoBrief[] = [
  {
    id: 'demo-saas-b2b',
    name: 'SaaS B2B - HubFlow CRM',
    description: 'Plataforma CRM para equipos de ventas B2B, objetivo: generar demos cualificadas',
    category: 'saas-b2b',
    briefData: {
      objective: 'leads',
      kpi: 'Demos agendadas cualificadas (SQL)',
      segments: 'CEOs, Directores Comerciales y Revenue Ops de empresas B2B SaaS con 20-200 empleados en España, Francia y UK',
      pains: 'Pierden oportunidades porque su CRM actual no unifica datos de marketing y ventas, dependen de múltiples herramientas desconectadas, y sus equipos comerciales pierden 40% del tiempo en tareas manuales',
      objections: '¿Cuánto tiempo lleva la implementación? ¿Se integra con nuestro stack actual? ¿Qué pasa con nuestros datos históricos? ¿Realmente veremos ROI en menos de 6 meses?',
      buyingContext: 'Compra compleja con ciclo de 45-90 días. Decisión por comité (comercial + IT + finanzas). Buscan validación de casos similares antes de agendar demo',
      product: 'HubFlow CRM - Plataforma todo-en-uno que unifica marketing, ventas y customer success con IA para priorización de leads y automatización de seguimientos',
      price: 'Desde 199€/mes (plan Starter 5 usuarios) hasta 899€/mes (plan Enterprise ilimitado). Prueba gratuita 14 días sin tarjeta',
      promo: 'Primeros 100 clientes: 3 meses gratis en plan anual + onboarding personalizado valorado en 1.500€',
      guarantee: 'Garantía de implementación en menos de 30 días o te devolvemos el doble de tu inversión. Migración de datos incluida sin coste adicional',
      usp: 'El único CRM que sincroniza datos en tiempo real con tu stack de marketing (HubSpot, Salesforce, Mailchimp) y usa IA para predecir qué leads cerrarán este mes',
      channels: ['Email', 'Google', 'LinkedIn'],
      budget: '8.000€/mes (60% LinkedIn Ads, 25% Google Search, 15% email outreach)',
      timing: 'Lanzamiento Q2 2024, duración 3 meses con revisión quincenal',
      geography: 'España (castellano), Francia (francés), UK (inglés)',
      language: 'es',
      tone: 'Profesional pero cercano, orientado a resultados, sin tecnicismos innecesarios',
      brandVoice: 'Somos el aliado práctico que entiende la realidad del día a día comercial. Hablamos de ROI real, no de funcionalidades. Evitamos el hype corporativo',
      forbiddenWords: 'revolucionario, disruptivo, innovador, game-changer, líder del mercado',
      allowedClaims: 'Implementación en menos de 30 días (promedio certificado 23 días), Sincronización en tiempo real verificada con +50 integraciones, ROI medio del 340% en primer año (estudio interno 2023 con 87 clientes)',
      legalRequirements: 'GDPR compliant, certificación ISO 27001, hosting en EU. No hacer claims de ROI sin disclaimers',
      availableAssets: 'Logo, guía de marca, 12 testimonios en video, 3 casos de estudio documentados (TechCorp +180% pipeline, SalesHub -60% tiempo admin), dashboard demo interactivo',
      links: 'https://hubflow.io/demo | https://hubflow.io/casos-exito | https://hubflow.io/comparativa-crm',
      audience: 'CEOs, Directores Comerciales y Revenue Ops de empresas B2B SaaS 20-200 empleados',
      goals: 'Generar 150 demos cualificadas en 3 meses con coste por demo <55€',
      mainPromise: 'Recupera 15 horas semanales por comercial automatizando tareas repetitivas y priorizando con IA los leads que realmente cerrarán',
      proof: [
        '+320 empresas B2B confían en HubFlow',
        'Implementación media de 23 días (promesa: <30)',
        '4.8/5 estrellas en G2 con 247 reviews',
        'ROI medio 340% primer año (estudio interno 87 clientes 2023)',
        'TechCorp aumentó pipeline 180% en 6 meses',
        'SalesHub redujo tiempo administrativo 60%'
      ],
      competitors: ['Salesforce (complejo y caro)', 'HubSpot (limitado en ventas B2B)', 'Pipedrive (sin IA real)'],
      timeline: 'Q2 2024: lanzamiento y testing (mes 1), escalado (mes 2-3), optimización',
      margin: 'LTV 3.600€, CAC objetivo <600€, payback 6 meses',
      sector: 'SaaS B2B'
    },
    brandKit: {
      tone: 'profesional',
      formality: 4,
      useEmojis: false,
      emojiStyle: 'pocos',
      forbiddenWords: ['revolucionario', 'disruptivo', 'innovador', 'game-changer', 'líder del mercado', 'único en el mundo', 'increíble', 'explosivo'],
      preferredWords: ['específico', 'medible', 'verificable', 'probado', 'en tiempo real', 'automático', 'predecible', 'escalable'],
      allowedClaims: [
        'Implementación en menos de 30 días',
        'Sincronización en tiempo real con +50 integraciones',
        'ROI medio 340% primer año (estudio interno 2023)',
        'Ahorra 15h semanales por comercial',
        'Migración de datos sin coste adicional'
      ],
      notAllowedClaims: [
        'El mejor CRM del mercado',
        'Aumenta ventas 10x',
        'Nunca más pierdas un lead',
        'CRM del futuro',
        'Resultados garantizados en X días'
      ],
      brandExamplesYes: [
        '¿Tu equipo comercial pasa más tiempo en el CRM que hablando con clientes? HubFlow automatiza el 60% de tareas administrativas para que vendas más y administres menos.',
        'Implementamos TechCorp en 21 días. Su pipeline creció 180% en 6 meses. Sin migraciones complejas, sin formaciones eternas.',
        'Sincronización real entre marketing y ventas. No más leads perdidos entre herramientas. Elige demo de 20 minutos y te mostramos tu stack integrado.'
      ],
      brandExamplesNo: [
        '¡Revoluciona tu forma de vender con el CRM más innovador del mercado!',
        'HubFlow: la solución definitiva que cambiará tu negocio para siempre',
        'Miles de empresas ya confían en nosotros. ¿A qué esperas?'
      ],
      preferredCTA: 'agenda-demo'
    }
  },
  {
    id: 'demo-ecommerce',
    name: 'Ecommerce - Tenua Skincare',
    description: 'Marca de cosmética natural vegana, objetivo: ventas directas online',
    category: 'ecommerce',
    briefData: {
      objective: 'ventas',
      kpi: 'Revenue con ROAS mínimo 3.5x y AOV >45€',
      segments: 'Mujeres 28-45 años, urbanas, conciencia ecológica, ingreso medio-alto, compran cosmética premium online, activas en Instagram y leen blogs de belleza sostenible',
      pains: 'Cansadas de productos con químicos agresivos que irritan su piel sensible, desconfían del greenwashing de marcas masivas, quieren resultados visibles pero sin comprometer valores',
      objections: '¿Realmente funciona o es solo marketing verde? ¿Por qué es más caro que la farmacia? ¿Cuánto tarda en llegar? ¿Puedo devolverlo si no me va bien?',
      buyingContext: 'Compra impulsiva de ticket medio (45-70€) o planificada de rutina completa (120-180€). Decisión en 24-72h. Buscan reviews y comparativas antes de comprar',
      product: 'Tenua Skincare - Línea completa de cosmética facial natural, vegana y cruelty-free con activos botánicos de agricultura ecológica. 4 líneas: Hidratación, Anti-edad, Piel sensible, Manchas',
      price: 'Sérum estrella 38€, Kit rutina completa 89€ (vs 124€ por separado), Rutina premium 149€. Envío gratis pedidos >50€',
      promo: 'Oferta lanzamiento: -25% en primer pedido con código TENUA25 + muestra gratis de sérum vitamina C. Válido hasta fin de mes',
      guarantee: '60 días satisfecho o te devolvemos el dinero. Sin preguntas. Cambio de producto gratuito si no ves resultados en 30 días',
      usp: 'Activos botánicos a concentración clínica (15-20% vs 2-5% de marcas masivas) + fórmulas diseñadas por dermatólogos + packaging sostenible de vidrio reutilizable',
      channels: ['Facebook', 'Instagram', 'Google', 'TikTok'],
      budget: '5.000€/mes (40% Meta Ads, 30% Google Shopping/Search, 20% influencers micro, 10% TikTok)',
      timing: 'Campaña Black Friday (3 semanas pre + 1 semana evento + 2 semanas post)',
      geography: 'España y Portugal (castellano y portugués)',
      language: 'es',
      tone: 'Cercano, inspiracional, empoderador pero honesto',
      brandVoice: 'Hablamos como una amiga experta que te aconseja sin venderte humo. Celebramos la belleza real, sin filtros. Somos transparentes con ingredientes y resultados',
      forbiddenWords: 'milagroso, instantáneo, mágico, perfecto, anti-arrugas definitivo, borra las manchas',
      allowedClaims: 'Reducción visible de líneas de expresión en 4 semanas (estudio clínico 89 voluntarias), Hidratación +68% a las 8h (test in vitro), 99% ingredientes naturales certificados, Cruelty-free certificado PETA',
      legalRequirements: 'Cosmética: no hacer claims médicos, incluir INCI completo, disclaimers de resultados individuales pueden variar',
      availableAssets: 'Fotografía de producto profesional (fondo blanco + lifestyle), 45 UGC de clientas reales, 8 colaboraciones con micro-influencers (15K-80K), guía de ingredientes, antes/después con consentimiento',
      links: 'https://tenuaskincare.com | Instagram @tenuaskincare | https://tenuaskincare.com/ingredientes',
      audience: 'Mujeres 28-45 años, urbanas, conciencia ecológica, compran cosmética premium online',
      goals: 'Facturar 75.000€ en campaña Black Friday (6 semanas) con ROAS 3.5x',
      mainPromise: 'Piel radiante y saludable con cosmética natural que funciona de verdad, sin químicos agresivos ni greenwashing',
      proof: [
        '+12.500 clientas en España y Portugal',
        '4.7/5 estrellas (1.247 reviews verificadas)',
        'Reducción líneas expresión 37% en 4 semanas (estudio 89 voluntarias)',
        'Hidratación +68% sostenida 8h (test in vitro)',
        '99% ingredientes origen natural certificado',
        'Cruelty-free PETA, Vegano certificado'
      ],
      competitors: ['The Ordinary (más barato pero menos natural)', 'Freshly Cosmetics (similar pero menos concentración)', 'Marcas farmacia (químicos y testing animal)'],
      timeline: 'Semana 1-3 pre-BF (awareness + lista espera), Semana 4 BF (conversión), Semana 5-6 post-BF (retargeting)',
      margin: 'Margen bruto 68%, AOV objetivo 52€, CAC objetivo <15€',
      sector: 'Ecommerce cosmética'
    },
    brandKit: {
      tone: 'cercano',
      formality: 2,
      useEmojis: true,
      emojiStyle: 'moderados',
      forbiddenWords: ['milagroso', 'instantáneo', 'mágico', 'perfecto', 'anti-arrugas definitivo', 'borra', 'elimina', 'nunca más'],
      preferredWords: ['natural', 'visible', 'saludable', 'equilibrado', 'radiante', 'auténtico', 'consciente', 'sostenible', 'real'],
      allowedClaims: [
        'Reducción visible en 4 semanas (estudio clínico)',
        'Hidratación +68% a las 8h',
        '99% ingredientes naturales certificados',
        'Cruelty-free certificado PETA',
        'Packaging sostenible de vidrio reutilizable',
        'Fórmulas dermatológicamente testadas'
      ],
      notAllowedClaims: [
        'Elimina arrugas para siempre',
        'Resultados instantáneos',
        'Mejor que botox',
        'Piel perfecta en 7 días',
        'Milagro anti-edad'
      ],
      brandExamplesYes: [
        '¿Cansada de productos que prometen mucho y cumplen poco? 🌿 Activos botánicos a concentración clínica (15-20%) + fórmulas dermatológicas = resultados visibles en 4 semanas. Sin filtros, sin promesas imposibles.',
        'Laura, 34 años: "Probé el sérum anti-manchas por mi melasma. En 6 semanas vi cambios reales. Lo mejor: ingredientes que entiendo y piel que no se irrita". 🤍',
        'Black Friday con propósito: -25% en tu rutina completa + envío gratis. Porque cuidarte y cuidar el planeta no debería ser un lujo. Código TENUA25 ✨'
      ],
      brandExamplesNo: [
        '¡OFERTA INCREÍBLE! ¡La crema milagrosa que borra tus arrugas en 3 días! ¡No te lo pierdas!',
        'Todas las famosas usan Tenua. ¿A qué esperas? Compra ya.',
        'El secreto de la eterna juventud revelado. Resultados instantáneos garantizados.'
      ],
      preferredCTA: 'compra'
    }
  },
  {
    id: 'demo-evento-curso',
    name: 'Evento - Bootcamp IA para Marketers',
    description: 'Formación intensiva online sobre IA aplicada a marketing, objetivo: inscripciones',
    category: 'evento-curso',
    briefData: {
      objective: 'inscripciones',
      kpi: 'Inscripciones confirmadas (pagadas) con coste por inscripción <45€',
      segments: 'Responsables de marketing, growth marketers, directores de marketing digital en empresas 10-500 empleados. Edad 28-45 años. Sienten que la IA les está dejando atrás',
      pains: 'Ven cómo la IA está transformando el marketing pero no saben por dónde empezar. Miedo a quedarse obsoletos. Saturados de teoría pero sin casos prácticos aplicables a su día a día',
      objections: '¿Es muy técnico o puedo seguirlo sin programar? ¿Realmente aprenderé a usar herramientas o solo veré demos? ¿Cuánto tiempo requiere? ¿Vale la pena la inversión?',
      buyingContext: 'Decisión rápida (48-72h desde awareness). Comparan con alternativas gratuitas (YouTube) y otros bootcamps. Necesitan ver programa detallado y quién imparte. Compra individual con presupuesto propio o empresa',
      product: 'Bootcamp IA para Marketers - 4 semanas online en directo (martes y jueves 19h-21h CET) + grabaciones + comunidad privada + certificado. Casos prácticos con ChatGPT, MidJourney, Claude, Make, herramientas IA marketing',
      price: '497€ (early bird 397€ primeros 50 inscritos). Opción empresa: 3 plazas 1.197€ (vs 1.491€). Facilidades: 3 cuotas sin intereses',
      promo: 'Early Bird: inscripción antes del 15/05 por 397€ (ahorro 100€) + acceso a grabaciones de edición anterior (valor 197€) + 1 sesión consultoría 1:1 post-bootcamp',
      guarantee: 'Si tras la primera semana no cumple expectativas, devolución 100% sin preguntas. Acceso a contenido actualizado durante 12 meses',
      usp: 'El único bootcamp que te hace USAR herramientas IA en TUS campañas reales, con feedback de expertos que trabajan en agencias top y startups. Cero teoría de relleno, 100% aplicable el lunes',
      channels: ['Email', 'LinkedIn', 'WhatsApp'],
      budget: '3.500€ (50% LinkedIn Ads a lista warm, 30% email a base datos propia, 20% partners/afiliados)',
      timing: 'Inscripciones abiertas del 01/05 al 30/05. Bootcamp del 04/06 al 27/06 (4 semanas). Edición limitada 80 plazas',
      geography: 'España y Latinoamérica (castellano). Horario: 19h-21h CET apto para LATAM',
      language: 'es',
      tone: 'Directo, retador, inspirador, sin fluff corporativo',
      brandVoice: 'Hablamos sin rodeos. No vendemos sueños, enseñamos herramientas. Retamos a la zona de confort pero acompañamos en el proceso. Somos colegas expertos, no gurús inalcanzables',
      forbiddenWords: 'gurú, secreto, fórmula mágica, ganar dinero fácil, conviértete en experto en 30 días',
      allowedClaims: '87% alumnos edición anterior implementaron al menos 2 herramientas IA en campañas reales (encuesta post-bootcamp), Reducción media 12h semanales en tareas repetitivas (auto-reportado), 4.9/5 satisfacción (112 reviews)',
      legalRequirements: 'Formación profesional no reglada. Incluir disclaimer "resultados pueden variar". Política de reembolso visible. Condiciones generales accesibles',
      availableAssets: 'Video-teaser del programa (2 min), testimonials en video (8), temario detallado PDF, casos de éxito alumnos anteriores, LinkedIn del instructor (12K seguidores)',
      links: 'https://bootcamp-ia-marketing.com | https://bootcamp-ia-marketing.com/programa | Perfil instructor: linkedin.com/in/carlos-martinez-ia',
      audience: 'Responsables de marketing, growth marketers, directores marketing digital 28-45 años',
      goals: '80 inscripciones en 30 días con coste por inscripción <45€ (objetivo: 3.500€ presupuesto / 80 = 43.75€)',
      mainPromise: 'Domina 8 herramientas de IA para marketing en 4 semanas y aplícalas en tus campañas reales con feedback de expertos. Ahorra 12h semanales y multiplica resultados',
      proof: [
        '112 alumnos en edición anterior',
        '4.9/5 satisfacción media',
        '87% implementaron al menos 2 herramientas IA en campañas',
        'Ahorro medio reportado: 12h semanales en tareas repetitivas',
        'María (CMO SaaS): "Automaticé segmentación y copy ads. CTR +43% en 3 semanas"',
        'Javier (Agencia): "Reduje tiempo creación contenido 60%. Clientes alucinados"'
      ],
      competitors: ['Coursera (teórico y sin comunidad)', 'Bootcamps genéricos (no específicos marketing)', 'YouTube (gratis pero sin estructura ni feedback)'],
      timeline: '01-15 Mayo: awareness + early bird. 16-30 Mayo: cierre urgencia. 04-27 Junio: bootcamp en vivo',
      margin: 'Coste entrega (plataforma + instructor + soporte): 4.800€. Objetivo: 80 x 397€ avg = 31.760€. Margen neto: ~75%',
      sector: 'Formación profesional'
    },
    brandKit: {
      tone: 'profesional',
      formality: 3,
      useEmojis: true,
      emojiStyle: 'pocos',
      forbiddenWords: ['gurú', 'secreto', 'fórmula mágica', 'ganar dinero fácil', 'conviértete en experto', 'trucos', 'hacks definitivos', 'sistema infalible'],
      preferredWords: ['práctico', 'aplicable', 'casos reales', 'herramientas', 'implementar', 'resultados', 'feedback', 'comunidad', 'aprender haciendo'],
      allowedClaims: [
        '87% alumnos implementaron al menos 2 herramientas IA',
        'Ahorro medio 12h semanales (auto-reportado)',
        '4.9/5 satisfacción (112 reviews)',
        '8 herramientas IA aplicadas a campañas reales',
        'Feedback personalizado de expertos',
        'Acceso a comunidad privada 12 meses'
      ],
      notAllowedClaims: [
        'Conviértete en experto IA en 4 semanas',
        'Duplica resultados garantizado',
        'Secretos que las agencias no quieren que sepas',
        'Fórmula mágica del marketing con IA',
        'Gana X€ extra al mes aplicando esto'
      ],
      brandExamplesYes: [
        '¿Sientes que la IA te está dejando atrás? 🤖 No necesitas ser ingeniero para usarla. En 4 semanas dominas 8 herramientas aplicadas a TUS campañas reales. Con feedback de expertos que curran en agencias y startups top.',
        'María (CMO): "Automaticé segmentación y copy con IA. CTR +43% en 3 semanas. Lo mejor: no perdí el toque humano, lo potencié". Eso enseñamos. Casos reales, no teoría de relleno.',
        'Early Bird hasta el 15/05: 397€ (vs 497€) + grabaciones edición anterior + consultoría 1:1. Solo 50 plazas. Si no cumple expectativas tras semana 1, reembolso 100%. Sin dramas. 🎯'
      ],
      brandExamplesNo: [
        '🚀 ¡Descubre el SECRETO que los gurús del marketing NO quieren que sepas! Conviértete en EXPERTO en IA en solo 30 días y DUPLICA tus ingresos. ¡Plazas limitadas!',
        'El sistema definitivo de IA para marketing que te hará ganar 10.000€ extra al mes. Garantizado.',
        'Webinar GRATUITO revela la fórmula mágica de IA que está revolucionando el marketing. ¡Inscríbete YA!'
      ],
      preferredCTA: 'suscribete'
    }
  }
]

export function getDemoBriefById(id: string): DemoBrief | undefined {
  return demoBriefs.find(brief => brief.id === id)
}

export function getDemoBriefsByCategory(category: 'saas-b2b' | 'ecommerce' | 'evento-curso'): DemoBrief[] {
  return demoBriefs.filter(brief => brief.category === category)
}
