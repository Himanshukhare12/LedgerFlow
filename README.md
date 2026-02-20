# LedgerFlow Backend

A modern, scalable backend API for financial transaction management and ledger operations built with Node.js and Express.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Routes](#api-routes)
- [Running the Project](#running-the-project)
- [Database Models](#database-models)
- [Authentication](#authentication)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

LedgerFlow is a comprehensive backend service designed for managing financial accounts, transactions, and user authentication. It provides RESTful APIs for creating and managing user accounts, handling financial transactions, and maintaining a ledger system.

## ✨ Features

- **User Authentication**: Secure JWT-based authentication with bcrypt password hashing
- **Account Management**: Create and manage user accounts with comprehensive account details
- **Transaction Tracking**: Record, retrieve, and manage financial transactions
- **Email Notifications**: Automated email notifications using Nodemailer
- **Token Management**: Implement token blacklist for logout functionality
- **Request Validation**: Input validation and error handling throughout the application

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js v5.2.1
- **Database**: MongoDB with Mongoose v9.2.1
- **Authentication**: 
  - JWT (jsonwebtoken v9.0.3)
  - bcrypt v6.0.0
- **Middleware**:
  - Cookie Parser v1.4.7
- **Email Service**: Nodemailer v8.0.1
- **Environment Management**: dotenv v17.3.1
- **Development**: nodemon v3.1.11

## 📦 Prerequisites

Ensure you have the following installed:

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn package manager

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd LedgerFlow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables** (see [Environment Variables](#environment-variables) section)

## 🔧 Environment Variables

Create a `.env` file in the root directory and configure the following variables:

```env
# Server Configuration
PORT=8000
NODE_ENV=development

# Database Configuration
# MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=your_expiry

# Email Configuration (Nodemailer)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@ledgerflow.com
```

## 📁 Project Structure

```
LedgerFlow/
├── src/
│   ├── controllers/
│   │   ├── auth.controller.js          # Authentication logic
│   │   ├── account.controller.js       # Account management
│   │   └── transaction.controller.js   # Transaction handling
│   ├── models/
│   │   ├── user.model.js               # User schema
│   │   ├── account.model.js            # Account schema
│   │   ├── transaction.model.js        # Transaction schema
│   │   ├── ledger.model.js             # Ledger schema
│   │   └── blackList.model.js          # Token blacklist schema
│   ├── routes/
│   │   ├── auth.routes.js              # Authentication endpoints
│   │   ├── account.routes.js           # Account endpoints
│   │   └── transaction.routes.js       # Transaction endpoints
│   ├── middlewares/
│   │   └── auth.middleware.js          # JWT verification middleware
│   ├── utils/
│   │   ├── ApiError.js                 # Centralized error handling
│   │   ├── ApiResponse.js              # Standardized API responses
│   │   ├── asyncHandler.js             # Async error wrapper
│   │   └── Nodemailer.js               # Email service configuration
│   ├── db/
│   │   └── index.js                    # Database connection
│   ├── constants.js                    # Application constants
│   ├── app.js                          # Express app configuration
│   └── index.js                        # Server entry point
├── package.json                        # Project dependencies
├── .env                                # Environment variables (git ignored)
└── README.md                           # This file
```

## 🌐 API Routes

### Home Route (`/`)
- `GET /` - Welcome endpoint with API information and available routes

### Authentication Routes (`/api/v1/auth`)
- `POST /register` - Register a new user
- `POST /login` - User login
- `POST /logout` - User logout

### Account Routes (`/api/v1/account`)
- `POST /` - Create a new account (Protected)
- `GET /` - Get all accounts of the authenticated user (Protected)
- `GET /balance/:accountId` - Get the balance of a specific account (Protected)

### Transaction Routes (`/api/v1/transaction`)
- `POST /` - Create a new transaction (Protected)
- `POST /system/initial-funds` - Create initial funds for a user (System User only)

## ▶️ Running the Project

### Development Mode
Run with automatic restart on file changes:
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on the port specified in your `.env` file (default: 8000).

## 🗄️ Database Models

### User Model
Stores user profile information including email, password (hashed), and personal details.

### Account Model
Maintains user account information with balance tracking and account metadata.

### Transaction Model
Records financial transactions with details about debits, credits, and transaction status.

### Ledger Model
Maintains the ledger entries for comprehensive financial tracking.

### BlackList Model
Stores invalidated JWT tokens for logout functionality.

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. User logs in with credentials
2. Server returns JWT token
3. Client includes token in Authorization header for protected routes
4. Middleware validates token before allowing access
5. Token can be blacklisted on logout

**Protected Routes**: All routes except authentication endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [package.json](package.json) file for details.

---

## 📧 Support

For issues or questions, please open an issue in the repository or contact the development team.

