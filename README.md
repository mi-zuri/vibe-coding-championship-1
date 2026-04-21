# Obecność

A platform connecting volunteers with lonely seniors, built for
**Stowarzyszenie mali bracia Ubogich (mbU)**.

Production: https://mi.zur-i.com

> Built in under 2 hours for a Vibe Coding Championship — from first hearing
> the problem to a fully working, publicly deployed site. Everything below
> reflects the state at the end of that sprint.

---

## Quickstart

**Requirements:** Docker, Node 20+, Git, `make`.

```bash
git clone git@github.com:mi-zuri/vc.git
cd vc
make setup            # one-off: copies .env, installs deps, boots backend+db
make dev-frontend     # Vite dev server on :5173
```

Then open http://localhost:5173.

If you want a single command for everything:

```bash
make dev              # backend+db in background, frontend in foreground
```

Full command list: `make help`.

---

## Architecture — at a glance

```
frontend (Vite, :5173)  ──fetch('/api/*')──→  backend (Express, :3001)
                                                       │
                                                       ▼
                                              Postgres 16 (in Docker)
```

- **Frontend** — React 18 + React Router, `frontend/src/`
- **Backend** — Express + `pg`, `backend/src/index.js`
- **Database** — Postgres 16 in Docker, schema in `backend/src/schema.sql`,
  seed data in `backend/src/seeds/`
- **Production** — Nginx serves the built frontend and reverse-proxies the
  backend; CI/CD via GitHub Actions on push to `main`

Full write-up: [`docs/Webpage Building Guide.md`](docs/Webpage%20Building%20Guide.md).

---

## Ports

| Port | What | When |
|---|---|---|
| 5173 | Vite dev server (frontend) | dev |
| 3001 | Backend API (Docker) | dev + prod-like |
| 5432 | Postgres | internal to the Docker network, not exposed |

In **dev**, Vite proxies `/api/*` → `localhost:3001`, so in code you write
`fetch('/api/seniors')` and it works identically in production.

---

## Common operations

```bash
make health           # is the backend alive? (curl /health)
make logs             # backend logs (Ctrl+C to exit)
make restart-backend  # swap backend code without resetting the db
make reset-db         # wipe the db and reload seeds (WARNING: destroys data)
make down             # stop backend+db (close the frontend with Ctrl+C)
make build-frontend   # build prod dist/ (smoke test before deploy)
make clean            # wipe everything (node_modules, db volume)
```

### Changing the database schema

1. Edit `backend/src/schema.sql` (we use `CREATE TABLE IF NOT EXISTS`).
2. For non-additive changes (column renames, DROPs): `make reset-db`.
3. Remember: production has no migrations — schema changes need coordination.

### Adding an endpoint

All endpoints live in `backend/src/index.js`. The backend runs with
`node --watch` (under `npm run dev`), so it reloads on file save. Under
Compose, a file save does **not** restart the container; use
`make restart-backend`, or run the backend locally (outside Docker) while
iterating.

### Adding a page

1. Create `frontend/src/pages/PageName.jsx`.
2. Register the route in `frontend/src/App.jsx`.
3. Vite HMR swaps it in live — no refresh needed.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `make setup` — "port is already allocated" | something is listening on 3001 | `lsof -i :3001` and kill it; or `make down` |
| Frontend shows a CORS error | you skipped the proxy in vite.config.js | check that `/api` is in `server.proxy` |
| Frontend shows 404 after F5 on `/dashboard` | that's the Vite dev server — fine in dev; the bug would be in prod (check `try_files` in nginx.conf) | — |
| Backend crashes with `ECONNREFUSED ::1:5432` | Postgres hasn't started yet | `make logs`, wait for `pg_isready` |
| Empty list of seniors at `/seniorzy-czekajacy` | seeds didn't load (the db was empty at seed time but now has no records) | `make reset-db` |
| `make health` returns `✗ backend not responding` | container died | `docker compose ps`, `make logs` |
| Node X.Y — 20+ required | old Node version | `nvm use` (the repo ships a `.nvmrc`) |

---

## Deploy

Automatic: `git push origin main` → GitHub Actions SSHes into EC2 and
deploys (~26s). Workflow: `.github/workflows/deploy.yml`.

Deploy status: `gh run watch`.

---

## Structure

```
vc/
├── Makefile                    # dev orchestration
├── docker-compose.yml          # backend + db
├── nginx.conf                  # prod reference (lives on the server)
├── .env.example                # environment variable template
├── .nvmrc                      # pins Node 20
│
├── .github/workflows/
│   └── deploy.yml              # CI/CD
│
├── backend/
│   ├── Dockerfile
│   └── src/
│       ├── index.js            # API endpoints
│       ├── db.js               # pool + seed
│       ├── schema.sql          # tables
│       └── seeds/              # starter data (seniors, inspirations)
│
├── frontend/
│   ├── vite.config.js          # /api proxy in dev
│   ├── public/poland.svg       # map for LonelinessMap
│   └── src/
│       ├── pages/              # Landing, Register, SeniorList, Waiting, Dashboard
│       ├── components/         # Layout, LonelinessMap
│       └── index.css           # design system
│
└── docs/
    └── Webpage Building Guide.md   # build walkthrough
```

---

## License and contact

Project for mbU, contact: michal.zurawski02@gmail.com.
