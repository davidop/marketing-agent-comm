# 🚀 Guía de Despliegue - Campaign Impact Hub

## Información General

Campaign Impact Hub es una aplicación web React/TypeScript conectada a un agente de Azure AI Foundry para generación de campañas de marketing.

## 🔐 Credenciales de Azure

### Configuración del Agente

```bash
# Identificador del Agente
AZURE_EXISTING_AGENT_ID="marketing-orchestrator:2"

# Entorno y Ubicación
AZURE_ENV_NAME="agents-playground-8828"
AZURE_LOCATION="swedencentral"

# Subscription de Azure
AZURE_SUBSCRIPTION_ID="d1836173-d451-4210-b565-5cb14f7b2e7e"

# Endpoint del Proyecto AI
AZURE_EXISTING_AIPROJECT_ENDPOINT="https://tenerife-winter-resource.services.ai.azure.com/api/projects/tenerife-winter"

# IDs de Recursos
AZURE_EXISTING_AIPROJECT_RESOURCE_ID="/subscriptions/d1836173-d451-4210-b565-5cb14f7b2e7e/resourceGroups/rg-campaign-impact-hub/providers/Microsoft.CognitiveServices/accounts/tenerife-winter-resource/projects/tenerife-winter"

AZURE_EXISTING_RESOURCE_ID="/subscriptions/d1836173-d451-4210-b565-5cb14f7b2e7e/resourceGroups/rg-campaign-impact-hub/providers/Microsoft.CognitiveServices/accounts/tenerife-winter-resource"

# Flags
AZD_ALLOW_NON_EMPTY_FOLDER=true
```

### Plataforma de Hospedaje

**Microsoft Foundry** (Azure AI Foundry)
- **URL del Proyecto**: https://tenerife-winter-resource.services.ai.azure.com/api/projects/tenerife-winter
- **Resource Group**: `rg-campaign-impact-hub`
- **Cognitive Services Account**: `tenerife-winter-resource`
- **Proyecto**: `tenerife-winter`

## 🌐 Endpoints del Agente

### 1. Activity Protocol Endpoint
```
https://tenerife-winter-resource.services.ai.azure.com/api/projects/tenerife-winter/applications/marketing-orchestrator/protocols/activityprotocol?api-version=2025-11-15-preview
```

**Uso**: Comunicación bidireccional mediante Activity Protocol (similar a Bot Framework).

### 2. OpenAI Responses Endpoint (Actualmente en uso)
```
https://tenerife-winter-resource.services.ai.azure.com/api/projects/tenerife-winter/applications/marketing-orchestrator/protocols/openai/responses?api-version=2025-11-15-preview
```

**Uso**: API compatible con OpenAI para respuestas conversacionales.

## ⚙️ Configuración de Variables de Entorno

### Archivo `.env` (Desarrollo Local)

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Azure AI Agent Configuration
VITE_AZURE_AGENT_ID=marketing-orchestrator:2
VITE_AZURE_ENV_NAME=agents-playground-8828
VITE_AZURE_LOCATION=swedencentral
VITE_AZURE_SUBSCRIPTION_ID=d1836173-d451-4210-b565-5cb14f7b2e7e

# Project Endpoints
VITE_AZURE_AIPROJECT_ENDPOINT=https://tenerife-winter-resource.services.ai.azure.com/api/projects/tenerife-winter
VITE_AZURE_AIPROJECT_RESOURCE_ID=/subscriptions/d1836173-d451-4210-b565-5cb14f7b2e7e/resourceGroups/rg-campaign-impact-hub/providers/Microsoft.CognitiveServices/accounts/tenerife-winter-resource/projects/tenerife-winter
VITE_AZURE_RESOURCE_ID=/subscriptions/d1836173-d451-4210-b565-5cb14f7b2e7e/resourceGroups/rg-campaign-impact-hub/providers/Microsoft.CognitiveServices/accounts/tenerife-winter-resource

