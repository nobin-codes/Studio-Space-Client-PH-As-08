# StudioSpace

**A Peer-to-Peer Creative Workspace & Production Studio Sharing Platform**

StudioSpace connects creators, photographers, filmmakers, podcasters, and other creative professionals with spaces they can book for their projects. Studio owners can list their workspaces, while users can explore available studios and manage their bookings.

## Live Website

https://studio-space-nu.vercel.app/

## Features

- **Explore Studios:** Browse creative spaces by category, location, and other details.
- **Studio Details:** View studio information, pricing, amenities, and host details.
- **Studio Listings:** Authenticated users can create, update, and manage their studio listings.
- **Booking System:** Request bookings for available creative workspaces.
- **Booking Management:** View booking history and manage booking statuses.
- **Authentication:** Secure user authentication with Better Auth and Google OAuth.
- **Responsive Design:** User-friendly interface for desktop, tablet, and mobile devices.
- **Notifications:** Clear feedback for important user actions.

## Technology Stack

**Frontend**
- Next.js
- React
- TypeScript
- Tailwind CSS
- Better Auth
- Sonner
- Swiper
- Lucide React

**Backend**
- Node.js
- Express.js
- TypeScript
- MongoDB
- Better Auth

**Deployment**
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/nobin-codes/Studio-Space-Client-PH-As-08.git
cd Studio-Space-Client-PH-As-08
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the client root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Use your local backend URL if it runs on a different port.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Backend Repository

https://github.com/nobin-codes/Studio-Space-Server-PH-As-08

## Live Backend API

https://studio-space-server-w8v0.onrender.com

## Test Account

For evaluation, use the following account:

- **Email:** studiospace.test@example.com
- **Password:** [Add the test account password here]

You can also register a new account through the website.

## Project Purpose

StudioSpace aims to make creative workspace discovery and booking easier by bringing studio owners and creators together on one platform.

---

Developed as part of the Programming Hero Batch 14 assignment.