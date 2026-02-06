# Azure AI Agent Integration - Quick Start Guide

## Overview

This integration connects the **Foundry Workflow** component in the Campaign Impact Hub to an **Azure AI Agent** using the `azure.ai.projects` Python SDK. The provided Python code from the problem statement has been fully integrated.

## What Was Done

✅ **Python Backend Server** (`azure_agent_server.py`)
- Flask-based REST API server
- Implements the exact Azure AI agent code from the problem statement
- Provides endpoints for thread creation, messaging, and conversation management
- Uses `DefaultAzureCredential` for Azure authentication

✅ **TypeScript Client Library** (`src/lib/azureAgentClient.ts`)
- Browser-friendly client for communicating with the Python backend
- Type-safe methods for all Azure Agent operations
- Error handling and health checks

✅ **Foundry Client Integration** (`src/lib/foundryClient.ts`)
- Updated to support Azure Agent mode via `VITE_USE_AZURE_AGENT` environment variable
- Seamless switching between direct Foundry calls and Azure Agent calls
- Maintains backward compatibility with existing code

✅ **Documentation and Scripts**
- Comprehensive setup guide (`AZURE_AGENT_INTEGRATION.md`)
- Startup script (`start-azure-agent.sh`) for easy launch
- Environment variable examples (`.env.example`)
- Integration test suite (`test_integration.py`)

## Quick Start

### Prerequisites

- **Python 3.8+** (required for backend)
- **Node.js 18+** (required for frontend)
- **Azure CLI** (optional, for authentication)

Note: The npm scripts use `python3` command. On some systems, you may need to create an alias: `alias python3=python`

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

This installs:
- `azure-ai-projects` - Azure AI Agent SDK
- `azure-identity` - Azure authentication
- `flask` - Web server framework
- `flask-cors` - CORS support for browser access
- `python-dotenv` - Environment variable management

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Azure AI Agent Configuration
AZURE_AIPROJECT_ENDPOINT=https://tenerife-winter-resource.services.ai.azure.com/api/projects/tenerife-winter
AZURE_AGENT_ID=asst_nJy3ICZrtfnUcpcldqpiEBTQ
AZURE_AGENT_PORT=5001

# Frontend Configuration
VITE_USE_AZURE_AGENT=true
VITE_AZURE_AGENT_BACKEND=http://localhost:5001
```

### 3. Authenticate with Azure

**Option A: Azure CLI (Recommended)**
```bash
az login
```

**Option B: Environment Variables**
```bash
export AZURE_TENANT_ID=your-tenant-id
export AZURE_CLIENT_ID=your-client-id
export AZURE_CLIENT_SECRET=your-client-secret
```

### 4. Start the Integration

**Option A: Using the startup script**
```bash
./start-azure-agent.sh
```

**Option B: Manual start (two terminals)**

Terminal 1 - Backend:
```bash
python3 azure_agent_server.py
```

Terminal 2 - Frontend:
```bash
npm run dev
```

**Option C: Using npm scripts**
```bash
npm run dev:azure
```

### 5. Test the Integration

1. Open your browser to the dev server URL (usually `http://localhost:5173`)
2. Navigate to the **"Foundry Workflow"** or **"War Room"** tab
3. The component should show "Connected to Azure AI Agent"
4. Enter a campaign brief and click "Generate Campaign"
5. The request will go through the Python backend to the Azure AI Agent
6. You'll see the agent's response in the UI

## How It Works

```
┌─────────────────────┐
│  Browser (React)    │
│  Foundry Workflow   │
│  Component          │
└──────────┬──────────┘
           │ HTTP POST
           ▼
┌─────────────────────┐
│  Python Backend     │
│  Flask Server       │  ← Uses azure.ai.projects
│  Port 5001          │  ← DefaultAzureCredential
└──────────┬──────────┘  ← Exact code from problem
           │               statement
           ▼
┌─────────────────────┐
│  Azure AI Agent     │
│  Marketing          │
│  Orchestrator       │
└─────────────────────┘
```

## Code Integration Points

### 1. Python Backend (`azure_agent_server.py`)

This file contains the **exact code** from the problem statement:

```python
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential
from azure.ai.agents.models import ListSortOrder

project = AIProjectClient(
    credential=DefaultAzureCredential(),
    endpoint="https://tenerife-winter-resource.services.ai.azure.com/api/projects/tenerife-winter"
)

agent = project.agents.get_agent("asst_nJy3ICZrtfnUcpcldqpiEBTQ")

thread = project.agents.threads.create()
print(f"Created thread, ID: {thread.id}")

message = project.agents.messages.create(
    thread_id=thread.id,
    role="user",
    content="Hi Marketing Orchestrator"
)

run = project.agents.runs.create_and_process(
    thread_id=thread.id,
    agent_id=agent.id
)

if run.status == "failed":
    print(f"Run failed: {run.last_error}")
else:
    messages = project.agents.messages.list(
        thread_id=thread.id, 
        order=ListSortOrder.ASCENDING
    )

    for message in messages:
        if message.text_messages:
            print(f"{message.role}: {message.text_messages[-1].text.value}")
```