# Optional: API Key for authentication (if required)
# VITE_AZURE_API_KEY=your-api-key-here

# Advanced Configuration
AZD_ALLOW_NON_EMPTY_FOLDER=true
```

### Variables de Producción

Para despliegue en producción, configura las mismas variables en tu plataforma de hosting (Vercel, Netlify, Azure Static Web Apps, etc.).

**Importante**: Todas las variables que comienzan con `VITE_` estarán disponibles en el cliente (browser), así que **NO incluyas secretos sensibles** en ellas.

## 📦 Instalación y Ejecución

### Prerequisitos

- Node.js 18+ y npm
- Acceso al proyecto Azure AI (para API keys si son necesarias)

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd spark-template
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Edita .env con tus credenciales
   ```

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

5. **Compilar para producción**
   ```bash
   npm run build
   ```

6. **Vista previa de producción**
   ```bash
   npm run preview
   ```

## 🔧 Configuración del Cliente Azure AI

El cliente `AzureAgentClient` en `src/lib/agentClient.ts` se configura automáticamente desde las variables de entorno:

```typescript
// En src/components/WarRoomChat.tsx
const agentClient = useMemo(() => {
  const projectEndpoint = import.meta.env.VITE_AZURE_AIPROJECT_ENDPOINT || 
    'https://tenerife-winter-resource.services.ai.azure.com/api/projects/tenerife-winter'
  const agentId = import.meta.env.VITE_AZURE_AGENT_ID || 'marketing-orchestrator:2'
  const applicationName = agentId.split(':')[0] || 'marketing-orchestrator'
  const apiKey = import.meta.env.VITE_AZURE_API_KEY
  
  return new AzureAgentClient({
    projectEndpoint,
    applicationName,
    apiVersion: '2025-11-15-preview',
    apiKey: apiKey || undefined,
    debug: true
  })
}, [])
```

## 🔐 Autenticación

### Opción 1: Sin Autenticación (Public Preview)

Si el agente está en preview público o configurado sin autenticación, la aplicación funcionará sin API key.

### Opción 2: API Key

Si necesitas autenticación con API key:

1. Obtén la API key desde el Azure Portal:
   - Navega a tu Cognitive Services account
   - Ve a "Keys and Endpoint"
   - Copia "Key 1" o "Key 2"

2. Añade la key a tu `.env`:
   ```env
   VITE_AZURE_API_KEY=tu-api-key-aqui
   ```

### Opción 3: Azure AD (Producción recomendada)

Para producción, se recomienda usar Azure AD authentication en lugar de API keys:

```typescript
const client = new AzureAgentClient({
  projectEndpoint: '...',
  applicationName: 'marketing-orchestrator',
  getAuthHeader: async () => {
    // Obtener token de Azure AD
    const token = await acquireAzureADToken()
    return `Bearer ${token}`
  }
})
```

## 🌍 Despliegue en Producción

### Opción 1: Vercel

