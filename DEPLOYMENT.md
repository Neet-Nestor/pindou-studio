# Deployment to pindou.neet.coffee

This project can be accessed via two URLs:
1. `https://pindou-studio.vercel.app/` (Vercel default deployment)
2. `https://pindou.neet.coffee/` (custom subdomain)

## Setup Instructions

### 1. Deploy to Vercel
Deploy this project to Vercel (it will be available at `pindou-studio.vercel.app`)

### 2. Add Custom Domain in Vercel
1. Go to Vercel dashboard → pindou project → Settings → Domains
2. Add custom domain: `pindou.neet.coffee`
3. Vercel will provide DNS configuration instructions

### 3. Configure DNS
In your DNS provider (where neet.coffee is registered):
1. Add a CNAME record:
   - **Host/Name**: `pindou`
   - **Value/Target**: `cname.vercel-dns.com`
   - **TTL**: Automatic or 3600
2. Wait for DNS propagation (usually 5-60 minutes)

### 4. Verify
Once DNS propagates, both URLs will work:
- `https://pindou-studio.vercel.app/` - Vercel default
- `https://pindou.neet.coffee/` - Custom subdomain

## How it works
- Both URLs serve the same deployment
- No path prefixes needed - app works at root on both
- All Next.js features work correctly (RSC, API routes, image optimization, auth)
- No asset loading issues
