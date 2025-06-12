# Inventrack Project (Backend)

This is a web app that allows teams to manage inventory and book shared resources (e.g., equipment, 
rooms, tools). This mimics enterprise-level workflows like resource planning and asset tracking — capabilities 
highly relevant to Elevate360’s future scalability, scheduling, and system efficiency.

---

# Tech Stack & Libraries
- Nodejs
- Expressjs
- Typescript
- Prisma
- Postgre
- socket.io
- node-cron

---

# Admin Credential
- Email : admin@admin.com
- Password: Admin123!

---

## Prerequisites

- Node.js (v20 or newer recommended)
- npm or yarn package manager
- docker

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/tangguhriyadi/inventrack-be.git
cd inventrack-be
```

### 2. Build docker image
```bash
docker build -t image-builded  .
```

### 3. Run docker container
```bash
docker run -d -p 4000:4000 --name container-name -e JWT_EXPIRE="24h" -e JWT_SECRET="291263dd314b9d5c48402678a4f9d6f799846fe773a1ced6e28b2432f0147051"  -e NODE_ENV="production"  -e PORT="4000"  -e SALT_ROUND="10" -e DATABASE_URL="postgresql://postgres.yqwkcvcutagrzbvtsqye:Stronghold2%40@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres" -e FRONTEND_URL="https://inventrack-fe.vercel.app" image-builded
```
