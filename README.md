# Barely Used Bytes

A marketplace for buying and selling used computer hardware parts. Built with Next.js 15, FastAPI, and Firebase.

## Features

- 🔐 **User Authentication** - Sign in with Google via Firebase Auth
- 📦 **Product Listings** - Create, edit, and delete hardware listings
- 🔍 **Search & Filter** - Search products by name, description, or category with real-time results
- 📂 **Category Browsing** - Filter products by hardware categories (CPUs, GPUs, RAM, etc.)
- ❤️ **Wishlist** - Save favorite items for later
- 🛒 **Shopping Cart** - Add items to cart for checkout
- 👤 **User Profile** - View and manage your listings

## Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **React Icons** - Icon library
- **Firebase Auth** - Authentication

### Backend

- **FastAPI** - Python web framework
- **Firebase Firestore** - NoSQL database
- **Firebase Admin SDK** - Server-side Firebase operations

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.9+
- Firebase project with Firestore and Authentication enabled

### Environment Setup

1. Clone the repository

2. **Backend Setup:**

   ```bash
   # Create virtual environment
   python -m venv venv

   # Activate virtual environment
   # Windows:
   .\venv\Scripts\activate
   # Mac/Linux:
   source venv/bin/activate

   # Install dependencies
   pip install -r requirements.txt
   ```

3. **Firebase Setup:**

   - Create a Firebase project at https://console.firebase.google.com
   - Enable Google Authentication
   - Enable Firestore Database
   - Download the service account key and save as `serviceAccountKey.json` in the root directory

4. **Frontend Setup:**

   ```bash
   cd bub-next
   npm install
   ```

5. **Environment Variables:**

   Create `.env.local` in the `bub-next` directory:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

### Running the Application

1. **Start the Backend (from project root):**

   ```bash
   .\venv\Scripts\activate  # Windows
   uvicorn backend:app --reload --port 8000
   ```

2. **Start the Frontend (from bub-next directory):**

   ```bash
   npm run dev
   ```

3. Open http://localhost:3000 in your browser

## API Endpoints

### Products

- `GET /products` - Get all products
- `GET /products/{id}` - Get product by ID
- `POST /products` - Create product (auth required)
- `PUT /products/{id}` - Update product (auth required, owner only)
- `DELETE /products/{id}` - Delete product (auth required, owner only)

### Users

- `GET /users/{id}` - Get user by ID (auth required)
- `POST /users` - Create user profile (auth required)
- `PUT /users/{id}` - Update user profile (auth required)
- `DELETE /users/{id}` - Delete user profile (auth required)

### Orders

- `GET /orders` - Get user's orders (auth required)
- `POST /orders` - Create order (auth required)
- `PUT /orders/{id}` - Update order (auth required)

### Reviews

- `GET /reviews` - Get all reviews
- `POST /reviews` - Create review (auth required)

## Project Structure

```
barely-used-bytes/
├── backend.py              # FastAPI backend
├── requirements.txt        # Python dependencies
├── serviceAccountKey.json  # Firebase service account (not in git)
├── venv/                   # Python virtual environment
└── bub-next/               # Next.js frontend
    ├── src/
    │   ├── app/
    │   │   ├── lib/        # Contexts, API, types
    │   │   ├── products/   # Product pages
    │   │   ├── profile/    # User profile
    │   │   ├── wishlist/   # Wishlist page
    │   │   ├── cart/       # Cart page
    │   │   ├── createListing/  # Create listing form
    │   │   └── [category]/ # Dynamic category pages
    │   └── components/     # Reusable components
    └── public/             # Static assets
```

## Color Palette

- Green: `#7ADAA5`
- Teal: `#239BA7`
- Cream: `#ECECBB`
- Gold: `#E1AA36`
- Dark Green: `#007562`

## License

MIT
