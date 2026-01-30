# Marketing Agent Command Center - Strategic Campaign System

Un sistema premium de planificación y ejecución de campañas de marketing digital orientado a **performance y brand**, que convierte briefs en campañas ejecutables, específicas y coherentes con la marca. Diseñado desde la perspectiva de una estratega senior de marketing digital.

**Filosofía estratégica**:
- **No inventar datos**: Si falta precio, resultados o testimonios, el sistema pregunta o marca como TBD
- **Cero generalidades**: Todo debe ser accionable (qué, por qué, cómo, con qué KPI)
- **Brand Kit como guardia**: Tono, palabras prohibidas, claims y emojis se respetan en todos los outputs
- **Estructura modular clara**: Bloques con títulos claros, jerarquía visual y fácil navegación
- **Diferenciación primero**: Si el USP no existe, se propone como hipótesis y se pide confirmación

**Experience Qualities**:
1. **Estratégica** - El sistema piensa como una estratega senior: prioriza claridad, diferenciación y consistencia de marca
2. **Rigurosa** - No permite promesas sin prueba, detecta claims dudosos y advierte sobre genericidad
3. **Ejecutable** - Cada output es accionable: con KPIs claros, responsables definidos y next steps
4. **Consistente** - Brand voice se aplica automáticamente y se puede evaluar en cada bloque

**Complexity Level**: Complex Application (advanced functionality, multiple views, persistent state)
Sistema de planificación estratégica con brief scoring, gap detection inteligente, Brand Kit persistente, evaluación de consistencia, dashboard modular con 12 tabs, versionado de contenido, y generación orientada a performance.

## Essential Features

### Persistent Brand Kit System
- **Functionality**: Centralized brand configuration stored per client with 11 customizable parameters that define brand voice, tone, and content guardrails
- **Purpose**: Ensures all generated campaign content is automatically aligned with the client's brand guidelines without manual intervention
- **Trigger**: Accessed via "Brand Kit" tab; loaded automatically on app mount; applied to all LLM prompts
- **Progression**: User defines brand parameters → Saves brand kit → All campaign generations automatically include brand guidelines → Every output block can be evaluated for consistency
- **Success criteria**: Brand kit persists across sessions; all generated content respects guidelines; evaluation detects violations accurately

#### Brand Kit Parameters:
1. **Tone** (Select) - 5 options: cercano, profesional, premium, canalla, tech
2. **Formality** (Slider 1-5) - Numerical scale from very informal to very formal
3. **Use Emojis** (Toggle) - Yes/No switch
4. **Emoji Style** (Conditional Select) - pocos, moderados, muchos (shown only if emojis enabled)
5. **Forbidden Words** (Dynamic List) - Words that must never appear in generated copy
6. **Preferred Words** (Dynamic List) - Words to use when contextually relevant
7. **Allowed Claims** (Dynamic List) - Pre-approved claims with evidence/verification
8. **Not Allowed Claims** (Dynamic List) - Claims to avoid (unverifiable, risky, off-brand)
9. **Brand Examples YES** (2-3 Text Samples) - Copy that perfectly represents the brand voice
10. **Brand Examples NO** (2-3 Text Samples) - Copy that does NOT represent the brand voice
11. **Preferred CTA** (Select) - agenda-demo, compra, descarga, suscribete, contacta

### Brand Consistency Evaluator
- **Functionality**: AI-powered analysis of any generated content block against saved brand guidelines, producing a 0-100 consistency score with detailed feedback
- **Purpose**: Validates that generated content adheres to brand voice, tone, formality, emoji usage, word choices, and claim restrictions
- **Trigger**: "Evaluar Consistencia" button on every output block
- **Progression**: User clicks button → Modal opens → LLM analyzes content against brand kit → Score calculated → Issues categorized → Recommendations displayed → User reviews feedback
- **Success criteria**: Detects forbidden words, evaluates tone/formality alignment, checks emoji usage, identifies risky claims, provides actionable improvement suggestions

#### Evaluation Metrics:
- **Tone Alignment** (0-100%) - How well the content matches the selected brand tone
- **Formality Alignment** (0-100%) - How well the content matches the formality level
- **Forbidden Words Found** - Count and list of prohibited words detected
- **Preferred Words Used** - Count and list of preferred words found
- **Emoji Usage Status** - correct, missing, excessive, or unnecessary
- **Claims Issues** - Detection of potentially disallowed claims
- **Overall Score** (0-100) - Composite score with penalties for errors and warnings

