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

Set the required frontend and backend environment variables in Vercel before deploying.

## Credits

- Pranjal Pandey: Backend
- Keshav Gupta: Frontend

Made with Love in Noida.
