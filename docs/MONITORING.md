# Monitoring & Logging Setup Guide

## Overview

This guide covers setting up comprehensive monitoring and logging for the Expense Tracker application in production.

## 1. Error Tracking with Sentry

### Setup Sentry

1. **Create Sentry Account**:
   - Go to [https://sentry.io/signup/](https://sentry.io/signup/)
   - Sign up with GitHub or email
   - Create new organization

2. **Create Project**:
   - Select **Next.js** as platform
   - Name: `expense-tracker`
   - Click **Create Project**

3. **Install Sentry**:
   ```bash
   npx @sentry/wizard@latest -i nextjs
   ```

   This wizard will:
   - Install `@sentry/nextjs` package
   - Create `sentry.client.config.ts`
   - Create `sentry.server.config.ts`
   - Create `sentry.edge.config.ts`
   - Update `next.config.js` with Sentry plugin
   - Add `instrumentation.ts` for Node.js monitoring

4. **Configure Environment Variables**:
   ```env
   # .env.production
   SENTRY_DSN=https://your-dsn@sentry.io/project-id
   SENTRY_ORG=your-organization
   SENTRY_PROJECT=expense-tracker
   
   # Optional: Auth token for source maps
   SENTRY_AUTH_TOKEN=your-auth-token
   ```

5. **Add to Vercel**:
   - Go to Vercel Project Settings → Environment Variables
   - Add `SENTRY_DSN` (Production environment)
   - Redeploy application

### Verify Error Tracking

1. **Create Test Error**:
   ```typescript
   // In any page component
   throw new Error('Test Sentry Error');
   ```

2. **Trigger Error**:
   - Visit the page in production
   - Error should appear in Sentry dashboard
   - Check error details: stack trace, breadcrumbs, user context

3. **Remove Test Error** after verification

### Custom Error Logging

```typescript
// src/lib/logger.ts
import * as Sentry from '@sentry/nextjs';

export const logger = {
  error: (error: Error, context?: Record<string, any>) => {
    console.error('[ERROR]', error, context);
    
    if (process.env.NODE_ENV === 'production') {
      Sentry.captureException(error, {
        extra: context,
      });
    }
  },

  warn: (message: string, context?: Record<string, any>) => {
    console.warn('[WARN]', message, context);
    
    if (process.env.NODE_ENV === 'production') {
      Sentry.captureMessage(message, {
        level: 'warning',
        extra: context,
      });
    }
  },

  info: (message: string, context?: Record<string, any>) => {
    console.log('[INFO]', message, context);
  },
};
```

**Usage in API Routes**:
```typescript
// src/app/api/transactions/route.ts
import { logger } from '@/lib/logger';

export async function POST(request: Request) {
  try {
    // ... transaction logic
  } catch (error) {
    logger.error(error as Error, {
      route: '/api/transactions',
      method: 'POST',
      body: await request.json(),
    });
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

## 2. Vercel Analytics

### Setup Web Analytics

1. **Enable in Vercel**:
   - Go to Project → Analytics tab
   - Click **Enable Analytics**

2. **Or Install Package**:
   ```bash
   npm install @vercel/analytics
   ```

3. **Add to Layout**:
   ```typescript
   // src/app/layout.tsx
   import { Analytics } from '@vercel/analytics/react';

   export default function RootLayout({ children }: { children: React.ReactNode }) {
     return (
       <html lang="vi">
         <body>
           {children}
           <Analytics />
         </body>
       </html>
     );
   }
   ```

### Track Custom Events

```typescript
// src/lib/analytics.ts
import { track } from '@vercel/analytics';

export const analytics = {
  trackTransaction: (type: 'income' | 'expense', amount: number) => {
    track('transaction_created', {
      type,
      amount,
    });
  },

  trackExport: (format: 'csv', count: number) => {
    track('data_exported', {
      format,
      count,
    });
  },

  trackError: (errorType: string) => {
    track('error_occurred', {
      type: errorType,
    });
  },
};
```

**Usage**:
```typescript
// In TransactionForm after successful submit
import { analytics } from '@/lib/analytics';

analytics.trackTransaction(data.type, data.amount);
```

## 3. Vercel Speed Insights

### Setup Performance Monitoring

1. **Install Package**:
   ```bash
   npm install @vercel/speed-insights
   ```

2. **Add to Layout**:
   ```typescript
   // src/app/layout.tsx
   import { SpeedInsights } from '@vercel/speed-insights/next';

   export default function RootLayout({ children }: { children: React.ReactNode }) {
     return (
       <html lang="vi">
         <body>
           {children}
           <SpeedInsights />
         </body>
       </html>
     );
   }
   ```

### Monitor Web Vitals

Speed Insights automatically tracks:
- **LCP** (Largest Contentful Paint): < 2.5s target
- **FID** (First Input Delay): < 100ms target
- **CLS** (Cumulative Layout Shift): < 0.1 target
- **FCP** (First Contentful Paint): < 1.8s target
- **TTFB** (Time to First Byte): < 600ms target

## 4. Custom Logging for API Routes

### Structured Logging

```typescript
// src/lib/logger.ts (expanded)
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  route?: string;
  method?: string;
  userId?: string;
  duration?: number;
  [key: string]: any;
}

