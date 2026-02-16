# System Architecture - Arya Vyshya Community Platform

## 1. Overall System Architecture

The platform follows a **Client-Server Architecture** with a clear separation of concerns, ensuring scalability, maintainability, and security.

### Frontend (Client)
- **Framework**: React.js (Create React App or Vite)
- **Language**: TypeScript (Recommended for type safety)
- **State Management**: Redux Toolkit or Context API (for global state like Auth)
- **UI Library**: Material UI (MUI) or Tailwind CSS (for responsive, mobile-first design)
- **Routing**: React Router v6
- **API Client**: Axios (with interceptors for token handling)

### Backend (Server)
- **Runtime**: Node.js
- **Framework**: Express.js (Rest API)
- **Language**: TypeScript (Recommended)
- **ORM**: Prisma (Type-safe database interaction)
- **Authentication**: JSON Web Tokens (JWT) + OTP (via Twilio/Msg91/Firebase)
- **Validation**: Joi or Zod
- **Logging**: Winston or Morgan

### Database
- **Primary DB**: PostgreSQL (Relational data, ACID compliance)
- **Hosting**: AWS RDS, Supabase, or Railway
- **Schema Management**: Prisma Schema

## 2. Authentication & Authorization Flow

### Authentication (AuthN)
The system uses a **Passwordless OTP-based Authentication** mechanism for higher security and ease of use.

1.  **Login/Register Request**: User enters Mobile Number.
2.  **OTP Generation**: Backend generates a 4/6-digit OTP, stores it in Redis/DB with expiry (e.g., 5 mins), and sends it via SMS Gateway.
3.  **OTP Verification**: User enters OTP. Backend verifies it against the stored value.
4.  **Token Issuance**: On success, Backend issues:
    -   `accessToken` (Short-lived, e.g., 15 mins) for API access.
    -   `refreshToken` (Long-lived, e.g., 7 days) stored in an HttpOnly cookie for secure token renewal.

### Authorization (AuthZ) - RBAC
We implement **Role-Based Access Control (RBAC)** using middleware. Each user is assigned a role, and API routes are protected based on these roles.

## 3. Role Hierarchy

The platform defines the following roles with specific permissions:

| Role | Description | Key Permissions |
| :--- | :--- | :--- |
| **Guest** | Unregistered or unverified user | View landing page, publicly available info (limited). Cannot access member directory or sensitive data. |
| **Verified Member** | Standard community member | **View**: Profiles, Business/Career listings, Events.<br>**Create**: Business profile, Help requests, Event capabilities (if enabled).<br>**Interact**: Groups (if joined). |
| **Mentor** | Trusted expert/leader | **All Member permissions** +<br>**Provide**: Guidance (Career, Financial, Overseas).<br>**Moderation** (Optional): Help moderate specific groups. |
| **Admin** | System Administrator | **Full Access**: Manage Users (Approve/Reject), Content Moderation, Analytics, Broadcast Notifications, Configure System Settings. |

## 4. Security Considerations

-   **Data in Transit**: SSL/TLS (HTTPS) for all communications.
-   **Data at Rest**: Sensitive data (like personally identifiable info) encryption if necessary. Passwords are arguably not needed due to OTP, but if used, hashed with Bcrypt/Argon2.
-   **Input Validation**: Strict validation of all API inputs using Zod/Joi to prevent Injection attacks.
-   **CORS**: Configured to allow only trusted domains.
-   **Rate Limiting**: Implementation of rate limiting (using `express-rate-limit` or Redis) on API endpoints, especially OTP generation, to prevent abuse.
-   **Helmet**: Use `helmet` middleware to set secure HTTP headers.
-   **Sanitization**: Sanitize user inputs to prevent XSS.

## 5. Scalability Approach

-   **Modular Codebase**: Separation of Routes, Controllers, Services, and Models for maintainability.
-   **Database Indexing**: Proper indexing on frequently queried fields (e.g., `mobileNumber`, `role`, `status`) to optimize read performance.
-   **Caching**: (Optional Phase 2) Redis for caching frequent queries or session overlap.
-   **Stateless Backend**: The API is stateless (REST), allowing horizontal scaling (adding more server instances).
-   **Asset Optimization**: Image compression and use of CDNs (like Cloudinary/AWS S3) for media storage to offload the main server.
-   **Environment Configuration**: Strict separation of Dev, Staging, and Production environments via `.env` files.
