# Store Testing Guide

## PayPal Sandbox Testing

### 1. Setup PayPal Sandbox

1. **Get Sandbox Credentials**
   - Follow the instructions in `PAYPAL_SETUP.md`
   - Create a sandbox app in PayPal Developer Portal
   - Copy the Client ID and Secret

2. **Configure Environment**
   - Create `.env.local` file in `/sdm` directory
   - Add your sandbox credentials:
   ```env
   NEXT_PUBLIC_PAYPAL_SANDBOX_CLIENT_ID=your_sandbox_client_id
   PAYPAL_SANDBOX_CLIENT_ID=your_sandbox_client_id
   PAYPAL_SANDBOX_CLIENT_SECRET=your_sandbox_secret
   NODE_ENV=development
   ```

### 2. Test Payment Flow

1. **Start Development Server**
   ```bash
   cd sdm
   npm install
   npm run dev
   ```

2. **Navigate to Store**
   - Go to http://localhost:3000/archivo
   - Click "View Store" button
   - You should see 3 products with PayPal buttons

3. **Test Each Product**

   **Vinyl ($33 + shipping)**
   - Click PayPal button
   - Use sandbox test account (create one in PayPal Developer Portal)
   - Complete payment
   - Verify order is captured

   **Para Ti Box ($11 + shipping)**
   - Test different shipping options
   - Verify shipping calculation
   - Complete payment

   **MP3 Collection ($33, no shipping)**
   - Click PayPal button
   - Complete payment
   - Should redirect to download page with token

### 3. Test Download System

1. **Purchase MP3 Collection**
   - Complete payment in sandbox
   - Should redirect to `/downloads/[token]`

2. **Verify Download Page**
   - Check token validation
   - Verify download button works
   - Test token expiration (24 hours)

### 4. Test Inventory System

1. **Stock Counter**
   - Products show stock when ≤10 items
   - Verify counter updates after purchase
   - Test stock warning display

2. **Order Tracking**
   - Check `/sdm/data/orders.json` file
   - Verify orders are saved correctly
   - Check download tokens are generated

### 5. Test Shipping Calculator

1. **Weight-based Shipping**
   - Vinyl (1.0 lb): Should show Priority Mail options
   - Box (0.5 lb): Should show Ground Advantage options
   - MP3 (0 lb): Should show "Digital Download"

2. **Shipping Options**
   - Ground Advantage: $4.50
   - Priority Mail: $8.95
   - Priority Express: $24.95

### 6. Error Testing

1. **Invalid PayPal Credentials**
   - Test with wrong credentials
   - Verify error handling

2. **Network Issues**
   - Test with network disconnected
   - Verify graceful error messages

3. **Invalid Tokens**
   - Test download with invalid token
   - Test expired token

## Production Testing

### Before Going Live

1. **Switch to Live Credentials**
   - Update `.env.local` with live PayPal credentials
   - Set `NODE_ENV=production`

2. **Test with Real PayPal Account**
   - Use small amounts for testing
   - Verify all payment flows work

3. **Upload MP3 File**
   - Add `el-archivo-complete-collection.zip` to `/sdm/public/downloads/`
   - Test download functionality

## Troubleshooting

### Common Issues

1. **PayPal Button Not Loading**
   - Check Client ID is correct
   - Verify environment variables
   - Check browser console for errors

2. **Payment Not Capturing**
   - Check server logs
   - Verify PayPal credentials
   - Check API endpoint responses

3. **Download Not Working**
   - Verify token generation
   - Check file exists in downloads folder
   - Test token validation endpoint

### Debug Commands

```bash
# Check environment variables
echo $NEXT_PUBLIC_PAYPAL_SANDBOX_CLIENT_ID

# View orders file
cat sdm/data/orders.json

# Check server logs
npm run dev
# Look for console.log outputs in terminal
```

## Security Checklist

- [ ] PayPal credentials are in `.env.local` (not committed)
- [ ] Download tokens expire after 24 hours
- [ ] Orders are validated before processing
- [ ] Error messages don't expose sensitive information
- [ ] File downloads are protected by tokens

## Performance Testing

1. **Load Testing**
   - Test with multiple simultaneous payments
   - Verify system handles concurrent requests

2. **File Download**
   - Test large file downloads
   - Verify download speed and reliability

## Ready for Production

- [ ] All tests pass in sandbox
- [ ] Live PayPal credentials configured
- [ ] MP3 file uploaded
- [ ] Error handling tested
- [ ] Security checklist completed
- [ ] Performance verified
