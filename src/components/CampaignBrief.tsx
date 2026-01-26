import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import { Lightning, CaretDown, Check } from '@phosphor-icons/react'
import { useTranslation, type Language } from '@/lib/i18n'
import { cn } from '@/lib/utils'

interface CampaignBriefProps {
  onGenerate: (data: any) => void
  isGenerating: boolean
  language: Language
}

const AVAILABLE_CHANNELS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'google', label: 'Google' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'telegram', label: 'Telegram' }
]

export function CampaignBrief({ onGenerate, isGenerating, language }: CampaignBriefProps) {
  const t = useTranslation(language)
  
  const [formData, setFormData] = useState({
    product: '',
    audience: '',
    goals: '',
    budget: '',
    channels: ''
  })
  
  const [selectedChannels, setSelectedChannels] = useState<string[]>([])
  const [isChannelOpen, setIsChannelOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const channelsText = selectedChannels
      .map(ch => AVAILABLE_CHANNELS.find(c => c.value === ch)?.label)
      .filter(Boolean)
      .join(', ')
    
    onGenerate({
      ...formData,
      channels: channelsText
    })
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  
  const toggleChannel = (channelValue: string) => {
    setSelectedChannels(prev => {
      if (prev.includes(channelValue)) {
        return prev.filter(ch => ch !== channelValue)
      } else {
        return [...prev, channelValue]
      }
    })
  }
  
  const getChannelDisplayText = () => {
    if (selectedChannels.length === 0) {
      return t.campaignBrief.channelsPlaceholder
    }
    return selectedChannels
      .map(ch => AVAILABLE_CHANNELS.find(c => c.value === ch)?.label)
      .filter(Boolean)
      .join(', ')
  }

  return (
    <Card className="glass-panel p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Lightning size={24} weight="fill" className="text-primary" />
          {t.campaignBrief.title}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {t.campaignBrief.subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="product" className="text-xs uppercase font-medium tracking-wide">
            {t.campaignBrief.product}
          </Label>
          <Input
            id="product"
            value={formData.product}
            onChange={(e) => handleChange('product', e.target.value)}
            placeholder={t.campaignBrief.productPlaceholder}
            className="glass-panel-hover"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="audience" className="text-xs uppercase font-medium tracking-wide">
            {t.campaignBrief.audience}
          </Label>
          <Input
            id="audience"
            value={formData.audience}
            onChange={(e) => handleChange('audience', e.target.value)}
            placeholder={t.campaignBrief.audiencePlaceholder}
            className="glass-panel-hover"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="goals" className="text-xs uppercase font-medium tracking-wide">
            {t.campaignBrief.goals}
          </Label>
          <Textarea
            id="goals"
            value={formData.goals}
            onChange={(e) => handleChange('goals', e.target.value)}
            placeholder={t.campaignBrief.goalsPlaceholder}
            className="glass-panel-hover resize-none"
            rows={3}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="budget" className="text-xs uppercase font-medium tracking-wide">
            {t.campaignBrief.budget}
          </Label>
          <Input
            id="budget"
            value={formData.budget}
            onChange={(e) => handleChange('budget', e.target.value)}
            placeholder={t.campaignBrief.budgetPlaceholder}
            className="glass-panel-hover"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="channels" className="text-xs uppercase font-medium tracking-wide">
            {t.campaignBrief.channels}
          </Label>
          <Popover open={isChannelOpen} onOpenChange={setIsChannelOpen}>
            <PopoverTrigger asChild>
              <Button
                id="channels"
                variant="outline"
                role="combobox"
                aria-expanded={isChannelOpen}
                className={cn(
                  "w-full justify-between font-normal glass-panel-hover",
                  selectedChannels.length === 0 && "text-muted-foreground"
                )}
              >
                <span className="truncate">{getChannelDisplayText()}</span>
                <CaretDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 glass-panel" align="start">
              <div className="p-2 space-y-1">
                {AVAILABLE_CHANNELS.map((channel) => (
                  <div
                    key={channel.value}
                    className="flex items-center space-x-2 rounded-md px-3 py-2 hover:bg-accent/50 cursor-pointer transition-colors"
                    onClick={() => toggleChannel(channel.value)}
                  >
                    <Checkbox
                      checked={selectedChannels.includes(channel.value)}
                      onCheckedChange={() => toggleChannel(channel.value)}
                      className="pointer-events-none"
                    />
                    <label
                      htmlFor={channel.value}
                      className="flex-1 text-sm font-medium cursor-pointer pointer-events-none"
                    >
                      {channel.label}
                    </label>
                    {selectedChannels.includes(channel.value) && (
                      <Check className="h-4 w-4 text-primary" weight="bold" />
                    )}
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          {selectedChannels.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {selectedChannels.length} {language === 'es' ? 'canal(es) seleccionado(s)' : 'channel(s) selected'}
            </p>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full neon-glow font-semibold uppercase tracking-wide"
          disabled={isGenerating || selectedChannels.length === 0}
        >
          {isGenerating ? (
            <>
              <span className="animate-pulse">{t.campaignBrief.generating}</span>
            </>
          ) : (
            <>
              <Lightning size={18} weight="fill" />
              {t.campaignBrief.generate}
            </>
          )}
        </Button>
      </form>
    </Card>
  )
}