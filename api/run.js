export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { endpoint, payload } = req.body

    if (!endpoint || !payload) {
      return res.status(400).json({ 
        error: 'Missing endpoint or payload',
        details: 'Request must include both "endpoint" and "payload" fields'
      })
    }

    const apiKey = process.env.FOUNDRY_API_KEY

    if (!apiKey) {
      return res.status(500).json({ 
        error: 'FOUNDRY_API_KEY not configured on server',
        recommendation: 'Configure FOUNDRY_API_KEY environment variable in your deployment settings'
      })
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
      return res.status(response.status).json({
        error: data.error || 'Foundry API error',
        details: data,
        status: response.status
      })
    }

    console.log('[Foundry Proxy] Success:', response.status)
    res.json(data)
  } catch (error) {
    console.error('[Foundry Proxy] Exception:', error)
    res.status(500).json({ 
      error: error.message || 'Internal server error',
      type: error.name || 'UnknownError'
    })
  }
}
