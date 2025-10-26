# PayPal Integration Setup Guide

## Getting PayPal API Credentials

### Sandbox (Development Environment)

1. **Go to PayPal Developer Portal**
   - Visit: https://developer.paypal.com/
   - Sign in with your PayPal account

2. **Create Sandbox App**
   - Navigate to "Dashboard" → "My Apps & Credentials"
   - Under "Sandbox" section, click "Create App"
   - App Name: `SDM Store Test`
   - Click "Create"

3. **Get Sandbox Credentials**
   - Copy the "Client ID" and "Secret" from the sandbox app
   - These will be used for testing payments

### Live (Production Environment)

1. **Create Live App**
   - In the same portal, switch to "Live" section
   - Click "Create App" under Live
   - App Name: `SDM Store Live`
   - Click "Create"

2. **Get Live Credentials**
   - Copy the "Client ID" and "Secret" from the live app
   - These will be used for real transactions

## Environment Configuration

Create a `.env.local` file in the `/sdm` directory with:

```env
# PayPal Sandbox (Development)
PAYPAL_SANDBOX_CLIENT_ID=your_sandbox_client_id_here
PAYPAL_SANDBOX_CLIENT_SECRET=your_sandbox_secret_here

# PayPal Live (Production)
PAYPAL_LIVE_CLIENT_ID=your_live_client_id_here
PAYPAL_LIVE_CLIENT_SECRET=your_live_secret_here

# Environment
NODE_ENV=development
```

## Testing

- Use sandbox credentials for development and testing
- Switch to live credentials only when ready for production
- Test all payment flows in sandbox before going live

## Security Notes

- Never commit `.env.local` to version control
- Keep credentials secure and rotate them regularly
- Use environment variables in production deployment