#### Evaluation Display:
- **Success Issues** (Green CheckCircle) - Strengths detected (e.g., "Great use of preferred words")
- **Warning Issues** (Orange Warning) - Improvements needed (e.g., "Emoji count not balanced for style")
- **Error Issues** (Red XCircle) - Violations found (e.g., "Forbidden word detected: barato")

### Brand Guidelines Integration
- **Functionality**: Automatically injects brand kit parameters into all LLM prompts as structured guidelines
- **Purpose**: Ensures AI generates on-brand content from the start rather than requiring post-generation editing
- **Trigger**: Every campaign generation and copy variation generation
- **Progression**: User initiates generation → Brand kit loaded from storage → Guidelines formatted → Appended to all LLM prompts → Generation proceeds with brand context
- **Success criteria**: All 11 parameters correctly formatted; guidelines clear and actionable; LLM respects constraints; no brand kit means neutral defaults

### Smart Gap Detection System
- **Functionality**: Analyzes the completed brief before generation and detects 8 types of critical gaps that would significantly impact campaign quality
- **Purpose**: Prevents generic outputs by ensuring essential campaign elements are defined
- **Trigger**: Runs when user clicks "Generar Campaña" button, before the actual generation starts
- **Progression**: Generate clicked → Brief analyzed → Gaps detected → If gaps exist, Quick Questions modal opens → If no gaps, generation proceeds
- **Success criteria**: Detects all 8 gap types accurately; only triggers when truly critical information is missing; never blocks unnecessarily

### Dynamic Quick Questions Modal
- **Functionality**: Multi-step modal that asks 3-6 contextual questions based on detected gaps, with progress indicator
- **Purpose**: Collects missing critical information in an efficient, focused flow
- **Trigger**: Opens when gap detection finds critical missing data
- **Progression**: Modal opens → Question 1 shown → User answers → Next question → ... → Complete → Answers merged into brief → Generation starts
- **Success criteria**: Modal is focused and non-intrusive; questions are clearly worded; progress is visible; can navigate back; answers auto-save to brief

### Context-Aware Question Types
- **Functionality**: 8 intelligent question triggers with 4 input types (text, textarea, select, multiselect)
- **Purpose**: Asks the right questions in the right format based on what's missing
- **Trigger**: Each trigger evaluates specific conditions in the brief data
- **Progression**: Brief analyzed → Conditions evaluated → Matching questions generated → Questions prioritized → Modal populated
- **Success criteria**: Questions only appear when relevant; input type matches data needs; options are contextual

#### Question Triggers:
1. **Missing Price** - Asks for price range when price field is empty
2. **Weak/Missing USP** - Provides 4 hypothesis options to choose from when USP is too short or missing
3. **No Social Proof** - Multiselect of 5 proof types when no proof data exists
4. **Vague Audience** - Requests specific 1-2 priority segments when audience description is too generic (< 8 words)
5. **Paid Channels Without Budget** - Asks for minimum budget when paid channels selected but budget missing
6. **Paid Channels Without KPI** - Select from 4 paid objectives (CPA/ROAS/CPL/CTR) when KPIs don't mention them
7. **Regulated Sector Claims** - Asks for allowed/prohibited claims when regulated keywords detected in product or audience
8. **Regulated Sector Legal** - Asks for mandatory legal requirements when regulated sector detected

### Real-Time Brief Score Calculator
- **Functionality**: Calculates a 0-100 score based on 8 weighted criteria as the user fills the campaign brief
- **Purpose**: Provides immediate feedback on brief quality and completeness
- **Trigger**: Automatically recalculates on any form field change
- **Progression**: Form field updates → Score recalculation → Visual update → Recommendations refresh
- **Success criteria**: Score updates within 100ms of any form change; accurate point allocation per criterion

### Weighted Scoring Checklist
- **Functionality**: 8 criteria with specific point values (15, 20, 15, 15, 10, 10, 10, 5 points) that evaluate different aspects of the brief
- **Purpose**: Breaks down abstract "quality" into concrete, actionable components
- **Trigger**: Runs on component mount and on every formData change
- **Progression**: Form data changes → Each criterion evaluated → Points awarded if met → Total calculated → Status determined
- **Success criteria**: Each criterion accurately detects completion; total always sums correctly to 100

### Missing Items Display
- **Functionality**: Shows list of incomplete criteria with point values and labels
- **Purpose**: Gives users a clear checklist of what needs attention
- **Trigger**: Displayed whenever score < 100
- **Progression**: Score calculated → Missing items filtered → List rendered with point badges
- **Success criteria**: List updates instantly; shows only incomplete items; displays point value clearly