1. Conecta tu repositorio en [Vercel](https://vercel.com)
2. Configura las variables de entorno en el dashboard de Vercel
3. Despliega automáticamente

### Opción 2: Azure Static Web Apps

1. Crea un Azure Static Web App en el portal
2. Conecta tu repositorio GitHub
3. Configura las variables de entorno en Configuration
4. El CI/CD se configura automáticamente

### Opción 3: Netlify

1. Conecta tu repositorio en [Netlify](https://netlify.com)
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Configura las variables de entorno en Site settings

## 🧪 Testing de la Conexión

Para verificar que la conexión con el agente funciona:

1. Ejecuta la aplicación en desarrollo
2. Ve a la tab "Campaign"
3. Abre el panel "War Room Chat" (columna derecha)
4. Deberías ver el badge "Conectado" en verde
5. Envía un mensaje de prueba: "Hola, ¿estás funcionando?"
6. Deberías recibir una respuesta del agente

### Debug de Conexión

Si hay problemas de conexión:

1. **Activa el modo debug** (ya está activado por defecto):
   ```typescript
   debug: true
   ```

2. **Revisa la consola del navegador** (F12):
   - Busca logs de `[AzureAgentClient]`
   - Verifica las URLs de los requests
   - Revisa los errores de red o CORS

3. **Verifica el estado del agente en Azure**:
   - Ve a [Azure Portal](https://portal.azure.com/)
   - Navega a tu subscription → Resource Group `rg-campaign-impact-hub`
   - Verifica que el servicio `tenerife-winter-resource` esté activo

4. **Comprueba CORS**:
   - Si estás en desarrollo local, podrías necesitar configurar CORS en Azure
   - En producción, asegúrate de que tu dominio esté en la whitelist

## 📊 Monitoreo

### Azure AI Studio

Accede a los logs y métricas del agente:

1. Ve a [Azure AI Studio](https://ai.azure.com/)
2. Selecciona tu proyecto `tenerife-winter`
3. Navega a Deployments → `marketing-orchestrator`
4. Revisa:
   - Logs de requests
   - Métricas de uso
   - Tasa de error
   - Latencia

### Application Insights (Opcional)

Para monitoreo avanzado, puedes configurar Application Insights:

```typescript
// src/lib/telemetry.ts
import { ApplicationInsights } from '@microsoft/applicationinsights-web'

const appInsights = new ApplicationInsights({
  config: {
    connectionString: import.meta.env.VITE_APPINSIGHTS_CONNECTION_STRING
  }
})

appInsights.loadAppInsights()
appInsights.trackPageView()
```

## 🔒 Seguridad

### Mejores Prácticas

1. **No commitees el archivo `.env`** - Está en `.gitignore` por defecto
2. **Usa variables `VITE_` solo para datos no sensibles** - Son públicas en el cliente
3. **Rota las API keys regularmente** en el portal de Azure
4. **Usa Azure AD en producción** en lugar de API keys
5. **Configura CORS correctamente** en Azure para tu dominio

### CORS Configuration

Si necesitas configurar CORS en Azure:

1. Ve a tu Cognitive Services resource en Azure Portal
2. Navega a "CORS" en el menú lateral
3. Añade los orígenes permitidos:
   - `http://localhost:5173` (desarrollo)
   - `https://tu-dominio-produccion.com` (producción)

## 📞 Soporte y Troubleshooting

### Errores Comunes

#### Error: "Failed to connect"
- **Causa**: Endpoint incorrecto o servicio no disponible
- **Solución**: Verifica las variables de entorno y el estado del servicio en Azure

#### Error: "401 Unauthorized"
- **Causa**: API key inválida o faltante
- **Solución**: Verifica la API key en Azure Portal y actualiza `.env`

#### Error: "CORS policy blocked"
- **Causa**: Dominio no permitido en la configuración CORS
- **Solución**: Añade tu dominio a la configuración CORS en Azure

#### Estado "Conectando..." permanente
- **Causa**: Timeout o problemas de red
- **Solución**: Verifica conectividad, revisa timeouts en `agentClient.ts`

### Documentación Adicional

- [AZURE_AI_INTEGRATION.md](./AZURE_AI_INTEGRATION.md) - Detalles técnicos de la integración
- [AGENT_SETUP.md](./AGENT_SETUP.md) - Configuración del agente paso a paso
- [README.md](./README.md) - Información general del proyecto
- [Azure AI Documentation](https://learn.microsoft.com/azure/ai-studio/)

### Contacto

Para problemas específicos del agente o la infraestructura Azure:
1. Revisa los logs en Azure AI Studio
2. Verifica el estado del servicio en Azure Portal
3. Consulta la documentación técnica en este repositorio
4. Activa `debug: true` para diagnóstico detallado

---

**Última actualización**: 2025-01-15  
**Versión del Agente**: marketing-orchestrator:2  
**API Version**: 2025-11-15-preview
