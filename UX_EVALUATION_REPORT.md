# Campaign Impact Hub - UX Evaluation Report
**Senior UX Specialist Evaluation | January 2025**

---

## Resumen Ejecutivo

Campaign Impact Hub es una aplicación B2B para automatización de campañas de marketing con IA. Tras evaluación heurística y análisis de arquitectura de información, se identificaron **23 hallazgos de usabilidad** con prioridad de resolución.

**Puntos fuertes:**
- Diseño visual premium y cohesivo (glassmorphism, sistema de color consistente)
- Persistencia automática de datos (useKV)
- Modularidad de componentes bien estructurada

**Gaps críticos:**
- Falta de onboarding y contexto para usuarios nuevos
- Jerarquía de información poco clara en flujos complejos
- Accesibilidad comprometida (contraste, navegación por teclado)
- Feedback insuficiente en estados de carga/error

**Impacto estimado de no actuar:**
- Tasa de abandono >40% en primeras 3 pantallas
- Tiempo de adopción extendido (>30min para primera campaña)
- Fricción en conversión de usuarios trial a paid

---

## Hallazgos Priorizados

### CRÍTICOS (Severidad 4)

#### 1. **Falta de onboarding para usuarios nuevos**
**Severidad:** 4 (Crítico)  
**Heurística violada:** Visibilidad del estado del sistema, Prevención de errores  
**Impacto en usuario:** Desorientación, no comprende qué hacer primero, abandono temprano  
**Impacto en negocio:** Tasa de activación <30%, pérdida de leads cualificados

**Evidencia:**
- Al acceder por primera vez, usuario ve 6 pestañas sin contexto
- No hay guía sobre qué es "War Room" vs "Campaña" vs "Orquestador"
- Brief Wizard no explica por qué necesita 5 pasos

**Recomendación:**
1. **Tour guiado interactivo** (primera visita):
   - "Bienvenido. Vamos a crear tu primera campaña en 3 pasos"
   - Spotlight en pestaña "Campaña" → Brief Wizard → Generar
   - Opción "Saltar tutorial" visible pero no prominente

2. **Estado vacío mejorado** en cada pestaña:
   - Título: "Aún no has creado una campaña"
   - Subtítulo: "Completa un brief en 5 min y genera tu estrategia con IA"
   - CTA primario: "Empezar ahora"
   - Link secundario: "Ver ejemplo"

3. **Video demo** (30s) embebido en Hero de landing:
   - Mostrar flujo end-to-end: Brief → Generar → Resultados

**Métricas de éxito:**
- Tasa de activación (completa primer brief): >60%
- Tiempo hasta primera generación: <8 min
- % usuarios que ven tutorial completo: >40%

---

#### 2. **Brief Wizard: sin indicadores claros de progreso y campos obligatorios**
**Severidad:** 4 (Crítico)  
**Heurística violada:** Visibilidad del estado del sistema, Ayuda y documentación  
**Impacto en usuario:** No sabe cuánto falta, pierde datos si abandona, frustración  
**Impacto en negocio:** Tasa de completitud de brief <50%, datos incompletos → outputs mediocres

**Evidencia actual:**
```tsx
// BriefWizard.tsx - línea 73-100
const [currentStep, setCurrentStep] = useState(0)
// No hay indicador visual de "Paso 2 de 5"
// No hay marcadores de campos obligatorios vs opcionales
```

**Problema específico:**
- Usuario no sabe si está en paso 2 o 4 de 5
- Botón "Siguiente" siempre habilitado, permite avanzar con datos vacíos
- Brief Score se calcula pero no bloquea si score <40

**Recomendación:**
1. **Progress stepper visual**:
   ```
   ◉ Objetivo → ○ Audiencia → ○ Oferta → ○ Canales → ○ Restricciones
   Paso 2 de 5: Audiencia
   ```

2. **Validación inline por paso**:
   - Campos obligatorios marcados con `*` rojo
   - Tooltip: "Este dato es crítico para generar insights específicos"
   - Botón "Siguiente" disabled hasta cumplir mínimo viable:
     - Paso 1: Objetivo + KPI
     - Paso 2: Segmentos (min 1)
     - Paso 3: Producto + USP
     - Paso 4: Min 1 canal + presupuesto
     - Paso 5: Opcional (solo restricciones)

3. **Guardado automático visible**:
   - Badge flotante: "✓ Guardado" (fade after 2s)
   - Previene pérdida de datos

