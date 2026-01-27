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
    <header className="glass-panel border-b sticky top-0 z-50 marketing-shine">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl lg:text-3xl font-bold uppercase tracking-tight text-foreground bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              {t.header.title}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge 
              variant={isConnected ? "default" : "destructive"}
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${isConnected ? 'pulse-status neon-glow' : ''}`}
            >
              {isConnected ? (
                <>
                  <WifiHigh size={18} weight="fill" />
                  <span className="text-xs font-bold uppercase tracking-wider">{t.header.connected}</span>
                </>
              ) : (
                <>
                  <WifiSlash size={18} weight="fill" />
                  <span className="text-xs font-bold uppercase tracking-wider">{t.header.disconnected}</span>
                </>
              )}
            </Badge>

            <Button
              variant="outline"
              size="sm"
              onClick={onLanguageToggle}
              className="glass-panel-hover px-4 py-2 rounded-full gap-2 font-bold uppercase tracking-wider border-2"
            >
              <Translate size={18} weight="fill" />
              <span className="text-xs">{language === 'es' ? 'EN' : 'ES'}</span>
            </Button>
            
            <div className="flex items-center gap-2 glass-panel-hover px-4 py-2 rounded-full border-2">
              <Sun size={18} weight="fill" className="text-accent" />
              <Switch 
                checked={theme === 'dark'}
                onCheckedChange={onThemeToggle}
              />
              <Moon size={18} weight="fill" className="text-primary" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}