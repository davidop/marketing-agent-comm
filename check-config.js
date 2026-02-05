#!/usr/bin/env node

import { config } from 'dotenv'

config()

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
}

function log(color, symbol, message) {
  console.log(`${colors[color]}${symbol} ${message}${colors.reset}`)
}

function checkEnvVar(name, required = false) {
  const value = process.env[name]
  const exists = !!value
  
  if (exists) {
    const masked = value.length > 10 
      ? `${value.substring(0, 4)}...${value.substring(value.length - 4)}`
      : '***'
    log('green', '✓', `${name}: ${masked}`)
    return true
  } else {
    if (required) {
      log('red', '✗', `${name}: Missing (REQUIRED)`)
      return false
    } else {
      log('yellow', '⚠', `${name}: Not set (optional)`)
      return true
    }
  }
}

console.log('\n' + colors.magenta + '━'.repeat(60) + colors.reset)
console.log(colors.magenta + '  Foundry Proxy Configuration Check' + colors.reset)
console.log(colors.magenta + '━'.repeat(60) + colors.reset + '\n')

console.log(colors.blue + 'Frontend Configuration (.env):' + colors.reset)
const hasProxyEnabled = process.env.VITE_USE_PROXY !== 'false'
checkEnvVar('VITE_FOUNDRY_ENDPOINT', false)
const proxyMode = hasProxyEnabled ? 'Enabled (✓)' : 'Disabled (direct mode)'
log(hasProxyEnabled ? 'green' : 'yellow', hasProxyEnabled ? '✓' : '⚠', `VITE_USE_PROXY: ${proxyMode}`)
checkEnvVar('VITE_FOUNDRY_API_KEY', false)

console.log('\n' + colors.blue + 'Backend Configuration (server):' + colors.reset)
const hasBackendKey = checkEnvVar('FOUNDRY_API_KEY', true)

console.log('\n' + colors.magenta + '━'.repeat(60) + colors.reset)
console.log(colors.magenta + '  Summary' + colors.reset)
console.log(colors.magenta + '━'.repeat(60) + colors.reset + '\n')

if (hasProxyEnabled && hasBackendKey) {
  log('green', '✓', 'Configuration looks good! Using proxy mode with backend API key.')
  console.log('\n  Start the proxy server with:')
  console.log('    ' + colors.blue + 'npm run proxy' + colors.reset)
  console.log('\n  Or start both frontend and proxy:')
  console.log('    ' + colors.blue + 'npm run dev:all' + colors.reset)
} else if (!hasProxyEnabled && process.env.VITE_FOUNDRY_API_KEY) {
  log('yellow', '⚠', 'Using DIRECT mode with frontend API key.')
  log('yellow', '⚠', 'This may not work in production due to CORS.')
  log('yellow', '⚠', 'Recommended: Set VITE_USE_PROXY=true and configure FOUNDRY_API_KEY in backend.')
} else if (hasProxyEnabled && !hasBackendKey) {
  log('red', '✗', 'Proxy mode enabled but FOUNDRY_API_KEY not set in backend!')
  console.log('\n  Solutions:')
  console.log('    1. Set FOUNDRY_API_KEY environment variable')
  console.log('    2. Or create .env with FOUNDRY_API_KEY=your-key')
  console.log('    3. Or disable proxy: VITE_USE_PROXY=false (not recommended)')
} else {
  log('red', '✗', 'No API key configured!')
  console.log('\n  Configure either:')
  console.log('    • Backend: FOUNDRY_API_KEY=your-key (recommended)')
  console.log('    • Frontend: VITE_FOUNDRY_API_KEY=your-key (dev only)')
}

console.log('\n' + colors.magenta + '━'.repeat(60) + colors.reset + '\n')
