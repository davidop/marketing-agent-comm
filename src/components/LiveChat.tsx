import { Card } from '@/components/ui/card'
import { ChatCircle } from '@phosphor-icons/react'
import { useTranslation, type Language } from '@/lib/i18n'

interface LiveChatProps {
  language: Language
}

export function LiveChat({ language }: LiveChatProps) {
  const t = useTranslation(language)

  return (
    <Card className="glass-panel p-6 flex flex-col h-[calc(100vh-180px)] lg:h-[calc(100vh-140px)]">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <ChatCircle size={24} weight="fill" className="text-success" />
          {t.chat.title}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {t.chat.subtitle}
        </p>
      </div>

      <div className="flex-1 relative">
        <iframe 
          src="https://copilotstudio.microsoft.com/environments/Default-eb4fd47b-46a3-452c-9d3e-caab10ab3805/bots/copilots_header_49046/webchat?__version__=2" 
          className="w-full h-full border-0 rounded-lg"
          title="Microsoft Copilot Chat"
        />
      </div>
    </Card>
  )
}