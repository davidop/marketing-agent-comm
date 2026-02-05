# Proxy Backend - Foundry Integration

Este directorio contiene la implementación del proxy backend para llamadas seguras a Microsoft Foundry.

## 🎯 ¿Por qué usar el proxy?

1. **Seguridad**: La API key de Foundry nunca se expone en el frontend
2. **CORS**: Evita problemas de CORS al hacer la llamada desde el servidor
3. **Control**: Permite agregar logging, rate limiting y validación

## 🚀 Opciones de deployment

### Vercel (Serverless Functions)

El archivo `api/run.js` es una Vercel Serverless Function.

**Configuración:**
1. Despliega tu proyecto en Vercel
2. En Settings → Environment Variables, añade:
   ```
   FOUNDRY_API_KEY=tu-api-key-de-azure
   ```
3. El endpoint `/api/run` estará disponible automáticamente

### Netlify (Functions)

El archivo `netlify/functions/run.js` es una Netlify Function.

**Configuración:**
1. Despliega tu proyecto en Netlify
2. En Site Settings → Environment Variables, añade:
   ```
   FOUNDRY_API_KEY=tu-api-key-de-azure
   ```
3. El endpoint `/.netlify/functions/run` estará disponible

**Nota:** Actualiza `proxyEndpoint` en el frontend a `/.netlify/functions/run`

### Node.js Express (Servidor tradicional)

El archivo `server.js` es un servidor Express standalone.

**Configuración:**

1. Crea un archivo `.env` en la raíz:
   ```bash
   FOUNDRY_API_KEY=tu-api-key-de-azure
   PORT=3001
   ```

2. Inicia el servidor:
   ```bash
   npm run proxy
   ```

3. El proxy estará disponible en `http://localhost:3001/api/run`

**Desarrollo paralelo (frontend + proxy):**
```bash
npm run dev:all
```
Esto inicia Vite (frontend) y el proxy server simultáneamente.

## 🔧 Configuración Frontend

Crea o edita tu archivo `.env`:

```bash
# Usar proxy (recomendado para producción)
VITE_USE_PROXY=true

# Endpoint de Foundry (opcional, tiene fallback)
VITE_FOUNDRY_ENDPOINT=https://tenerife-winter-resource.services.ai.azure.com/api/projects/tenerife-winter/applications/campaign-impact-hub/protocols/activityprotocol?api-version=2025-11-15-preview
```

## 🧪 Testing

### Probar el proxy localmente

```bash
curl -X POST http://localhost:3001/api/run \
  -H "Content-Type: application/json" \
  -d '{
    "endpoint": "https://tenerife-winter-resource.services.ai.azure.com/api/projects/tenerife-winter/applications/campaign-impact-hub/protocols/activityprotocol?api-version=2025-11-15-preview",
    "payload": {
      "messages": [{"role": "user", "content": "Test brief"}],
      "context": {"uiState": {"view": "campaign"}}
    }
  }'
```

### Health check

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

## 🐛 Troubleshooting

### Error 401/403

**Síntomas:** Authentication error

**Soluciones:**
- Verifica que `FOUNDRY_API_KEY` esté configurada en el servidor
- Verifica que la key sea válida en Azure Portal
- Verifica que uses el endpoint correcto para tu región de Azure
- Revisa que la key tenga permisos sobre el proyecto/aplicación

### Error 404 en /api/run

**Síntomas:** Proxy endpoint not found

**Soluciones:**
- El servidor proxy no está corriendo (usa `npm run proxy`)
- En Vercel/Netlify, verifica que el deployment haya incluido las funciones
- Temporalmente, puedes usar modo directo: `VITE_USE_PROXY=false`

### Error CORS en modo directo

**Síntomas:** CORS error, blocked by browser

**Soluciones:**
- **Usa el proxy**: `VITE_USE_PROXY=true` (recomendado)
- El modo directo (`VITE_USE_PROXY=false`) no funciona en producción por políticas CORS de Azure

### Error 500: FOUNDRY_API_KEY not configured

**Síntomas:** API key not configured on server

**Soluciones:**
- **Vercel/Netlify**: Añade la variable en el dashboard
- **Express local**: Crea `.env` con `FOUNDRY_API_KEY=...`
- **Docker/Cloud**: Configura la variable de entorno en tu plataforma

## 🔒 Seguridad

### ✅ Buenas prácticas

- ✅ **Configura `FOUNDRY_API_KEY` solo en el servidor** (backend)
- ✅ **Usa el proxy en producción** (`VITE_USE_PROXY=true`)
- ✅ **No expongas la API key en el frontend** (nunca uses `VITE_FOUNDRY_API_KEY` en producción)
- ✅ **Añade rate limiting** si esperas mucho tráfico
- ✅ **Valida payloads** antes de enviarlos a Foundry
- ✅ **Usa HTTPS** en producción

### ❌ Malas prácticas

- ❌ No pongas `FOUNDRY_API_KEY` en `.env` con prefijo `VITE_`
- ❌ No uses modo directo en producción
- ❌ No commitees la API key en el repo
- ❌ No expongas logs de la key en la consola del navegador

## 📋 Checklist de Deployment

### Antes de desplegar

- [ ] `FOUNDRY_API_KEY` configurada en el servidor (no en frontend)
- [ ] `VITE_USE_PROXY=true` en el frontend
- [ ] Archivo de proxy (`api/run.js` o `netlify/functions/run.js`) incluido en el deployment
- [ ] Endpoint de Foundry correcto para tu región
- [ ] `.env` local NO commitado (añadido a `.gitignore`)

### Después de desplegar

- [ ] Probar health check: `curl https://tu-dominio.com/health`
- [ ] Probar proxy: `curl -X POST https://tu-dominio.com/api/run -d '...'`
- [ ] Verificar logs en el dashboard de tu plataforma
- [ ] Verificar que el frontend puede llamar al proxy
- [ ] Hacer una prueba end-to-end desde la UI

## 📚 Referencias

- [PROXY_BACKEND_GUIDE.md](../PROXY_BACKEND_GUIDE.md) - Guía completa del proxy
- [.env.example](../.env.example) - Variables de entorno recomendadas
- [Foundry Client](../src/lib/foundryClient.ts) - Cliente TypeScript del frontend
