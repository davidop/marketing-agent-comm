# Guía de Deployment - Proxy Backend para Foundry

Esta guía cubre el deployment del proxy backend en diferentes plataformas.

## 📋 Pre-requisitos

Antes de desplegar, asegúrate de tener:

1. ✅ Una API key válida de Azure AI Foundry
2. ✅ El endpoint correcto de tu proyecto Foundry
3. ✅ Permisos de administrador en la plataforma de deployment
4. ✅ Git configurado y el proyecto en un repositorio

## 🔍 Validar configuración local

Antes de desplegar, verifica tu configuración:

```bash
npm run check
```

Este comando validará que tienes las variables de entorno correctas.

---

## 🌐 Vercel

### Paso 1: Preparar el proyecto

Asegúrate de que existen estos archivos:
- ✅ `api/run.js` (función serverless)
- ✅ `vercel.json` (configuración)

### Paso 2: Conectar con Vercel

```bash
# Instala Vercel CLI (si no lo tienes)
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

### Paso 3: Configurar variables de entorno

En el dashboard de Vercel:

1. Ve a tu proyecto → **Settings** → **Environment Variables**
2. Añade estas variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `FOUNDRY_API_KEY` | `tu-api-key-de-azure` | Production, Preview, Development |
| `VITE_USE_PROXY` | `true` | Production, Preview, Development |

### Paso 4: Re-desplegar

Después de configurar las variables:

```bash
vercel --prod
```

### Verificar

```bash
# Test del endpoint
curl -X POST https://tu-proyecto.vercel.app/api/run \
  -H "Content-Type: application/json" \
  -d '{"endpoint":"https://tenerife-winter-resource.services.ai.azure.com/api/projects/tenerife-winter/applications/campaign-impact-hub/protocols/activityprotocol?api-version=2025-11-15-preview","payload":{"messages":[{"role":"user","content":"Test"}]}}'
```

---

## 🟦 Netlify

### Paso 1: Preparar el proyecto

Asegúrate de que existen estos archivos:
- ✅ `netlify/functions/run.js` (función)
- ✅ `netlify.toml` (configuración)

### Paso 2: Conectar con Netlify

```bash
# Instala Netlify CLI (si no lo tienes)
npm i -g netlify-cli

# Login
netlify login

# Inicializar
netlify init

# Deploy
netlify deploy --prod
```

### Paso 3: Configurar variables de entorno

En el dashboard de Netlify:

1. Ve a **Site settings** → **Environment variables**
2. Añade estas variables:

| Variable | Value |
|----------|-------|
| `FOUNDRY_API_KEY` | `tu-api-key-de-azure` |
| `VITE_USE_PROXY` | `true` |

### Paso 4: Re-desplegar

Después de configurar las variables:

```bash
netlify deploy --prod
```

### Verificar

```bash
# Test del endpoint (Netlify redirige /api/run a /.netlify/functions/run)
curl -X POST https://tu-proyecto.netlify.app/api/run \
  -H "Content-Type: application/json" \
  -d '{"endpoint":"https://tenerife-winter-resource.services.ai.azure.com/api/projects/tenerife-winter/applications/campaign-impact-hub/protocols/activityprotocol?api-version=2025-11-15-preview","payload":{"messages":[{"role":"user","content":"Test"}]}}'
```

---

## 🐳 Docker

### Paso 1: Crear Dockerfile

Crea un archivo `Dockerfile` en la raíz:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["node", "server.js"]
```

### Paso 2: Crear .dockerignore

```
node_modules
dist
.env
.git
*.log
```

### Paso 3: Build y run

```bash
# Build
docker build -t campaign-impact-hub .

# Run (con variable de entorno)
docker run -p 3001:3001 -e FOUNDRY_API_KEY=tu-api-key campaign-impact-hub
```

### Paso 4: Docker Compose (opcional)

Crea `docker-compose.yml`:

```yaml
version: '3.8'
services:
  proxy:
    build: .
    ports:
      - "3001:3001"
    environment:
      - FOUNDRY_API_KEY=${FOUNDRY_API_KEY}
      - PORT=3001
    restart: unless-stopped
```

Run:
```bash
docker-compose up -d
```

---

## ☁️ Azure App Service

### Paso 1: Preparar el proyecto

Asegúrate de tener `server.js` y `package.json` configurados.

### Paso 2: Crear App Service

```bash
# Azure CLI
az login

# Crear Resource Group (si no existe)
az group create --name rg-campaign-impact-hub --location westeurope

# Crear App Service Plan
az appservice plan create \
  --name plan-campaign-impact-hub \
  --resource-group rg-campaign-impact-hub \
  --sku B1 \
  --is-linux

# Crear Web App
az webapp create \
  --name campaign-impact-hub \
  --resource-group rg-campaign-impact-hub \
  --plan plan-campaign-impact-hub \
  --runtime "NODE:20-lts"
```

