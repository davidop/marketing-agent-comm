import { useState, useRef, useEffect } from 'react'
import { DotsSixVertical } from '@phosphor-icons/react'

interface DraggableSectionWrapperProps {
  children: React.ReactNode
  sectionId: string
  index: number
  onReorder: (fromIndex: number, toIndex: number) => void
  isDragging: boolean
  onDragStart: (index: number) => void
  onDragEnd: () => void
}

export function DraggableSectionWrapper({
  children,
  sectionId,
  index,
  onReorder,
  isDragging,
  onDragStart,
  onDragEnd,
}: DraggableSectionWrapperProps) {
  const [isOver, setIsOver] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', sectionId)
    onDragStart(index)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setIsOver(true)
  }

  const handleDragLeave = () => {
    setIsOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsOver(false)
    
    const draggedId = e.dataTransfer.getData('text/html')
    if (draggedId !== sectionId) {
      onReorder(index, index)
    }
  }

  const handleDragEnd = () => {
    onDragEnd()
  }

  return (
    <div
      ref={ref}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
      className={`relative group transition-all duration-200 ${
        isDragging ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
      } ${isOver ? 'ring-2 ring-primary rounded-xl' : ''}`}
    >
      <div className="absolute -left-10 top-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-10 bg-card/80 backdrop-blur-sm rounded-lg p-1.5 border border-border">
        <DotsSixVertical size={20} weight="bold" className="text-muted-foreground" />
      </div>
      {children}
    </div>
  )
}
