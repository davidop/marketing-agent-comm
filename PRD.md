# Planning Guide

A comprehensive Marketing Agent Command Center that empowers marketers to generate AI-powered campaign strategies, copy variations, content calendars, and KPI insights while collaborating with a live AI agent through an integrated chat interface.

**Experience Qualities**:
1. **Futuristic** - Glassmorphism and neon accents create a cutting-edge tech environment that feels like commanding a digital mission control
2. **Fluid** - Smooth micro-interactions and subtle animations make every action feel responsive and natural
3. **Empowering** - Clear visual hierarchy and organized panels give users complete oversight of their marketing operations

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
This is a multi-panel dashboard with real-time AI generation, persistent chat history, live status indicators, theme switching, and coordinated data flow between multiple interactive sections.

## Essential Features

### Campaign Brief Form
- **Functionality**: Collects campaign parameters (product, audience, goals, budget, channels)
- **Purpose**: Provides context for AI to generate relevant marketing materials
- **Trigger**: User fills form fields and clicks "Generate Campaign"
- **Progression**: Empty form → User input → Validation → Submit → Loading state → Results populate output panels
- **Success criteria**: Form validates all required fields, submits data, triggers AI generation, and shows loading feedback

### Strategy Output Panel
- **Functionality**: Displays AI-generated marketing strategy with key recommendations
- **Purpose**: Provides strategic direction for the campaign
- **Trigger**: Campaign brief submission
- **Progression**: Empty state → Loading skeleton → Strategy text with sections (Overview, Target Approach, Channel Strategy, Budget Allocation)
- **Success criteria**: Shows structured strategy content with clear sections and actionable insights

### A/B Copy Variations
- **Functionality**: Generates two copy variations for comparison and testing
- **Purpose**: Offers marketers options to test different messaging approaches
- **Trigger**: Campaign brief submission
- **Progression**: Empty state → Loading → Two side-by-side copy variants with headlines and body text
- **Success criteria**: Displays distinct copy variations with clear labeling (Version A / Version B)

### Content Calendar
- **Functionality**: Creates a time-based posting schedule across channels
- **Purpose**: Organizes campaign execution timeline
- **Trigger**: Campaign brief submission
- **Progression**: Empty state → Loading → Calendar grid with dates, channels, and content types
- **Success criteria**: Shows structured calendar with dates, platforms, and content descriptions

### KPI Insights Panel
- **Functionality**: Recommends key metrics and success indicators
- **Purpose**: Defines measurement framework for campaign success
- **Trigger**: Campaign brief submission
- **Progression**: Empty state → Loading → List of KPIs with descriptions and target ranges
- **Success criteria**: Displays relevant metrics with clear explanations and benchmarks

### Live Agent Chat
- **Functionality**: Real-time conversational interface with AI marketing assistant
- **Purpose**: Allows users to refine outputs, ask questions, and iterate on ideas
- **Trigger**: User types message and sends
- **Progression**: User types → Sends message → Message appears in chat → AI typing indicator → Response appears → Scroll to bottom
- **Success criteria**: Messages persist, scroll behavior works smoothly, typing indicators show, responses are contextual

### Dark Mode Toggle
- **Functionality**: Switches between light and dark themes
- **Purpose**: Reduces eye strain and provides user preference
- **Trigger**: Click toggle switch in header
- **Progression**: Current theme → Toggle click → Smooth transition → New theme applied → Preference saved
- **Success criteria**: Theme persists across sessions, transitions smoothly, all components adapt properly

### Connection Status Indicator
- **Functionality**: Shows system connectivity state
- **Purpose**: Provides feedback on AI service availability
- **Trigger**: App initialization and periodic checks
- **Progression**: Loading → Connected (green pulse) or Disconnected (red) → Updates automatically
- **Success criteria**: Status reflects actual state, updates in real-time, has visual distinction

## Edge Case Handling

- **Empty Form Submission**: Display validation errors with specific field requirements highlighted
- **Long AI Response Times**: Show persistent loading skeletons with progress indicators, allow cancellation
- **Very Long Chat History**: Implement virtual scrolling or pagination to maintain performance
- **Network Failures**: Show retry buttons and cached data when available
- **Incomplete Generation**: Display partial results with indicators for missing sections
- **Rapid Form Submissions**: Debounce or disable submit during active generation
- **Mobile Narrow Screens**: Stack three-column layout vertically with expandable sections

## Design Direction

The design should evoke a high-tech command center with glassmorphic panels floating over animated nebula-like gradients, accented by subtle neon glows that pulse with activity, creating an environment that feels both sophisticated and energizing.

## Color Selection

A cyberpunk-inspired palette with electric accents over deep backgrounds.

- **Primary Color**: Electric Purple (oklch(0.58 0.25 295)) - Represents AI intelligence and creative energy, used for primary actions and active states
- **Secondary Colors**: 
  - Deep Indigo Background (oklch(0.12 0.05 270)) - Creates depth and sophistication
  - Cyan Accent (oklch(0.75 0.15 195)) - Highlights success states and connectivity