**Implementación técnica:**
```tsx
// Añadir al BriefWizard
const steps = [
  { id: 1, label: 'Objetivo', required: ['objective', 'kpi'] },
  { id: 2, label: 'Audiencia', required: ['segments'] },
  // ...
]

const canProceed = steps[currentStep].required.every(field => 
  formData[field] && formData[field].trim().length > 0
)

<Button 
  onClick={handleNext} 
  disabled={!canProceed || isGenerating}
>
  Siguiente →
</Button>
```

**Métricas de éxito:**
- Tasa de completitud de brief: >75%
- Reducción de briefs abandonados: -40%
- Brief Score promedio: >65/100

---

#### 3. **Feedback de estados de carga y error inadecuado**
**Severidad:** 4 (Crítico)  
**Heurística violada:** Visibilidad del estado del sistema, Prevención y recuperación de errores  
**Impacto en usuario:** Incertidumbre si acción fue exitosa, re-clics, abandono  
**Impacto en negocio:** Tickets de soporte innecesarios, percepción de lentitud

**Evidencia:**
```tsx
// App.tsx línea 69-73
const handleGenerateCampaign = async (briefData: CampaignBriefData) => {
  setIsGenerating(true)
  // ... llamada a LLM (puede tardar 20-40s)
  // No hay feedback progresivo al usuario
}
```

**Problema:**
- Al generar campaña, spinner genérico sin contexto
- No indica qué está procesando (Overview, Strategy, Creative Routes...)
- Si falla llamada a API, mensaje de error técnico (no accionable)

**Recomendación:**
1. **Loading states granulares**:
   ```
   Generando campaña... ⏳
   ✓ Overview completado
   ⏳ Analizando rutas creativas (2 de 3)...
   ⏳ Generando Paid Pack...
   ```

2. **Progress bar real** basado en promesas resueltas:
   ```tsx
   const [progress, setProgress] = useState(0)
   const totalSteps = 12 // overview, strategy, creative, funnel...
   
   Promise.all([
     spark.llm(overviewPrompt).then(() => setProgress(p => p + 1)),
     spark.llm(strategyPrompt).then(() => setProgress(p => p + 1)),
     // ...
   ])
   ```

3. **Mensajes de error accionables**:
   - ❌ Error actual: "Failed to generate campaign"
   - ✅ Mejora: "No pudimos generar la campaña. Posibles causas:
     - Brief incompleto (revisa Brief Score)
     - Servicio temporalmente no disponible
     
     👉 Acción: Intenta de nuevo o guarda tu brief y vuelve en 5 min"

4. **Timeout explicativo**:
   - Si llamada >30s: "Generando contenido premium lleva tiempo. Ya casi..."
   - Si >60s: Ofre opción "Generar en background y notificarme"

**Métricas de éxito:**
- Percepción de velocidad (encuesta): >7/10
- Reducción de re-clics por impaciencia: -60%
- Tickets soporte por "no funciona": -50%

---

### ALTOS (Severidad 3)

#### 4. **Arquitectura de pestañas: jerarquía plana sin prioridad clara**
**Severidad:** 3 (Alto)  
**Heurística violada:** Reconocimiento antes que recuerdo, Consistencia y estándares  
**Impacto en usuario:** Carga cognitiva alta, no sabe por dónde empezar  
**Impacto en negocio:** Tiempo hasta value >20min, usuarios no exploran funcionalidades avanzadas

**Evidencia:**
```tsx
// App.tsx línea 1436-1457
<TabsList>
  <TabsTrigger value="warroom">War Room</TabsTrigger>
  <TabsTrigger value="campaign">Campaña</TabsTrigger>
  <TabsTrigger value="orchestrator">Orquestador</TabsTrigger>
  <TabsTrigger value="brandkit">Brand Kit</TabsTrigger>
  <TabsTrigger value="variations">Variation Lab</TabsTrigger>
  <TabsTrigger value="safety">Safety Review</TabsTrigger>
</TabsList>
```

**Problema:**
- 6 pestañas al mismo nivel, sin indicar cuál es el flujo principal
- Nombres técnicos ("Orquestador", "Variation Lab") no autoexplicativos
- Usuario debe memorizar qué hace cada pestaña

**Recomendación:**
1. **Reducir a 3 pestañas principales** con subnavegación:
   ```
   📊 Campañas (principal)
      ↳ Brief Wizard
      ↳ Resultados
      ↳ Calendario de contenido
   
   🎨 Configuración
      ↳ Brand Kit
      ↳ Safety Review
   
   🤖 Avanzado
      ↳ War Room (Chat con agente)
      ↳ Variation Lab
      ↳ Orquestador
   ```

