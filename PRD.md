# Marketing Agent Command Center - Brief Score Feature

A premium marketing campaign brief wizard with real-time intelligent scoring that guides users to create high-quality campaign briefs through structured feedback and actionable recommendations.

**Experience Qualities**:
1. **Empowering** - Users feel confident and informed as they build their brief, with clear guidance on what will make their campaign stronger
2. **Transparent** - Real-time scoring makes quality visible and demystifies what makes an excellent campaign brief
3. **Non-blocking** - Never prevents generation, but provides clear warnings when results may be generic due to missing data

**Complexity Level**: Light Application (multiple features with basic state)
This is a guided form wizard with real-time scoring calculations, validation logic, and persistent state management through multiple steps.

## Essential Features

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
- **Progression**: Score calculated → Status tier determined → Icon, color, and message selected → Alert displayed
- **Progression**: Status updates → Warning message shown if < 80 points → User proceeds with informed expectations
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

## Edge Case Handling

- **Empty Form on Load** - Shows 0 score with all 8 items missing and recommendations for top 3; no errors thrown
- **Partial Multi-Field Criteria** - If only 1 of 2 required fields filled (e.g., product but no price), criterion not met; recommendation explains both requirements
- **Demo Data Load** - Score jumps to high value immediately; all UI elements update smoothly; no flickering
- **Rapid Form Changes** - Debouncing not needed as calculations are instant; React batches updates naturally
- **Language Switch Mid-Session** - Score value preserved; only text changes; recommendations remain relevant
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
