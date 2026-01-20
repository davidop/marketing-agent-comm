import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Moon, Sun, WifiHigh, WifiSlash, Translate } from '@phosphor-icons/react'
import { useTranslation, type Language } from '@/lib/i18n'

interface HeaderProps {
  theme: string
  onThemeToggle: () => void
  isConnected: boolean
  language: Language
  onLanguageToggle: () => void
}

export function Header({ theme, onThemeToggle, isConnected, language, onLanguageToggle }: HeaderProps) {
  const t = useTranslation(language)
  
  return (
    <header className="glass-panel border-b sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl lg:text-3xl font-bold uppercase tracking-tight text-foreground">
              {t.header.title}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge 
              variant={isConnected ? "default" : "destructive"}
              className={`flex items-center gap-2 px-3 py-1 ${isConnected ? 'pulse-status' : ''}`}
            >
              {isConnected ? (
                <>
                  <WifiHigh size={16} weight="fill" />
                  <span className="text-xs font-medium uppercase">{t.header.connected}</span>
                </>
              ) : (
                <>
                  <WifiSlash size={16} weight="fill" />
                  <span className="text-xs font-medium uppercase">{t.header.disconnected}</span>
                </>
              )}
            </Badge>

            <Button
              variant="outline"
              size="sm"
              onClick={onLanguageToggle}
              className="glass-panel px-3 py-2 rounded-lg gap-2 font-semibold uppercase tracking-wide"
            >
              <Translate size={16} weight="fill" />
              <span className="text-xs">{language === 'en' ? 'ES' : 'EN'}</span>
            </Button>
            
            <div className="flex items-center gap-2 glass-panel px-3 py-2 rounded-lg">
              <Sun size={16} weight="fill" className="text-foreground" />
              <Switch 
                checked={theme === 'dark'}
                onCheckedChange={onThemeToggle}
              />
              <Moon size={16} weight="fill" className="text-foreground" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}