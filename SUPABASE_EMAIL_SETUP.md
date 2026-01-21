# Supabase Email Confirmation Setup Guide

This guide will help you fix the email confirmation issues by configuring Supabase properly.

## Problem: Email Prefetching

Enterprise email filters (Outlook, Gmail) "pre-click" links to scan them for viruses. Since Supabase confirmation links are single-use, the security scanner "consumes" the link, leaving it dead by the time you click it.

## Solution: Use Intermediate Confirmation Page

### Step 1: Update Supabase Email Template

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Email Templates**
3. Click on **Confirm signup** template
4. Replace the confirmation link with:

```html
<a href="{{ .SiteURL }}/auth/confirm?confirmation_url={{ .ConfirmationURL }}">
  Confirm your email
</a>
```

Or if you prefer a button:

```html
<table role="presentation" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td align="center">
      <a href="{{ .SiteURL }}/auth/confirm?confirmation_url={{ .ConfirmationURL }}" 
         style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 4px;">
        Confirm your email
      </a>
    </td>
  </tr>
</table>
```

### Step 2: Configure URL Settings

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL** to your production URL:
   - Example: `https://thegridnexus.com`
   - Or for development: `http://localhost:5173`

3. Add **Redirect URLs**:
   ```
   https://thegridnexus.com/auth/callback
   https://thegridnexus.com/auth/confirm
   https://thegridnexus.com/auth/reset-password
   ```

   For development:
   ```
   http://localhost:5173/auth/callback
   http://localhost:5173/auth/confirm
   http://localhost:5173/auth/reset-password
   ```

### Step 3: Enable PKCE (Recommended)

1. Go to **Authentication** → **URL Configuration**
2. Enable **PKCE** (Proof Key for Code Exchange)
3. This makes the authentication flow more secure and reliable

### Step 4: Password Reset Template

Update the **Reset password** template similarly:

```html
<a href="{{ .SiteURL }}/auth/reset-password?token={{ .TokenHash }}&type=recovery">
  Reset your password
</a>
```

## Alternative: OTP (One-Time Password) Method

If email links continue to be problematic, you can switch to OTP:

1. Go to **Authentication** → **Providers** → **Email**
2. Ensure **Confirm Email** is ON
3. In your email template, replace the link with:

```html
<p>Your confirmation code is: <strong>{{ .Token }}</strong></p>
<p>Enter this code in the app to confirm your email.</p>
```

Then in your app, provide an input field for users to enter the 6-digit code.

## Testing

1. Sign up with a new email
2. Check your email inbox
3. Click the confirmation link
4. You should be redirected to `/auth/confirm`
5. Click "Confirm Email Address" button
6. You should be logged in and redirected to the homepage

## Troubleshooting

### Issue: "Email link is invalid or has expired"

**Solution**: The link was likely prefetched. The intermediate page fixes this.

### Issue: Redirects to localhost in production

**Solution**: Check your Site URL in Supabase settings - it should be your production URL.

### Issue: "code_exchange_error"

**Solution**: Ensure PKCE is enabled and your `/auth/callback` route properly exchanges the code.

### Issue: Not logged in after confirmation

**Solution**: Check browser console for errors. Ensure the session is being set correctly in the callback handler.

## Security Notes

- Confirmation links expire after 1 hour by default
- Links are single-use only
- The intermediate page prevents email prefetching issues
- PKCE flow is more secure than implicit flow




