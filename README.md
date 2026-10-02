# HackTrack

A hackathon team and task tracker. React + Vite + Tailwind, all in the browser —
no backend, no database. Data is saved to `localStorage`, so it stays on
whichever browser you use it in.

## Run locally
```
cd frontend
npm install
npm run dev
```
Open http://localhost:5173

## Run with Docker
```
docker compose up --build
```
Open http://localhost:3000

## Features
- **Dashboard** — team size, total/completed/pending tasks, overall progress
- **Team** — add, edit, delete members
- **Tasks** — create, edit, delete, assign, prioritize, set deadlines
- **Board** — drag-and-drop Kanban across To Do / In Progress / Completed

## Push to GitHub
```
git init && git add . && git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<you>/hacktrack.git
git push -u origin main
```
