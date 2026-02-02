# Integración con Azure AI Agent

## 🔌 Configuración del Agente

Campaign Impact Hub está integrado con Microsoft Azure AI Foundry para proporcionar capacidades avanzadas de IA conversacional.

### Endpoints Configurados

#### Proyecto Base
```
https://tenerife-winter-resource.services.ai.azure.com/api/projects/tenerife-winter
```

#### Aplicación
```
marketing-orchestrator
```

#### Protocolo de Actividad
```
https://tenerife-winter-resource.services.ai.azure.com/api/projects/tenerife-winter/applications/marketing-orchestrator/protocols/activityprotocol?api-version=2025-11-15-preview
```

#### API de Respuestas OpenAI
```
https://tenerife-winter-resource.services.ai.azure.com/api/projects/tenerife-winter/applications/marketing-orchestrator/protocols/openai/responses?api-version=2025-11-15-preview
```

## 🏗️ Arquitectura de la Integración

### Cliente Azure AI (`AzureAgentClient`)

La clase `AzureAgentClient` en `/src/lib/agentClient.ts` maneja toda la comunicación con Azure AI:

```typescript
const client = new AzureAgentClient({
  projectEndpoint: 'https://tenerife-winter-resource.services.ai.azure.com/api/projects/tenerife-winter',
  applicationName: 'marketing-orchestrator',
  apiVersion: '2025-11-15-preview',
  apiKey: 'YOUR_API_KEY', // Opcional
  debug: true
})
```

### Características

1. **Gestión de Estado de Conexión**
   - Estados: `idle`, `connecting`, `connected`, `reconnecting`, `disconnected`, `error`
   - Observable mediante `client.onState(callback)`

2. **Mensajería Asíncrona**
   - Envío de mensajes: `await client.sendMessage(text, options)`
   - Recepción mediante eventos: `client.onMessage(callback)`

3. **Contexto y Metadata**
   ```typescript
   await client.sendMessage("Mejora estos hooks", {
     context: { campaignId: '123', brief: briefData },
     metadata: { language: 'es', source: 'war-room' }
   })
   ```

4. **Manejo de Errores**
   - Reintentos automáticos
   - Eventos de error observables: `client.onError(callback)`

## 🎯 Uso en War Room Chat

El componente `WarRoomChat` utiliza el cliente para:

### 1. Conexión Automática
```typescript
const agentClient = useMemo(() => {
  const client = new AzureAgentClient({ ... })
  client.onMessage((msg) => {
    // Procesar respuestas del agente
  })
  return client
}, [])

useEffect(() => {
  agentClient.connect()
  return () => agentClient.disconnect()
}, [agentClient])
```

### 2. Envío de Mensajes
```typescript
await agentClient.sendMessage(userInput, {
  metadata: {
    language: language,
    source: 'war-room-chat'
  }
})
```

### 3. Indicadores Visuales
- Badge de conexión (Conectado/Conectando)
- Iconos `PlugsConnected` / `Plug` según estado
- Estados de carga durante procesamiento

## 🔐 Autenticación

### Opción 1: API Key (Recomendado para desarrollo)
```typescript
const client = new AzureAgentClient({
  projectEndpoint: '...',
  applicationName: 'marketing-orchestrator',
  apiKey: 'YOUR_API_KEY'
})
```

### Opción 2: Azure AD / Token personalizado
```typescript
const client = new AzureAgentClient({
  projectEndpoint: '...',
  applicationName: 'marketing-orchestrator',
  getAuthHeader: async () => {
    const token = await getAzureToken()
    return `Bearer ${token}`
  }
})
```

## 📊 Formato de Mensajes

### Request (OpenAI Compatible)
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Genera 10 hooks para campaña de Azure ARC"
    }
  ],
  "context": {
    "brief": { ... },
    "brandKit": { ... }
  },
  "metadata": {
    "language": "es",
    "source": "war-room"
  }
}
```

### Response
```json
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "Aquí están los 10 hooks..."
      }
    }
  ]
}
```

## 🛠️ Comandos del War Room

El War Room soporta comandos especiales que se pueden enviar al agente:

- `/mejora-hooks` - Mejora los hooks actuales
- `/más-premium` - Ajusta el tono a más premium
- `/b2b` - Adapta el contenido para B2B
- `/reduce-riesgo` - Reduce claims arriesgados
- `/regenera-bloque` - Regenera un bloque específico
- `/crea-landing` - Genera copy para landing page
- `/paid-pack` - Crea estructura de campañas pagadas
- `/flow-email` - Diseña secuencias de email

## 🧪 Testing y Debug

### Activar modo debug
```typescript
const client = new AzureAgentClient({
  // ...
  debug: true
})
```

Esto mostrará en consola:
- URLs de requests
- Payloads enviados
- Respuestas recibidas
- Cambios de estado

### Monitorear eventos
```typescript
client.onState(state => console.log('Estado:', state))
client.onMessage(msg => console.log('Mensaje:', msg))
client.onError(err => console.error('Error:', err))
client.onRawActivity(activity => console.log('Raw:', activity))
```

## 🚀 Próximas Mejoras

1. **Streaming de Respuestas**: Mostrar texto del agente en tiempo real
2. **Historial de Conversación**: Guardar y recuperar conversaciones anteriores
3. **Attachments**: Enviar archivos y contexto estructurado
4. **Multi-Agent**: Soportar múltiples agentes especializados
5. **Voice Input**: Integrar speech-to-text para comandos de voz

## 📚 Referencias

- [Azure AI Foundry Documentation](https://learn.microsoft.com/azure/ai-studio/)
- [Activity Protocol Specification](https://learn.microsoft.com/azure/ai-studio/how-to/develop/flow-deploy-and-connect)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)

## 🐛 Troubleshooting

### Error: "Failed to connect"
- Verificar que los endpoints sean correctos
- Comprobar API key si es necesaria
- Revisar CORS si estás en desarrollo local

### Error: "No response from agent"
- Verificar que el agente `marketing-orchestrator` esté desplegado
- Revisar logs del agente en Azure AI Studio
- Comprobar formato del mensaje enviado

### Estado "reconnecting" constante
- Verificar conectividad de red
- Revisar timeouts configurados
- Comprobar que el servicio esté disponible
