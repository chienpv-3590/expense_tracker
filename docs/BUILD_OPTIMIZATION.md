# Production Build Optimization Guide

## Build Configuration

### next.config.js Optimizations

The project is configured with the following production optimizations:

```javascript
// ✅ Enabled optimizations:
- reactStrictMode: true           // Better error detection
- swcMinify: true                  // Fast minification with SWC
- compress: true                   // Gzip/Brotli compression
- Image optimization (AVIF, WebP)  // Modern image formats
- Security headers                 // XSS, clickjacking protection
- Static asset caching             // 1-year cache for immutable files
- Package import optimization      // Tree-shaking for date-fns, lucide-react
```

### Bundle Analysis

To analyze bundle size and identify large dependencies:

```bash
# Run bundle analyzer (opens in browser)
npm run analyze
```

This will:
- Generate visual bundle size report
- Show all dependencies and their sizes
- Identify opportunities for code splitting
- Highlight duplicate dependencies

## Current Build Performance

### Build Output (as of Phase 11)

```
✓ Compiled successfully in 2.0s
✓ Generating static pages (11/11) in 567ms

Route Summary:
- Static pages:  4 (/, /_not-found, /categories/new, /transactions/new)
- Dynamic pages: 11 (API routes, edit pages, list pages)
```

### Optimization Results

- ✅ **Fast build**: ~2 seconds compilation (Turbopack)
- ✅ **Static generation**: 4 pages pre-rendered at build time
- ✅ **Dynamic rendering**: API routes and data-driven pages on-demand
- ✅ **No build warnings**: TypeScript compilation successful
- ✅ **Zero vulnerabilities**: All dependencies secure

## Performance Best Practices

### 1. Code Splitting ✅

**Already Implemented:**
- Next.js automatic code splitting per route
- Dynamic imports for heavy components (if needed)

**Example** (if you need lazy loading):
```typescript
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <LoadingSpinner />,
  ssr: false, // Disable server-side rendering if not needed
});
```

### 2. Image Optimization ✅

**Already Configured:**
- AVIF and WebP format support
- Automatic image optimization by Next.js
- Security headers for images

**Usage:**
```tsx
import Image from 'next/image';

<Image 
  src="/logo.png" 
  alt="Logo" 
  width={200} 
  height={50}
  priority // For above-the-fold images
/>
```

### 3. Font Optimization ✅

**Already Using:**
- `next/font` for optimized font loading
- Self-hosted fonts (no external requests)

### 4. Database Query Optimization ✅

**Already Implemented:**
- Prisma ORM with optimized queries
- Database indexes on frequently queried fields
- Pagination for large datasets (20 items per page)
- Connection pooling (automatic with Prisma)

### 5. API Route Optimization

**Consider Adding** (optional for high traffic):

```typescript
// Caching with revalidation
export const revalidate = 60; // Revalidate every 60 seconds

// Or dynamic caching
export const dynamic = 'force-dynamic'; // Always fresh data
export const fetchCache = 'force-no-store'; // No caching
```

### 6. Static Page Generation

**Current Setup:**
- Homepage: Static (regenerated on build)
- Form pages: Static (no dynamic data)
- List pages: Dynamic (user-specific data)

**To Add More Static Pages** (if applicable):
```typescript
// In page component
export const dynamic = 'force-static';
export const revalidate = 3600; // ISR: Regenerate every hour
```

## Build Size Analysis

### Expected Bundle Sizes

| Package | Size | Purpose |
|---------|------|---------|
| Next.js | ~80KB | Framework core |
| React | ~40KB | UI library |
| Prisma Client | ~5KB | Database ORM |
| date-fns | ~10KB | Date utilities (tree-shaken) |
| react-hook-form | ~15KB | Form management |
| Zod | ~12KB | Validation |
| Tailwind CSS | Variable | Utility styles (purged unused) |

**Total First Load JS**: ~100-150KB (gzipped)

### Reducing Bundle Size

If bundle is too large after analysis:

1. **Check Duplicate Dependencies**:
   ```bash
   npm ls date-fns  # Check for multiple versions
   npm dedupe       # Remove duplicates
   ```

2. **Use Dynamic Imports for Heavy Libraries**:
   ```typescript
   // Before: Chart component always loaded
   import { Chart } from 'react-chartjs-2';

   // After: Chart loaded only when needed
   const Chart = dynamic(() => import('react-chartjs-2'), { ssr: false });
   ```