### Paso 3: Configurar variables de entorno

```bash
az webapp config appsettings set \
  --name campaign-impact-hub \
  --resource-group rg-campaign-impact-hub \
  --settings \
    FOUNDRY_API_KEY="tu-api-key-de-azure" \
    VITE_USE_PROXY="true" \
    PORT="8080"
```

### Paso 4: Deploy

```bash
# Usando GitHub Actions (recomendado)
az webapp deployment source config \
  --name campaign-impact-hub \
  --resource-group rg-campaign-impact-hub \
  --repo-url https://github.com/tu-usuario/tu-repo \
  --branch main \
  --manual-integration

# O usando ZIP deploy
npm run build
zip -r deploy.zip .
az webapp deploy \
  --name campaign-impact-hub \
  --resource-group rg-campaign-impact-hub \
  --src-path deploy.zip
```

---

## 🔧 Heroku

### Paso 1: Preparar Procfile

Crea un archivo `Procfile`:

```
web: node server.js
```

### Paso 2: Deploy

```bash
# Login
heroku login

# Crear app
heroku create campaign-impact-hub

# Configurar variables
heroku config:set FOUNDRY_API_KEY=tu-api-key-de-azure
heroku config:set VITE_USE_PROXY=true

# Deploy
git push heroku main
```

---

## 🧪 Testing del Deployment

### Health Check

```bash
curl https://tu-dominio.com/health
```

Respuesta esperada:
```json
{
  "status": "ok",
  "service": "foundry-proxy",
  "hasApiKey": true
}
```

### Test completo del proxy

```bash
curl -X POST https://tu-dominio.com/api/run \
  -H "Content-Type: application/json" \
  -d '{
    "endpoint": "https://tenerife-winter-resource.services.ai.azure.com/api/projects/tenerife-winter/applications/campaign-impact-hub/protocols/activityprotocol?api-version=2025-11-15-preview",
    "payload": {
      "messages": [
        {
          "role": "user",
          "content": "Genera una campaña de marketing para Azure ARC dirigida a CTOs"
        }
      ],
      "context": {
        "campaignContext": {
          "product": "Azure ARC",
          "target": "CTOs, Responsables IT",
          "channels": ["LinkedIn", "Email"],
          "brandTone": "profesional",
          "budget": "3000€"
        },
        "uiState": {
          "view": "campaign"
        }
      }
    }
  }'
```

---

## 🐛 Troubleshooting por Plataforma

### Vercel

**Error: "Function invocation timeout"**
- Aumenta `maxDuration` en `vercel.json` (máx 60s en Hobby, 300s en Pro)

**Error: "Cannot find module"**
- Verifica que `package.json` tenga todas las dependencies (no devDependencies)

### Netlify

**Error: "Function did not return a response"**
- Asegúrate de que la función retorna `{ statusCode, body }`
- Verifica que el path sea `netlify/functions/run.js`

**Error: "Build failed"**
- Verifica `netlify.toml` tiene la configuración correcta de `functions`

### Docker

**Error: "Connection refused"**
- Verifica que el puerto expuesto coincida con el de la app (`EXPOSE 3001`)
- Usa `0.0.0.0` en lugar de `localhost` dentro del contenedor

**Error: "Environment variable not set"**
- Pasa la variable con `-e` en `docker run` o en `docker-compose.yml`

### Azure

**Error: "Application Error"**
- Verifica logs: `az webapp log tail --name tu-app --resource-group tu-rg`
- Asegúrate de que el `PORT` esté configurado a `8080` (default de Azure)

---

## 📊 Monitoring y Logs

### Vercel
```bash
vercel logs tu-proyecto.vercel.app
```

### Netlify
```bash
netlify logs
```

### Docker
```bash
docker logs -f <container-id>
```

### Azure
```bash
az webapp log tail --name tu-app --resource-group tu-rg
```

---

## 🔒 Checklist de Seguridad Post-Deployment

- [ ] `FOUNDRY_API_KEY` está en el servidor (no en el repo)
- [ ] `.env` está en `.gitignore`
- [ ] Endpoint usa HTTPS en producción
- [ ] Variables de entorno configuradas en el dashboard de la plataforma
- [ ] Health check responde correctamente
- [ ] Proxy funciona desde el frontend
- [ ] No hay logs de la API key en la consola del navegador
- [ ] CORS está manejado correctamente
- [ ] Rate limiting configurado (si es necesario)

---

## 📚 Recursos Adicionales

- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Docker Documentation](https://docs.docker.com/)
- [Azure App Service](https://learn.microsoft.com/azure/app-service/)
- [PROXY_BACKEND_GUIDE.md](./PROXY_BACKEND_GUIDE.md) - Guía técnica detallada
