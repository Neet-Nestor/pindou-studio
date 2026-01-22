# Deployment to neet.coffee/projects/pindou

This project is configured to be hosted at `https://neet.coffee/projects/pindou` using Vercel rewrites.

## Setup Instructions

### 1. Deploy this project to Vercel
Deploy this project as a separate Vercel project (e.g., `pindou-studio.vercel.app`)

### 2. Configure neet.coffee project
Add the following to `vercel.json` in your neet.coffee project:

```json
{
  "rewrites": [
    {
      "source": "/projects/pindou/:path*",
      "destination": "https://pindou-studio.vercel.app/projects/pindou/:path*"
    }
  ]
}
```

### 3. How it works
- Users visit: `https://neet.coffee/projects/pindou`
- URL stays: `https://neet.coffee/projects/pindou` (no redirect)
- Content served from: `https://pindou-studio.vercel.app/projects/pindou` (behind the scenes)

### Configuration in this project
- `next.config.ts`: Contains `basePath: '/projects/pindou'`
- All routes are automatically prefixed with `/projects/pindou`
- Assets are loaded from the correct paths
