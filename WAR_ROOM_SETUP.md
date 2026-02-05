# War Room Command Center - Setup Guide

## Overview

The War Room Command Center is the main panel for launching Microsoft Foundry workflows and rendering campaign results. It provides a visual "command center" interface with three main columns:

1. **Left Column**: Campaign Brief form (product, target, channels, tone, budget)
2. **Center Column**: Output cards (Strategy, Content, Analytics, SEO/Visibility, Summary)
3. **Right Column**: Run Trace with execution events + Run button

## Microsoft Foundry Integration

### Endpoint Configuration

The War Room connects to Microsoft Foundry using environment variables:

```env
VITE_FOUNDRY_ENDPOINT=https://tenerife-winter-resource.services.ai.azure.com/api/projects/tenerife-winter/applications/campaign-impact-hub/protocols/activityprotocol?api-version=2025-11-15-preview
VITE_FOUNDRY_API_KEY=your-api-key-here
```

**Important**: Never commit API keys to the repository. Use `.env.local` for local development.

### Setup Steps

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. (Optional) Add your Foundry API key to `.env.local`:
   ```env
   VITE_FOUNDRY_API_KEY=your-key-here
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Payload Format

The War Room sends the following payload to Foundry:

```json
{
  "messages": [
    {
      "role": "user",
      "content": "<brief text>"
    }
  ],
  "context": {
    "campaignContext": {
      "product": "...",
      "target": "...",
      "channels": ["..."],
      "brandTone": "...",
      "budget": "..."
    },
    "uiState": {
      "view": "war-room"
    }
  }
}
```

### Expected Response Format

The War Room expects responses in this structure:

```json
{
  "summary": "Executive summary text...",
  "campaignPlan": {
    "strategy": { ... },
    "content": { ... },
    "analytics": { ... },
    "seo": { ... }
  },
  "cards": {
    // Additional structured data
  }
}
```

If the response doesn't match this structure, the War Room will display the raw JSON in a collapsible "Raw JSON Viewer".

## Error Handling

### CORS Errors

If you encounter CORS errors when calling Foundry from the browser:

```
CORS error: Cannot connect to Foundry endpoint from browser
```

**Recommendation**: Use a backend proxy at `/api/run` to call Foundry without exposing keys and to avoid CORS issues.

### Authentication Errors

If you see authentication errors (401/403):

```
Authentication error (401): Invalid or missing API key
```

**Solutions**:
1. Set `VITE_FOUNDRY_API_KEY` in your `.env.local` file
2. Use a backend proxy to handle authentication server-side

### Example Backend Proxy (Node.js/Express)

```javascript
// server/api/run.js
import express from 'express'
import fetch from 'node-fetch'

const router = express.Router()

router.post('/run', async (req, res) => {
  const endpoint = process.env.FOUNDRY_ENDPOINT
  const apiKey = process.env.FOUNDRY_API_KEY

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify(req.body)
    })

    const data = await response.json()
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
```

Then update the War Room to call `/api/run` instead of the Foundry endpoint directly.

## Features

### Run Trace

The Run Trace panel displays real-time execution events:

- ⏰ **Started**: Workflow initiated
- ⚡ **Calling**: Making API call to Foundry
- ✅ **Done**: Workflow completed successfully
- ❌ **Error**: Error occurred with recommendation

### Copy Buttons

- **Copy Payload**: Copies the full request payload to clipboard
- **Copy Response**: Copies the Foundry response to clipboard

These are useful for debugging and sharing results.

### State Management

The War Room has four states:

1. **Idle**: Waiting for user input
2. **Loading**: Workflow in progress
3. **Success**: Campaign generated successfully
4. **Error**: Error occurred (with details)

## Styling

The War Room uses a "command center" aesthetic with:

- **Glassmorphism**: Transparent cards with backdrop blur
- **Neon accents**: Subtle glows on interactive elements
- **Dark mode support**: Respects system theme
- **Responsive layout**: Adapts to mobile/tablet/desktop

## Azure AI Agent Details

For reference, the Marketing Orchestrator agent configuration:

```
Agent ID: marketing-orchestrator:2
Project Endpoint: https://tenerife-winter-resource.services.ai.azure.com/api/projects/tenerife-winter
Subscription ID: d1836173-d451-4210-b565-5cb14f7b2e7e
Resource Group: rg-campaign-impact-hub
Location: swedencentral
```

## Troubleshooting

### No output cards displayed

If you don't see Strategy/Content/Analytics cards after a successful run, check that the Foundry response includes a `campaignPlan` object with the expected structure.

### "Copy Response" button disabled

This button is only enabled after a successful run that returns data.

### Channels not selectable

Click on the channel badges to toggle them on/off. Selected channels appear with a solid background.

## Next Steps

To use the War Room in production:

1. Set up a backend proxy to handle Foundry API calls
2. Implement proper authentication and authorization
3. Add rate limiting and error tracking
4. Store campaign results in a database
5. Add export functionality (PDF, CSV, etc.)