- **Accent Color**: Neon Pink (oklch(0.68 0.24 340)) - Draws attention to CTAs and important notifications
- **Foreground/Background Pairings**:
  - Primary Purple (oklch(0.58 0.25 295)): White text (oklch(0.98 0 0)) - Ratio 5.2:1 ✓
  - Deep Indigo (oklch(0.12 0.05 270)): Light text (oklch(0.90 0.05 270)) - Ratio 12.8:1 ✓
  - Cyan Accent (oklch(0.75 0.15 195)): Dark text (oklch(0.15 0.05 270)) - Ratio 10.5:1 ✓
  - Neon Pink (oklch(0.68 0.24 340)): White text (oklch(0.98 0 0)) - Ratio 5.8:1 ✓
  - Glass Panels (oklch(0.95 0 0 / 0.08)): Dark text for light mode (oklch(0.15 0.02 270)) - Ratio 11.2:1 ✓
  - Glass Panels Dark (oklch(0.2 0.05 270 / 0.4)): Light text (oklch(0.90 0.05 270)) - Ratio 8.5:1 ✓

## Font Selection

Typography should feel clean, technical, and distinctly modern - evoking precision instrumentation while remaining highly readable for extended dashboard use.

- **Typographic Hierarchy**:
  - H1 (Page Title): Space Grotesk Bold / 32px / -0.02em letter-spacing / uppercase
  - H2 (Panel Headers): Space Grotesk SemiBold / 20px / -0.01em letter-spacing
  - H3 (Section Labels): Space Grotesk Medium / 16px / normal letter-spacing
  - Body Text (Outputs): Inter Regular / 15px / 1.6 line-height
  - Small Text (Labels): Inter Medium / 13px / 0.01em letter-spacing / uppercase
  - Chat Messages: Inter Regular / 14px / 1.5 line-height
  - Monospace (KPIs): JetBrains Mono Regular / 14px / for numeric data

## Animations

Animations should emphasize the "living system" quality of the command center - status pulses, gradient flows, and glass refraction effects create ambient activity, while micro-interactions on buttons and cards provide crisp, immediate feedback.

- Ambient background gradient shift (20-second loop, subtle color morphing)
- Pulse animation on connection status indicator (2-second rhythm)
- Glass refraction effect on hover (subtle border luminosity increase)
- Smooth panel transitions when outputs populate (300ms ease-out with slight scale)
- Typing indicator bounce (three dots, staggered 150ms delays)
- Message send animation (slide up with fade, 200ms)
- Button press feedback (scale 0.98, 100ms)
- Toggle switch slide (250ms with spring physics)

## Component Selection

- **Components**:
  - Input, Textarea, Label (Form fields in Campaign Brief)
  - Button (Primary actions, send chat, generate campaign)
  - Card (Glassmorphic panels for all major sections)
  - Switch (Dark mode toggle)
  - Badge (Status indicator, channel tags)
  - ScrollArea (Chat message container, long outputs)
  - Skeleton (Loading states for outputs)
  - Tabs (Switching between output types if needed)
  - Separator (Dividing sections within panels)

- **Customizations**:
  - Custom glassmorphic Card with backdrop-blur-xl and translucent borders with neon glow
  - Custom pulse Badge for connection status with animated ring
  - Custom chat bubble components with distinct user/agent styling
  - Custom gradient background component with animated mesh gradient
  - Custom neon-glow utility classes for borders and shadows

- **States**:
  - Buttons: Default (neon glow), Hover (increased glow + scale), Active (pressed scale), Disabled (desaturated + no glow), Loading (pulse animation)
  - Inputs: Default (subtle border), Focus (neon border glow), Error (red glow), Filled (increased opacity)
  - Cards: Default (glass), Hover (increased border luminosity), Active (stronger backdrop blur)
  - Status Badge: Connected (green pulse), Disconnected (red steady), Loading (yellow pulse)

- **Icon Selection**:
  - Sparkle (AI generation indicator)
  - ChartBar (Strategy output)
  - ChatCircle (Live chat)
  - Calendar (Content calendar)
  - TrendUp (KPI insights)
  - PaperPlaneRight (Send message)
  - Lightning (Campaign brief submit)
  - Moon/Sun (Theme toggle)
  - WifiHigh/WifiSlash (Connection status)

- **Spacing**:
  - Section gaps: gap-6 (24px between major panels)
  - Card padding: p-6 (24px internal padding)
  - Form field spacing: space-y-4 (16px between fields)
  - Chat message spacing: space-y-3 (12px between messages)
  - Header padding: px-6 py-4 (24px horizontal, 16px vertical)
  - Button padding: px-6 py-3 (24px horizontal, 12px vertical)

- **Mobile**:
  - Stack three columns vertically on screens < 1024px
  - Campaign Brief becomes collapsible accordion at top
  - Outputs stack in order: Strategy → Copy → Calendar → KPIs
  - Chat becomes bottom sheet or full-screen modal
  - Header remains fixed with compact status indicator
  - Reduce card padding to p-4
  - Font sizes reduce by 1-2px for body text
  - Touch targets minimum 44px height
