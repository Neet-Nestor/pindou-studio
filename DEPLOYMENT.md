# Deployment to neet.coffee/projects/pindou

This project can be accessed via two URLs:
1. `https://pindou-studio.vercel.app/` (standalone deployment)
2. `https://neet.coffee/projects/pindou/` (proxied through neet.coffee)

## Setup Instructions

### 1. Deploy this project to Vercel
Deploy this project as a separate Vercel project: `pindou-studio.vercel.app`

### 2. Configure neet.coffee project
Add the following to `vercel.json` in your neet.coffee project:

```json
{
  "rewrites": [
    {
      "source": "/projects/pindou/:path*",
      "destination": "https://pindou-studio.vercel.app/:path*"
    }
  ]
}
```

### 3. How it works
- **Standalone access**: `https://pindou-studio.vercel.app/` works normally
- **Portfolio integration**: `https://neet.coffee/projects/pindou/` proxies to `pindou-studio.vercel.app`
- URL stays as `https://neet.coffee/projects/pindou/` (no redirect visible to user)
- The `/projects/pindou` prefix is stripped when proxying

### Configuration in this project
- No `basePath` needed - app works at root path
- Both deployment URLs work seamlessly
