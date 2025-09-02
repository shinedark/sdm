This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## 🚀 Automated Deployment

This project is configured for automatic deployment to Vercel on every commit to the main branch.

### Setup Instructions

1. **Get your Vercel Token**:
   - Visit: https://vercel.com/account/tokens
   - Create a new token
   - Copy the token value

2. **Add Vercel Token to GitHub Secrets**:
   - Go to your GitHub repository
   - Navigate to Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `VERCEL_TOKEN`
   - Value: Paste your Vercel token
   - Click "Add secret"

3. **Automatic Deployment**:
   - Every push to `main` branch will automatically:
     - Install dependencies
     - Run linting
     - Build the application
     - Deploy to Vercel production

### Manual Deployment

If you need to deploy manually:

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Project Structure

- `.github/workflows/deploy.yml` - GitHub Actions workflow for automated deployment
- `vercel.json` - Vercel configuration
- `.gitignore` - Excludes build artifacts and sensitive files
