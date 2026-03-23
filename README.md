# GLBITM Helpdesk

GLBITM Helpdesk is a full-stack complaint management system for college campuses. Students can sign in with Google, file complaints, and track updates, while admins can review, manage, and resolve complaints from a dedicated admin panel.

## Features

- Google OAuth login with backend token verification
- Allowed-domain and email-whitelist access control
- Extra admin access-code verification after Google sign-in
- Student dashboard, complaint filing, and complaint tracking
- Admin dashboard with recent complaints, full complaint list, filters, notifications, and status updates
- MongoDB Atlas persistence with ticket IDs and complaint metadata
- Vercel-ready frontend and API packaging

## Tech Stack

- Frontend: React, React Router, Axios
- Backend: Node.js, Express, Mongoose
- Authentication: Google OAuth, JWT
- Database: MongoDB Atlas
- Deployment: Vercel

## Project Structure

```text
glbitm-helpdesk/
  api/
  backend/
  public/
  src/
  package.json
  vercel.json
```

## Local Development

### Frontend

Create a root `.env` file using `.env.example`.

Example:

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
REACT_APP_ALLOWED_DOMAIN=glbitm.ac.in
```

Run:

```bash
npm install
npm start
```

### Backend

Create `backend/.env` using `backend/.env.example`.

Required values include:

```env
MONGODB_URI=your-mongodb-atlas-uri
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
JWT_SECRET=your-jwt-secret
ALLOWED_EMAIL_DOMAINS=glbitm.ac.in
ALLOWED_EMAILS=
ADMIN_EMAILS=your-admin-email@example.com
ADMIN_ACCESS_CODE=your-unique-admin-code
```

Run:

```bash
cd backend
npm install
npm start
```

## Important Routes

### Frontend

- `/login`
- `/dashboard`
- `/new-complaint`
- `/my-complaints`
- `/admin`
- `/admin/complaints`

### Backend

- `POST /api/auth/google-login`
- `POST /api/auth/admin-verify`
- `GET /api/user/me`
- `POST /api/complaints`
- `GET /api/complaints`
- `PATCH /api/complaints/:id`

## Deployment

This repository is packaged for Vercel:

- static frontend build from the root app
- serverless API handlers under `api/`
- shared backend logic reused from `backend/src`

### Direct Vercel Deployment

1. Import this GitHub repository into Vercel.
2. Keep the root as the project root.
3. Build command: `npm run build`
4. Output directory: `build`
5. Add these environment variables in Vercel for both Preview and Production:

```env
MONGODB_URI=your-mongodb-atlas-uri
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d
ADMIN_CHALLENGE_EXPIRES_IN=10m
ALLOWED_EMAIL_DOMAINS=glbitm.ac.in
ALLOWED_EMAILS=pranjalwork2022@gmail.com,keshavguptauidev@gmail.com
ADMIN_EMAILS=pranjalwork2022@gmail.com,keshavguptauidev@gmail.com
ADMIN_ACCESS_CODE=your-unique-admin-code
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
REACT_APP_ALLOWED_DOMAIN=glbitm.ac.in
```

6. Leave `REACT_APP_API_BASE_URL` unset on Vercel. The frontend is already configured to use same-origin `/api` automatically outside localhost.
7. In Vercel Project Settings, enable automatically exposed system environment variables. The backend is configured to accept the current Vercel deployment URL through `VERCEL_URL`, `VERCEL_BRANCH_URL`, and `VERCEL_PROJECT_PRODUCTION_URL`.
8. In Google Cloud Console, add your Vercel production domain and preview domain/origins to the OAuth client before testing login.

Vercel references used for this setup:

- https://examples.vercel.com/docs/environment-variables/system-environment-variables
- https://vercel.com/docs/project-configuration/vercel-json

## Credits

- Pranjal Pandey: Backend
- Keshav Gupta: Frontend

Made with Love in Noida.
