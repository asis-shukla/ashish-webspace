# Webhook-Based Blog Revalidation Setup

## Overview

Your blog now uses **webhook-based on-demand revalidation** instead of polling the Hashnode API every hour. When you publish or update a blog post on Hashnode, it automatically triggers a webhook that instantly refreshes your blog pages.

**Key benefit:** ⚡ Blog posts appear on your website immediately (within seconds), not after 1 hour.

---

## How It Works

1. **You publish a post** on Hashnode
2. **Hashnode sends a webhook** to `https://yourdomain.com/api/webhooks/hashnode`
3. **Your app verifies the signature** (security check)
4. **Next.js revalidates** the blog pages:
   - `/blog` (listing page)
   - `/blog/[slug]` (individual post)
   - `/feed/[format]` (RSS/Atom/JSON feeds)
5. **Fresh content is served** immediately to visitors

---

## Setup Instructions

### Step 1: Get Your Webhook Secret

Your webhook secret is already configured in [.env.local](.env.local):

```bash
WEBHOOK_SECRET=hn_whs_EbH6dZ6G8KvTlqznwsbJTD5uB
```

**Important:** Keep this secret safe! Don't commit [.env.local](.env.local) to version control.

### Step 2: Configure Hashnode Webhook

1. Go to [Hashnode Settings → Webhooks/Integrations](https://hashnode.com/settings/webhooks) (or similar)
2. Create a new webhook with these settings:
   - **URL:** `https://yourdomain.com/api/webhooks/hashnode`
   - **Secret:** Copy the value from `WEBHOOK_SECRET` in your [.env.local](.env.local)
   - **Events:** Select at least:
     - `post.published` - When you publish a new post
     - `post.updated` - When you update an existing post
     - `post.deleted` - When you delete a post (optional)

3. **Save the webhook**

### Step 3: Deploy

Push your changes to production:

```bash
git add .
git commit -m "feat: implement webhook-based blog revalidation"
git push
```

Then deploy to your hosting (Vercel, Netlify, etc.)

---

## Implementation Details

### Webhook Endpoint

**Location:** [app/api/webhooks/hashnode/route.ts](app/api/webhooks/hashnode/route.ts)

**What it does:**
- ✅ Accepts POST requests from Hashnode
- ✅ Verifies HMAC-SHA256 signature for security
- ✅ Revalidates blog pages on-demand
- ✅ Handles: `post.published`, `post.updated`, `post.deleted` events
- ✅ Returns JSON responses with status

**Security:**
- Only requests with valid `x-hashnode-signature` header are accepted
- Signature is verified using your `WEBHOOK_SECRET`
- Invalid signatures get rejected with 403 Forbidden

### Files Modified

| File | Change |
|------|--------|
| [app/api/webhooks/hashnode/route.ts](app/api/webhooks/hashnode/route.ts) | Created webhook handler |
| [app/blog/page.tsx](app/blog/page.tsx) | Removed `export const revalidate = 3600` |
| [app/blog/[slug]/page.tsx](app/blog/[slug]/page.tsx) | Removed `export const revalidate = 3600` |
| [app/feed/[format]/route.ts](app/feed/[format]/route.ts) | Removed `export const revalidate = 3600` |
| [app/lib/hashnode.ts](app/lib/hashnode.ts) | Removed `next: { revalidate: 3600 }` from fetch |

---

## Testing the Webhook (Local Development)

### Method 1: Using curl

Generate a valid webhook request:

```bash
# Save this as test-webhook.sh
#!/bin/bash

SECRET="hn_whs_EbH6dZ6G8KvTlqznwsbJTD5uB"
PAYLOAD='{"event":"post.published","data":{"post":{"id":"test-123","slug":"test-post","title":"Test Post","publishedAt":"2026-02-16T10:00:00Z"}}}'

SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$SECRET" | sed 's/^.* //')

curl -X POST http://localhost:3000/api/webhooks/hashnode \
  -H "Content-Type: application/json" \
  -H "x-hashnode-signature: $SIGNATURE" \
  -d "$PAYLOAD"
```

### Method 2: Use Postman or Insomnia

1. Create POST request to `http://localhost:3000/api/webhooks/hashnode`
2. Add header: `x-hashnode-signature: <your-signature-here>`
3. Add raw JSON body and send

### Expected Response (Success)

```json
{
  "success": true,
  "message": "Successfully revalidated blog pages for post: Test Post",
  "event": "post.published",
  "slug": "test-post"
}
```

### Expected Response (Signature Verification Failed)

```json
{
  "error": "Invalid signature"
}
```

---

## Monitoring

### Check Server Logs

Look for these log messages when webhooks are received:

```
Webhook received: post.published for post "My New Post" (slug: my-new-post)
✓ Revalidated: /blog, /blog/my-new-post, and feed routes
```

### Check Webhook Delivery

Go to your Hashnode webhook settings to see:
- ✅ Delivery history
- ✅ Payload sent
- ✅ Response from your server
- ❌ Failed deliveries (if any)

---

## Troubleshooting

### Webhook not triggering?

1. **Check webhook URL is correct:**
   - Should be: `https://yourdomain.com/api/webhooks/hashnode`
   - Not: `http://localhost:3000/api/webhooks/hashnode` (local dev)

2. **Verify secret matches:**
   - Hashnode webhook secret should match `WEBHOOK_SECRET` in `[.env.local](.env.local)`

3. **Check Hashnode webhook settings:**
   - Go to Hashnode Settings and verify webhook is enabled
   - Check delivery history for errors

4. **Check server logs:**
   - Look for error messages in your deployment logs
   - Check for `WEBHOOK_SECRET not configured`

### Blog pages not updating after webhook?

1. **Verify revalidatePath calls succeed:**
   - Check server logs for `✓ Revalidated` message

2. **Clear browser cache:**
   - Hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

3. **Check ISR cache:**
   - Visit `/blog` in incognito/private window to bypass browser cache

---

## Hashnode Webhook Events

Your webhook is configured to handle:

| Event | Action |
|-------|--------|
| `post.published` | Revalidates blog pages when new post published |
| `post.updated` | Revalidates blog pages when post updated |
| `post.deleted` | Revalidates blog pages when post deleted |

Other events are ignored (not sent to your endpoint by Hashnode).

---

## Next Steps

✅ Webhook implementation is complete!

### What's Next:

1. **Deploy to production** (Vercel, Netlify, etc.)
2. **Configure Hashnode webhook** with your production URL
3. **Test by publishing a post** on Hashnode
4. **Monitor webhook delivery** in Hashnode settings
5. **Verify blog update** appears instantly on your website

---

## FAQs

**Q: What happens if webhook fails?**
A: Your blog pages won't update. Hashnode will retry delivery. Check server logs and webhook settings in Hashnode.

**Q: Can I manually trigger revalidation?**
A: Yes, the webhook endpoint will still accept valid requests from any source. Just include the correct signature.

**Q: What if I delete a post on Hashnode?**
A: The webhook will revalidate your blog pages, and the deleted post will be removed from listings.

**Q: Does this work with ISR fallback?**
A: No ISR polling is active anymore. Updates are 100% webhook-driven.

**Q: How secure is the webhook?**
A: Uses HMAC-SHA256 signature verification. Only Hashnode can generate valid signatures with your secret.

---

## Reference

- **Webhook Endpoint:** [app/api/webhooks/hashnode/route.ts](app/api/webhooks/hashnode/route.ts)
- **Next.js Revalidation Docs:** https://nextjs.org/docs/app/building-your-application/data-fetching/revalidating
- **Hashnode Webhooks:** https://hashnode.com/docs (check webhooks section)