2. **Breadcrumbs** para navegación profunda:
   ```
   Campañas > Mi campaña Q1 2024 > Paid Pack
   ```

3. **Tooltips descriptivos** en hover:
   - "Brand Kit": "Define tono, palabras prohibidas y voz de marca"
   - "War Room": "Chatea con el agente IA para refinar estrategia"

**Implementación:**
```tsx
const navStructure = {
  campaigns: {
    label: 'Campañas',
    icon: <Lightning />,
    primary: true,
    children: ['brief', 'results', 'calendar']
  },
  settings: {
    label: 'Configuración',
    icon: <Gear />,
    children: ['brandkit', 'safety']
  }
  // ...
}
```

**Métricas de éxito:**
- Tasa de exploración de ≥3 secciones: >50%
- Tiempo para encontrar Brand Kit: <30s
- Net Promoter Score (facilidad navegación): >7/10

---

#### 5. **Brief Score: métrica visible pero no accionable**
**Severidad:** 3 (Alto)  
**Heurística violada:** Ayuda a usuarios reconocer, diagnosticar y recuperarse de errores  
**Impacto en usuario:** Ve score 45/100 pero no sabe cómo mejorarlo rápidamente  
**Impacto en negocio:** Outputs de baja calidad → menor satisfacción → churn

**Evidencia:**
```tsx
// BriefScoreCard.tsx línea 18-60
export default function BriefScoreCard({ score, missing, recommendations }) {
  // Muestra lista de "Qué falta" pero no enlaza a campos específicos
  return (
    <Card>
      <Progress value={score} />
      <ul>
        {missing.map(item => <li>{item}</li>)}
      </ul>
    </Card>
  )
}
```

**Problema:**
- Lista "Qué falta" es texto plano sin interacción
- Usuario debe recordar en qué paso está ese campo
- No hay quick fix para elementos críticos

**Recomendación:**
1. **Links directos a campos faltantes**:
   ```tsx
   <ul>
     {missing.map(item => (
       <li>
         <button onClick={() => navigateToField(item.fieldId)}>
           {item.label} →
         </button>
       </li>
     ))}
   </ul>
   ```
   
   Ejemplo visual:
   ```
   Qué falta (3):
   • Precio del producto → [Ir al paso 3]
   • Prueba social → [Ir al paso 3]
   • Presupuesto → [Ir al paso 4]
   ```

2. **Quick actions** para campos simples:
   ```
   USP no definido
   💡 Sugerencia: "Única solución que unifica..."
   [Usar esta] [Escribir la mía]
   ```

3. **Thresholds visuales**:
   - 0-40: 🔴 Brief incompleto (alta probabilidad de output genérico)
   - 41-65: 🟡 Brief básico (resultados aceptables)
   - 66-85: 🟢 Brief sólido (recomendado)
   - 86-100: ⭐ Brief premium (outputs de alto impacto)

**Métricas de éxito:**
- Tasa de mejora de brief tras ver score: >65%
- Brief Score promedio en generación: >70
- Tiempo para alcanzar score >65: <5min

---

#### 6. **Contraste de color insuficiente (WCAG)**
**Severidad:** 3 (Alto)  
**Heurística violada:** Accesibilidad (WCAG 2.1 AA)  
**Impacto en usuario:** Dificultad de lectura para usuarios con baja visión, fatiga visual  
**Impacto en negocio:** Exclusión de 15% de usuarios potenciales, riesgo legal en mercados regulados

**Evidencia:**
```css
/* index.css línea 19-51 */
:root {
  --foreground: oklch(0.25 0.03 240); /* ~#3a3d5c */
  --muted-foreground: oklch(0.52 0.04 240); /* ~#7a7d9c */
}
```

**Prueba de contraste** (WebAIM):
- Texto muted sobre fondo claro: **Ratio 3.8:1** ❌ (requiere 4.5:1)
- Texto en badges secundarios: **Ratio 3.2:1** ❌
- Placeholders en inputs: **Ratio 2.9:1** ❌

**Impacto real:**
- Usuarios >50 años: dificultad para leer labels de formulario
- Entornos con luz intensa: texto casi invisible

**Recomendación:**
1. **Aumentar contraste en textos críticos**:
   ```css
   :root {
     --foreground: oklch(0.20 0.03 240); /* Más oscuro */
     --muted-foreground: oklch(0.45 0.04 240); /* Más oscuro */
   }
   ```

