# Hospital Management System

Production-ready HMS monorepo with:

- `server` -> Node.js + Express + MongoDB (Mongoose) REST API
- `client` -> React + React Router v6 frontend

## Tech Stack

- Frontend: React, React Router v6, Context API, Axios, CSS
- Backend: Node.js, Express (MVC), JWT auth, bcryptjs
- Database: MongoDB with Mongoose
- Security: Helmet, rate limiting, xss-clean, mongo sanitize

## Project Structure

```text
.
├── client
│   ├── package.json
│   └── src
└── server
	├── package.json
	├── .env.example
	├── server.js
	├── seed.js
	├── config
	├── controllers
	├── middleware
	├── models
	├── routes
	└── utils
```

## Backend Setup

1. Install dependencies:

```bash
cd server
npm install
```

2. Create env file:

```bash
cp .env.example .env
```

3. Update values in `.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/hms
JWT_SECRET=replace_with_strong_secret
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

4. Seed database:

```bash
npm run seed
```

5. Start backend:

```bash
npm run dev
```

API base URL: `http://localhost:5000/api`

## Frontend Setup

1. Install dependencies:

```bash
cd client
npm install
```

2. Create env file for frontend (optional):

```bash
cat > .env << 'EOF'
VITE_API_URL=http://localhost:5000/api
EOF
```

3. Start frontend:

```bash
npm run dev
```

Frontend URL: `http://localhost:5173`

## Demo Credentials

After running seed:

- Admin: `admin@hms.com`
- Password: `Password@123`

## Available Features

- JWT authentication with role-based authorization
- Full CRUD APIs for Patients, Doctors, Appointments, Billing, Services, Laboratory, Pharmacy, Departments
- Dashboard statistics endpoint
- Patient details with appointment/billing/lab history
- Billing invoice creation and print view
- Pharmacy low-stock highlighting
- Profile view and update
- Request validation using express-validator

## Security Highlights

- Password hashing with bcryptjs (salt rounds 12)
- JWT expiry set to 8 hours
- Optional HTTP-only cookie token support in production
- Helmet security headers
- Auth route rate limiter (10 requests per 15 minutes)
- Input sanitization with `express-mongo-sanitize` and `xss-clean`

## Run Both Apps

Use two terminals:

Terminal 1:

```bash
cd server && npm run dev
```

Terminal 2:

```bash
cd client && npm run dev
```