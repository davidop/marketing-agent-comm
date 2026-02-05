# Proxy Backend - Quick Start Guide

Guía rápida de 5 minutos para configurar el proxy backend.

## 📋 Pre-requisitos

- Node.js 20+ instalado
- Una API key válida de Azure AI Foundry
- El endpoint de tu proyecto Foundry

## 🚀 Configuración en 3 Pasos

### Paso 1: Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
# Backend (servidor) - REQUERIDO
FOUNDRY_API_KEY=tu-api-key-de-azure-aqui

# Frontend - OPCIONAL (tiene valores por defecto)
VITE_USE_PROXY=true
VITE_FOUNDRY_ENDPOINT=https://tenerife-winter-resource.services.ai.azure.com/api/projects/tenerife-winter/applications/campaign-impact-hub/protocols/activityprotocol?api-version=2025-11-15-preview
```

**¿Dónde conseguir la API key?**

1. Ve a [Azure Portal](https://portal.azure.com)
2. Busca tu recurso de AI Foundry
3. En el menú lateral: **Keys and Endpoint**
4. Copia **Key 1** o **Key 2**

### Paso 2: Verificar Configuración

```bash
npm run check
```

Deberías ver:
```
✓ FOUNDRY_API_KEY: ab12...xy89
✓ VITE_USE_PROXY: Enabled (✓)
✓ Configuration looks good!
```

### Paso 3: Iniciar el Proxy

```bash
# Solo proxy
npm run proxy

# O frontend + proxy simultáneamente
npm run dev:all
```

El proxy estará disponible en: `http://localhost:3001`

## ✅ Verificar que Funciona

### Test 1: Health Check

```bash
curl http://localhost:3001/health
```

Respuesta esperada:
```json
{
  "status": "ok",
  "service": "foundry-proxy",
  "hasApiKey": true
}
```

### Test 2: Prueba Completa

```bash
npm run test:proxy
```

Deberías ver:
```
✓ Health test
✓ Validation test
✓ Proxy test
Total: 3/3 passed
🎉 All tests passed!
```

## 🌐 Uso desde el Frontend

El frontend ya está configurado para usar el proxy automáticamente. Simplemente:

1. Ve a la pestaña **Campaña**
2. Completa el brief
3. Haz clic en **Generar campaña**

El frontend llamará a `/api/run` que redirigirá a Foundry de forma segura.

## 🐛 Problemas Comunes

### Error: "FOUNDRY_API_KEY not configured"

**Solución:**
```bash
# Verifica que el archivo .env existe y tiene la key
cat .env | grep FOUNDRY_API_KEY

# Si no existe, créalo:
echo "FOUNDRY_API_KEY=tu-api-key" > .env
```

### Error: "Cannot connect to proxy"

**Solución:**
```bash
# Asegúrate de que el proxy está corriendo
npm run proxy

# En otra terminal, prueba la conexión
curl http://localhost:3001/health
```

### Error 401 desde Foundry

**Posibles causas:**
1. API key incorrecta o expirada
2. Endpoint incorrecto (verifica la región)
3. Permisos insuficientes en Azure

**Solución:**
1. Verifica la key en Azure Portal
2. Asegúrate de que el endpoint es el correcto para tu región
3. Regenera la key si es necesario

## 🎯 Siguientes Pasos

### Desarrollo Local

```bash
# Terminal 1: Proxy
npm run proxy

# Terminal 2: Frontend
npm run dev

# O ambos juntos:
npm run dev:all
```

Abre http://localhost:5173 y prueba la app.

### Deployment en Vercel

```bash
# 1. Conectar con Vercel
vercel

# 2. Configurar API key en el dashboard
# Settings → Environment Variables → FOUNDRY_API_KEY

# 3. Deploy
vercel --prod
```

### Deployment en Netlify

```bash
# 1. Conectar con Netlify
netlify init

# 2. Configurar API key en el dashboard
# Site Settings → Environment Variables → FOUNDRY_API_KEY

# 3. Deploy
netlify deploy --prod
```

## 📚 Documentación Completa

- [PROXY_BACKEND_GUIDE.md](./PROXY_BACKEND_GUIDE.md) - Guía técnica detallada
- [DEPLOYMENT_PROXY.md](./DEPLOYMENT_PROXY.md) - Deployment en todas las plataformas
- [api/README.md](./api/README.md) - Referencia del API

## 💡 Tips

1. **Desarrollo**: Usa `npm run dev:all` para iniciar todo de una vez
2. **Testing**: Corre `npm run test:proxy` después de cada cambio
3. **Deployment**: Siempre configura `FOUNDRY_API_KEY` en el servidor, nunca en el frontend
4. **Seguridad**: Añade `.env` a `.gitignore` (ya está incluido)

## ✨ ¡Listo!

Ahora tu proxy backend está configurado y funcionando. El frontend puede llamar a Foundry de forma segura sin exponer la API key.

Si tienes problemas, revisa:
- [Troubleshooting completo](./PROXY_BACKEND_GUIDE.md#troubleshooting)
- [Logs del servidor](./DEPLOYMENT_PROXY.md#monitoring-y-logs)
