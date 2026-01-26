import { Card } from '@/components/ui/card'
import { ChatCircle } from '@phosphor-icons/react'
import { useTranslation, type Language } from '@/lib/i18n'

interface LiveChatProps {
  language: Language
}

export function LiveChat({ language }: LiveChatProps) {
  const t = useTranslation(language)

      <div className="flex-1 relative">        <iframe           src="https://copilotstudio.microsoft.com/environments/Default-eb4fd47b-46a3-452c-9d3e-caab10ab3805/bots/copilots_header_49046/webchat?__version__=2"           className="w-full h-full border-0 rounded-lg"          title="Microsoft Copilot Chat"