### 2. Foundry Workflow Component

The existing `WarRoomChat` and `OrchestratorDemo` components automatically use the Azure Agent when `VITE_USE_AZURE_AGENT=true`.

No changes needed to these components - they work transparently!

### 3. TypeScript Client Usage

```typescript
import { runCampaignFlow } from '@/lib/foundryClient'

// Automatically uses Azure Agent if VITE_USE_AZURE_AGENT=true
const response = await runCampaignFlow({
  messages: [
    { role: 'user', content: 'Generate a marketing campaign' }
  ],
  context: {
    campaignContext: {
      product: 'Azure ARC',
      target: 'Enterprise IT',
      channels: ['LinkedIn', 'Email']
    }
  }
})
```

## Testing

Run the integration test suite:

```bash
python3 test_integration.py
```

This verifies:
- ✅ Python module imports work
- ✅ Server structure is correct
- ✅ TypeScript client has all required methods
- ✅ Foundry client integration is complete

## Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `AZURE_AIPROJECT_ENDPOINT` | Azure AI project endpoint URL | (required) |
| `AZURE_AGENT_ID` | Agent ID in Azure AI Studio | `asst_nJy3ICZrtfnUcpcldqpiEBTQ` |
| `AZURE_AGENT_PORT` | Backend server port | `5001` |
| `VITE_USE_AZURE_AGENT` | Enable Azure Agent mode in frontend | `false` |
| `VITE_AZURE_AGENT_BACKEND` | Backend URL for frontend to connect | `http://localhost:5001` |
| `AZURE_TENANT_ID` | Azure tenant ID (optional) | - |
| `AZURE_CLIENT_ID` | Azure client ID (optional) | - |
| `AZURE_CLIENT_SECRET` | Azure client secret (optional) | - |

## Troubleshooting

### Backend won't start

**Error**: "Failed to import Flask"
```bash
pip install -r requirements.txt
```

**Error**: "Azure AI client not initialized"
```bash
az login  # or set AZURE_* environment variables
```

### Frontend can't connect

**Error**: "Cannot connect to Azure Agent backend"
- Check that Python backend is running: `curl http://localhost:5001/health`
- Verify `VITE_AZURE_AGENT_BACKEND` is set correctly
- Check CORS is enabled in the backend

### Agent not responding

**Error**: "Run failed"
- Verify agent ID is correct in Azure AI Studio
- Check Azure credentials have permission to access the agent
- Review backend logs for detailed error messages

## Files Created/Modified

### New Files
- ✅ `azure_agent_server.py` - Python Flask backend
- ✅ `requirements.txt` - Python dependencies
- ✅ `src/lib/azureAgentClient.ts` - TypeScript client
- ✅ `AZURE_AGENT_INTEGRATION.md` - Comprehensive docs
- ✅ `start-azure-agent.sh` - Startup script
- ✅ `.env.example` - Environment template
- ✅ `test_integration.py` - Integration tests
- ✅ `QUICKSTART_AZURE_AGENT.md` - This guide

### Modified Files
- ✅ `src/lib/foundryClient.ts` - Added Azure Agent support
- ✅ `package.json` - Added npm scripts for Azure Agent
- ✅ `.gitignore` - Added Python ignore patterns

## Next Steps

1. ✅ Integration is complete and ready to use
2. 🔄 Test with real Azure credentials
3. 🔄 Deploy backend to production (Azure App Service recommended)
4. 🔄 Update `VITE_AZURE_AGENT_BACKEND` to production URL
5. 🚀 Deploy frontend with `VITE_USE_AZURE_AGENT=true`

## Production Deployment

### Backend (Python)

**Azure App Service**:
```bash
az webapp create --resource-group rg-campaign-impact-hub \
  --plan asp-campaign --name campaign-agent-backend \
  --runtime "PYTHON:3.12"

az webapp config appsettings set --name campaign-agent-backend \
  --resource-group rg-campaign-impact-hub \
  --settings AZURE_AIPROJECT_ENDPOINT="..." AZURE_AGENT_ID="..."
```

### Frontend

Update `.env.production`:
```env
VITE_USE_AZURE_AGENT=true
VITE_AZURE_AGENT_BACKEND=https://campaign-agent-backend.azurewebsites.net
```

## Support

For detailed information, see:
- `AZURE_AGENT_INTEGRATION.md` - Complete technical documentation
- `azure_agent_server.py` - Backend implementation with comments
- `src/lib/azureAgentClient.ts` - TypeScript client with JSDoc

---

**Status**: ✅ Integration Complete and Ready to Use

The Foundry Workflow component is now connected to the Azure AI Agent using the exact code provided in the problem statement.
