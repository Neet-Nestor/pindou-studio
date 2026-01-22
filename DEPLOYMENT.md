# Deployment to neet.coffee/apps/pindou

This project can be accessed via two URLs:
1. `https://pindou-studio.vercel.app/` (standalone deployment at root)
2. `https://neet.coffee/apps/pindou/` (proxied through portfolio site)

## Setup Instructions

### 1. Deploy this project to Vercel
Deploy this project as: `pindou-studio.vercel.app`

### 2. Configure neet.coffee project
Add the following to `vercel.json` in your neet.coffee project:

```json
{
  "rewrites": [
    {
      "source": "/apps/pindou",
      "destination": "https://pindou-studio.vercel.app/"
    },
    {
      "source": "/apps/pindou/:path*",
      "destination": "https://pindou-studio.vercel.app/:path*"
    }
  ]
}
```

### 3. How it works
- **Standalone**: `https://pindou-studio.vercel.app/` works at root path
- **Portfolio**: `https://neet.coffee/apps/pindou/` proxies to root path
- **Assets**: Loaded with absolute URLs from `pindou-studio.vercel.app` (via assetPrefix)
- **URL**: User sees `neet.coffee/apps/pindou/` but assets come from pindou-studio

### Configuration in this project
- `assetPrefix`: Set to `https://pindou-studio.vercel.app` in production
- No `basePath`: App works at root path on standalone deployment
- Assets always use absolute URLs pointing to the Vercel deployment
