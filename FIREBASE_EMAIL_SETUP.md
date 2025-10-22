# 🔧 FIREBASE EMAIL TEMPLATE FIX

## 🐛 **PROBLEM IDENTIFIED**

**Issue:** Firebase email templates showing placeholders instead of actual values
- `%APP_NAME%` not replaced with "Symptom2Care"
- `%DISPLAY_NAME%` not replaced with user's name
- `%EMAIL%` not replaced with user's email
- Sender name showing "not provided"

**Example Error:**
```
Subject: Verify your email for %APP_NAME%
Message: Hello %DISPLAY_NAME%...
```

---

## ✅ **SOLUTION**

### **Step 1: Configure Firebase Email Templates**

You need to customize the email templates in Firebase Console:

#### **1. Go to Firebase Console**
```
https://console.firebase.google.com
```

#### **2. Select Your Project**
```
symptom2care
```

#### **3. Navigate to Authentication**
```
Left sidebar → Authentication → Templates
```

#### **4. Customize Email Templates**

---

## 📧 **EMAIL TEMPLATE CONFIGURATIONS**

### **Template 1: Email Verification**

**Click on "Email address verification"**

#### **Sender Name:**
```
Symptom2Care
```

#### **Subject:**
```
Verify your email for Symptom2Care
```

#### **Email Body (HTML):**
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #0891b2; font-size: 32px;">🏥 Symptom2Care</h1>
    </div>
    
    <div style="background: #f8fafc; padding: 30px; border-radius: 12px;">
        <h2 style="color: #1e293b; margin-bottom: 20px;">Verify Your Email Address</h2>
        
        <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
            Hello <strong>%DISPLAY_NAME%</strong>,
        </p>
        
        <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
            Thank you for signing up with Symptom2Care! Please verify your email address to get started.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="%LINK%" style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                Verify Email Address
            </a>
        </div>
        
        <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">
            Or copy and paste this link into your browser:
        </p>
        <p style="color: #0891b2; font-size: 14px; word-break: break-all;">
            %LINK%
        </p>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
        
        <p style="color: #94a3b8; font-size: 13px;">
            If you didn't create an account with Symptom2Care, you can safely ignore this email.
        </p>
    </div>
    
    <div style="text-align: center; margin-top: 30px; color: #94a3b8; font-size: 12px;">
        <p>© 2025 Symptom2Care. All rights reserved.</p>
        <p>Your Intelligent Healthcare Assistant</p>
    </div>
</div>
```

---

### **Template 2: Password Reset**

**Click on "Password reset"**

#### **Sender Name:**
```
Symptom2Care
```

#### **Subject:**
```
Reset your Symptom2Care password
```

#### **Email Body (HTML):**
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #0891b2; font-size: 32px;">🏥 Symptom2Care</h1>
    </div>
    
    <div style="background: #f8fafc; padding: 30px; border-radius: 12px;">
        <h2 style="color: #1e293b; margin-bottom: 20px;">Reset Your Password</h2>
        
        <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
            Hello,
        </p>
        
        <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
            We received a request to reset the password for your Symptom2Care account (<strong>%EMAIL%</strong>).
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="%LINK%" style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                Reset Password
            </a>
        </div>
        
        <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">
            Or copy and paste this link into your browser:
        </p>
        <p style="color: #0891b2; font-size: 14px; word-break: break-all;">
            %LINK%
        </p>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
        
        <p style="color: #94a3b8; font-size: 13px;">
            If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
        </p>
        
        <p style="color: #94a3b8; font-size: 13px;">
            This link will expire in 1 hour for security reasons.
        </p>
    </div>
    
    <div style="text-align: center; margin-top: 30px; color: #94a3b8; font-size: 12px;">
        <p>© 2025 Symptom2Care. All rights reserved.</p>
        <p>Your Intelligent Healthcare Assistant</p>
    </div>
</div>
```

---

### **Template 3: Email Change**

**Click on "Email address change"**

#### **Sender Name:**
```
Symptom2Care
```

#### **Subject:**
```
Verify your new email for Symptom2Care
```

#### **Email Body (HTML):**
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #0891b2; font-size: 32px;">🏥 Symptom2Care</h1>
    </div>
    
    <div style="background: #f8fafc; padding: 30px; border-radius: 12px;">
        <h2 style="color: #1e293b; margin-bottom: 20px;">Verify Your New Email</h2>
        
        <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
            Hello <strong>%DISPLAY_NAME%</strong>,
        </p>
        
        <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
            You recently changed your email address for your Symptom2Care account. Please verify your new email address.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="%LINK%" style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                Verify New Email
            </a>
        </div>
        
        <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">
            Or copy and paste this link into your browser:
        </p>
        <p style="color: #0891b2; font-size: 14px; word-break: break-all;">
            %LINK%
        </p>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
        
        <p style="color: #94a3b8; font-size: 13px;">
            If you didn't change your email address, please contact support immediately.
        </p>
    </div>
    
    <div style="text-align: center; margin-top: 30px; color: #94a3b8; font-size: 12px;">
        <p>© 2025 Symptom2Care. All rights reserved.</p>
        <p>Your Intelligent Healthcare Assistant</p>
    </div>
