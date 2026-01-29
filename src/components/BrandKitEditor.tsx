import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Palette, Plus, X, CheckCircle, XCircle, FloppyDisk } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { Language } from '@/lib/i18n'
import type { BrandKit } from '@/lib/types'

interface BrandKitEditorProps {
  language: Language
}

export function BrandKitEditor({ language }: BrandKitEditorProps) {
  const defaultBrandKit: BrandKit = {
    tone: 'profesional',
    formality: 3,
    useEmojis: false,
    emojiStyle: 'moderados',
    forbiddenWords: [],
    preferredWords: [],
    allowedClaims: [],
    notAllowedClaims: [],
    brandExamplesYes: [],
    brandExamplesNo: [],
    preferredCTA: 'contacta'
  }

  const [brandKit, setBrandKit] = useKV<BrandKit>('brand-kit-v2', defaultBrandKit)
  
  const [forbiddenInput, setForbiddenInput] = useState('')
  const [preferredInput, setPreferredInput] = useState('')
  const [allowedClaimInput, setAllowedClaimInput] = useState('')
  const [notAllowedClaimInput, setNotAllowedClaimInput] = useState('')
  const [exampleYesInput, setExampleYesInput] = useState('')
  const [exampleNoInput, setExampleNoInput] = useState('')

  const handleUpdate = <K extends keyof BrandKit>(field: K, value: BrandKit[K]) => {
    setBrandKit((current) => {
      const base = current || defaultBrandKit
      return {
        ...base,
        [field]: value
      }
    })
  }

  const addToList = <K extends keyof BrandKit>(
    field: K,
    value: string,
    setter: (v: string) => void
  ) => {
    if (!value.trim()) return
    setBrandKit((current) => {
      const base = current || defaultBrandKit
      const currentList = (base[field] as string[]) || []
      return {
        ...base,
        [field]: [...currentList, value.trim()] as BrandKit[K]
      }
    })
    setter('')
    toast.success(language === 'es' ? 'Agregado' : 'Added')
  }

  const removeFromList = <K extends keyof BrandKit>(field: K, index: number) => {
    setBrandKit((current) => {
      const base = current || defaultBrandKit
      const currentList = (base[field] as string[]) || []
      return {
        ...base,
        [field]: currentList.filter((_, i) => i !== index) as BrandKit[K]
      }
    })
  }

  const handleSave = () => {
    toast.success(language === 'es' ? '✅ Brand Kit guardado' : '✅ Brand Kit saved')
  }

  const kit = brandKit || defaultBrandKit

  return (
    <Card className="glass-panel p-6 border-2 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10">
            <Palette size={28} className="text-primary" weight="fill" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {language === 'es' ? 'Brand Kit' : 'Brand Kit'}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              {language === 'es' 
                ? 'Define el estilo y reglas de tu marca' 
                : 'Define your brand style and rules'}
            </p>
          </div>
        </div>
        <Button onClick={handleSave} className="rounded-xl gap-2">
          <FloppyDisk size={18} weight="fill" />
          {language === 'es' ? 'Guardar' : 'Save'}
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-240px)] pr-4">
        <div className="space-y-8">
          
          {/* Tone Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-bold text-primary">
              {language === 'es' ? '🎭 Tono de Marca' : '🎭 Brand Tone'}
            </Label>
            <Select 
              value={kit.tone} 
              onValueChange={(value: BrandKit['tone']) => handleUpdate('tone', value)}
            >
              <SelectTrigger className="glass-panel-hover border-2 rounded-xl h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cercano">
                  {language === 'es' ? '🤝 Cercano - Amigable y accesible' : '🤝 Approachable - Friendly and accessible'}
                </SelectItem>
                <SelectItem value="profesional">
                  {language === 'es' ? '💼 Profesional - Confiable y competente' : '💼 Professional - Reliable and competent'}
                </SelectItem>
                <SelectItem value="premium">
                  {language === 'es' ? '💎 Premium - Exclusivo y sofisticado' : '💎 Premium - Exclusive and sophisticated'}
                </SelectItem>
                <SelectItem value="canalla">
                  {language === 'es' ? '😎 Canalla - Atrevido y directo' : '😎 Bold - Daring and direct'}
                </SelectItem>
                <SelectItem value="tech">
                  {language === 'es' ? '🚀 Tech - Innovador y técnico' : '🚀 Tech - Innovative and technical'}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Formality Slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-bold text-primary">
                {language === 'es' ? '📊 Nivel de Formalidad' : '📊 Formality Level'}
              </Label>
              <Badge variant="outline" className="rounded-lg text-lg font-bold px-3">
                {kit.formality}/5
              </Badge>
            </div>
            <div className="space-y-2">
              <Slider
                value={[kit.formality]}
                onValueChange={(values) => handleUpdate('formality', values[0])}
                min={1}
                max={5}
                step={1}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{language === 'es' ? 'Muy informal' : 'Very informal'}</span>
                <span>{language === 'es' ? 'Muy formal' : 'Very formal'}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Emojis Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-bold text-primary">
                {language === 'es' ? '😊 Usar Emojis' : '😊 Use Emojis'}
              </Label>
              <Switch 
                checked={kit.useEmojis}
                onCheckedChange={(checked) => handleUpdate('useEmojis', checked)}
              />
            </div>
            
            {kit.useEmojis && (
              <div className="space-y-2 pl-4 border-l-2 border-primary/30">
                <Label className="text-xs font-semibold text-muted-foreground">
                  {language === 'es' ? 'Estilo de Emojis' : 'Emoji Style'}
                </Label>
                <Select 
                  value={kit.emojiStyle} 
                  onValueChange={(value: BrandKit['emojiStyle']) => handleUpdate('emojiStyle', value)}
                >
                  <SelectTrigger className="glass-panel-hover border-2 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pocos">
                      {language === 'es' ? '🎯 Pocos - Solo en puntos clave' : '🎯 Few - Only at key points'}
                    </SelectItem>
                    <SelectItem value="moderados">
                      {language === 'es' ? '✨ Moderados - Equilibrado' : '✨ Moderate - Balanced'}
                    </SelectItem>
                    <SelectItem value="muchos">
                      {language === 'es' ? '🎉 Muchos - Expresivo y dinámico' : '🎉 Many - Expressive and dynamic'}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <Separator />

          {/* Forbidden Words */}
          <div className="space-y-3">
            <Label className="text-sm font-bold text-destructive">
              {language === 'es' ? '🚫 Palabras Prohibidas' : '🚫 Forbidden Words'}
            </Label>
            <div className="flex gap-2">
              <Input
                value={forbiddenInput}
                onChange={(e) => setForbiddenInput(e.target.value)}
                placeholder={language === 'es' ? 'ej., barato, gratis, oferta...' : 'e.g., cheap, free, offer...'}
                className="glass-panel-hover border-2 rounded-xl"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addToList('forbiddenWords', forbiddenInput, setForbiddenInput)
                  }
                }}
              />
              <Button 
                type="button" 
                onClick={() => addToList('forbiddenWords', forbiddenInput, setForbiddenInput)} 
                variant="outline" 
                className="rounded-xl shrink-0"
              >
                <Plus size={18} weight="bold" />
              </Button>
            </div>
            {kit.forbiddenWords.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {kit.forbiddenWords.map((word, idx) => (
                  <Badge 
                    key={idx} 
                    variant="destructive" 
                    className="rounded-lg cursor-pointer gap-1"
                    onClick={() => removeFromList('forbiddenWords', idx)}
                  >
                    {word} <X size={14} weight="bold" />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Preferred Words */}
          <div className="space-y-3">
            <Label className="text-sm font-bold text-primary">
              {language === 'es' ? '⭐ Palabras Preferidas' : '⭐ Preferred Words'}
            </Label>
            <div className="flex gap-2">
              <Input
                value={preferredInput}
                onChange={(e) => setPreferredInput(e.target.value)}
                placeholder={language === 'es' ? 'ej., transformar, potenciar, innovar...' : 'e.g., transform, empower, innovate...'}
                className="glass-panel-hover border-2 rounded-xl"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addToList('preferredWords', preferredInput, setPreferredInput)
                  }
                }}
              />
              <Button 
                type="button" 
                onClick={() => addToList('preferredWords', preferredInput, setPreferredInput)} 
                variant="outline" 
                className="rounded-xl shrink-0"
              >
                <Plus size={18} weight="bold" />
              </Button>
            </div>
            {kit.preferredWords.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {kit.preferredWords.map((word, idx) => (
                  <Badge 
                    key={idx} 
                    variant="outline" 
                    className="rounded-lg cursor-pointer gap-1 border-primary text-primary"
                    onClick={() => removeFromList('preferredWords', idx)}
                  >
                    {word} <X size={14} weight="bold" />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Allowed Claims */}
          <div className="space-y-3">
            <Label className="text-sm font-bold text-primary flex items-center gap-2">
              <CheckCircle size={18} weight="fill" />
              {language === 'es' ? 'Claims Permitidos' : 'Allowed Claims'}
            </Label>
            <div className="flex gap-2">
              <Textarea
                value={allowedClaimInput}
                onChange={(e) => setAllowedClaimInput(e.target.value)}
                placeholder={language === 'es' ? 'ej., #1 en satisfacción de clientes según Forbes 2024' : 'e.g., #1 in customer satisfaction per Forbes 2024'}
                className="glass-panel-hover border-2 rounded-xl min-h-[60px]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    e.preventDefault()
                    addToList('allowedClaims', allowedClaimInput, setAllowedClaimInput)
                  }
                }}
              />
              <Button 
                type="button" 
                onClick={() => addToList('allowedClaims', allowedClaimInput, setAllowedClaimInput)} 
                variant="outline" 
                className="rounded-xl shrink-0"
              >
                <Plus size={18} weight="bold" />
              </Button>
            </div>
            {kit.allowedClaims.length > 0 && (
              <div className="space-y-2">
                {kit.allowedClaims.map((claim, idx) => (
                  <div 
                    key={idx} 
                    className="glass-panel p-3 rounded-xl border-2 border-primary/30 relative group"
                  >
                    <p className="text-sm pr-8">{claim}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeFromList('allowedClaims', idx)}
                    >
                      <X size={16} weight="bold" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Not Allowed Claims */}
          <div className="space-y-3">
            <Label className="text-sm font-bold text-destructive flex items-center gap-2">
              <XCircle size={18} weight="fill" />
              {language === 'es' ? 'Claims NO Permitidos' : 'NOT Allowed Claims'}
            </Label>
            <div className="flex gap-2">
              <Textarea
                value={notAllowedClaimInput}
                onChange={(e) => setNotAllowedClaimInput(e.target.value)}
                placeholder={language === 'es' ? 'ej., Duplica tus ventas en 7 días (no verificable)' : 'e.g., Double your sales in 7 days (not verifiable)'}
                className="glass-panel-hover border-2 rounded-xl min-h-[60px]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    e.preventDefault()
                    addToList('notAllowedClaims', notAllowedClaimInput, setNotAllowedClaimInput)
                  }
                }}
              />
              <Button 
                type="button" 
                onClick={() => addToList('notAllowedClaims', notAllowedClaimInput, setNotAllowedClaimInput)} 
                variant="outline" 
                className="rounded-xl shrink-0"
              >
                <Plus size={18} weight="bold" />
              </Button>
            </div>
            {kit.notAllowedClaims.length > 0 && (
              <div className="space-y-2">
                {kit.notAllowedClaims.map((claim, idx) => (
                  <div 
                    key={idx} 
                    className="glass-panel p-3 rounded-xl border-2 border-destructive/30 relative group"
                  >
                    <p className="text-sm pr-8">{claim}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeFromList('notAllowedClaims', idx)}
                    >
                      <X size={16} weight="bold" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Brand Examples YES */}
          <div className="space-y-3">
            <Label className="text-sm font-bold text-primary flex items-center gap-2">
              <CheckCircle size={18} weight="fill" />
              {language === 'es' ? 'Ejemplos: "SÍ suena a mi marca"' : 'Examples: "YES sounds like my brand"'}
            </Label>
            <p className="text-xs text-muted-foreground">
              {language === 'es' 
                ? 'Proporciona 2-3 ejemplos de copy que represente perfectamente tu marca' 
                : 'Provide 2-3 examples of copy that perfectly represents your brand'}
            </p>
            <div className="flex gap-2">
              <Textarea
                value={exampleYesInput}
                onChange={(e) => setExampleYesInput(e.target.value)}
                placeholder={language === 'es' ? 'ej., "Transforma tu estrategia en 90 días con resultados medibles"' : 'e.g., "Transform your strategy in 90 days with measurable results"'}
                className="glass-panel-hover border-2 rounded-xl min-h-[80px]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    e.preventDefault()
                    addToList('brandExamplesYes', exampleYesInput, setExampleYesInput)
                  }
                }}
              />
              <Button 
                type="button" 
                onClick={() => addToList('brandExamplesYes', exampleYesInput, setExampleYesInput)} 
                variant="outline" 
                className="rounded-xl shrink-0"
              >
                <Plus size={18} weight="bold" />
              </Button>
            </div>
            {kit.brandExamplesYes.length > 0 && (
              <div className="space-y-2">
                {kit.brandExamplesYes.map((example, idx) => (
                  <div 
                    key={idx} 
                    className="glass-panel p-4 rounded-xl border-2 border-primary/40 relative group bg-primary/5"
                  >
                    <p className="text-sm font-medium pr-8 leading-relaxed">{example}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeFromList('brandExamplesYes', idx)}
                    >
                      <X size={16} weight="bold" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Brand Examples NO */}
          <div className="space-y-3">
            <Label className="text-sm font-bold text-destructive flex items-center gap-2">
              <XCircle size={18} weight="fill" />
              {language === 'es' ? 'Ejemplos: "NO suena a mi marca"' : 'Examples: "NO does not sound like my brand"'}
            </Label>
            <p className="text-xs text-muted-foreground">
              {language === 'es' 
                ? 'Proporciona 2-3 ejemplos de copy que NO quieres asociar a tu marca' 
                : 'Provide 2-3 examples of copy you do NOT want associated with your brand'}
            </p>
            <div className="flex gap-2">
              <Textarea
                value={exampleNoInput}
                onChange={(e) => setExampleNoInput(e.target.value)}
                placeholder={language === 'es' ? 'ej., "¡OFERTA LOCA! Compra ya antes de que se acabe!!!"' : 'e.g., "CRAZY OFFER! Buy now before it\'s gone!!!"'}
                className="glass-panel-hover border-2 rounded-xl min-h-[80px]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    e.preventDefault()
                    addToList('brandExamplesNo', exampleNoInput, setExampleNoInput)
                  }
                }}
              />
              <Button 
                type="button" 
                onClick={() => addToList('brandExamplesNo', exampleNoInput, setExampleNoInput)} 
                variant="outline" 
                className="rounded-xl shrink-0"
              >
                <Plus size={18} weight="bold" />
              </Button>
            </div>
            {kit.brandExamplesNo.length > 0 && (
              <div className="space-y-2">
                {kit.brandExamplesNo.map((example, idx) => (
                  <div 
                    key={idx} 
                    className="glass-panel p-4 rounded-xl border-2 border-destructive/40 relative group bg-destructive/5"
                  >
                    <p className="text-sm font-medium pr-8 leading-relaxed">{example}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeFromList('brandExamplesNo', idx)}
                    >
                      <X size={16} weight="bold" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Preferred CTA */}
          <div className="space-y-3">
            <Label className="text-sm font-bold text-primary">
              {language === 'es' ? '🎯 CTA Preferido' : '🎯 Preferred CTA'}
            </Label>
            <Select 
              value={kit.preferredCTA} 
              onValueChange={(value: BrandKit['preferredCTA']) => handleUpdate('preferredCTA', value)}
            >
              <SelectTrigger className="glass-panel-hover border-2 rounded-xl h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="agenda-demo">
                  {language === 'es' ? '📅 Agenda una Demo' : '📅 Schedule a Demo'}
                </SelectItem>
                <SelectItem value="compra">
                  {language === 'es' ? '🛒 Compra Ahora' : '🛒 Buy Now'}
                </SelectItem>
                <SelectItem value="descarga">
                  {language === 'es' ? '📥 Descarga Gratis' : '📥 Download Free'}
                </SelectItem>
                <SelectItem value="suscribete">
                  {language === 'es' ? '✉️ Suscríbete' : '✉️ Subscribe'}
                </SelectItem>
                <SelectItem value="contacta">
                  {language === 'es' ? '💬 Contacta con Nosotros' : '💬 Contact Us'}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

        </div>
      </ScrollArea>
    </Card>
  )
}
