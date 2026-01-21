# 拼豆Studio

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

3. **Set up Vercel Postgres**

   a. Go to [Vercel Dashboard](https://vercel.com/dashboard)

   b. Create a new project or select an existing one

   c. Go to the "Storage" tab and create a new Postgres database

   d. Copy the connection strings to your `.env.local` file

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

1. Push your code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy
5. Seed the production database

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Chinese perler bead community for color data and feedback

---

Made with ❤️ by [Neet-Nestor](https://github.com/Neet-Nestor) for the perler bead community (拼豆爱好者)
