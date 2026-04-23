# TalentIQ Frontend

A modern Next.js application for AI-powered talent screening and candidate management. This is the frontend for the TalentIQ system, designed for recruiters and hiring managers to manage job postings, screen candidates using AI, and make data-driven hiring decisions.

## Overview

TalentIQ is an AI-powered recruitment platform that helps recruiters:
- Create and manage job postings
- Upload applicant data (CSV, Excel, PDF)
- Use AI to screen and rank candidates
- View detailed screening results and AI reasoning
- Manage user settings and API keys
- Track hiring metrics and analytics

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with shadcn/ui patterns
- **Icons**: Lucide React
- **HTTP Client**: Custom API client with token management
- **Notifications**: Sonner (toast notifications)

## Features

### Dashboard
- Overview of key metrics (submissions, pending, hired, declined)
- Recent jobs list
- Quick access to main features

### Jobs Management
- Create, view, and delete job postings
- Configure job details (title, department, location, employment type)
- Set responsibilities and required skills
- Track applicant counts per job

### AI Screening
- Upload applicant data via CSV files
- AI-powered candidate screening using Google Gemini
- View ranked shortlists with detailed scoring
- See AI reasoning and confidence scores
- Filter candidates by fit level

### Applicants
- View all applicants across all jobs
- Filter by status, job, skills
- View detailed applicant profiles
- Track application status

### Settings
- Profile management (name, email, company, job title)
- API key configuration for Gemini
- Notification preferences
- Profile completion tracking

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running (see [backend README](../backend/README.md))

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd umurava-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure the backend API URL in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## Development

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for Production

Build the application for production:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## Project Structure

```
umurava-frontend/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page (login)
│   │   └── providers.tsx    # Redux providers
│   ├── components/          # Reusable components
│   │   ├── DashboardLayout.tsx
│   │   ├── PageHeader.tsx
│   │   └── ...
│   ├── lib/                 # Utilities
│   │   ├── api.ts          # API client
│   │   └── notify.ts       # Toast notifications
│   ├── screens/            # Page components
│   │   ├── DashboardPage.tsx
│   │   ├── JobsPage.tsx
│   │   ├── AIScreeningPage.tsx
│   │   ├── ApplicantsPage.tsx
│   │   ├── SettingsPage.tsx
│   │   └── UploadApplicantsPage.tsx
│   ├── store/              # Redux store
│   │   ├── index.ts
│   │   └── slices/
│   │       └── authSlice.ts
│   └── types/              # TypeScript types
├── public/                 # Static assets
├── .env.example           # Environment variables template
├── tailwind.config.ts     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies
```

## API Integration

The frontend uses a custom API client (`src/lib/api.ts`) that:
- Handles HTTP requests to the backend
- Manages JWT token authentication
- Provides typed API responses
- Includes error handling

### Authentication Flow

1. User logs in via `/auth/login` endpoint
2. JWT token is stored in localStorage
3. Token is automatically included in all API requests
4. Token is refreshed on each page load via `/auth/me`

### Key API Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `GET /api/dashboard/stats` - Dashboard metrics
- `GET /api/jobs` - List all jobs
- `POST /api/jobs` - Create new job
- `DELETE /api/jobs/:id` - Delete job
- `POST /api/screenings/upload/csv` - Upload applicant data
- `GET /api/user/settings` - Get user settings
- `PUT /api/user/profile` - Update user profile
- `PUT /api/user/api-key` - Update API key
- `PUT /api/user/settings` - Update notification settings

## State Management

The application uses Redux Toolkit for state management:

### Auth Slice (`src/store/slices/authSlice.ts`)
- Manages user authentication state
- Handles login, register, and logout actions
- Stores user profile information
- Manages loading and error states

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:4000/api` |

## Deployment

### Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_API_URL` (your production backend URL)
4. Deploy

### Docker

```bash
docker build -t talentiq-frontend .
docker run -p 3000:3000 talentiq-frontend
```

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. The output will be in the `.next` directory
3. Serve using a Node.js server or a static hosting service

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

[Your License Here]

## Support

For issues and questions, please contact the development team.
