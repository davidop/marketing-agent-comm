import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Lightning } from '@phosphor-icons/react'
import { useTranslation, type Language } from '@/lib/i18n'

interface CampaignBriefProps {
  onGenerate: (data: any) => void
  isGenerating: boolean
  language: Language
}

export function CampaignBrief({ onGenerate, isGenerating, language }: CampaignBriefProps) {
  const t = useTranslation(language)
  
  const [formData, setFormData] = useState({
    product: '',
    audience: '',
    goals: '',
    budget: '',
    channels: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onGenerate(formData)
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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
          <Input
            id="channels"
            value={formData.channels}
            onChange={(e) => handleChange('channels', e.target.value)}
            placeholder={t.campaignBrief.channelsPlaceholder}
            className="glass-panel-hover"
            required
          />
        </div>

        <Button 
          type="submit" 
          className="w-full neon-glow font-semibold uppercase tracking-wide"
          disabled={isGenerating}
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