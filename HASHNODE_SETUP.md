# Hashnode Integration Setup Guide

## ✅ Implementation Complete

The integration is now implemented. Here's what was added:

### Files Created/Modified:

1. **[.env.local](.env.local)** - Environment variables (placeholder values)
   - `NEXT_PUBLIC_HASHNODE_USERNAME` - Your Hashnode username (public)
   - `HASHNODE_API_KEY` - Your Hashnode API key (private, backend only)
   - `HASHNODE_API_URL` - Hashnode GraphQL endpoint

2. **[app/lib/hashnode.ts](app/lib/hashnode.ts)** - New Hashnode API client
   - GraphQL client to fetch posts from Hashnode
   - Automatic HTML sanitization for security
   - Error handling with fallback to empty array

3. **[app/lib/posts.ts](app/lib/posts.ts)** - Updated blog post fetcher
   - New `getHashnodePosts()` function
   - Updated `getBlogPosts()` to check feature flag
   - Added `isHashnode` flag to post type

4. **[app/blog/page.tsx](app/blog/page.tsx)** - Added ISR revalidation
   - `export const revalidate = 3600` (1 hour)

5. **[app/blog/[slug]/page.tsx](app/blog/[slug]/page.tsx)** - Updated for Hashnode posts
   - Added ISR revalidation
   - Conditional rendering for HTML (Hashnode) vs MDX (Local)

6. **[app/feed/[format]/route.ts](app/feed/[format]/route.ts)** - Updated feed generation
   - Added ISR revalidation for RSS/Atom/JSON feeds

7. **package.json** - New dependencies installed
   - `sanitize-html` - HTML sanitization
   - `@types/sanitize-html` - TypeScript types

## 🔧 Configuration Required

To make it work, you need to:

### Step 1: Get Hashnode API Key
1. Go to [https://hashnode.com/settings/developer](https://hashnode.com/settings/developer)
2. Create a new API token
3. Copy the token

### Step 2: Update .env.local

Edit [.env.local](.env.local) and replace the placeholder values:

```bash
NEXT_PUBLIC_HASHNODE_USERNAME=your_actual_username
HASHNODE_API_KEY=your_actual_api_key
HASHNODE_API_URL=https://gql.hashnode.com/
```

### Step 3: Toggle Feature Flag

The integration respects your existing feature flag:

- **In [app/constants.ts](app/constants.ts)**:
  - Set `IN_WEBSITE_BLOGS: false` → Use Hashnode
  - Set `IN_WEBSITE_BLOGS: true` → Use local MDX files

## 📋 How It Works

### When `IN_WEBSITE_BLOGS: false` (Hashnode Mode):

1. **Blog List Page** (`/blog`)
   - Fetches posts from Hashnode GraphQL API
   - Displays title, date, and summary
   - ISR revalidates every 1 hour

2. **Individual Post Page** (`/blog/[slug]`)
   - Fetches specific post content from Hashnode
   - Renders HTML content directly with sanitization
   - ISR revalidates every 1 hour
   - Generates RSS/Atom/JSON feeds

3. **Feed Generation** (`/feed/rss.xml`, `/feed/atom.xml`, `/feed/feed.json`)
   - Pulls posts from Hashnode
   - ISR revalidates every 1 hour

### When `IN_WEBSITE_BLOGS: true` (Local MDX Mode):

- Uses existing local MDX files in `/content`
- Renders with custom MDX components (code, tweets, videos, etc.)
- No Hashnode API calls

## 🔨 Build & Deploy

### Local Development

```bash
npm run dev
# Open http://localhost:3000/blog
```

### Production Build

```bash
npm run build
npm start
```

## 📊 Content Transformation

Hashnode posts are transformed to match your existing structure:

| Hashnode Field | Your Metadata Field | Notes |
|----------------|-------------------|-------|
| `title` | `title` | Post title |
| `publishedAt` | `publishedAt` | ISO date |
| `brief` | `summary` | Post excerpt |
| `tags[].name` | `tags` | Comma-separated |
| `coverImage.url` | `image` | Featured image |
| `content` | `content` | HTML (sanitized) |
| `slug` | `slug` | URL slug |

## 🛡️ Security

- HTML content is sanitized using `sanitize-html` package
- Allowed tags: `p`, `br`, `strong`, `em`, `h1-h6`, `ul`, `ol`, `a`, `img`, `code`, `pre`, `table`, etc.
- API key stored in `.env.local` (never committed to git)
- HTTPS only for Hashnode API calls

## 🔄 ISR (Incremental Static Regeneration)

- Blog pages revalidate every **1 hour** (3600 seconds)
- Feeds revalidate every **1 hour**
- Changes appear automatically without full rebuild
- You can adjust revalidation time in the source files

## ✅ Verification Checklist

- [ ] Updated `.env.local` with real Hashnode credentials
- [ ] Set `IN_WEBSITE_BLOGS: false` in `app/constants.ts`
- [ ] Run `npm run dev` and visit `/blog`
- [ ] Verify Hashnode posts appear (not "Visit Blog Site" link)
- [ ] Click a post and verify content renders
- [ ] Check `/feed/rss.xml` to verify feed includes Hashnode posts
- [ ] Optional: Toggle `IN_WEBSITE_BLOGS: true` to verify local MDX fallback
- [ ] Run `npm run build` to verify production build succeeds

## 🎯 Next Steps

Optional enhancements you could add:

1. **Add sanitization options** - Customize allowed HTML tags in [app/lib/hashnode.ts](app/lib/hashnode.ts)
2. **Custom MDX component parsing** - Convert Hashnode embeds to your custom components
3. **Author information** - Add Hashnode author details to blog posts
4. **Search** - Add Algolia or similar for searching Hashnode posts
5. **Comments** - Enable Hashnode comments on individual posts
6. **Social preview** - Use Hashnode cover images for OG tags

## 🆘 Troubleshooting

**Hashnode API error 400:**
- Check API key is valid in `.env.local`
- Verify username is correct
- Check Hashnode GraphQL API is accessible

**No posts appearing:**
- Check `IN_WEBSITE_BLOGS` flag is `false`
- Verify API key and credentials in `.env.local`
- Check browser console for errors
- Check server logs during build

**Build fails:**
- Ensure `npm install` completed successfully
- Check all imports are correct
- Verify TypeScript compilation: `npm run build`
