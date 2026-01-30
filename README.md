# Marketing Agent Command Center

**Sistema de planificación estratégica de campañas de marketing digital orientado a performance y brand.**

Diseñado desde la perspectiva de una estratega senior de marketing, este sistema convierte briefs en **campañas ejecutables, específicas y coherentes con la marca**. No genera textos bonitos, genera planes accionables con KPIs claros, responsables definidos y next steps concretos.

## 🎯 Filosofía Estratégica

### Reglas Fundamentales
1. ❌ **No inventar datos**: Si falta precio, resultados o testimonios → pregunta o marca como TBD
2. ✅ **Cero generalidades**: Todo debe ser accionable (qué, por qué, cómo, con qué KPI)
3. 🎨 **Brand Kit como guardia**: Tono, palabras prohibidas, claims y emojis se respetan en todos los outputs
4. 📋 **Estructura modular clara**: Bloques con títulos claros, jerarquía visual y navegación sencilla
5. 💎 **Diferenciación primero**: Si el USP no existe, se propone como hipótesis y se pide confirmación

> **Documentación estratégica completa**: Ver [STRATEGIC_APPROACH.md](./STRATEGIC_APPROACH.md) para ejemplos detallados y mejores prácticas.

## 🚀 Características Principales

### Persistent Brand Kit System ✨ NEW
- **Configuración centralizada de marca** persistente por cliente
- **11 parámetros personalizables**: tono, formalidad, emojis, palabras prohibidas/preferidas, claims, ejemplos, CTA
- **Integración automática**: todas las generaciones respetan las directrices de marca
- **Evaluación de consistencia AI**: botón en cada bloque para validar adherencia al brand kit
- **Score 0-100** con análisis detallado de alineación de tono, formalidad, uso de palabras y claims

### Smart Campaign Brief Wizard
- **Formulario multi-paso intuitivo** para capturar detalles de campaña
- **Sistema de puntuación en tiempo real (0-100)** que evalúa la calidad del brief
- **Detección inteligente de huecos críticos** antes de generar la campaña
- **Modal de Preguntas Rápidas** que completa automáticamente información faltante
- Validación contextual y recomendaciones accionables

### Intelligent Gap Detection System
El sistema detecta 8 tipos de huecos críticos y genera preguntas contextuales:

1. **Precio Faltante** - Solicita rango de precio cuando no está definido
2. **USP Débil/Ausente** - Ofrece 4 hipótesis de valor único para elegir
3. **Sin Prueba Social** - Multiselección de 5 tipos de evidencia (reviews, cifras, casos, garantías, certificaciones)
4. **Audiencia Vaga** - Pide definir 1-2 segmentos prioritarios cuando la descripción es muy genérica
5. **Canales Pagados sin Presupuesto** - Pregunta por presupuesto mínimo cuando hay Google/Facebook/LinkedIn seleccionados
6. **Canales Pagados sin KPI** - Ofrece objetivos paid (CPA/ROAS/CPL/CTR) cuando no están definidos
7. **Sector Regulado - Claims** - Detecta sectores como financiero/salud y pregunta por claims permitidos/prohibidos
8. **Sector Regulado - Legal** - Solicita requisitos legales obligatorios (GDPR, disclaimers, etc.)

### Quick Questions Modal
- **Interfaz multi-paso** con indicador de progreso
- **4 tipos de input**: texto, textarea, select, multiselect
- **Navegación flexible** con botones anterior/siguiente
- **Preguntas opcionales** que se pueden omitir
- **Respuestas auto-integradas** al brief automáticamente

### Modular Campaign Dashboard
Panel completo con **12 tabs especializados**:

