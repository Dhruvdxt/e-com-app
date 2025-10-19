# 🔑 API Keys Setup Guide for MERN Ecommerce

## 📋 **Current Status**
Your server is running with basic configuration. The warnings you see are for **optional services** that enhance functionality but aren't required for basic operation.

## ✅ **What's Working (No Setup Needed)**
- ✅ Database connection (MongoDB)
- ✅ Basic authentication (JWT)
- ✅ Core ecommerce functionality
- ✅ Frontend/Backend communication

## 🔧 **Optional Services Setup**

### 1. **Email Services** (For notifications, password reset, etc.)

#### **Mailgun** (Recommended for transactional emails)
1. Go to [mailgun.com](https://mailgun.com)
2. Sign up for free account (10,000 emails/month free)
3. Get your API key from dashboard
4. Add domain and verify it
5. Update `.env`:
   ```
   MAILGUN_KEY=your_actual_key_here
   MAILGUN_DOMAIN=your_domain_here
   MAILGUN_EMAIL_SENDER=noreply@yourdomain.com
   ```

#### **Mailchimp** (For newsletter subscriptions)
1. Go to [mailchimp.com](https://mailchimp.com)
2. Create free account
3. Get API key from Account → Extras → API Keys
4. Get List ID from Audience → Settings → Audience name and defaults
5. Update `.env`:
   ```
   MAILCHIMP_KEY=your_actual_key_here
   MAILCHIMP_LIST_KEY=your_list_id_here
   ```

### 2. **Social Authentication** (For Google/Facebook login)

#### **Google OAuth**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Set authorized redirect URI: `http://localhost:3000/api/auth/google/callback`
6. Update `.env`:
   ```
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   ```

#### **Facebook OAuth**
1. Go to [Facebook Developers](https://developers.facebook.com)
2. Create new app → Consumer
3. Add Facebook Login product
4. Set Valid OAuth Redirect URIs: `http://localhost:3000/api/auth/facebook/callback`
5. Update `.env`:
   ```
   FACEBOOK_CLIENT_ID=your_app_id_here
   FACEBOOK_CLIENT_SECRET=your_app_secret_here
   ```

### 3. **AWS S3** (For file uploads, product images)

#### **AWS S3 Setup**
1. Go to [AWS Console](https://aws.amazon.com)
2. Create S3 bucket
3. Create IAM user with S3 permissions
4. Generate access keys
5. Update `.env`:
   ```
   AWS_ACCESS_KEY_ID=your_access_key_here
   AWS_SECRET_ACCESS_KEY=your_secret_key_here
   AWS_REGION=us-east-1
   AWS_BUCKET_NAME=your_bucket_name_here
   ```

## 🚀 **Quick Start (Minimal Setup)**

For immediate development, you only need to update these in your `.env`:

```bash
# Copy the template
cp env-template .env

# Edit with your preferred editor
nano .env
# or
code .env
```

**Minimum required changes:**
- Keep all the basic configuration as-is
- Optionally add real API keys for services you want to use
- Leave placeholder values for services you don't need

## 🔍 **Current Warnings Explained**

```
Missing mailgun keys     → Email notifications won't work
Missing google keys      → Google login won't work  
Missing facebook keys    → Facebook login won't work
```

**These are just warnings, not errors!** Your app will work perfectly without them.

## 🎯 **Recommended Development Setup**

1. **Start with basic setup** (what you have now)
2. **Add Mailgun** for email functionality
3. **Add Google OAuth** for social login
4. **Add AWS S3** when you need file uploads

## 📝 **Environment File Location**
```
mern-ecommerce/server/.env
```

## 🔒 **Security Notes**
- Never commit `.env` files to git
- Use different keys for development/production
- Rotate keys regularly
- Use environment-specific configurations

## 🆘 **Need Help?**
- Check the official documentation for each service
- Most services offer free tiers for development
- Test with one service at a time
