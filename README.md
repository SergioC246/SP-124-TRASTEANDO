<div align="center">

<img src="https://capsule-render.vercel.app/api?type=venom&height=200&text=Trasteando&fontSize=70&color=0:5b6ee8,100:e96c6c&fontColor=ffffff&animation=twinkling&desc=The%20Storage%20Marketplace%20Platform&descAlignY=75&descSize=18" width="100%"/>

[![Typing SVG](https://readme-typing-svg.herokuapp.com?font=Montserrat&weight=600&size=22&pause=1000&color=5B6EE8&center=true&vCenter=true&width=750&lines=Full-Stack+Storage+Rental+Marketplace;React+%2B+Flask+%2B+PostgreSQL+%2B+OpenAI;Real-Time+Chat+%7C+Google+Maps+%7C+Stripe+Payments;Built+as+Final+Project+at+4Geeks+Academy+%F0%9F%9A%80)](https://git.io/typing-svg)

<br/>

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-trasteando--marketplace.vercel.app-5b6ee8?style=for-the-badge)](https://trasteando-marketplace.vercel.app)

<br/>

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=Stripe&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![Google Maps](https://img.shields.io/badge/Google%20Maps-4285F4?style=for-the-badge&logo=googlemaps&logoColor=white)

</div>

---

## 📦 What is Trasteando?

**Trasteando** is a full-stack marketplace platform for renting and managing storage units (trasteros). Companies can list their storage facilities with real locations on a map, and clients can search, compare, book and pay for storage spaces — all in one place.

> Think of it as **Airbnb, but for storage rooms.**

🔗 **Live Demo:** [trasteando-marketplace.vercel.app](https://trasteando-marketplace.vercel.app)  
🔧 **Backend API:** [web-production-9b0c1.up.railway.app](https://web-production-9b0c1.up.railway.app/api/hello)

---

## ✨ Key Features

### 👥 For Clients
- 🔍 **Search & Filter** storage units by city, price and availability
- 🗺️ **Interactive Map** powered by Google Maps to find nearby storage
- 📅 **Date-based Booking** with real-time availability checking
- 💳 **Stripe Payments** with subscription plans (monthly, quarterly, semiannual, annual)
- 💬 **Real-Time Chat** with storage companies via Socket.IO
- 🤖 **AI Inventory** — upload a photo of any item and OpenAI Vision automatically suggests the category
- 📊 **Export Inventory** to CSV with one click

### 🏢 For Companies
- 🏠 **Location & Storage Management** — add locations and individual storage units
- 📊 **Occupancy Dashboard** — see which units are free, occupied or expiring
- 📋 **Lease Management** — view current, past and upcoming leases with client details
- 💬 **Real-Time Messaging** with clients
- 📸 **Profile & Photo Management**

### 🤖 AI-Powered Features
- **OpenAI GPT-4 Vision** — snap a photo of any stored item and the AI automatically identifies and categorizes it
- **Smart Inventory System** — clients can track everything stored in their unit with AI assistance

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Bootstrap 5, CSS3 |
| Backend | Python 3, Flask, Flask-JWT-Extended |
| Database | PostgreSQL (Neon cloud) |
| ORM | SQLAlchemy + Flask-Migrate (Alembic) |
| Authentication | JWT Tokens (client, company & admin roles) |
| Payments | Stripe Checkout (Subscription model) |
| Real-Time | Socket.IO + Eventlet |
| Maps | Google Maps JavaScript API |
| AI | OpenAI GPT-4 Vision API |
| Deploy | Railway (Backend) · Vercel (Frontend) |

---

## 🗂️ Project Structure

```
trasteando/
├── src/
│   ├── api/
│   │   ├── models.py              # DB models: User, Client, Company, Storage, Lease...
│   │   ├── routes.py              # 40+ REST API endpoints
│   │   ├── services/
│   │   │   └── vision_category.py # OpenAI Vision integration
│   │   ├── socketio_instance.py   # Socket.IO setup
│   │   └── realtime_rooms.py      # Real-time chat rooms
│   ├── front/
│   │   ├── components/            # Navbar, Cards, Map, Chat, Footer...
│   │   ├── pages/                 # Home, Login, Dashboard, Inventory...
│   │   └── store/                 # Global state (Flux pattern)
│   └── app.py                     # Flask app entry point
├── migrations/                    # Alembic DB migrations
├── .env.example
├── Pipfile
└── requirements.txt
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL database (or [Neon](https://neon.tech) free tier)

### 1. Clone the repository
```bash
git clone https://github.com/SergioC246/SP-124-TRASTEANDO.git
cd SP-124-TRASTEANDO
```

### 2. Set up environment variables
```bash
cp .env.example .env
```

Fill in your `.env`:
```env
DATABASE_URL=postgresql://...
FLASK_APP_KEY="your-secret-key"
FLASK_APP=src/app.py
FLASK_DEBUG=1
VITE_BACKEND_URL=http://localhost:5000/api
VITE_GOOGLE_MAP_ID=your_map_id
VITE_GOOGLE_MAPS_KEY=your_google_maps_key
OPENAI_API_KEY=your_openai_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLIC_KEY=your_stripe_public_key
FRONTEND_URL=http://localhost:3000
```

### 3. Install dependencies & run migrations
```bash
# Python dependencies
pip install pipenv
pipenv install

# Run DB migrations
pipenv run flask db upgrade

# Node dependencies
npm install
```

### 4. Start both servers (two terminals)

**Terminal 1 — Backend (Flask):**
```bash
pipenv run flask run
# Runs on http://localhost:5000
```

**Terminal 2 — Frontend (React):**
```bash
npm run dev
# Runs on http://localhost:3000
```

---

## 🔌 API Endpoints (selected)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/login/client` | Client login → JWT token | ❌ |
| POST | `/api/login/company` | Company login → JWT token | ❌ |
| GET | `/api/storage/overview` | All available storages | ❌ |
| GET | `/api/storage/map` | Storages with geolocation for map | ❌ |
| GET | `/api/private/company` | Authenticated company profile | ✅ JWT |
| POST | `/api/private/company/locations` | Add new location | ✅ JWT |
| POST | `/api/private/company/storages` | Add new storage unit | ✅ JWT |
| POST | `/api/client/leases` | Book a storage unit | ✅ JWT |
| GET | `/api/client/my-leases` | Client's booking history | ✅ JWT |
| POST | `/api/stripe/create-subscription-session` | Stripe checkout session | ✅ JWT |
| POST | `/api/products/suggest-category` | AI-powered category suggestion | ✅ JWT |
| GET | `/api/products/export` | Export inventory as CSV | ✅ JWT |
| POST | `/api/messages` | Send real-time message | ❌ |

---

## 👨‍💻 My Contribution

This project was built as a team final project at 4Geeks Academy. My main areas of work:

| Area | Details |
|------|---------|
| 🎨 **UI/UX & Styling** | Responsible for the overall visual design and CSS across the entire application — consistent color palette, typography, spacing and component styling |
| 🧭 **Navbar & Routing** | Built the complete navigation system with role-based routing for clients, companies and admins. Includes dropdown menus, dynamic states and protected routes |
| 🏢 **Company Views** | Designed and implemented all company-facing pages: registration, login, dashboard, location management, storage unit management and lease overview |
| 🤖 **AI Integration** | Contributed to the OpenAI Vision feature — clients can photograph stored items and the AI automatically suggests the correct inventory category |
| 📱 **Responsive Design** | Ensured consistent UX across desktop and mobile viewports |
| 🚀 **Deployment** | Set up full production deployment on Vercel (frontend) + Railway (backend) with environment configuration |

---

## 🔐 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| 🏢 Company | empresa@test.com | test1234 |
| 👤 Client | cliente@test.com | test1234 |

---

## 📄 License

Built as a final project at [4Geeks Academy](https://4geeksacademy.com). Free to use as inspiration.

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:5b6ee8,100:e96c6c&height=100&section=footer" width="100%"/>

**Built with ❤️ by Sergio Córdoba & team · 4Geeks Academy 2026**

[![GitHub](https://img.shields.io/badge/GitHub-SergioC246-181717?style=for-the-badge&logo=github)](https://github.com/SergioC246)
[![Live](https://img.shields.io/badge/Live-trasteando--marketplace.vercel.app-5b6ee8?style=for-the-badge)](https://trasteando-marketplace.vercel.app)

</div>