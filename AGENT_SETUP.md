# 🤖 Configuración del Agente Azure AI

## Información del Agente

El Campaign Impact Hub está conectado al agente **Marketing Orchestrator** desplegado en Azure AI Foundry.

### Credenciales y Configuración

```bash
# Agent Information
AZURE_EXISTING_AGENT_ID="marketing-orchestrator:2"
AZURE_ENV_NAME="agents-playground-8828"
AZURE_LOCATION="swedencentral"
AZURE_SUBSCRIPTION_ID="d1836173-d451-4210-b565-5cb14f7b2e7e"

# Endpoints
AZURE_EXISTING_AIPROJECT_ENDPOINT="https://tenerife-winter-resource.services.ai.azure.com/api/projects/tenerife-winter"

# Resource IDs
AZURE_EXISTING_AIPROJECT_RESOURCE_ID="/subscriptions/d1836173-d451-4210-b565-5cb14f7b2e7e/resourceGroups/rg-campaign-impact-hub/providers/Microsoft.CognitiveServices/accounts/tenerife-winter-resource/projects/tenerife-winter"
AZURE_EXISTING_RESOURCE_ID="/subscriptions/d1836173-d451-4210-b565-5cb14f7b2e7e/resourceGroups/rg-campaign-impact-hub/providers/Microsoft.CognitiveServices/accounts/tenerife-winter-resource"

# Flags
AZD_ALLOW_NON_EMPTY_FOLDER=true
```

## 🔌 Endpoints Activos

### 1. Activity Protocol Endpoint
```
https://tenerife-winter-resource.services.ai.azure.com/api/projects/tenerife-winter/applications/marketing-orchestrator/protocols/activityprotocol?api-version=2025-11-15-preview
```

**Uso**: Para comunicación bidireccional mediante el protocolo de actividad (similar a Bot Framework).

### 2. OpenAI Responses Endpoint
```
https://tenerife-winter-resource.services.ai.azure.com/api/projects/tenerife-winter/applications/marketing-orchestrator/protocols/openai/responses?api-version=2025-11-15-preview
```

**Uso**: Para comunicación compatible con API de OpenAI (recomendado para simplicidad).

## 🚀 Cómo Funciona

### 1. Conexión Automática

El componente `WarRoomChat` se conecta automáticamente al agente cuando se carga:

```typescript
const agentClient = new AzureAgentClient({
  projectEndpoint: 'https://tenerife-winter-resource.services.ai.azure.com/api/projects/tenerife-winter',
  applicationName: 'marketing-orchestrator',
  apiVersion: '2025-11-15-preview',
  debug: true,
  userId: `user-${Math.random().toString(16).slice(2)}`,
  userName: 'Campaign Impact User'
})

await agentClient.connect()
```

### 2. Envío de Mensajes

Los mensajes se envían al agente con contexto y metadata:

```typescript
await agentClient.sendMessage("Mejora estos hooks", {
  metadata: {
    language: 'es',
    source: 'war-room-chat'
  }
})
```

### 3. Recepción de Respuestas

Las respuestas del agente se reciben mediante eventos:

```typescript
agentClient.onMessage((msg) => {
  console.log('Respuesta del agente:', msg.text)
})
```

## 🎯 Comandos Disponibles

El War Room soporta comandos especiales:

| Comando | Descripción |
|---------|-------------|
| `/mejora-hooks` | Mejora los hooks actuales de la campaña |
| `/más-premium` | Ajusta el tono a más premium y sofisticado |
| `/b2b` | Adapta el contenido para audiencia B2B |
| `/reduce-riesgo` | Reduce claims arriesgados y mejora seguridad legal |
| `/regenera-bloque` | Regenera un bloque específico del output |
| `/crea-landing` | Genera copy completo para landing page |
| `/paid-pack` | Crea estructura completa de campañas pagadas |
| `/flow-email` | Diseña secuencias de email automatizadas |

## 🔐 Autenticación

### Desarrollo Local

Para desarrollo local, puedes usar una API key (si está disponible):

```typescript
const client = new AzureAgentClient({
  projectEndpoint: '...',
  applicationName: 'marketing-orchestrator',
  apiKey: process.env.VITE_AZURE_API_KEY
})
```

### Producción

En producción, se recomienda usar Azure AD authentication:

```typescript
const client = new AzureAgentClient({
  projectEndpoint: '...',
  applicationName: 'marketing-orchestrator',
  getAuthHeader: async () => {
    const token = await getAzureADToken()
    return `Bearer ${token}`
  }
})
```

## 📊 Indicadores de Estado

El War Room muestra indicadores visuales del estado de conexión:

- 🟢 **Conectado**: Cliente conectado y listo para recibir mensajes
- 🟡 **Conectando...**: Estableciendo conexión con el agente
- 🔴 **Desconectado**: Sin conexión activa

## 🐛 Troubleshooting

### Error: "Failed to connect"

**Soluciones**:
1. Verifica que los endpoints estén correctos
2. Comprueba que el agente `marketing-orchestrator:2` esté desplegado en Azure
3. Revisa la consola del navegador con `debug: true` para más detalles

### Error: "No response from agent"

**Soluciones**:
1. Verifica que el agente esté activo en Azure AI Studio
2. Revisa los logs del agente en Azure Portal
3. Comprueba el formato del mensaje enviado

### Estado "Conectando..." permanente

**Soluciones**:
1. Verifica conectividad de red
2. Revisa timeouts configurados en `agentClient.ts`
3. Comprueba CORS si estás en desarrollo local

## 📚 Recursos Útiles

- [Azure AI Foundry Portal](https://ai.azure.com/)
- [Documentación Azure AI Agents](https://learn.microsoft.com/azure/ai-studio/)
- [Consola del Proyecto Tenerife Winter](https://tenerife-winter-resource.services.ai.azure.com/)

## 🔧 Configuración Avanzada

### Ajustar Timeouts

```typescript
const client = new AzureAgentClient({
  projectEndpoint: '...',
  applicationName: 'marketing-orchestrator',
  requestTimeoutMs: 60000 // 60 segundos
})
```

### Activar Debug Logging

```typescript
const client = new AzureAgentClient({
  projectEndpoint: '...',
  applicationName: 'marketing-orchestrator',
  debug: true // Muestra logs detallados en consola
})
```

### Custom Headers

```typescript
const client = new AzureAgentClient({
  projectEndpoint: '...',
  applicationName: 'marketing-orchestrator',
  headers: {
    'X-Custom-Header': 'value'
  }
})
```

## 🎨 Personalización

### Cambiar Nombre de Usuario

```typescript
const client = new AzureAgentClient({
  projectEndpoint: '...',
  applicationName: 'marketing-orchestrator',
  userId: 'john-doe-123',
  userName: 'John Doe'
})
```

### Enviar Contexto Adicional

```typescript
await agentClient.sendMessage("Genera campaña", {
  metadata: {
    language: 'es',
    source: 'war-room',
    campaignId: 'camp-123',
    userId: 'user-456'
  }
})
```

## 🚦 Estado del Servicio

Para verificar el estado del servicio Azure AI:

1. Ir a [Azure Portal](https://portal.azure.com/)
2. Navegar a: Subscriptions → `d1836173-d451-4210-b565-5cb14f7b2e7e`
3. Resource Groups → `rg-campaign-impact-hub`
4. Resources → `tenerife-winter-resource`
5. Verificar estado y métricas

## 📞 Soporte

Para problemas con el agente o la conexión:

1. Revisar logs en Azure AI Studio
2. Verificar estado del servicio en Azure Portal
3. Consultar documentación en este repositorio
4. Activar `debug: true` para diagnóstico detallado