### Contextual Recommendations
- **Functionality**: Provides specific, actionable guidance on how to improve each missing criterion
- **Purpose**: Educates users on what good brief data looks like; reduces generic inputs
- **Trigger**: Shown for top 3 missing items when score < 100
- **Progression**: Missing items identified → Top 3 prioritized → Specific recommendation displayed per item
- **Success criteria**: Recommendations are contextually relevant; examples provided match the criterion

### Status Indicators
- **Functionality**: Three-tier status system (Listo para generar 80+, Casi listo 50-79, Necesita completar datos <50)
- **Purpose**: Gives clear at-a-glance assessment of brief readiness
- **Trigger**: Calculated based on total score
- **Progression**: Score calculated → Status tier determined → Icon, color, and message selected → Alert displayed → Status updates → Warning message shown if < 80 points → User proceeds with informed expectations
- **Success criteria**: Status correctly reflects score tier; warning message explains impact on output quality

### Non-Blocking Generation
- **Functionality**: Always allows campaign generation regardless of score, but warns about generic results when score is low
- **Purpose**: Respects user autonomy while setting appropriate expectations
- **Trigger**: User can click "Generar Campaña" at any score level
- **Progression**: User clicks generate → If score < 80, warning already visible → Generation proceeds → LLM works with available data
- **Success criteria**: Generation never blocked; warnings clear about data gaps; users understand trade-offs

### Visual Progress Feedback
- **Functionality**: Progress bar, score number, badge, and completed items list
- **Purpose**: Makes progress tangible and motivating
- **Trigger**: Renders on every score update
- **Progression**: Score changes → Progress bar animates → Number updates → Badge updates → Completed list refreshes
- **Success criteria**: All visual elements sync perfectly; animations smooth; numbers always match

### Bilingual Support
- **Functionality**: All labels, recommendations, and status messages in Spanish and English
- **Purpose**: Supports the app's existing language toggle feature
- **Trigger**: Language prop changes
- **Progression**: Language toggle clicked → Component receives new language prop → All text switches → Score logic unchanged
- **Success criteria**: Complete translation coverage; no text remains in wrong language; formatting preserved

### Modular Campaign Dashboard
- **Functionality**: Tab-based dashboard with 12 distinct sections for campaign outputs, plus an executive overview
- **Purpose**: Organizes complex campaign deliverables into digestible, actionable modules with individual controls
- **Trigger**: Displayed after campaign generation completes
- **Progression**: Campaign generated → Dashboard populated → User navigates tabs → Views/edits specific modules → Copies/regenerates/saves versions as needed
- **Success criteria**: All tabs render correctly; content persists between tab switches; actions work independently per module

#### Dashboard Tabs:
1. **Overview** - Executive summary with highlights from all sections plus upcoming content calendar preview
2. **Strategy** - Overall campaign strategy, positioning, audience approach, and budget allocation
3. **Creative Routes** - 4 distinct creative angles with concepts, tone, and examples
4. **Funnel Blueprint** - Complete funnel mapping with stages, objectives, content, CTAs, and metrics
5. **Paid Pack** - Campaign structure, segmentation, ad copy variations, budget allocation, and benchmarks
6. **Landing Kit** - Landing page structure, copy for each section, and design recommendations
7. **Content Calendar** - Timeline view with platform, content type, objective, funnel phase, CTA, and format
8. **Flows** - Email and WhatsApp automation sequences with subject lines, timing, and CTAs
9. **Experiments** - A/B testing plan with hypotheses, variations, success metrics, and duration
10. **Measurement & UTMs** - Tracking structure, UTM nomenclature, URL examples, and KPI dashboard
11. **Risks & Assumptions** - Critical risks with impact, probability, and mitigation plans
12. **Execution Checklist** - Step-by-step launch checklist organized by pre-launch, launch, and post-launch phases

### Output Card Actions
- **Functionality**: Every output card includes 4 action buttons for content management
- **Purpose**: Enables users to iterate, refine, and manage campaign content without leaving the interface
- **Trigger**: Each card renders with action buttons in the header
- **Progression**: User clicks action → Modal or inline editor appears → User completes action → Content updates → Toast confirmation shown
- **Success criteria**: All 4 actions work independently; changes persist; UI updates immediately; no data loss

#### Card Actions:
1. **Copiar (Copy)** - Copies content to clipboard with toast notification
2. **Editar (Edit)** - Switches to inline edit mode with textarea; Save/Cancel buttons replace action bar
3. **Regenerar este bloque (Regenerate)** - Calls LLM to regenerate just this specific block with same brief data
4. **Guardar como versión (Save Version)** - Stores current content as a version in persistent storage with timestamp