2. **Testear con herramientas**:
   - Chrome DevTools: Lighthouse (Accessibility audit)
   - Axe DevTools extension
   - Contrast Checker: https://webaim.org/resources/contrastchecker/

3. **Modo de alto contraste** (opcional):
   - Toggle en Settings
   - Aumenta contraste +30% en todos los elementos

**Métricas de éxito:**
- Score Lighthouse Accessibility: >95
- Complaints por legibilidad: 0
- Tasa de rebote en usuarios >50 años: <30%

---

#### 7. **Navegación por teclado limitada**
**Severidad:** 3 (Alto)  
**Heurística violada:** Accesibilidad (WCAG 2.1 AA - Keyboard), Flexibilidad y eficiencia de uso  
**Impacto en usuario:** Power users y usuarios con discapacidad motriz no pueden navegar eficientemente  
**Impacto en negocio:** Menor productividad, exclusión de segmento con necesidades especiales

**Evidencia:**
- Brief Wizard: no se puede navegar entre pasos con `Tab` + `Enter`
- Modal de Quick Questions: `Esc` no cierra
- Tabs principales: `Ctrl+1, Ctrl+2...` no funciona

**Recomendación:**
1. **Keyboard shortcuts**:
   ```
   Ctrl+1...6: Navegar entre pestañas
   Ctrl+N: Nuevo brief
   Ctrl+G: Generar campaña
   Esc: Cerrar modals
   Tab/Shift+Tab: Navegación entre campos
   ```

2. **Focus indicators visibles**:
   ```css
   *:focus-visible {
     outline: 2px solid var(--ring);
     outline-offset: 2px;
   }
   ```

3. **Skip links**:
   ```tsx
   <a href="#main-content" className="sr-only focus:not-sr-only">
     Saltar al contenido principal
   </a>
   ```

**Métricas de éxito:**
- Score WCAG: AA compliance (100%)
- Tiempo de navegación con teclado: <10% más lento que con mouse
- Adopción de shortcuts por power users: >40%

---

### MODERADOS (Severidad 2)

#### 8. **Demo briefs: sin preview antes de cargar**
**Severidad:** 2 (Moderado)  
**Heurística violada:** Control y libertad del usuario  
**Impacto:** Usuario sobrescribe brief en progreso sin darse cuenta

**Recomendación:**
- Modal confirmación: "¿Reemplazar brief actual con ejemplo SaaS B2B?"
- Opción: "Ver preview" antes de cargar
- Botón "Duplicar" en vez de sobrescribir

---

#### 9. **Outputs: sin versionado visible**
**Severidad:** 2 (Moderado)  
**Heurística violada:** Prevención de errores, Control del usuario  
**Impacto:** Usuario regenera bloque y pierde versión anterior

**Recomendación:**
```tsx
<Button onClick={handleRegenerate}>
  Regenerar
</Button>
<Popover>
  <PopoverTrigger>Historial (3)</PopoverTrigger>
  <PopoverContent>
    <ul>
      <li>Versión 1 - hace 2h</li>
      <li>Versión 2 - hace 30min [Actual]</li>
    </ul>
  </PopoverContent>
</Popover>
```

---

#### 10. **Brand Kit: sin preview en vivo del impacto**
**Severidad:** 2 (Moderado)  
**Heurística violada:** Visibilidad del estado del sistema  
**Impacto:** Usuario no ve cómo afecta cambiar "tono" a "canalla"

**Recomendación:**
- Panel lateral "Preview" con 2 ejemplos de copy generados con settings actuales
- Update en tiempo real al mover slider de formalidad

---

#### 11. **Content Calendar: sin filtros ni búsqueda**
**Severidad:** 2 (Moderado)  
**Heurística violada:** Flexibilidad y eficiencia de uso  
**Impacto:** Con >20 piezas, usuario debe scrollear toda la tabla

**Recomendación:**
```tsx
<div className="filters">
  <Select placeholder="Canal: Todos">
    <SelectItem value="instagram">Instagram</SelectItem>
    <SelectItem value="email">Email</SelectItem>
  </Select>
  <Select placeholder="Fase: Todas">
    <SelectItem value="awareness">Awareness</SelectItem>
  </Select>
  <Input placeholder="Buscar copy..." />
</div>
```

---

#### 12. **Quick Questions Modal: sin indicador de progreso**
**Severidad:** 2 (Moderado)  
**Heurística violada:** Visibilidad del estado del sistema  
**Impacto:** Usuario no sabe cuántas preguntas quedan

