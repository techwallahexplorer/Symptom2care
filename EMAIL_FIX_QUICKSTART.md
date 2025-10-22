# ⚡ QUICK FIX: Firebase Email Templates

## 🎯 **THE PROBLEM**

Your Firebase emails show:
```
Subject: Verify your email for %APP_NAME%
Hello %DISPLAY_NAME%,
Sender: not provided
```

## ✅ **THE SOLUTION (5 MINUTES)**

---

## 📋 **STEP-BY-STEP GUIDE**

### **Step 1: Open Firebase Console**
```
1. Go to: https://console.firebase.google.com
2. Click on: symptom2care
```

### **Step 2: Go to Templates**
```
1. Left sidebar → Click "Authentication"
2. Top tabs → Click "Templates"
```

### **Step 3: Edit Email Verification**
```
1. Find "Email address verification"
2. Click the pencil icon (Edit)
3. Change these fields:
```

**Sender name:**
```
Symptom2Care
```

**Subject:**
```
Verify your email for Symptom2Care
```

**Email body:** (Click "Customize action URL" if needed)
```html
Hello %DISPLAY_NAME%,

Thank you for signing up with Symptom2Care!

Click the button below to verify your email address:

%LINK%

If you didn't create an account, you can ignore this email.

Thanks,
Symptom2Care Team
```

**Click "SAVE"**

---

### **Step 4: Edit Password Reset**
```
1. Find "Password reset"
2. Click the pencil icon (Edit)
3. Change these fields:
```

**Sender name:**
```
Symptom2Care
```

**Subject:**
```
Reset your Symptom2Care password
```

**Email body:**
```html
Hello,

We received a request to reset your Symptom2Care password for %EMAIL%.

Click the button below to reset your password:

%LINK%

If you didn't request this, you can ignore this email.

This link expires in 1 hour.

Thanks,
Symptom2Care Team
```

**Click "SAVE"**

---

### **Step 5: Test It**
```
1. Go to your app
2. Try to sign up with a new email
3. Check your inbox
4. Email should now show:
   ✅ "Symptom2Care" as sender
   ✅ Proper subject
   ✅ Your name instead of %DISPLAY_NAME%
```

---

## 🎨 **OPTIONAL: Beautiful HTML Template**

For a professional look, use this HTML template:

### **For Email Verification:**

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc;">
    <div style="background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <h1 style="color: #0891b2; text-align: center; margin-bottom: 30px;">
            🏥 Symptom2Care
        </h1>
        
        <h2 style="color: #1e293b; margin-bottom: 20px;">
            Verify Your Email
        </h2>
        
        <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
            Hello <strong>%DISPLAY_NAME%</strong>,
        </p>
        
        <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
            Thank you for signing up! Please verify your email to get started.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="%LINK%" style="background: linear-gradient(135deg, #0891b2, #06b6d4); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                Verify Email
            </a>
        </div>
        
        <p style="color: #94a3b8; font-size: 14px;">
            Or copy this link: <br>
            <span style="color: #0891b2; word-break: break-all;">%LINK%</span>
        </p>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
        
        <p style="color: #94a3b8; font-size: 13px;">
            If you didn't sign up, ignore this email.
        </p>
        
        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 30px;">
            © 2025 Symptom2Care | Your Healthcare Assistant
        </p>
    </div>
</div>
```

---

## ✅ **CHECKLIST**

After setup, verify:
- [ ] Opened Firebase Console
- [ ] Went to Authentication → Templates
- [ ] Edited Email Verification template
- [ ] Edited Password Reset template
- [ ] Saved both templates
- [ ] Tested with new signup
- [ ] Checked email inbox
- [ ] Verified sender name shows "Symptom2Care"
- [ ] Verified placeholders are replaced

---

## 🎉 **DONE!**

Your emails will now show:
```
✅ From: Symptom2Care
✅ Subject: Verify your email for Symptom2Care
✅ Hello [Your Name],
✅ Professional design
```

---

## ⚠️ **IMPORTANT**

1. **Wait 5-10 minutes** after saving for changes to take effect
2. **Test with a NEW email** (not one you've used before)
3. **Check spam folder** if you don't see the email
4. **Clear browser cache** if still seeing old templates

---

## 🔗 **QUICK LINKS**

- Firebase Console: https://console.firebase.google.com
- Your Project: https://console.firebase.google.com/project/symptom2care
- Templates: https://console.firebase.google.com/project/symptom2care/authentication/emails

---

## 💡 **TIP**

You can customize the templates anytime:
1. Go to Firebase Console
2. Authentication → Templates
3. Edit and save
4. Changes apply immediately (after 5-10 min)

**That's it! Your email templates are now fixed!** 🚀