class Logger {
  private log(level: LogLevel, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...context,
    };

    // Console log in all environments
    const logMethod = level === 'error' ? console.error : 
                     level === 'warn' ? console.warn : 
                     console.log;
    
    logMethod(JSON.stringify(logEntry));

    // Send to Sentry in production
    if (process.env.NODE_ENV === 'production' && level === 'error') {
      Sentry.captureMessage(message, {
        level,
        extra: context,
      });
    }
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context);
  }

  error(error: Error | string, context?: LogContext) {
    const message = error instanceof Error ? error.message : error;
    const errorContext = error instanceof Error ? 
      { ...context, stack: error.stack } : 
      context;
    
    this.log('error', message, errorContext);
  }

  debug(message: string, context?: LogContext) {
    if (process.env.NODE_ENV === 'development') {
      this.log('debug', message, context);
    }
  }
}

export const logger = new Logger();
```

### Middleware for Request Logging

```typescript
// src/middleware.ts (if not exists)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const start = Date.now();
  const { pathname, search } = request.nextUrl;

  // Log request
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    type: 'request',
    method: request.method,
    path: pathname + search,
    userAgent: request.headers.get('user-agent'),
  }));

  // Continue request
  const response = NextResponse.next();

  // Log response time
  const duration = Date.now() - start;
  response.headers.set('X-Response-Time', `${duration}ms`);

  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    type: 'response',
    method: request.method,
    path: pathname + search,
    duration,
    status: response.status,
  }));

  return response;
}

export const config = {
  matcher: '/api/:path*', // Only log API routes
};
```

## 5. Database Query Monitoring

### Prisma Query Logging

```typescript
// src/lib/prisma.ts (modify existing)
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn']
      : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Log slow queries in production
if (process.env.NODE_ENV === 'production') {
  prisma.$use(async (params, next) => {
    const before = Date.now();
    const result = await next(params);
    const after = Date.now();
    const duration = after - before;

    // Log queries taking > 1 second
    if (duration > 1000) {
      console.warn(JSON.stringify({
        type: 'slow_query',
        model: params.model,
        action: params.action,
        duration,
      }));
    }

    return result;
  });
}
```

## 6. Application Health Checks

### Create Health Endpoint

```typescript
// src/app/api/health/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      uptime: process.uptime(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
```

### Setup Uptime Monitoring

**Using UptimeRobot (Free)**:
1. Go to [https://uptimerobot.com](https://uptimerobot.com)
2. Create new monitor:
   - Type: HTTP(s)
   - URL: `https://your-app.vercel.app/api/health`
   - Interval: 5 minutes
   - Alert contacts: Your email
3. Receive alerts if site goes down

**Using Vercel Cron**:
```typescript
// vercel.json
{
  "crons": [{
    "path": "/api/health",
    "schedule": "*/5 * * * *"  // Every 5 minutes
  }]
}
```

## 7. Alert Configuration

### Sentry Alerts

1. **In Sentry**: Go to Alerts → Create Alert Rule

2. **Alert Conditions**:
   ```
   When: The number of events
   Is: More than 10
   In: 5 minutes
   For: All environments
   ```

3. **Actions**:
   - Send email notification
   - Send Slack message (if integrated)

### Vercel Deployment Alerts

1. **In Vercel**: Settings → Notifications

