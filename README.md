# Doctor-Patient Management Web App

A premium, scalable application built with Node.js/Express (stateless, Cloud Run ready) and React (Vanilla CSS based on 'The Clinical Sanctuary' design system).

## Tech Stack
-   **Frontend**: React (Vite), Vanilla CSS
-   **Backend**: Node.js, Express
-   **Database**: PostgreSQL
-   **Design System**: The Clinical Sanctuary (See `DESIGN.md`)

## Running Locally

### Backend
1.  cd `backend`
2.  `npm install`
3.  Copy `../.env.example` to `backend/.env` and update credentials.
4.  `npm run dev`

### Frontend
1.  cd `frontend`
2.  `npm install`
3.  `npm run dev`

## Database Schema Overview
-   **Users (Doctors/Patients)**: Core authentication and profile data.
-   **Appointments**: Connects Doctors and Patients. Handled via transactions to prevent double-booking.
-   **MedicalHistory**: Associated with Patients.
