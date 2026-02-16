# Arya Vyshya Community Platform - README

A comprehensive community platform for the Arya Vyshya community, enabling members to connect, share opportunities, and support each other.

## Features

### Core Functionality
- **OTP-based Authentication**: Secure mobile number-based login
- **Role-Based Access Control**: GUEST, MEMBER, MENTOR, ADMIN roles
- **User Profiles**: Comprehensive profiles with verification system
- **Business Listings**: Post and discover community businesses
- **Career Opportunities**: Job postings and career guidance
- **Support Requests**: Request and offer help within the community
- **Community Groups**: Create and join interest-based groups
- **Events Management**: Organize and participate in community events
- **Notifications**: Real-time updates on activities

### Admin Features
- User verification and management
- Content moderation (approve/reject listings)
- System statistics and analytics
- Audit logging

## Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens
- **Security**: Helmet, rate limiting, input validation
- **Logging**: Winston

### Frontend
- **Framework**: React 19 with TypeScript
- **UI Library**: Material-UI (MUI) v7
- **Styling**: Tailwind CSS v3
- **Routing**: React Router v7
- **HTTP Client**: Axios

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd community-platform
```

2. **Install backend dependencies**
```bash
npm install
```

3. **Install frontend dependencies**
```bash
cd frontend
npm install
cd ..
```

4. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. **Set up the database**
```bash
npx prisma generate
npx prisma migrate dev
```

6. **Start development servers**

Backend:
```bash
npm run dev
```

Frontend (in a new terminal):
```bash
cd frontend
npm run dev
```

## Environment Variables

### Backend (.env)
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
JWT_SECRET="your-secret-key-min-32-characters"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV="development"
OTP_EXPIRY_MINUTES="5"
```

### Frontend (.env)
```bash
VITE_API_URL="http://localhost:5000/api"
```

## Project Structure

```
community-platform/
├── src/                    # Backend source
│   ├── controllers/        # Request handlers
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── config/            # Configuration files
│   ├── utils/             # Utility functions
│   └── index.ts           # Entry point
├── frontend/              # Frontend application
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context
│   │   └── api/           # API client
│   └── public/            # Static assets
├── prisma/                # Database schema
└── logs/                  # Application logs
```

## API Documentation

### Authentication
- `POST /api/auth/login` - Request OTP
- `POST /api/auth/verify-otp` - Verify OTP and get token

### Users
- `GET /api/profile/me` - Get current user profile
- `PUT /api/profile/me` - Update profile

### Business
- `GET /api/business` - List all businesses
- `POST /api/business` - Create business listing
- `PUT /api/business/:id` - Update business listing
- `DELETE /api/business/:id` - Delete business listing

### Career
- `GET /api/career` - List career opportunities
- `POST /api/career` - Create career listing

### Admin (ADMIN role required)
- `GET /api/admin/stats` - System statistics
- `GET /api/admin/users` - List all users
- `POST /api/admin/users/verify` - Verify user
- `GET /api/admin/content/pending` - Pending content
- `POST /api/admin/content/approve` - Approve/reject content

## Security Features

- **Rate Limiting**: Prevents brute force attacks
- **Helmet**: Security headers
- **Input Validation**: Zod schema validation
- **Environment Validation**: Ensures required configs
- **JWT Authentication**: Secure token-based auth
- **RBAC**: Role-based access control

## Deployment

See [`deployment_plan.md`](file:///Users/shrilakshmishenoy/.gemini/antigravity/brain/38f9d2b2-86b6-4f12-a66e-6c796f53d308/deployment_plan.md) for detailed deployment instructions.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details
