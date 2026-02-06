# Azure AI Agent Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Campaign Impact Hub                           │
│                        (React/TypeScript Frontend)                   │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ User enters campaign brief
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    Foundry Workflow Component                        │
│                    (WarRoomChat.tsx / OrchestratorDemo.tsx)         │
│                                                                      │
│  • Collects campaign brief from user                                │
│  • Displays connection status                                       │
│  • Shows execution logs                                             │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ runCampaignFlow({ messages, context })
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      foundryClient.ts                                │
│                                                                      │
│  if (VITE_USE_AZURE_AGENT === 'true') {                            │
│    return runViaAzureAgent(payload)    ← NEW                       │
│  } else {                                                           │
│    return runViaProxy(payload)         ← Original                  │
│  }                                                                  │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ HTTP POST to /api/azure-agent/thread/create
                             │ HTTP POST to /api/azure-agent/message/send
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    azure_agent_server.py                             │
│                    Python Flask Backend (Port 5001)                  │
│                                                                      │
│  Routes:                                                            │
│  • POST /api/azure-agent/thread/create                             │
│  • POST /api/azure-agent/message/send                              │
│  • POST /api/azure-agent/messages/list                             │
│  • GET  /health                                                     │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ Python code from problem statement:
                             │
                             │ project = AIProjectClient(
                             │     credential=DefaultAzureCredential(),
                             │     endpoint="https://..."
                             │ )
                             │
                             │ thread = project.agents.threads.create()
                             │ message = project.agents.messages.create(...)
                             │ run = project.agents.runs.create_and_process(...)
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Azure AI Agent                                  │
│                      Marketing Orchestrator                          │
│                      (asst_nJy3ICZrtfnUcpcldqpiEBTQ)               │
│                                                                      │
│  Endpoint:                                                          │
│  https://tenerife-winter-resource.services.ai.azure.com/           │
│    api/projects/tenerife-winter                                     │
│                                                                      │
│  Capabilities:                                                      │
│  • Campaign strategy generation                                     │
│  • Content creation                                                 │
│  • Marketing recommendations                                        │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Thread Creation
```
Frontend → foundryClient.ts → azure_agent_server.py → Azure AI
    ↓
  Returns thread_id
```

### 2. Message Exchange
```
Frontend sends: {
  thread_id: "thread_abc123",
  content: "Generate a marketing campaign for Product X"
}
    ↓
Python backend calls:
  - project.agents.messages.create(thread_id, role="user", content)
  - project.agents.runs.create_and_process(thread_id, agent_id)
  - project.agents.messages.list(thread_id)
    ↓
Frontend receives: {
  messages: [
    { role: "user", content: "..." },
    { role: "assistant", content: "Here's your campaign..." }
  ]
}
```

## Authentication Flow

```
┌──────────────────────┐
│  DefaultAzureCredential │
│  (Python Backend)       │
└───────────┬─────────────┘
            │
            │ Tries in order:
            │
            ├─► 1. Environment Variables
            │      AZURE_TENANT_ID
            │      AZURE_CLIENT_ID
            │      AZURE_CLIENT_SECRET
            │
            ├─► 2. Managed Identity
            │      (Azure App Service, VM, etc.)
            │
            ├─► 3. Azure CLI
            │      (az login)
            │
            └─► 4. Visual Studio Code
                   (Signed in account)
```

## Environment Configuration

### Development
```
Frontend (.env):
  VITE_USE_AZURE_AGENT=true
  VITE_AZURE_AGENT_BACKEND=http://localhost:5001

Backend (.env):
  AZURE_AIPROJECT_ENDPOINT=https://...
  AZURE_AGENT_ID=asst_...
  AZURE_AGENT_PORT=5001
```

### Production
```
Frontend (.env.production):
  VITE_USE_AZURE_AGENT=true
  VITE_AZURE_AGENT_BACKEND=https://backend.azurewebsites.net

Backend (Azure App Service Settings):
  AZURE_AIPROJECT_ENDPOINT=https://...
  AZURE_AGENT_ID=asst_...
  (Managed Identity handles auth automatically)
```

## Component Integration

### Original Flow (Before)
```
WarRoomChat → foundryClient.ts → Azure Foundry Endpoint (Direct/Proxy)
```

### New Flow (After)
```
WarRoomChat → foundryClient.ts → azure_agent_server.py → Azure AI Agent
                                    (Python Backend)
```

### Backward Compatible
```
if VITE_USE_AZURE_AGENT=true:
  Use new Python backend
else:
  Use original direct/proxy mode
```

## Key Features

1. **No Frontend Changes Required**
   - Existing components work without modification
   - Just set environment variable to switch modes

2. **Secure by Design**
   - Azure credentials never exposed to browser
   - All authentication happens server-side
   - CORS configured for security

3. **Exact Code Integration**
   - Uses the exact Python code from problem statement
   - No modifications to Azure agent interaction logic

4. **Production Ready**
   - Health check endpoint
   - Error handling and logging
   - Environment-based configuration
   - Easy deployment to Azure

## Testing Commands

```bash
# 1. Test structure
python3 test_integration.py

# 2. Test backend health
curl http://localhost:5001/health

# 3. Test thread creation
curl -X POST http://localhost:5001/api/azure-agent/thread/create

# 4. Test message sending
curl -X POST http://localhost:5001/api/azure-agent/message/send \
  -H "Content-Type: application/json" \
  -d '{"thread_id": "thread_abc", "content": "Hello"}'
```
