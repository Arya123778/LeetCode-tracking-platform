# TODO - LC Tracking Platform

## Completed
- [x] Created base React/Vite structure, routing, auth store, axios API client, login/register/profile pages
- [x] Implemented Problems page, Due-for-review (spaced repetition) page, Goals page, Stats page


## Steps
1. Create missing frontend app under `frontend/src/` (React + router + Tailwind).
2. Implement auth store (JWT token + user) and route guard.
3. Implement axios API client for existing backend endpoints.
4. Build pages:
   - Register/Login/Profile
   - Problems (list/add/edit/delete + filters)
   - Goals (list/create/delete + progress)
   - Stats (overview + difficulty + topics + heatmap + weekly)
   - Due for review (spaced repetition queue + update confidence -> next review)
5. Add basic UI states (loading/error) and confirm wiring works.
6. Smoke test by running backend and frontend.