1. **Overview** - Resumen ejecutivo en 1 página (objetivo, KPI, audiencia primaria, propuesta de valor, RTBs, TBDs, riesgos)
2. **Strategy** - Estrategia integral (posicionamiento, audiencia, canales, presupuesto)
3. **Creative Routes** - 3 rutas creativas (segura/atrevida/premium) con big idea, tagline, hooks, ejemplos
4. **Funnel Blueprint** - 4 fases (Awareness/Consideration/Conversion/Retention) con objetivo, mensaje, formatos, CTAs, KPIs
5. **Paid Pack** - Campañas pagadas completas (estructura, audiencias, 10 hooks + 10 headlines + 5 descripciones, ángulos creativos, presupuesto, plan de tests)
6. **Landing Kit** - Wireframes + copy por sección (Hero, Beneficios, Prueba Social, Objeciones, FAQs, CTA Final)
7. **Content Calendar** - 15 piezas con canal, formato, fase del funnel, objetivo, CTA, idea visual, copy base, KPI, categoría
8. **Flows** - 3 secuencias (Bienvenida/Nurturing/Winback) para Email y WhatsApp
9. **Experiments** - Plan de tests A/B con hipótesis, variaciones, métricas, duración
10. **Measurement & UTMs** - KPIs por fase, eventos, nomenclatura, plantilla UTM, checklist de tracking
11. **Risks & Assumptions** - Supuestos, riesgos (impacto + probabilidad), mitigaciones, TBDs
12. **Execution Checklist** - 30-50 tareas en 6 fases con responsables, esfuerzo, dependencias, critical path

### Output Card Actions
Cada bloque incluye 4 acciones:
- **Copiar** → Clipboard
- **Editar** → Inline editor con Save/Cancel
- **Regenerar** → LLM regenera solo ese bloque
- **Guardar Versión** → Almacena versión con timestamp

### Variation Lab (Copy Testing)
- **15 variaciones** por campaña (3 por cada ángulo: beneficio, urgencia, autoridad, emoción, objeciones)
- **Etiquetas estratégicas**: Hook type, promesa, prueba, CTA, nivel de riesgo
- **Copy Scoring (0-100)**: Claridad (25), Especificidad (25), Diferenciación (20), Audiencia fit (20), Brand voice fit (10)
- **Filtros**: Por canal, objetivo, tono, score
- **Favoritos**: Guarda mejores variaciones

### War Room Chat
Chat con **comandos estratégicos**:
- `/mejora-hooks` → Regenera hooks más impactantes
- `/más-premium` → Sube sofisticación del copy
- `/b2b` → Adapta tono a audiencia B2B
- `/reduce-riesgo` → Suaviza claims dudosos
- `/regenera-bloque [nombre]` → Regenera bloque específico
- `/crea-landing` → Nueva versión de landing
- `/paid-pack` → Nuevo paid pack
- `/flow-email` → Nueva secuencia de email

## 🛠 Stack Tecnológico

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Componentes UI**: GitHub Spark + Radix UI
- **Styling**: Tailwind CSS 4
- **State Management**: TanStack React Query
- **Forms**: React Hook Form
- **Icons**: Phosphor Icons
- **API**: Octokit (GitHub API)

```
src/
├── components/
│   ├── BriefWizard.tsx           # Wizard multi-paso con scoring
│   ├── QuickQuestionsModal.tsx   # Modal de preguntas inteligentes
│   ├── BriefScoreCard.tsx        # Tarjeta de puntuación en tiempo real
│   ├── BrandKitEditor.tsx        # ✨ Editor de Brand Kit persistente
│   ├── BrandConsistencyEvaluator.tsx # ✨ Evaluador AI de consistencia
│   ├── ModularOutputsPanel.tsx
│   ├── VariationLab.tsx
│   ├── WarRoomChat.tsx
│   ├── Header.tsx
│   └── ui/                        # Componentes de UI reutilizables (shadcn)
├── hooks/
│   └── use-mobile.ts
├── lib/
│   ├── briefGapDetector.ts       # Lógica de detección de huecos
│   ├── types.ts                  # Tipos TypeScript (incluye BrandKit)
│   ├── i18n.ts                   # Traducciones ES/EN
│   └── utils.ts
├── styles/
│   └── theme.css
└── App.tsx
```

## 🎨 Brand Kit: Cómo Funciona

### 1. Configurar Tu Marca
Ve al tab **"Brand Kit"** y define:
- **Tono**: cercano, profesional, premium, canalla, o tech
- **Formalidad**: Slider de 1 (muy informal) a 5 (muy formal)
- **Emojis**: Activar/desactivar y elegir densidad (pocos/moderados/muchos)
- **Palabras Prohibidas**: Lista de términos a evitar (ej: barato, gratis, oferta)
- **Palabras Preferidas**: Vocabulario a priorizar (ej: transformar, innovar, excelencia)
- **Claims Permitidos**: Afirmaciones verificables aprobadas
- **Claims NO Permitidos**: Afirmaciones riesgosas o no verificables
- **Ejemplos YES**: 2-3 textos que SÍ suenan a tu marca
- **Ejemplos NO**: 2-3 textos que NO representan tu marca
- **CTA Preferido**: agenda-demo, compra, descarga, suscribete, o contacta

