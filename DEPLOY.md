# 🚀 Guía de Despliegue en Railway

## Arquitectura

```
┌──────────────────────────────────────────────────────┐
│                     Railway                          │
│                                                      │
│  ┌──────────┐   ┌──────────┐   ┌────────────────┐  │
│  │  Portal   │──▶│   API    │──▶│  PostgreSQL    │  │
│  │ (Nginx +  │   │ (NestJS) │   │  (Railway      │  │
│  │  React)   │   │ :3000    │   │   managed)     │  │
│  │  :80      │   │          │   │                │  │
│  └──────────┘   └──────────┘   └────────────────┘  │
│                                                      │
└──────────────────────────────────────────────────────┘
```

## Paso 1: Crear cuenta y proyecto en Railway

1. Ve a [railway.com](https://railway.com) e inicia sesión con GitHub
2. Crea un **New Project** → asígnale nombre (ej: `mygrc`)
3. **NO añadas servicios manualmente** — lo haremos con `railway.toml` y GitHub Actions

## Paso 2: Migrar tu base de datos local a Railway

### 2.1 Añadir PostgreSQL en Railway

1. En tu proyecto de Railway, haz clic en **+ New Service** → **Database** → **PostgreSQL**
2. Railway te dará un `DATABASE_URL` público. Cópialo.
3. Ve a la pestaña **Variables** del servicio PostgreSQL y anota:
   - `PGHOST`
   - `PGPORT`
   - `PGUSER`
   - `PGPASSWORD`
   - `PGDATABASE`

### 2.2 Exportar tu BD local

En tu terminal de Windows (PowerShell o CMD):

```bash
cd c:\xampp\htdocs\mygrc
scripts\backup-db.bat
```

Esto genera `mygrc_backup.sql` en la raíz del proyecto.

### 2.3 Importar en Railway

```bash
# Instalar Railway CLI (si no lo tienes)
npm install -g @railway/cli

# Conectarte a tu proyecto
railway login
railway link

# Importar el backup
railway run psql -f mygrc_backup.sql
```

O directamente con psql si lo tienes instalado:

```bash
psql "postgresql://postgres:TU_PASSWORD@TU_HOST:TU_PORT/railway" -f mygrc_backup.sql
```

## Paso 3: Configurar GitHub Secrets

En tu repositorio de GitHub (`Settings` → `Secrets and variables` → `Actions`):

| Secret | Descripción |
|---|---|
| `RAILWAY_TOKEN` | Token de Railway CLI. Consíguelo en [Railway → Settings → Tokens](https://railway.com/account/tokens) |
| `DATABASE_URL` | La URL completa de PostgreSQL que te dio Railway: `postgresql://postgres:password@host:port/railway` |

## Paso 4: Configurar variables de entorno en Railway

En el dashboard de Railway, añade estas variables para el servicio **api**:

| Variable | Valor |
|---|---|
| `PORT` | `3000` |
| `NODE_ENV` | `production` |
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` (referencia al servicio PostgreSQL) |

Y para el servicio **portal** no se necesitan variables adicionales.

## Paso 5: Desplegar

Simplemente haz push a la rama `main`:

```bash
git add .
git commit -m "Deploy to Railway"
git push origin main
```

El GitHub Actions workflow (`.github/workflows/deploy-railway.yml`) se ejecutará automáticamente:
1. Ejecuta las migraciones de Prisma en la BD de Railway
2. Construye y despliega la API
3. Construye y despliega el Portal

## Paso 6: Verificar

Una vez desplegado, Railway te dará URLs públicas para cada servicio:
- **Portal**: `https://portal-tu-proyecto.railway.app`
- **API**: `https://api-tu-proyecto.railway.app`
- **Swagger**: `https://api-tu-proyecto.railway.app/api/docs`

## Solución de problemas

### Las migraciones fallan
- Asegúrate de que `DATABASE_URL` en GitHub Secrets apunta a la BD de Railway
- Verifica que la BD de Railway acepta conexiones externas (está abierto por defecto)

### La API no arranca
- Revisa los logs en Railway: `railway logs --service api`
- Verifica que `DATABASE_URL` está configurado en las variables del servicio

### El portal no carga
- Revisa que el `config.ts` del portal usa `/api` como `API_BASE` en producción
- El nginx del portal hace proxy reverso a la API internamente
