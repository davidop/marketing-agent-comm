# Marketing Agent Command Center

Un panel de control integral impulsado por IA para marketers que permite generar estrategias de campaña, variaciones de copia, calendarios de contenido e insights de KPI, con colaboración en tiempo real a través de una interfaz de chat integrada.

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

### Strategy Output Panel
- Muestra estrategia de marketing generada por IA
- Incluye recomendaciones clave, enfoque del público objetivo, estrategia de canales y asignación de presupuesto

### A/B Copy Variations
- Genera dos variaciones de copia para pruebas comparativas
- Presenta versión A vs Versión B lado a lado
- Ayuda a marketers a probar diferentes enfoques de mensajería

### Content Calendar
- Calendario de contenido generado por IA
- Planificación de publicaciones por canal

### Live Chat Interface
- Chat en tiempo real con agente de IA
- Historial de conversación persistente
- Indicadores de estado en vivo

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
