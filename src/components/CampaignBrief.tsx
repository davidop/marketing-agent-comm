import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Lightning } from '@phosphor-icons/react'

interface CampaignBriefProps {
  onGenerate: (data: any) => void
  isGenerating: boolean
}

export function CampaignBrief({ onGenerate, isGenerating }: CampaignBriefProps) {
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
          Campaign Brief
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Define your campaign parameters
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="product" className="text-xs uppercase font-medium tracking-wide">
            Product/Service
          </Label>
          <Input
            id="product"
            value={formData.product}
            onChange={(e) => handleChange('product', e.target.value)}
            placeholder="e.g., Premium Headphones"
            className="glass-panel-hover"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="audience" className="text-xs uppercase font-medium tracking-wide">
            Target Audience
          </Label>
          <Input
            id="audience"
            value={formData.audience}
            onChange={(e) => handleChange('audience', e.target.value)}
            placeholder="e.g., Music enthusiasts 25-40"
            className="glass-panel-hover"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="goals" className="text-xs uppercase font-medium tracking-wide">
            Campaign Goals
          </Label>
          <Textarea
            id="goals"
            value={formData.goals}
            onChange={(e) => handleChange('goals', e.target.value)}
            placeholder="e.g., Increase brand awareness, Drive online sales"
            className="glass-panel-hover resize-none"
            rows={3}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="budget" className="text-xs uppercase font-medium tracking-wide">
            Budget
          </Label>
          <Input
            id="budget"
            value={formData.budget}
            onChange={(e) => handleChange('budget', e.target.value)}
            placeholder="e.g., $50,000"
            className="glass-panel-hover"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="channels" className="text-xs uppercase font-medium tracking-wide">
            Marketing Channels
          </Label>
          <Input
            id="channels"
            value={formData.channels}
            onChange={(e) => handleChange('channels', e.target.value)}
            placeholder="e.g., Instagram, Google Ads, Email"
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
              <span className="animate-pulse">Generating...</span>
            </>
          ) : (
            <>
              <Lightning size={18} weight="fill" />
              Generate Campaign
            </>
          )}
        </Button>
      </form>
    </Card>
  )
}