### 2. Generación Automática On-Brand
Todas las campañas generadas incluyen automáticamente:
- Tono y formalidad correctos
- Uso apropiado de emojis
- Vocabulario alineado con preferencias
- CTAs según tu configuración
- Respeto por claims permitidos/prohibidos

### 3. Evaluar Consistencia
En cada bloque generado (estrategia, email, landing, etc.):
1. Click en botón **"Evaluar Consistencia"**
2. AI analiza el contenido vs tu Brand Kit
3. Obtienes:
   - **Score 0-100** de consistencia
   - **Alineación de Tono** (%)
   - **Alineación de Formalidad** (%)
   - **Palabras prohibidas detectadas**
   - **Palabras preferidas usadas**
   - **Validación de uso de emojis**
   - **Issues detallados** con recomendaciones

## 🎯 Cómo Usar el Sistema de Preguntas Rápidas

1. **Completa el Brief**: Llena los campos del formulario en los 5 pasos
2. **Presiona "Generar Campaña"**: El sistema analiza automáticamente tu brief
3. **Responde las Preguntas**: Si detecta huecos críticos, aparecerá el modal con 3-6 preguntas
4. **Navegación Flexible**: Puedes ir atrás, omitir preguntas opcionales, o completar todo
5. **Generación Automática**: Al completar, las respuestas se integran y la campaña se genera

### Ejemplos de Triggers

- ❌ **Precio vacío** → "¿Cuál es el rango de precio?"
- ❌ **USP corto** → "Elige tu propuesta de valor" (4 opciones)
- ❌ **Sin prueba social** → "¿Qué evidencia tienes?" (multiselect)
- ❌ **Audiencia genérica** → "Define 1-2 segmentos prioritarios"
- ❌ **Google Ads sin presupuesto** → "¿Cuál es el presupuesto mínimo?"
- ❌ **Paid sin KPI** → "Objetivo principal: CPA, ROAS, CPL o CTR?"
- ❌ **Producto financiero** → "¿Qué claims están permitidos/prohibidos?"

## 💼 Ejemplo de Uso: Campaña Azure ARC

### Input (Brief)
```yaml
Producto: Azure ARC
Audiencia: CEOs, CTOs, Responsables de IT en empresas mid-market (100-500 empleados)
Objetivo: Implementación de Azure ARC en infraestructura On-Premise para aumentar ACR
Presupuesto: €3,000
Canales: Email, LinkedIn
```

### Output Esperado (Overview)

```
=== OVERVIEW EJECUTIVO ===

OBJETIVO: Generar 15 demos cualificadas con decisores IT en 60 días
KPI: CPL < €200, tasa de conversión demo → contrato > 25%

AUDIENCIA PRIMARIA: CTOs y Responsables de IT en empresas mid-market (100-500 empleados) 
con infraestructura híbrida (cloud + on-premise) que buscan simplificar gestión y reducir 
costos operativos.

PROPUESTA DE VALOR: Azure ARC permite gestionar servidores, Kubernetes y servicios de datos 
on-premise desde una única consola Azure, reduciendo complejidad operativa hasta 40% y costos 
de licenciamiento hasta 30%.

MENSAJE PRINCIPAL: "Unifica tu infraestructura híbrida sin migración completa: controla todo 
desde Azure, sin perder el control de tu on-premise."

RTBs:
1. Compatibilidad universal: Funciona con servidores Windows, Linux, VMware, cualquier cloud
2. Sin vendor lock-in: No obliga a migrar todo a Azure, respeta inversión actual
3. Adopción progresiva: Implementación por fases sin interrupción de servicio

CTA RECOMENDADO: "Agenda demo técnica personalizada"

QUÉ LANZAR PRIMERO:
1. Secuencia LinkedIn Ads (audiencia: CTOs con budget de IT confirmado) → Landing con caso de éxito
2. Email nurturing a base de contactos del webinar previo → Demo técnica 1-to-1
3. Contenido educativo LinkedIn: "3 señales de que necesitas Azure ARC" → Captación orgánica

ALERTAS:
TBDs:
- ⚠️ Precio exacto de Azure ARC por servidor
- ⚠️ Caso de éxito concreto con cliente real (cifras de ahorro, timeline de implementación)
- ⚠️ Garantía o trial period disponible?

RIESGOS:
- ⚠️ Presupuesto limitado (€3K): Priorizar LinkedIn orgánico + email sobre paid ads masivos
- ⚠️ Ciclo de venta largo en IT: Necesitarás contenido para nutrir leads durante 2-3 meses
- ⚠️ Decisión multi-stakeholder (CTO + CFO + CEO): Preparar argumentos de ROI financiero, no solo técnico
```