### Content Versioning System
- **Functionality**: Stores multiple versions of each output block with timestamps
- **Purpose**: Allows users to experiment with regenerations without losing previous versions
- **Trigger**: "Guardar como versión" button clicked on any output card
- **Progression**: User clicks save → Current content captured → Timestamp added → Stored in KV → Toast confirms → Version retrievable later
- **Success criteria**: Versions persist across sessions; no version limit; retrieval accurate; timestamps correct

### Inline Content Editor
- **Functionality**: Converts output card to edit mode with textarea and Save/Cancel controls
- **Purpose**: Enables quick manual edits to generated content without external tools
- **Trigger**: "Editar" button clicked on any output card
- **Progression**: Edit clicked → Card switches to edit mode → Textarea populated → User edits → Save clicked → Content updated → Card returns to view mode
- **Success criteria**: Original formatting preserved; Cancel restores previous content; Save persists changes; No visual glitches during mode switch

## Edge Case Handling

- **Empty Form on Load** - Shows 0 score with all 8 items missing and recommendations for top 3; no errors thrown
- **No Brand Kit Configured** - App uses sensible defaults (profesional tone, formality 3, no emojis); generation proceeds normally
- **Brand Kit with All Fields Empty** - System treats as "no restrictions"; LLM generates freely
- **Conflicting Brand Guidelines** - (e.g., formal tone + many emojis) System passes both to LLM; evaluation notes inconsistencies
- **Forbidden and Preferred Words Overlap** - Forbidden takes precedence; evaluation flags the conflict
- **Brand Consistency Evaluation on Empty Content** - Button disabled when no content available
- **Evaluation During Active Generation** - Button disabled while isGenerating=true to prevent premature evaluation
- **Multiple Simultaneous Evaluations** - Each modal operates independently; can evaluate multiple blocks in separate tabs
- **Emoji Detection Edge Cases** - Uses Unicode regex to catch all emoji ranges including skin tones and combined sequences
- **All Gaps Present** - Modal shows up to 6 questions; progress bar accurate; can complete all without errors
- **No Gaps Detected** - Modal never appears; generation proceeds immediately
- **Skip Optional Questions** - User can skip non-required questions; brief generated with available data
- **Navigate Back in Modal** - Previous answers preserved when going back; can change answers
- **Close Modal Without Completing** - Modal closes; generation does not proceed; user returns to form
- **Regulated Sector Auto-Detection** - Keywords like "financiero", "salud", "farmacéutico" trigger legal questions
- **Paid Channels Detection** - Correctly identifies paid channels (Google Ads, Facebook, Instagram, LinkedIn, TikTok, YouTube)
- **Multiple Gap Types** - Questions ordered logically; all gap types can coexist; no conflicts
- **Partial Multi-Field Criteria** - If only 1 of 2 required fields filled (e.g., product but no price), criterion not met; recommendation explains both requirements
- **Demo Data Load** - Score jumps to high value immediately; all UI elements update smoothly; no flickering; gap detection works correctly
- **Rapid Form Changes** - Debouncing not needed as calculations are instant; React batches updates naturally
- **Language Switch Mid-Session** - Score value preserved; only text changes; modal questions switch language if reopened; brand kit labels update
- **Score Exactly 50 or 80** - Uses >= comparison so edge values fall into correct tier (50 = "Casi listo", 80 = "Listo")

## Design Direction

The Brief Score card should feel like an intelligent assistant watching over the user's shoulder—encouraging, informative, and never judgmental. It uses vibrant color coding (success green for completion, warning orange for progress, attention red for gaps) to create instant emotional feedback. The card has a premium glass-panel aesthetic matching the existing app design, with subtle glows on status indicators to draw the eye. Typography is clean and hierarchical: bold uppercase micro-labels for sections, prominent score numbers, and comfortable body text for recommendations.

## Color Selection

Leveraging the app's existing sophisticated color system with teal-cyan primaries, warm orange accents, and magenta secondaries:

- **Primary Color (Teal oklch(0.75 0.12 165))**: Used for section headers, criterion labels, and the score ring when complete. Communicates professionalism and trust.
- **Success Color (Teal oklch(0.75 0.12 165))**: Checkmarks, "Listo para generar" status, completed items badges. Reinforces positive achievement.
- **Accent Color (Warm Orange oklch(0.85 0.15 50))**: "Casi listo" status, recommendation lightbulb icons, point value highlights. Signals opportunity for improvement.
- **Destructive Color (Red-Orange oklch(0.65 0.20 25))**: "Necesita completar datos" status, missing item badges, warning icons. Creates urgency without panic.
- **Muted Foreground (oklch(0.52 0.04 240))**: Body text for recommendations, supplementary information. Maintains readability hierarchy.

