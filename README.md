# VitestMart

VitestMart is a modern E-commerce application built with the MERN stack (MongoDB, Express, React, Node.js). It features a responsive client interface created with Vite and TailwindCSS, and a robust RESTful API server.

## Features

- **User Authentication**: Secure Login and Registration functionality.
- **Product Management**: Browse products with details. Admin dashboard for management (implied by AdminDashboard component).
- **Shopping Cart**: Add items to cart and manage them.
- **Checkout Process**: Streamlined checkout flow.
- **Order History**: View past orders.
- **User Profile**: Manage user details.
- **Admin Dashboard**: Specialized interface for administrators.

## Tech Stack

### Client
- **Framework**: React (Vite)
- **Styling**: TailwindCSS, Framer Motion (for animations), Lucide React (icons)
- **State/Data**: Axios, Context API (implied)

### Server
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (JSON Web Tokens), bcryptjs

## Project Structure

```
vitestmart/
├── client/                 # React Frontend Application
│   ├── public/             
│   ├── src/
│   │   ├── components/     # UI Components (Navbar, ProductCard, etc.)
│   │   ├── context/        # React Context
│   │   ├── assets/         # Static assets
│   │   ├── App.jsx         # Main App Component
│   │   └── main.jsx        # Entry point
│   └── package.json
│
├── server/                 # Express Backend Application
│   ├── config/             # DB Configuration
│   ├── controllers/        # Route Controllers
│   ├── models/             # Mongoose Models (User, Product, Order)
│   ├── routes/             # API Routes
│   ├── server.js           # Server Entry Point
│   └── package.json
│
└── README.md               # Project Documentation
```

## Getting Started

### Prerequisites
- Node.js (v14+ recommended)
- MongoDB (Local instance or Atlas URI)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd vitestmart
    ```

2.  **Install Client Dependencies:**
    ```bash
    cd client
    npm install
    ```

3.  **Install Server Dependencies:**
    ```bash
    cd ../server
    npm install
    ```

4.  **Environment Configuration:**
    - Create a `.env` file in the `server` directory.
    - Add the necessary environment variables (Example):
      ```env
      PORT=5000
      MONGO_URI=mongodb://localhost:27017/vitestmart
      JWT_SECRET=your_jwt_secret
      NODE_ENV=development
      ```

### Running the Application

You need to run both the client and server terminals.

**1. Start the Server:**
```bash
cd server
node server.js
# or if you have nodemon installed
# nodemon server.js
```
The server will run on `http://localhost:5000` (or specified PORT).

**2. Start the Client:**
```bash
cd client
npm run dev
```
The client will start (usually at `http://localhost:5173`).

## Scripts

- **Root Directory:**
    - `npm run dev`: Runs the client in development mode.
    - `npm run build`: Builds the client for production.

- **Client Directory:**
    - `npm run dev`: Start Vite dev server.
    - `npm run build`: Build for production.
    - `npm run lint`: Lint code.

- **Server Directory:**
    - No default `start` script defined in package.json, use `node server.js`.

## API Endpoints

- `/api/auth`: Authentication routes
- `/api/products`: Product management
- `/api/orders`: Order processing
- `/api/settings`: Application settings

