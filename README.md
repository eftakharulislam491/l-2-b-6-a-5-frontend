# Metro E-Commerce Frontend

Frontend for Assignment 5, built with Next.js (App Router) and Tailwind CSS.

## Live URL
- Frontend: `https://your-frontend-url.vercel.app`

## Features
- Public storefront with multiple homepage sections:
  - Banner/Hero
  - About section
  - Category section
  - Promotional offers
  - Best selling products
  - Wholesale/decorate/exclusive sections
- Product listing with filters and search query sync
- Product details with variants and add-to-cart
- Cart + checkout flow with address handling
- Stripe payment return handling (`/cart?payment=...`)
- Authentication pages (login/register)
- User dashboard:
  - Orders
  - Profile
  - Wishlist
  - Addresses
- Admin panel routes:
  - Dashboard
  - Categories
  - Products
  - Orders
  - Reviews
- Role protection for `/admin/*` via `proxy.ts`
- Loading states, toasts, and error rendering across flows

## Tech Stack
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Radix UI
- Lucide Icons
- Sonner

## Project Structure
```text
app/
  (public)/      Public pages (home, products, cart)
  (auth)/        Login/register pages
  (user)/        User dashboard pages
  admin/         Admin pages
components/
  home/          Home page sections
  layout/        Navbar/footer
  modules/       Feature modules (cart, product, admin, etc.)
  providers/     Global providers (cart/loading)
services/        API call layer
lib/             Utilities and auth helpers
```

## Environment Variables
Create `.env.local`:

```env
BASE_URL=https://your-backend-url.vercel.app/
```

## Run Locally
```bash
npm install
npm run dev
```

Build for production:
```bash
npm run build
npm run start
```

## Assignment Submission Info (Fill Before Submission)
- Frontend Repo: `https://github.com/your-username/project-frontend`
- Frontend Live URL: `https://your-frontend-url.vercel.app`
- Admin Email: `admin@project.com`
- Admin Password: `your-admin-password`

## Notes
- This frontend depends on the backend API base URL from `BASE_URL`.
- Make sure backend CORS allows your frontend domain in production.