2. **Enable**:
   - ✅ Deployment Started
   - ✅ Deployment Ready
   - ✅ Deployment Failed
   - ✅ Deployment Error

3. **Integrations**:
   - Slack: Install Vercel app in Slack workspace
   - Email: Add team members

## 8. Logging Best Practices

### ✅ DO:
- Log all API errors with context
- Log slow database queries (> 1 second)
- Log authentication failures
- Log important business events (transaction created, deleted)
- Use structured logging (JSON format)
- Include request IDs for tracing

### ❌ DON'T:
- Log sensitive data (passwords, tokens, credit cards)
- Log personal data (without user consent)
- Log excessive debug information in production
- Log every successful request (high volume)
- Use console.log directly (use logger wrapper)

### Example Good Log Entry

```json
{
  "timestamp": "2025-01-18T10:30:45.123Z",
  "level": "error",
  "message": "Failed to create transaction",
  "route": "/api/transactions",
  "method": "POST",
  "userId": "user-123",
  "error": "Validation failed",
  "details": {
    "field": "amount",
    "value": "invalid"
  },
  "requestId": "req-abc123"
}
```

## 9. Monitoring Dashboard

### Key Metrics to Track

1. **Application Metrics**:
   - Total transactions created
   - Total categories created
   - CSV exports count
   - Active users (if auth added)

2. **Performance Metrics**:
   - Page load time (P50, P95, P99)
   - API response time
   - Database query time
   - Error rate

3. **Business Metrics**:
   - New users (if auth added)
   - Transaction volume
   - Feature usage

### Creating Custom Dashboard

**In Vercel Analytics**:
1. Go to Analytics tab
2. View:
   - Pageviews
   - Top pages
   - Top referrers
   - Devices
   - Locations

**In Sentry**:
1. Go to Dashboards → Create Dashboard
2. Add widgets:
   - Error count over time
   - Error by route
   - Error by browser
   - Response time

## 10. Testing Monitoring Setup

### Error Tracking Test

```bash
# Create test error route
# src/app/api/test-error/route.ts
export async function GET() {
  throw new Error('Test error for Sentry');
}

# Visit: https://your-app.vercel.app/api/test-error
# Check: Sentry dashboard for error
# Delete: Test route after verification
```

### Performance Test

```bash
# Use Lighthouse
npm install -g lighthouse

lighthouse https://your-app.vercel.app --view

# Check scores:
# - Performance: > 90
# - Accessibility: > 95
# - Best Practices: > 95
# - SEO: > 90
```

### Analytics Test

```bash
# Visit your app and interact
# - Visit homepage
# - Create transaction
# - Export CSV
# - Search transactions

# Check Vercel Analytics:
# - Pageviews recorded
# - Custom events tracked
# - Web Vitals measured
```

## Monitoring Checklist

- [ ] Sentry installed and configured
- [ ] Sentry DSN added to Vercel environment variables
- [ ] Error logging tested in production
- [ ] Vercel Analytics enabled
- [ ] Vercel Speed Insights installed
- [ ] Custom analytics events tracked
- [ ] Structured logging implemented
- [ ] Health check endpoint created
- [ ] Uptime monitoring configured
- [ ] Alert rules configured in Sentry
- [ ] Deployment notifications enabled
- [ ] Slow query logging enabled
- [ ] Monitoring dashboard reviewed

## Cost Estimation

### Sentry
- **Free Tier**: 5,000 errors/month, 10,000 transactions
- **Team**: $26/month (50,000 errors, 100,000 transactions)

### Vercel Analytics
- **Included**: Free with Vercel Pro ($20/month)
- **Unlimited**: Pageviews and custom events

### UptimeRobot
- **Free Tier**: 50 monitors, 5-minute checks
- **Pro**: $7/month (50 monitors, 1-minute checks)

**Total for Small App**: $0-10/month (using free tiers)

## Next Steps

After setup complete:

1. ✅ T080 Complete: Monitoring and logging configured
2. ➡️ T081: Security review
3. 🎉 Production ready!

## Resources

- [Sentry Next.js Integration](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Vercel Analytics](https://vercel.com/docs/analytics)
- [Vercel Speed Insights](https://vercel.com/docs/speed-insights)
- [Web Vitals](https://web.dev/vitals/)
- [Structured Logging](https://www.datadoghq.com/knowledge-center/structured-logging/)
