# Therma-Triage Hospital Command Center

A comprehensive hospital resource management dashboard for heatwave emergencies in India, built with Next.js and featuring Google OAuth authentication.

## Features

- **Real-time Dashboard**: ICU capacity, cooling resources, staff surge levels
- **Bed Management**: Detailed bed tracking with patient information
- **Resource Management**: Heatwave emergency equipment monitoring
- **Staff Analytics**: Surge capacity and fatigue tracking
- **Triage Queue**: Incoming patient monitoring with 30-second polling
- **Trend Analytics**: Admissions vs temperature correlation charts
- **Google OAuth**: Secure authentication with role-based access control
- **Dark/Light Mode**: Full theme support with persistent preferences

## Getting Started

### Prerequisites

- Node.js 18+ 
- Google Cloud Console project with OAuth 2.0 credentials

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 Client ID credentials
5. Add authorized redirect URI: `http://localhost:3001/api/auth/callback/google`
6. Copy Client ID and Client Secret

### Environment Configuration

Create a `.env.local` file in the root directory:

```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your_nextauth_secret_here_generate_random_string
NODE_ENV=development
```

### Installation

```bash
npm install
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

## Authentication

The application uses Google OAuth for authentication. Users will be redirected to sign in with their Google account before accessing the dashboard.

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── api/auth/          # NextAuth API routes
│   ├── beds/              # Bed management page
│   ├── resources/         # Resources page
│   ├── staff/             # Staff management page
│   ├── settings/          # Settings page
│   └── signin/            # Sign-in page
├── components/            # React components
│   ├── dashboard/         # Dashboard components
│   ├── beds/              # Bed management components
│   ├── resources/         # Resource components
│   ├── staff/             # Staff components
│   └── settings/          # Settings components
├── contexts/              # React contexts
│   ├── AuthContext.tsx    # Authentication context
│   └── ThemeContext.tsx   # Theme context
└── types/                 # TypeScript type definitions
```

## Technologies Used

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Authentication**: NextAuth.js with Google Provider
- **State Management**: React Context API

## API Integration

The frontend is designed to integrate with backend APIs for:
- Real-time bed and resource updates
- Staff management and surge tracking
- Triage queue polling
- Analytics and trend data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is part of the Therma-Triage hackathon initiative.
