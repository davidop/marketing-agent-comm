export interface FoundryPayload {
  messages: Array<{
    role: 'user' | 'assistant'
    content: string
  }>
  context?: {
    campaignContext?: {
      product?: string
      target?: string
      channels?: string[]
      brandTone?: string
      budget?: string
    }
    uiState?: {
      view?: string
    }
  }
}

export interface FoundryResponse {
  summary?: string
  campaignPlan?: Record<string, any>
  cards?: Record<string, any>
  [key: string]: any
}

export interface FoundryError {
  message: string
  type: 'network' | 'auth' | 'cors' | 'parse' | 'unknown'
  recommendation?: string
}

export async function runCampaignFlow(
  payload: FoundryPayload
): Promise<FoundryResponse> {
  const endpoint = import.meta.env.VITE_FOUNDRY_ENDPOINT || 
    'https://tenerife-winter-resource.services.ai.azure.com/api/projects/tenerife-winter/applications/campaign-impact-hub/protocols/activityprotocol?api-version=2025-11-15-preview'
  
  const apiKey = import.meta.env.VITE_FOUNDRY_API_KEY

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (apiKey) {
    headers['api-key'] = apiKey
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error')
      
      if (response.status === 401 || response.status === 403) {
        const error: FoundryError = {
          message: `Authentication error (${response.status}): ${errorText}`,
          type: 'auth',
          recommendation: 'Set VITE_FOUNDRY_API_KEY in your environment variables, or use a backend proxy at /api/run to avoid exposing keys in the frontend.'
        }
        throw error
      }

      throw {
        message: `HTTP ${response.status}: ${errorText}`,
        type: 'network',
      } as FoundryError
    }

    const data = await response.json()
    return data as FoundryResponse
  } catch (err: any) {
    if (err.type) {
      throw err
    }

    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      const corsError: FoundryError = {
        message: 'CORS error: Cannot connect to Foundry endpoint from browser',
        type: 'cors',
        recommendation: 'Use a backend proxy (/api/run) to call Foundry without exposing keys and to avoid CORS issues.'
      }
      throw corsError
    }

    const unknownError: FoundryError = {
      message: err.message || 'Unknown error occurred',
      type: 'unknown',
    }
    throw unknownError
  }
}
