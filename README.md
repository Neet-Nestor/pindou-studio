# 拼豆工坊 (Perler Beads Studio)

专业的拼豆库存管理工具，支持数据库同步和云端备份。

A modern web application for managing your perler bead inventory with database synchronization and cloud backup.

## Features

- 🎨 **Multi-Brand Support**: Perler, Hama, Artkal, DoDo (279 colors total)
- 🇨🇳 **Chinese Interface**: Full Chinese language support
- 📊 **Inventory Management**: Track quantities of 200+ bead colors
- 🔍 **Search & Filter**: Find colors by code, name, or color set
- ➕➖ **Quick Adjustments**: Easily add or subtract quantities with +/-1, +/-5, +/-10 buttons
- 💾 **Cloud Sync**: Automatic synchronization across devices
- 📤 **Export/Import**: Backup your inventory as JSON
- 🎨 **Custom Colors**: Add your own custom color definitions with piece IDs
- 🏷️ **Color Customization**: Override pre-defined colors with your own values
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile

## Tech Stack

- **Framework**: Next.js 14+ with App Router and TypeScript
- **UI**: shadcn/ui + Tailwind CSS v4 (oklch color space)
- **Database**: Vercel Postgres with Drizzle ORM
- **Authentication**: NextAuth.js v5 (email/password)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Vercel account (for database hosting)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**

   Copy `.env.example` to `.env.local` and fill in your values:
   ```bash
   cp .env.example .env.local
   ```

   Required variables:
   ```env
   # Vercel Postgres - Get these from your Vercel project dashboard
   POSTGRES_URL=your_postgres_url_here

   # NextAuth - Generate a secret: openssl rand -base64 32
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_secret_key_here
   ```

3. **Set up Vercel Postgres Database**

   a. **Create a Vercel Account**
      - Go to [Vercel](https://vercel.com) and sign up/login
      - You can use GitHub, GitLab, or Bitbucket to sign in

   b. **Create a new Vercel Project (Optional)**
      - Go to [Vercel Dashboard](https://vercel.com/dashboard)
      - Click "Add New..." → "Project"
      - Import your GitHub repository or skip this step for now

   c. **Create Postgres Database**
      - In your Vercel Dashboard, go to the "Storage" tab
      - Click "Create Database"
      - Select "Postgres" (powered by Neon)
      - Choose a database name (e.g., "pindou-db")
      - Select a region close to your users (e.g., "Washington, D.C., USA (iad1)")
      - Click "Create"

   d. **Get Database Connection String**
      - After creation, you'll see your database dashboard
      - Click on the ".env.local" tab
      - You'll see environment variables like:
        ```
        POSTGRES_URL="postgres://..."
        POSTGRES_PRISMA_URL="postgres://..."
        POSTGRES_URL_NO_SSL="postgres://..."
        POSTGRES_URL_NON_POOLING="postgres://..."
        ```
      - Copy the `POSTGRES_URL` value

   e. **Configure Local Environment**
      - Open your `.env.local` file
      - Paste the `POSTGRES_URL` value:
        ```env
        POSTGRES_URL="postgres://default:xxx@xxx.aws.neon.tech:5432/verceldb?sslmode=require"
        ```
      - Add other required variables:
        ```env
        NEXTAUTH_URL=http://localhost:3000
        NEXTAUTH_SECRET=your_generated_secret_here
        ```

   f. **Test Connection**
      - Run `npm run db:push` to verify the connection
      - If successful, your database schema will be created

4. **Generate and run database migrations**
   ```bash
   npm run db:generate
   npm run db:push
   ```

5. **Seed the database with color sets**
   ```bash
   npm run db:seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Scripts

- `npm run db:generate` - Generate migration files from schema
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run migrations
- `npm run db:studio` - Open Drizzle Studio (database GUI)
- `npm run db:seed` - Seed database with color sets

## Color Sets Included

- **Perler Standard 63 Colors** (P01-P63)
- **Hama Midi 48 Colors** (H01-H48, 5.0mm)
- **Artkal S-Series 72 Colors** (S01-S72, 2.6mm small beads)
- **DoDo Standard 96 Colors** (D01-D96, 5mm large beads)

## Usage Guide

### 1. First-Time Setup

1. Create an account or log in
2. Go to onboarding to select your color sets
3. Your inventory will be initialized with all colors at quantity 0

### 2. Managing Inventory

- **Search**: Use the search bar to find colors by code or name
- **Filter**: Select specific color sets or custom colors
- **Sort**: Sort by code, name, or quantity
- **Update Quantity**: Click on the number to enter a specific quantity
- **Quick Adjust**: Use +/-1, +/-5, +/-10 buttons for quick changes

### 3. Export/Import

- **Export**: Download your inventory as JSON for backup
- **Import**: Upload JSON to restore or merge inventory data

## Deployment to Vercel

### 1. Push Code to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Select your GitHub repository (pindou-studio)
4. Click "Import"

### 3. Configure Production Database

1. **Link Database to Project**
   - In your Vercel project settings, go to "Storage"
   - Click "Connect Store"
   - Select your existing Postgres database OR create a new one
   - Click "Connect"

2. **Automatic Environment Variables**
   - Vercel will automatically add database environment variables to your project
   - The following variables will be set automatically:
     - `POSTGRES_URL`
     - `POSTGRES_PRISMA_URL`
     - `POSTGRES_URL_NO_SSL`
     - `POSTGRES_URL_NON_POOLING`

3. **Add Additional Environment Variables**
   - Go to "Settings" → "Environment Variables"
   - Add the following variables:
     ```
     NEXTAUTH_URL = https://pindou.neet.coffee
     NEXTAUTH_SECRET = (generate with: openssl rand -base64 32)
     ```

### 4. Deploy

1. Click "Deploy" in your Vercel project
2. Wait for the build to complete (usually 2-3 minutes)
3. Your app will be live at `https://pindou.neet.coffee`

### 5. Initialize Production Database

After first deployment, you need to seed the database with color sets:

**Option A: Using Vercel CLI (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link to your project
vercel link

# Run seed command on production
vercel env pull .env.production.local
npm run db:seed
```

**Option B: Manual SQL Upload**
1. Go to your Vercel database dashboard
2. Click "Query" tab
3. Manually run seed queries from `lib/db/seed.ts`

### 6. Verify Deployment

1. Visit your deployed site: `https://pindou.neet.coffee`
2. Create a new account
3. Go to onboarding and select color sets
4. Verify inventory loads correctly

### Troubleshooting

**Database Connection Issues:**
- Ensure `POSTGRES_URL` is set correctly in environment variables
- Check if database region matches your Vercel deployment region
- Verify SSL mode is set to `require` in connection string

**Build Failures:**
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript compilation succeeds locally

**Authentication Issues:**
- Make sure `NEXTAUTH_URL` matches your production domain
- Regenerate `NEXTAUTH_SECRET` if needed
- Clear browser cookies and try again

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Chinese perler bead community for color data and feedback

---

Made with ❤️ by [Neet-Nestor](https://github.com/Neet-Nestor) for the perler bead community (拼豆爱好者)
