# Google Analytics Quick Reference Guide

## Your Analytics Setup

**Measurement ID**: G-32PRRS0W85

**Pages Tracking Analytics**:
✅ contact.html
✅ events.html
✅ faq.html
✅ volunteer.html

**Pages NOT Tracking** (intentionally):
❌ admin.html
❌ install.html
❌ index.html (needs to be added separately if desired)

---

## How to Access Your Analytics

1. Go to: **https://analytics.google.com/**
2. Sign in with your Google account (the one linked to Firebase)
3. Select your property (should show "LDAH" or your project name)

---

## Key Reports to Check

### 1. **Realtime Report**
- See who's on your site RIGHT NOW
- See which pages they're viewing
- Location: Left sidebar → **Realtime** → **Overview**

### 2. **Audience Overview**
- Total users and sessions
- Bounce rate
- Session duration
- New vs returning visitors
- Location: Left sidebar → **Reports** → **Audience** → **Overview**

### 3. **Page Views**
- Most popular pages
- Time spent on each page
- Exit rates
- Location: Left sidebar → **Reports** → **Behavior** → **Site Content** → **All Pages**

### 4. **Traffic Sources**
- How people found your site (Google, direct, social media, etc.)
- Location: Left sidebar → **Reports** → **Acquisition** → **All Traffic** → **Source/Medium**

### 5. **Devices**
- Desktop vs mobile vs tablet usage
- Operating systems and browsers
- Location: Left sidebar → **Reports** → **Audience** → **Technology** → **Overview**

---

## What Data You'll See

### Automatically Tracked:
- ✅ **Page views**: Every time someone visits a page
- ✅ **Sessions**: A group of interactions within 30 minutes
- ✅ **Users**: Unique visitors to your site
- ✅ **Bounce rate**: % of visitors who leave after viewing one page
- ✅ **Session duration**: How long people stay
- ✅ **Geographic location**: Where visitors are from
- ✅ **Device type**: Desktop, mobile, or tablet
- ✅ **Browser & OS**: Chrome, Safari, iOS, Android, etc.
- ✅ **Traffic source**: How they found you (search, direct, referral)

### Not Tracked (Would Need Custom Setup):
- ❌ Button clicks
- ❌ Form submissions
- ❌ Video plays
- ❌ Downloads
- ❌ Scroll depth
- ❌ Custom events

---

## Timeline for Seeing Data

- **Realtime data**: Shows within seconds of page views
- **Standard reports**: Can take 24-48 hours to fully populate
- **First visit**: After deploying, visit your site to generate test data

---

## Testing Your Analytics

### Step 1: Deploy Your Files
Upload the updated HTML files to your web server

### Step 2: Visit Your Site
- Open your website in a browser
- Navigate through the pages with analytics (contact, events, faq, volunteer)

### Step 3: Check Realtime Report
1. Go to Google Analytics
2. Click **Realtime** → **Overview**
3. You should see yourself as an active user
4. Click through pages and watch them appear in realtime

### Step 4: Wait for Full Data
- Check back in 24-48 hours for complete reports
- Historical data will accumulate over time

---

## Common Metrics Explained

**Users**: Total number of unique visitors
- *Good to know*: A person who visits twice counts as 1 user, 2 sessions

**Sessions**: Total visits to your site
- *Good to know*: Ends after 30 minutes of inactivity

**Pageviews**: Total number of pages viewed
- *Good to know*: If someone views the same page twice, it counts as 2 pageviews

**Bounce Rate**: % of single-page sessions
- *Good to know*: Lower is generally better (means people explore your site)
- *For LDAH*: Some pages (like contact) might naturally have higher bounce rates

**Avg. Session Duration**: How long visitors stay
- *Good to know*: Longer is generally better
- *For LDAH*: FAQ page might have longer sessions if people are reading

**Pages/Session**: Average pages viewed per session
- *Good to know*: Higher means more engagement

---

## Pro Tips

1. **Check Regularly**: Look at analytics weekly to spot trends
2. **Compare Dates**: Use date comparison to see growth
3. **Mobile-First**: Check mobile vs desktop usage for design insights
4. **Popular Pages**: See which pages get the most traffic
5. **Geographic Data**: See where your audience is located
6. **Set Goals**: In Analytics, you can set up goals (optional but useful)

---

## Troubleshooting

### "I don't see any data"
- Wait 24-48 hours after deployment
- Make sure files are actually deployed to your live site
- Check if you're using an ad blocker (disable it for testing)
- Try visiting in an incognito/private window

### "Realtime shows data but reports don't"
- This is normal! Reports update with a delay
- Give it 24 hours

### "I see my own visits"
- This is normal for testing
- To exclude your own traffic, set up an IP filter in Analytics (optional)

---

## Next Steps (Optional)

If you want more advanced tracking:
1. **Track button clicks** (volunteer applications, email clicks)
2. **Track form submissions** (volunteer form)
3. **Set up conversion goals** (define what success looks like)
4. **Create custom dashboards** (personalized view of your data)

Let me know if you want help setting up any of these!

---

## Support Resources

- **Google Analytics Help**: https://support.google.com/analytics
- **Firebase Analytics Docs**: https://firebase.google.com/docs/analytics
- **Your Measurement ID**: G-32PRRS0W85

---

**Remember**: Analytics is a powerful tool, but the most important metrics are the ones that help you understand your users and improve their experience!
