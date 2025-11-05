# Role-based Food Ordering App

Full‑stack food ordering web application with role-based access control (Admin, Manager, Member) and optional country restrictions (India, America).

## Tech Stack
- Frontend: React (Vite) + Tailwind CSS + Redux Toolkit + RTK Query + react-hot-toast
- Backend: Node.js + Express.js
- Database: MongoDB (Mongoose)
- Auth: JWT

## Role Permissions
- View restaurants & menu: Admin/Manager/Member
- Create order: Admin/Manager/Member
- Checkout & cancel order: Admin/Manager
- Add/Modify payment methods: Admin


1) Backend
```
cd backend
npm install

# Environment
# Create .env with the following (example values):
# MONGO_URI=mongodb://localhost:27017/foodordering
# JWT_SECRET=your-secret
# JWT_LIFETIME=30d
# PORT=5000

npm run dev
```

2) Frontend
```
cd frontend
npm install

# Create .env:
# VITE_API_BASE_URL=http://localhost:5000/api

npm run dev
```

App will be available at the Vite dev URL (e.g., http://localhost:5173).

## Frontend Pages
- /login, /register
- /restaurants (browse menus, add to cart, create order)
- /orders (list orders; Admin/Manager can checkout/cancel)
- /admin/payments (Admin only)


