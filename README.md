# StudioSpace

**A Peer-to-Peer Creative Workspace & Production Studio Sharing Platform**

StudioSpace connects creators, photographers, filmmakers, podcasters, and creative professionals with spaces they can book for their projects. Studio owners can list their workspaces, while users can explore studios and manage their bookings.

## Live Website

https://studio-space-nu.vercel.app/

## Features

- **Explore Studios:** Browse creative spaces by category, location, and other details.
- **Studio Details:** View studio information, pricing, amenities, and host details.
- **Studio Listings:** Authenticated users can create, update, and manage their studio listings.
- **Booking System:** Request bookings for available creative workspaces.
- **Booking Management:** View booking history and manage booking statuses.
- **Authentication:** User authentication with Better Auth and Google OAuth.
- **Booking Protection:** Prevent overlapping bookings for confirmed reservations.
- **Responsive Design:** Interface designed for desktop, tablet, and mobile devices.
- **Notifications:** User feedback through toast notifications and custom confirmation dialogs.

## Technology Stack

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Better Auth
- Sonner
- Swiper
- Lucide React

### Backend
- Node.js
- Express.js 5
- TypeScript
- MongoDB
- Better Auth

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## Run Locally

### Prerequisites

- Node.js
- npm
- MongoDB database
- Google OAuth credentials (if using Google login)

### 1. Clone the frontend repository

```bash
git clone https://github.com/nobin-codes/Studio-Space-Client-PH-As-08.git
cd Studio-Space-Client-PH-As-08
npm install
```

### 2. Configure frontend environment variables

Create a `.env.local` file in the frontend root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Start the frontend

```bash
npm run dev
```

Frontend runs at:

http://localhost:3000

### 4. Clone the backend repository

Open another terminal:

```bash
git clone https://github.com/nobin-codes/Studio-Space-Server-PH-As-08.git
cd Studio-Space-Server-PH-As-08
npm install
```

### 5. Configure backend environment variables

Create a `.env` file in the backend root:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
DB_NAME=your_database_name
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:5000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Replace the example values with your own configuration. Never commit real credentials or secrets to GitHub.

### 6. Build and start the backend

```bash
npm run build
npm start
```

Backend runs at:

http://localhost:5000

## Repositories

**Frontend Repository:**  
https://github.com/nobin-codes/Studio-Space-Client-PH-As-08

**Backend Repository:**  
https://github.com/nobin-codes/Studio-Space-Server-PH-As-08

## Live Backend API

https://studio-space-server-w8v0.onrender.com

## Getting Started

Users can create an account through the website and start exploring creative workspaces. Studio owners can register, publish their studios, and manage incoming bookings.

## Project Purpose

StudioSpace aims to make creative workspace discovery and booking easier by bringing studio owners and creators together on one platform.

---

Developed as part of the Programming Hero Batch 14 assignment.