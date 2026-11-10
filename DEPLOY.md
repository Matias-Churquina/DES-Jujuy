# Deploy DES

## Railway (backend + DB)
1. https://railway.com → Login con GitHub → New Project → Deploy from GitHub → DES-Jujuy
2. Add Service → Database → PostgreSQL (genera DATABASE_URL auto)
3. Servicio backend: Root Directory = `backend`, env vars:
   - DATABASE_URL = ${{Postgres.DATABASE_URL}} (referencia automática)
   - JWT_SECRET, MERCADOPAGO_ACCESS_TOKEN
   - MERCADOPAGO_WEBHOOK_URL = https://<tu-app>.up.railway.app/api/pagos/webhook
   - CORS_ORIGIN = https://<tu-app>.vercel.app
   - DB_SYNCHRONIZE=true, RUN_SEED=true (una vez, luego false)
4. Settings → Generate Domain → copiá la URL → actualizá web/vercel.json destination + webhook MP

## Vercel (frontend)
1. https://vercel.com → Login GitHub → Import DES-Jujuy → Root Directory = `web` → Framework Vite
2. Env var: VITE_WS_URL = https://<tu-app>.up.railway.app
3. Deploy → copiá la URL → actualizá CORS_ORIGIN en Railway
