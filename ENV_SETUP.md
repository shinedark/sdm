# Environment Setup Instructions

## Create .env.local File

Create a file named `.env.local` in the `/sdm` directory with the following content:

```env
# PayPal Sandbox (Development)
NEXT_PUBLIC_PAYPAL_SANDBOX_CLIENT_ID=your_sandbox_client_id_here
PAYPAL_SANDBOX_CLIENT_ID=your_sandbox_client_id_here
PAYPAL_SANDBOX_CLIENT_SECRET=your_sandbox_secret_here

# PayPal Live (Production)
NEXT_PUBLIC_PAYPAL_LIVE_CLIENT_ID=your_live_client_id_here
PAYPAL_LIVE_CLIENT_ID=your_live_client_id_here
PAYPAL_LIVE_CLIENT_SECRET=your_live_secret_here

# Environment
NODE_ENV=development
```

## Steps to Create the File

1. **Navigate to the sdm directory:**
   ```bash
   cd /Users/camilopineda/Desktop/sdcode/SDM/sdm
   ```

2. **Create the .env.local file:**
   ```bash
   touch .env.local
   ```

3. **Open the file in your editor and paste the content above**

4. **Save the file**

## Test the Setup

Once you've created the `.env.local` file, you can test the store:

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to the store:**
   - Go to http://localhost:3000/archivo
   - Click "View Store" button
   - You should see the PayPal buttons loading

3. **Test with PayPal Sandbox:**
   - Use the sandbox test accounts from PayPal Developer Portal
   - Complete a test purchase
   - Verify the payment flow works

## Security Notes

- The `.env.local` file is automatically ignored by git
- Never commit this file to version control
- Keep your credentials secure
- Use sandbox for testing, live for production

## Switching to Production

When ready to go live:
1. Change `NODE_ENV=production` in `.env.local`
2. Test with small amounts first
3. Upload your MP3 file to `/public/downloads/el-archivo-complete-collection.zip`
