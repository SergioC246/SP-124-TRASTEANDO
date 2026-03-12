<div align="center">
<img src="https://capsule-render.vercel.app/api?type=venom&height=200&text=Trasteando&fontSize=70&color=0:5b6ee8,100:e96c6c&fontColor=ffffff&animation=twinkling&desc=The%20Storage%20Marketplace%20Platform&descAlignY=75&descSize=18" width="100%"/>
Mostrar imagen
<br/>
Mostrar imagen
<br/>
Mostrar imagen
Mostrar imagen
Mostrar imagen
Mostrar imagen
Mostrar imagen
Mostrar imagen
Mostrar imagen
Mostrar imagen
</div>

📦 What is Trasteando?
Trasteando is a full-stack marketplace platform for renting and managing storage units (trasteros). Companies can list their storage facilities with real locations on a map, and clients can search, compare, book and pay for storage spaces — all in one place.

Think of it as Airbnb, but for storage rooms.

🔗 Live Demo: trasteando-marketplace.vercel.app
🔧 Backend API: web-production-9b0c1.up.railway.app

✨ Key Features
👥 For Clients

🔍 Search & Filter storage units by city, price and availability
🗺️ Interactive Map powered by Google Maps to find nearby storage
📅 Date-based Booking with real-time availability checking
💳 Stripe Payments with subscription plans (monthly, quarterly, semiannual, annual)
💬 Real-Time Chat with storage companies via Socket.IO
🤖 AI Inventory — upload a photo of any item and OpenAI Vision automatically suggests the category
📊 Export Inventory to CSV with one click

🏢 For Companies

🏠 Location & Storage Management — add locations and individual storage units
📊 Occupancy Dashboard — see which units are free, occupied or expiring
📋 Lease Management — view current, past and upcoming leases with client details
💬 Real-Time Messaging with clients
📸 Profile & Photo Management

🤖 AI-Powered Features

OpenAI GPT-4 Vision — snap a photo of any stored item and the AI automatically identifies and categorizes it
Smart Inventory System — clients can track everything stored in their unit with AI assistance


🛠️ Tech Stack
LayerTechnologyFrontendReact 18, Vite, Bootstrap 5, CSS3BackendPython 3, Flask, Flask-JWT-ExtendedDatabasePostgreSQL (Neon cloud)ORMSQLAlchemy + Flask-Migrate (Alembic)AuthenticationJWT Tokens (client, company & admin roles)PaymentsStripe Checkout (Subscription model)Real-TimeSocket.IO + EventletMapsGoogle Maps JavaScript APIAIOpenAI GPT-4 Vision APIDeployRailway (Backend) · Vercel (Frontend)

🗂️ Project Structure
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

🚀 Getting Started (Local Development)
Prerequisites

Python 3.10+
Node.js 18+
PostgreSQL database (or Neon free tier)

1. Clone the repository
bashgit clone https://github.com/SergioC246/SP-124-TRASTEANDO.git
cd SP-124-TRASTEANDO
2. Set up environment variables
bashcp .env.example .env
Fill in your .env:
envDATABASE_URL=postgresql://...
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
3. Install dependencies & run migrations
bash# Python dependencies
pip install pipenv
pipenv install

# Run DB migrations
pipenv run flask db upgrade

# Node dependencies
npm install
4. Start both servers (two terminals)
Terminal 1 — Backend (Flask):
bashpipenv run flask run
# Runs on http://localhost:5000
Terminal 2 — Frontend (React):
bashnpm run dev
# Runs on http://localhost:3000

🔌 API Endpoints (selected)
MethodEndpointDescriptionAuthPOST/api/login/clientClient login → JWT token❌POST/api/login/companyCompany login → JWT token❌GET/api/storage/overviewAll available storages❌GET/api/storage/mapStorages with geolocation for map❌GET/api/private/companyAuthenticated company profile✅ JWTPOST/api/private/company/locationsAdd new location✅ JWTPOST/api/private/company/storagesAdd new storage unit✅ JWTPOST/api/client/leasesBook a storage unit✅ JWTGET/api/client/my-leasesClient's booking history✅ JWTPOST/api/stripe/create-subscription-sessionStripe checkout session✅ JWTPOST/api/products/suggest-categoryAI-powered category suggestion✅ JWTGET/api/products/exportExport inventory as CSV✅ JWTPOST/api/messagesSend real-time message❌

👨‍💻 My Contribution
This project was built as a team final project at 4Geeks Academy. My main areas of work:
AreaDetails🎨 UI/UX & StylingResponsible for the overall visual design and CSS across the entire application — consistent color palette, typography, spacing and component styling🧭 Navbar & RoutingBuilt the complete navigation system with role-based routing for clients, companies and admins. Includes dropdown menus, dynamic states and protected routes🏢 Company ViewsDesigned and implemented all company-facing pages: registration, login, dashboard, location management, storage unit management and lease overview🤖 AI IntegrationContributed to the OpenAI Vision feature — clients can photograph stored items and the AI automatically suggests the correct inventory category📱 Responsive DesignEnsured consistent UX across desktop and mobile viewports🚀 DeploymentSet up full production deployment on Vercel (frontend) + Railway (backend) with environment configuration

🔐 Test Credentials
RoleEmailPassword🏢 Companyempresa@test.comtest1234👤 Clientcliente@test.comtest1234

📄 License
Built as a final project at 4Geeks Academy. Free to use as inspiration.

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:5b6ee8,100:e96c6c&height=100&section=footer" width="100%"/>
Built with ❤️ by Sergio Córdoba & team · 4Geeks Academy 2026
Mostrar imagen
Mostrar imagen
</div>