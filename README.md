# Web Starter

A small full-stack starter for apps built mostly by AI agents: Fastify and Postgres on the server, React on the client, one Docker container, deployed by Coolify on every push to `main`. The app keeps working through short outages: changes made offline show straight away and sync when the connection returns.

Agent rules live in `AGENTS.md`. The project brief lives in `PROBLEM.md`.

## Start a new project

1. Copy this folder and run `git init` in the copy.
2. Fill in `PROBLEM.md`.
3. `cp .env.example .env`, then `npm install` and `npm run dev`. Open http://localhost:5173.
4. Build the first real feature by copying the `todos` feature, then delete `todos`.

Needs Node 24 (see `.nvmrc`) and Docker.

## Deploy with Coolify

1. In Coolify, add a PostgreSQL database on your server and copy its internal connection URL.
2. Add an application from your Git repository, using the Dockerfile build option, with port 3000 exposed.
3. Set the `DATABASE_URL` environment variable to the database's internal URL.
4. Turn on automatic deploys for the `main` branch.

Each push to `main` then builds the `Dockerfile`, which typechecks and builds the app, runs pending database migrations on start, and replaces the running container.

## Keeping packages current

Versions are pinned exactly. To update, run `npm outdated`, bump one package at a time, and check that `npm run verify` still passes.

Draft prepared with AI assistance: requires review before distribution.
