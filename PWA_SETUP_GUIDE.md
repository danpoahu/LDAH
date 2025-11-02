# LDAH Progressive Web App (PWA) Setup Guide

## Overview
Your LDAH website has been configured as a Progressive Web App (PWA), which allows users to install it on their phones and use it like a native app with a custom icon!

## What's Been Added

### 1. **Web App Manifest** (`manifest.json`)
This file tells phones how to display your app:
- App name: "LDAH - Learning Disabilities Association of Hawaiʻi"
- Short name: "LDAH"
- Theme color: #004E7C (your brand blue)
- Display mode: Standalone (looks like a native app, no browser UI)
- Icons at 192x192 and 512x512 pixels

### 2. **Service Worker** (`service-worker.js`)
Enables offline functionality:
- Caches important pages and resources
- Allows the app to work without internet connection
- Provides faster load times on repeat visits

### 3. **Updated Meta Tags on All Pages**
Added to index.html, contact.html, events.html, faq.html, and volunteer.html:
- PWA manifest link
- iOS-specific meta tags
- Theme color for browser chrome
- App-capable declarations
- Apple touch icons

## Required: Create App Icons

You need to create two app icon images and upload them to your GitHub repository:

### Icon Requirements

**Icon 1: 192x192 pixels**
- Filename: `icon-192.png`
- Size: 192x192 pixels
- Format: PNG with transparency
- Upload to: `https://danpoahu.github.io/LDAH/icon-192.png`

**Icon 2: 512x512 pixels**
- Filename: `icon-512.png`
- Size: 512x512 pixels
- Format: PNG with transparency
- Upload to: `https://danpoahu.github.io/LDAH/icon-512.png`

### Design Tips for Icons
- Use your LDAH logo (the one currently at logo_transparent.png)
- Make sure it's centered with padding around the edges
- Keep it simple - small details won't show well at small sizes
- Use a solid background or transparency
- Test how it looks as a circle (Android masks icons as circles)

### How to Create Icons from Your Logo

**Option 1: Online Tool (Easiest)**
1. Go to https://www.pwabuilder.com/imageGenerator
2. Upload your logo_transparent.png
3. Download the generated icons
4. Rename them to icon-192.png and icon-512.png
5. Upload to your GitHub repository

**Option 2: Using an Image Editor**
1. Open your logo in an image editor (Photoshop, GIMP, Canva, etc.)
2. Create a new canvas: 512x512 pixels
3. Center your logo with some padding (leave ~10% margin)
4. Export as icon-512.png
5. Resize to 192x192 pixels
6. Export as icon-192.png

## Installation Instructions for Users

### On iPhone/iPad (iOS)

1. **Open in Safari** (must use Safari, not Chrome)
2. Tap the Share button (square with arrow pointing up)
3. Scroll down and tap "Add to Home Screen"
4. Edit the name if desired (shows as "LDAH")
5. Tap "Add" in the top right
6. The LDAH app icon will appear on the home screen!

**Features on iOS:**
- Custom app icon with your logo
- Opens in full-screen mode (no Safari UI)
- Works offline
- Appears in app switcher like other apps

### On Android

1. **Open in Chrome** (or Samsung Internet)
2. Tap the three dots menu (⋮)
3. Tap "Add to Home screen" or "Install app"
4. Confirm by tapping "Add" or "Install"
5. The LDAH app icon will appear on the home screen!

**Alternative for Android:**
- Chrome may show an automatic "Install app" prompt at the bottom
- Just tap "Install" when you see it

**Features on Android:**
- Custom app icon with your logo
- Opens as a standalone app (no browser UI)
- Works offline
- Appears in app drawer alongside other apps

## Files to Upload to Your Server

Place these files in your website's root directory:

1. ✅ `manifest.json` - Web app configuration
2. ✅ `service-worker.js` - Offline functionality
3. ✅ `index.html` - Updated home page
4. ✅ `contact.html` - New contact page
5. ✅ `events.html` - Updated with PWA tags
6. ✅ `faq.html` - Updated with PWA tags
7. ✅ `volunteer.html` - Updated with PWA tags
8. ⚠️ `icon-192.png` - **YOU NEED TO CREATE THIS**
9. ⚠️ `icon-512.png` - **YOU NEED TO CREATE THIS**

## Testing Your PWA

### Check if PWA is Working:

**On Desktop (Chrome):**
1. Open your website
2. Open Chrome DevTools (F12)
3. Go to "Application" tab
4. Check "Manifest" - should show your app details
5. Check "Service Workers" - should show registered worker

**On Mobile:**
1. Visit your site on a phone
2. Look for "Add to Home Screen" prompt or option
3. If the option appears, PWA is working!

### Troubleshooting:

**Icons not showing?**
- Make sure icon-192.png and icon-512.png are uploaded
- Check the URLs match exactly (case-sensitive)
- Clear browser cache and reload

**Can't find "Add to Home Screen"?**
- iOS: Must use Safari browser
- Android: Must use Chrome or Samsung Internet
- Make sure you're on HTTPS (not HTTP)

**Service Worker not registering?**
- Check browser console for errors
- Make sure service-worker.js is in the root directory
- Try in an incognito/private window

## Benefits of PWA for LDAH

1. **Easy Access**: Users can launch your services with one tap from their home screen
2. **Professional Appearance**: Looks like a native app, builds trust
3. **Offline Access**: Content cached for offline viewing
4. **Fast Loading**: Resources cached for instant loading
5. **No App Store Needed**: Install directly from website
6. **Works on All Phones**: iOS, Android, and desktop
7. **Push Notifications**: (Can be added later if needed)
8. **Lower Development Cost**: One app works everywhere

## Advanced Features (Optional)

You can enhance your PWA further with:

- **Push Notifications**: Alert users about new events
- **Background Sync**: Submit forms even when offline
- **Geolocation**: Help users find nearest office
- **Share API**: Let users share events easily
- **Camera Access**: Upload photos in volunteer applications

## Next Steps

1. ✅ All HTML files have been updated with PWA features
2. ✅ Manifest and service worker created
3. ⚠️ **ACTION NEEDED**: Create and upload icon-192.png and icon-512.png
4. Upload all files to your web server
5. Test installation on your phone
6. Share installation instructions with your team

## Support Resources

- PWA Builder: https://www.pwabuilder.com
- Icon Generator: https://www.pwabuilder.com/imageGenerator
- Google PWA Guide: https://web.dev/progressive-web-apps/
- Apple PWA Guide: https://developer.apple.com/web/

---

**Questions or need help?** The PWA features are fully backward compatible - users who don't install the app can still use the website normally in their browser!
