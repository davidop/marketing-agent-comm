#!/usr/bin/env node

const BASE_URL = process.env.TEST_URL || 'http://localhost:3001'

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

async function testHealthCheck() {
  try {
    const response = await fetch(`${BASE_URL}/health`)
    const data = await response.json()
    
    if (response.ok && data.status === 'ok') {
      log('green', '✓', `Health check passed (${response.status})`)
      log('blue', 'ℹ', `  API Key configured: ${data.hasApiKey ? 'Yes' : 'No'}`)
      return true
    } else {
      log('red', '✗', `Health check failed (${response.status})`)
      return false
    }
  } catch (error) {
    log('red', '✗', `Health check error: ${error.message}`)
    return false
  }
}

async function testProxyEndpoint() {
  const testPayload = {
    endpoint: 'https://tenerife-winter-resource.services.ai.azure.com/api/projects/tenerife-winter/applications/campaign-impact-hub/protocols/activityprotocol?api-version=2025-11-15-preview',
    payload: {
      messages: [
        {
          role: 'user',
          content: 'Test brief: Campaña de marketing digital'
        }
      ],
      context: {
        campaignContext: {
          product: 'Test Product',
          target: 'Test Audience',
          channels: ['Email'],
          brandTone: 'profesional',
          budget: '1000€'
        },
        uiState: {
          view: 'campaign'
        }
      }
    }
  }

  try {
    log('blue', '→', 'Calling proxy endpoint...')
    const response = await fetch(`${BASE_URL}/api/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload),
    })

    const data = await response.json()

    if (response.ok) {
      log('green', '✓', `Proxy call successful (${response.status})`)
      log('blue', 'ℹ', `  Response keys: ${Object.keys(data).join(', ')}`)
      return true
    } else {
      log('red', '✗', `Proxy call failed (${response.status})`)
      log('red', 'ℹ', `  Error: ${data.error || 'Unknown error'}`)
      if (data.recommendation) {
        log('yellow', '💡', `  ${data.recommendation}`)
      }
      return false
    }
  } catch (error) {
    log('red', '✗', `Proxy error: ${error.message}`)
    return false
  }
}

async function testMissingPayload() {
  try {
    log('blue', '→', 'Testing missing payload validation...')
    const response = await fetch(`${BASE_URL}/api/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })

    if (response.status === 400) {
      log('green', '✓', 'Validation works (returned 400 for missing payload)')
      return true
    } else {
      log('yellow', '⚠', `Expected 400, got ${response.status}`)
      return false
    }
  } catch (error) {
    log('red', '✗', `Validation test error: ${error.message}`)
    return false
  }
}

async function runTests() {
  console.log('\n' + colors.magenta + '━'.repeat(60) + colors.reset)
  console.log(colors.magenta + '  Proxy Backend Tests' + colors.reset)
  console.log(colors.magenta + '━'.repeat(60) + colors.reset + '\n')

  console.log(colors.blue + `Testing: ${BASE_URL}` + colors.reset + '\n')

  const results = {
    health: await testHealthCheck(),
    validation: await testMissingPayload(),
    proxy: await testProxyEndpoint(),
  }

  console.log('\n' + colors.magenta + '━'.repeat(60) + colors.reset)
  console.log(colors.magenta + '  Results Summary' + colors.reset)
  console.log(colors.magenta + '━'.repeat(60) + colors.reset + '\n')

  const passed = Object.values(results).filter(Boolean).length
  const total = Object.keys(results).length

  Object.entries(results).forEach(([test, passed]) => {
    const symbol = passed ? '✓' : '✗'
    const color = passed ? 'green' : 'red'
    const name = test.charAt(0).toUpperCase() + test.slice(1)
    log(color, symbol, `${name} test`)
  })

  console.log('\n' + colors.magenta + `Total: ${passed}/${total} passed` + colors.reset + '\n')

  if (passed === total) {
    log('green', '🎉', 'All tests passed!')
    process.exit(0)
  } else {
    log('red', '❌', 'Some tests failed')
    process.exit(1)
  }
}

runTests()