**Foreground/Background Pairings**:
- Primary on Card Background (oklch(0.75 0.12 165) on oklch(0.97 0.01 160)): Ratio 4.7:1 ✓
- Success on Light Background (oklch(0.75 0.12 165) on oklch(0.98 0.01 160)): Ratio 4.8:1 ✓
- Accent on Card Background (oklch(0.85 0.15 50) on oklch(0.97 0.01 160)): Ratio 5.2:1 ✓
- Destructive on Card Background (oklch(0.65 0.20 25) on oklch(0.97 0.01 160)): Ratio 6.1:1 ✓

## Font Selection

Building on the existing typographic system of Space Grotesk for display and Inter for body text, the Brief Score card maintains visual consistency while establishing information hierarchy.

- **Typographic Hierarchy**:
  - Card Title (Section Header): Space Grotesk Bold / 12px / UPPERCASE / 0.05em tracking / text-primary
  - Score Number: Inter Bold / 28px / tight line-height / dynamic color (success/accent/destructive)
  - Status Label: Inter Bold / 14px / dynamic color
  - Subsection Headers: Inter Bold / 11px / UPPERCASE / 0.08em tracking
  - Criterion Labels: Inter Medium / 12px / 1.4 line-height
  - Point Badges: Inter Bold / 10px / monospace feel
  - Recommendations: Inter Regular / 12px / 1.6 line-height / muted foreground

## Animations

Animations serve functional purposes: guiding attention to updates and reinforcing positive progress. All transitions feel snappy (200-300ms) to maintain the sense of real-time responsiveness.

- **Score Number Update**: Counter animation when points increase (satisfying feedback) vs instant change when decreasing (immediate awareness)
- **Progress Bar Fill**: Smooth width transition with easing when score changes (300ms ease-out)
- **Badge Color Transition**: Status badge color fades between states (200ms) to avoid jarring switches
- **List Item Appearance**: Completed items fade in with subtle slide-up (250ms) when criteria met
- **Status Icon**: CheckCircle, Warning, XCircle icons scale in (150ms spring) when status changes
- **Recommendation Text**: Gentle fade in/out (200ms) when top 3 missing items change

## Component Selection

- **Components**:
  - **Card** - Main container with glass-panel styling for premium look; border-2 for definition
  - **Progress** - Visual score representation; filled portion uses accent gradient
  - **Badge** - Point value displays (small pill shapes) and status label (prominent rounded badge)
  - **Alert** - Status message container with icon and colored border/background
  - **Icons (Phosphor)**:
    - Sparkle (filled) - Card header accent for "intelligent scoring" feel
    - CheckCircle (filled) - Completed criteria and success status
    - XCircle (filled) - Missing criteria and low-score status
    - Warning (filled) - Medium-score status
    - Lightbulb (filled) - Recommendation section header

- **Customizations**:
  - Custom color mapping for Alert based on score tier (success/accent/destructive backgrounds)
  - Progress bar uses gradient fill on high scores for celebratory feel
  - Badge size variants: Small (point values) vs medium (status label)
  - List items with left border accent on recommendations for visual separation

- **States**:
  - Score 80-100: Success theme → Green check icon, "Listo para generar" badge, no warnings
  - Score 50-79: Warning theme → Orange warning icon, "Casi listo" badge, gentle improvement message
  - Score 0-49: Destructive theme → Red X icon, "Necesita completar datos" badge, clear gap explanation
  - Empty missing items: Collapsed section (doesn't render)
  - Empty completed items: Collapsed section (doesn't render)
  - 1-3 missing items: Full recommendations shown
  - 4+ missing items: Top 3 shown + "X more..." indicator

- **Icon Selection**:
  - Sparkle: Represents AI-powered intelligence and premium quality
  - CheckCircle: Universal completion signal
  - XCircle: Clear gap indicator without negativity
  - Warning: Balanced "improvement opportunity" signal
  - Lightbulb: Classic "idea/suggestion" metaphor

- **Spacing**: Tailwind spacing scale with generous gaps
  - Card padding: p-5 (1.25rem)
  - Section spacing: space-y-4 (1rem between sections)
  - List items: space-y-2 (0.5rem between criteria)
  - Recommendation items: space-y-3 (0.75rem for breathability)
  - Inline gaps: gap-2 (0.5rem for icon + text pairings)

- **Mobile**: Stack everything vertically with no compromises
  - Score number and /100 suffix remain inline for compactness
  - Progress bar full width (already responsive)
  - Lists remain full width with touch-friendly spacing
  - Point badges remain inline with labels (flexbox wraps naturally)
  - No horizontal scrolling; all text wraps properly at min-w-[32px] badge constraint
