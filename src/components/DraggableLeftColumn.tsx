import { useState } from 'react'
import { DotsSixVertical } from '@phosphor-icons/react'
import { BriefWizard } from '@/components/BriefWizard'
import { BriefScoreCard } from '@/components/BriefScoreCard'
import DemoBriefSelector from '@/components/DemoBriefSelector'
import type { CampaignBriefData } from '@/lib/types'
import type { Language } from '@/lib/i18n'

interface DraggableSection {
  id: string
  component: React.ReactNode
}

interface DraggableLeftColumnProps {
  onGenerate: (briefData: CampaignBriefData) => void
  isGenerating: boolean
  language: Language
  onBriefSelected: (briefData: CampaignBriefData) => void
  briefScore?: number
  briefMissing?: string[]
  briefRecommendations?: string[]
  briefStatusText?: string
}

export function DraggableLeftColumn({
  onGenerate,
  isGenerating,
  language,
  onBriefSelected,
  briefScore = 0,
  briefMissing = [],
  briefRecommendations = [],
  briefStatusText = ''
}: DraggableLeftColumnProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [sections, setSections] = useState<DraggableSection[]>([
    {
      id: 'brief-wizard',
      component: (
        <BriefWizard 
          onGenerate={onGenerate}
          isGenerating={isGenerating}
          language={language}
        />
      )
    },
    {
      id: 'brief-score',
      component: (
        <BriefScoreCard
          score={briefScore}
          missing={briefMissing}
          recommendations={briefRecommendations}
          statusText={briefStatusText}
        />
      )
    },
    {
      id: 'demo-brief',
      component: (
        <DemoBriefSelector
          onBriefSelected={onBriefSelected}
          language={language}
        />
      )
    }
  ])

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    
    if (draggedIndex === null || draggedIndex === index) return

    const newSections = [...sections]
    const draggedSection = newSections[draggedIndex]
    
    newSections.splice(draggedIndex, 1)
    newSections.splice(index, 0, draggedSection)
    
    setSections(newSections)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  return (
    <div className="space-y-6">
      {sections.map((section, index) => (
        <div
          key={section.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          className={`relative group transition-all duration-200 ${
            draggedIndex === index ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
          }`}
        >
          <div className="absolute -left-8 top-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
            <DotsSixVertical size={24} weight="bold" className="text-muted-foreground" />
          </div>
          <div className={`${draggedIndex === index ? 'ring-2 ring-primary rounded-xl' : ''}`}>
            {section.component}
          </div>
        </div>
      ))}
    </div>
  )
}
