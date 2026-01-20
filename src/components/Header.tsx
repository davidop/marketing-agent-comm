import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Moon, Sun, WifiHigh, WifiSlash } from '@phosphor-icons/react'

interface HeaderProps {
  theme: string
  onThemeToggle: () => void
  isConnected: boolean
}

export function Header({ theme, onThemeToggle, isConnected }: HeaderProps) {
  return (
    <header className="glass-panel border-b sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl lg:text-3xl font-bold uppercase tracking-tight text-foreground">
              Marketing Command Center
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
                  <span className="text-xs font-medium uppercase">Connected</span>
                </>
              ) : (
                <>
                  <WifiSlash size={16} weight="fill" />
                  <span className="text-xs font-medium uppercase">Disconnected</span>
                </>
              )}
            </Badge>
            
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