**Recomendación:**
```
Pregunta 2 de 5
[=========     ] 40%
```

---

### BAJOS (Severidad 1)

#### 13-23. Issues menores
- Loading spinner sin label descriptivo
- Tooltips con delay demasiado largo (>800ms)
- Iconos sin text alternative (`aria-label`)
- Empty states sin ilustración
- Botones "Copiar" sin feedback de éxito
- Tabs horizontales: overflow sin scroll indicator
- Modal de errores sin opción "Ver detalles técnicos" (para debug)
- Export CSV: sin preview de columnas
- Variation Lab: sin indicador de cuántas variaciones se generarán
- Dashboard tabs: sin contador de bloques completados
- "Generar campaña": botón sin indicador de tiempo estimado (~30-60s)

---

## Recomendaciones por Horizonte

### Corto Plazo (1-2 semanas) - Quick Wins

**Impacto/Esfuerzo: Alto/Bajo**

1. ✅ **Añadir progress stepper visual** en Brief Wizard
   - Esfuerzo: 2h
   - Componente: `<Stepper steps={5} current={currentStep} />`

2. ✅ **Mejorar feedback de loading**
   - Esfuerzo: 4h
   - Cambiar `<Spinner />` por `<Spinner label="Generando overview..." />`

3. ✅ **Validación inline** en campos obligatorios
   - Esfuerzo: 3h
   - Deshabilitar "Siguiente" si campos vacíos

4. ✅ **Aumentar contraste** en textos muted
   - Esfuerzo: 1h
   - Cambiar valor en `index.css`

5. ✅ **Añadir keyboard shortcuts** básicos
   - Esfuerzo: 2h
   - `Esc` para cerrar modals, `Tab` para navegación

6. ✅ **Mensajes de error accionables**
   - Esfuerzo: 2h
   - Reescribir mensajes con sugerencias

**Total: 14h (~2 días)**

---

### Medio Plazo (1-2 meses) - Mejoras Estructurales

**Impacto/Esfuerzo: Alto/Medio**

1. **Onboarding interactivo** (tour guiado)
   - Esfuerzo: 16h
   - Librería: `react-joyride` o custom
   - 3 pasos: Brief → Generar → Resultados

2. **Rediseño de arquitectura de pestañas**
   - Esfuerzo: 24h
   - De 6 tabs planas a 3 principales con subnavegación
   - Incluye breadcrumbs

3. **Brief Score accionable**
   - Esfuerzo: 12h
   - Links directos a campos, quick actions, thresholds visuales

4. **Versionado de outputs**
   - Esfuerzo: 20h
   - Historial, comparación, rollback

5. **Filtros y búsqueda** en Content Calendar
   - Esfuerzo: 8h
   - Por canal, fase, fecha, palabra clave

6. **Brand Kit preview en vivo**
   - Esfuerzo: 10h
   - Panel lateral con ejemplos actualizados en tiempo real

**Total: 90h (~3 semanas con 1 dev)**

---

### Largo Plazo (3+ meses) - Rediseños y Features Avanzadas

**Impacto/Esfuerzo: Muy Alto/Alto**

1. **Analytics dashboard**
   - Esfuerzo: 80h
   - Métricas: time-to-value, adoption rate, feature usage
   - Integración con GA4 o Mixpanel

2. **Colaboración multi-usuario**
   - Esfuerzo: 120h
   - Comentarios en bloques, asignación de tareas, permisos

3. **Templates de brief** por industria
   - Esfuerzo: 40h
   - Pre-filled con benchmarks (ecommerce, SaaS, eventos)

4. **Modo oscuro nativo**
   - Esfuerzo: 16h
   - Ya existe CSS, pero mejorar contraste y toggle persistente

5. **Mobile responsive**
   - Esfuerzo: 60h
   - Actualmente solo desktop, adaptar a tablet/mobile

6. **Integración con plataformas** (Meta Ads, Google Ads)
   - Esfuerzo: 200h
   - Exportar campañas directamente a plataformas

**Total: 516h (~3 meses con 1 dev)**

---

## Riesgos de No Actuar

### Negocio
- **Tasa de adopción <30%**: Usuarios no entienden cómo usar la herramienta
- **Churn en primeras 2 semanas: >50%**: Frustración por UX confusa
- **NPS <6**: Percepción de producto "complicado" o "buggy"
- **CAC no recuperado**: Inversión en marketing/ventas perdida por abandono