3. **Optimize Tailwind CSS**:
   ```javascript
   // tailwind.config.ts
   content: [
     './src/**/*.{js,ts,jsx,tsx}',  // Only scan source files
     '!./node_modules',              // Exclude node_modules
   ],
   ```

4. **Use Modular Imports**:
   ```typescript
   // Before: Import entire library
   import _ from 'lodash';

   // After: Import specific function
   import debounce from 'lodash/debounce';
   ```

## Runtime Performance

### Lighthouse Metrics (Target Scores)

- **Performance**: 90+ (Green)
- **Accessibility**: 95+ (Green)
- **Best Practices**: 95+ (Green)
- **SEO**: 90+ (Green)

### Core Web Vitals (Target)

- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Monitoring Tools

**Vercel Analytics** (Built-in):
```bash
npm install @vercel/analytics
```

```typescript
// In src/app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />  {/* Add this */}
      </body>
    </html>
  );
}
```

**Web Vitals Logging**:
```typescript
// In src/app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';

<SpeedInsights />
```

## Caching Strategy

### Static Assets

**Already Configured in next.config.js:**
```
/static/*  → Cache-Control: public, max-age=31536000, immutable
```

### API Routes

**Consider Adding:**
```typescript
// In API routes (e.g., /api/transactions/summary)
export async function GET(request: Request) {
  const data = await getSummary();

  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
    },
  });
}
```

### Database

**Already Optimized:**
- Prisma connection pooling
- Efficient queries with `select` and `include`
- Indexes on `date`, `categoryId`, `type` fields

## Production Testing

### Before Deployment

1. **Build Test**:
   ```bash
   npm run build
   # ✓ Should complete without errors
   # ✓ Check for build warnings
   ```

2. **Start Production Server Locally**:
   ```bash
   npm start
   # Test on http://localhost:3000
   ```

3. **Type Check**:
   ```bash
   npm run type-check
   # ✓ No TypeScript errors
   ```

4. **Format Check**:
   ```bash
   npm run format:check
   # ✓ All files formatted consistently
   ```

5. **Test Critical Paths**:
   - [ ] Homepage loads and shows data
   - [ ] Can create a transaction
   - [ ] Can edit/delete transactions
   - [ ] Dashboard filters work
   - [ ] CSV export works
   - [ ] Search and filter works

### Load Testing (Optional)

If expecting high traffic:

```bash
# Install Apache Bench
sudo apt install apache2-utils

# Test 100 concurrent users, 1000 requests
ab -n 1000 -c 100 http://localhost:3000/

# Or use k6
npm install -g k6
k6 run load-test.js
```

## Optimization Checklist

- [X] next.config.js configured with production optimizations
- [X] Bundle analyzer installed and configured
- [X] Image optimization enabled (AVIF, WebP)
- [X] Security headers configured
- [X] Static asset caching configured
- [X] SWC minification enabled
- [X] React Strict Mode enabled
- [X] Package import optimization configured
- [X] Database queries optimized with indexes
- [X] Pagination implemented for large datasets
- [ ] Bundle size analyzed (run `npm run analyze`)
- [ ] Production build tested locally
- [ ] Lighthouse audit performed (after deployment)
- [ ] Web Vitals monitored (after deployment)

## Troubleshooting

### Build Fails

**Error: `Out of memory`**
```bash
# Increase Node.js memory
NODE_OPTIONS='--max-old-space-size=4096' npm run build
```

**Error: `Module not found`**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### Build is Slow

- ✅ Already using Turbopack (fastest bundler)
- Check large dependencies with `npm run analyze`
- Consider using `output: 'standalone'` for Docker

### Bundle Too Large

- Run `npm run analyze` to identify culprits
- Use dynamic imports for heavy components
- Check for duplicate dependencies
- Remove unused dependencies

## Next Steps

After completing build optimization:

1. ✅ T078 Complete: Production build optimized
2. ➡️ T079: Deploy to Vercel
3. ➡️ T080: Setup monitoring and logging
4. ➡️ T081: Security review

## Resources

- [Next.js Production Checklist](https://nextjs.org/docs/going-to-production)
- [Next.js Optimization](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Vercel Analytics](https://vercel.com/analytics)
- [Web Vitals](https://web.dev/vitals/)