</div>
```

---

## 🔧 **STEP-BY-STEP SETUP GUIDE**

### **Step 1: Access Firebase Console**
1. Go to https://console.firebase.google.com
2. Click on "symptom2care" project
3. Click "Authentication" in left sidebar
4. Click "Templates" tab at the top

### **Step 2: Customize Email Verification Template**
1. Click on "Email address verification"
2. Click "Edit template" (pencil icon)
3. Fill in:
   - **Sender name:** `Symptom2Care`
   - **Reply-to email:** Your support email (optional)
   - **Subject:** `Verify your email for Symptom2Care`
   - **Body:** Copy the HTML from above
4. Click "Save"

### **Step 3: Customize Password Reset Template**
1. Click on "Password reset"
2. Click "Edit template"
3. Fill in:
   - **Sender name:** `Symptom2Care`
   - **Subject:** `Reset your Symptom2Care password`
   - **Body:** Copy the HTML from above
4. Click "Save"

### **Step 4: Customize Email Change Template**
1. Click on "Email address change"
2. Click "Edit template"
3. Fill in:
   - **Sender name:** `Symptom2Care`
   - **Subject:** `Verify your new email for Symptom2Care`
   - **Body:** Copy the HTML from above
4. Click "Save"

### **Step 5: Test the Templates**
1. Go back to your app
2. Try signing up with a new email
3. Check your inbox
4. Email should now show:
   - ✅ "Symptom2Care" as sender
   - ✅ Proper subject line
   - ✅ Your name instead of %DISPLAY_NAME%
   - ✅ Beautiful HTML design

---

## 📧 **AVAILABLE PLACEHOLDERS**

Firebase provides these placeholders that will be automatically replaced:

| Placeholder | Replaced With |
|-------------|---------------|
| `%DISPLAY_NAME%` | User's display name |
| `%EMAIL%` | User's email address |
| `%LINK%` | Verification/reset link |
| `%APP_NAME%` | Your app name (if set) |

**Note:** `%APP_NAME%` requires additional setup in Firebase project settings.

---

## 🎨 **EMAIL DESIGN FEATURES**

Our custom templates include:
- ✅ Branded header with logo emoji
- ✅ Modern gradient buttons
- ✅ Responsive design
- ✅ Clear call-to-action
- ✅ Fallback link for copy-paste
- ✅ Security notice
- ✅ Professional footer
- ✅ Color scheme matching app

---

## ⚠️ **IMPORTANT NOTES**

### **1. Sender Email**
The sender email `noreply@symptom2care.firebaseapp.com` is automatically provided by Firebase. You cannot change this unless you:
- Upgrade to Firebase Blaze plan
- Set up custom SMTP server
- Use Firebase Extensions

### **2. Reply-To Email**
You can set a reply-to email in the template settings:
- Go to template settings
- Add your support email (e.g., support@yourdomain.com)
- Users can reply to this email

### **3. Testing**
Always test emails after customization:
- Use a real email address
- Check spam folder
- Verify all links work
- Test on mobile and desktop

---

## 🔍 **TROUBLESHOOTING**

### **Issue: Still seeing placeholders**
**Solution:** 
1. Clear browser cache
2. Wait 5-10 minutes for changes to propagate
3. Try with a new email address
4. Check if you saved the template

### **Issue: Emails going to spam**
**Solution:**
1. Add noreply@symptom2care.firebaseapp.com to contacts
2. Check SPF/DKIM records (requires custom domain)
3. Ask users to check spam folder

### **Issue: Emails not sending**
**Solution:**
1. Check Firebase Console → Usage
2. Verify email quota not exceeded
3. Check if email/password auth is enabled
4. Try with different email provider

---

## ✅ **VERIFICATION CHECKLIST**

After setup, verify:
- [ ] Sender name shows "Symptom2Care"
- [ ] Subject line is customized
- [ ] %DISPLAY_NAME% replaced with actual name
- [ ] %EMAIL% replaced with actual email
- [ ] %LINK% is clickable and works
- [ ] Email design looks good
- [ ] Mobile responsive
- [ ] Links work correctly

---

## 🎉 **RESULT**

**Before:**
```
From: not provided
Subject: Verify your email for %APP_NAME%
Hello %DISPLAY_NAME%...
```

**After:**
```
From: Symptom2Care
Subject: Verify your email for Symptom2Care
Hello John Doe,
[Beautiful HTML email with gradient button]
```

---

## 🚀 **QUICK SETUP (5 MINUTES)**

1. ✅ Go to Firebase Console
2. ✅ Authentication → Templates
3. ✅ Edit each template (3 templates)
4. ✅ Copy-paste HTML from above
5. ✅ Save all templates
6. ✅ Test with new signup

**Done!** Your emails will now look professional! 🎉

---

## 📞 **NEED HELP?**

If you need assistance:
1. Check Firebase documentation
2. Verify all templates are saved
3. Wait 10 minutes for changes
4. Test with fresh email address
5. Check spam folder

**Firebase Email Templates Guide:**
https://firebase.google.com/docs/auth/custom-email-handler