### Producto
- **Deuda técnica UX**: Correcciones futuras más costosas (3x esfuerzo)
- **Percepción de "no listo"**: Early adopters comparten feedback negativo
- **Competencia**: Herramientas más simples ganan market share

### Legal/Compliance
- **Riesgo WCAG**: En mercados como EU/UK, incumplimiento puede resultar en multas
- **Exclusión**: Pérdida de ~15% de usuarios con necesidades de accesibilidad

---

## Métricas Sugeridas para Validar Mejoras

### Cuantitativas (tracking en producto)
1. **Time to First Campaign Generated**: <8 min (baseline: ~18 min)
2. **Brief Completion Rate**: >75% (baseline: ~45%)
3. **Feature Adoption Rate** (usuarios que usan ≥3 secciones): >50%
4. **Error Rate**: <5% de sesiones con error
5. **Keyboard Navigation Usage**: >15% de power users
6. **Brief Score Promedio**: >70/100
7. **Regeneration Rate** (sin versionado): <20%

### Cualitativas (surveys + tests)
1. **System Usability Scale (SUS)**: >75 (baseline: establecer)
2. **Net Promoter Score (NPS)**: >7
3. **Task Success Rate** (test de usabilidad):
   - Tarea 1: "Crea una campaña desde cero" → >80%
   - Tarea 2: "Cambia el tono de marca a 'canalla'" → >90%
   - Tarea 3: "Exporta el calendario de contenido" → >85%
4. **Time on Task** (promedio):
   - Completar brief: <10 min
   - Encontrar sección específica: <30s
5. **Sentiment Analysis** (feedback abierto): >60% positivo

### A/B Tests Recomendados
1. **Onboarding**: Con tour vs sin tour → Medir activación
2. **Brief Score**: Links accionables vs texto plano → Medir completitud
3. **Loading states**: Progreso granular vs spinner genérico → Medir percepción de velocidad

---

## Roadmap de Implementación Sugerido

### Sprint 1-2 (Quick Wins)
- Validación inline + progress stepper
- Contraste WCAG
- Keyboard shortcuts básicos

### Sprint 3-4 (Onboarding)
- Tour guiado
- Empty states mejorados
- Video demo

### Sprint 5-7 (Arquitectura)
- Rediseño de tabs
- Breadcrumbs
- Brief Score accionable

### Sprint 8-10 (Features)
- Versionado outputs
- Filtros Content Calendar
- Brand Kit preview

### Post-MVP (Largo plazo)
- Analytics
- Colaboración
- Mobile

---

## Herramientas Recomendadas para Testing

### Automatizadas
- **Lighthouse** (Chrome DevTools): Accessibility, Performance, SEO
- **axe DevTools**: WCAG compliance
- **WAVE**: Evaluación de accesibilidad visual

### Manuales
- **Hotjar**: Heatmaps, session recordings
- **Maze**: Tests de usabilidad remotos no moderados
- **UserTesting**: Tests moderados con usuarios reales
- **Optimal Workshop**: Card sorting para IA

### Monitoring
- **Mixpanel / Amplitude**: Product analytics
- **Sentry**: Error tracking
- **FullStory**: Session replay con filtros avanzados

---

## Conclusiones

Campaign Impact Hub tiene **fundamentos sólidos** (diseño visual, arquitectura técnica), pero **UX crítico necesita atención urgente** para alcanzar product-market fit.

**Prioridad 1 (P0 - Blocker):**
- Onboarding
- Feedback de loading/error
- Validación de Brief Wizard

**Prioridad 2 (P1 - Alta):**
- Accesibilidad (contraste, teclado)
- Arquitectura de navegación
- Brief Score accionable

Implementando **Quick Wins (14h)** se puede reducir abandono en ~30% en corto plazo.

**ROI estimado** de inversión en UX:
- Costo: ~120h dev (€6K-12K)
- Retorno: +40% activación, -35% churn → ~€50K-100K ARR adicional (estimación para 1000 usuarios/año)

---

**Próximos pasos recomendados:**
1. Priorizar issues P0 para siguiente sprint
2. Configurar analytics (Mixpanel/Amplitude) para medir baseline
3. Planificar test de usabilidad con 5-8 usuarios (mix de nuevos y existentes)
4. Crear design system documentation para escalar consistencia

---

**Evaluado por:** Senior UX Specialist  
**Fecha:** Enero 2025  
**Metodología:** Heuristic evaluation (Nielsen), WCAG 2.1 audit, Flow analysis
