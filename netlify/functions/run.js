exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const { endpoint, payload } = JSON.parse(event.body)

    if (!endpoint || !payload) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ 
          error: 'Missing endpoint or payload',
          details: 'Request must include both "endpoint" and "payload" fields'
        })
      }
    }

    const apiKey = process.env.FOUNDRY_API_KEY

    if (!apiKey) {
      return { 
        statusCode: 500, 
        body: JSON.stringify({ 
          error: 'FOUNDRY_API_KEY not configured on server',
          recommendation: 'Configure FOUNDRY_API_KEY environment variable in Netlify settings'
        })
      }
    }

    console.log('[Foundry Proxy] Calling endpoint:', endpoint.substring(0, 60) + '...')

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
        'Ocp-Apim-Subscription-Key': apiKey
      },
      body: JSON.stringify(payload)
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('[Foundry Proxy] Error response:', response.status, data)
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: data.error || 'Foundry API error',
          details: data,
          status: response.status
        })
      }
    }

    console.log('[Foundry Proxy] Success:', response.status)
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
  } catch (error) {
    console.error('[Foundry Proxy] Exception:', error)
    return { 
      statusCode: 500, 
      body: JSON.stringify({ 
        error: error.message || 'Internal server error',
        type: error.name || 'UnknownError'
      })
    }
  }
}