### Output (Paid Pack - Ejemplo de Hook)

```
HOOKS (10 variaciones):
1. "¿Gestionas servidores on-premise + Azure + AWS? Simplifica todo desde una consola."
2. "Cloud híbrido = gestión compleja. Azure ARC = control unificado."
3. "Migrar al 100% a cloud no es viable. Gestionar todo desde Azure, sí."
4. "Reduce 40% la complejidad operativa de tu infraestructura híbrida con Azure ARC."
5. "Sin vendor lock-in: Azure ARC funciona con VMware, Linux, cualquier cloud."
...

ÁNGULOS CREATIVOS:
1. BENEFICIO: "Reduce complejidad operativa hasta 40% gestionando on-premise desde Azure"
   Cuándo usar: Cuando la audiencia ya sabe que tiene un problema de complejidad
   Ejemplo: "3 consolas diferentes para gestionar tu infraestructura. Azure ARC: 1 sola."

2. URGENCIA: "Cada día de ineficiencia operativa cuesta €X en horas de tu equipo IT"
   Cuándo usar: Cuando quieres acelerar decisión y hay presión por costos
   Ejemplo: "Tu equipo IT pasa 15h/semana coordinando 3 plataformas. ¿Cuánto vale eso?"

3. AUTORIDAD: "Azure ARC es la solución oficial de Microsoft para cloud híbrido"
   Cuándo usar: Audiencia risk-averse que prioriza vendor confiable sobre innovación
   Ejemplo: "Microsoft diseñó Azure ARC específicamente para CTOs con infraestructura híbrida."
```

### Output (Content Calendar - Ejemplo de Pieza)

```
SEMANA 1 - DÍA 2
Canal: LinkedIn
Formato: Carrusel (5 slides)
Fase: Awareness
Objetivo: Educar sobre señales de que necesitan Azure ARC
CTA: "Descarga checklist completo"
Idea Visual: Ilustración de 3 pantallas de gestión vs 1 pantalla unificada
Copy Base:
  "3 señales de que necesitas Azure ARC:
  
  1️⃣ Tu equipo IT usa 3+ herramientas para gestionar infraestructura
  2️⃣ Tienes servidores on-premise que no migrarás pronto
  3️⃣ Quieres políticas de Azure en todo tu entorno (no solo cloud)
  
  Azure ARC unifica gestión de servidores, Kubernetes y datos on-premise 
  desde la consola de Azure. Sin migración completa.
  
  👉 Descarga checklist de evaluación gratuito"
KPI: Engagement rate > 5%, Click-to-landing > 2%
Categoría: Educación
```

> **💡 Nota**: Todo este output es específico, accionable y respeta el presupuesto y contexto del brief. No hay genericidad ni promesas sin prueba.

## 📋 Estructura del Proyecto

```

## 🎨 Diseño

- **Inspiración**: Paleta cyberpunk con acentos eléctricos sobre fondos oscuros
- **Colores Primarios**: Púrpura eléctrico y Rosa neón
- **Tipografía**: Space Grotesk para títulos, fuente monoespaciada para KPIs
- **Tema**: Glassmorphic panels, gradientes animados, efectos de refracción

## 🚀 Primeros Pasos

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build

# Preview de build
npm run preview
```

## 📄 Licencia

Los archivos y recursos de Spark Template de GitHub están licenciados bajo los términos de la licencia MIT, Copyright GitHub, Inc.
