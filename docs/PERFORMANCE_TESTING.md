# Performance Testing Guide

## Overview
This guide documents performance testing procedures and results for the Expense Tracker application with 10,000+ transactions.

## Setup

### 1. Seed Performance Data
```bash
# Run performance seed script
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed-performance.ts
```

This will:
- Generate 10,000 transactions
- Date range: 2023-01-01 to present
- Realistic amounts (Income: 5M-50M VND, Expense: 10K-5M VND)
- 70% expense, 30% income ratio
- Varied descriptions

### 2. Start Development Server
```bash
npm run dev
```

## Performance Targets

| Feature | Target Load Time | Acceptable |
|---------|-----------------|------------|
| Dashboard (initial) | < 2 seconds | < 3 seconds |
| Transactions list | < 1 second | < 2 seconds |
| Search/Filter | < 1 second | < 2 seconds |
| CSV Export (10K) | < 5 seconds | < 10 seconds |
| Page navigation | < 500ms | < 1 second |

## Testing Procedures

### 1. Dashboard Performance

**Test Steps:**
1. Open Chrome DevTools (F12) → Performance tab
2. Click "Record" button
3. Navigate to `http://localhost:3000`
4. Wait for page to fully load
5. Stop recording

**Metrics to Check:**
- [ ] First Contentful Paint (FCP) < 1s
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] Time to Interactive (TTI) < 3s
- [ ] Total Blocking Time (TBT) < 300ms
- [ ] API response time (/api/transactions/summary) < 1s

**Commands:**
```bash
# Open Network tab and reload page
# Check:
# - /api/transactions/summary response time
# - Number of API calls
# - Total data transferred
```

### 2. Transaction List Performance

**Test Steps:**
1. Navigate to `/transactions`
2. Record performance in DevTools
3. Test pagination (navigate through pages)
4. Test with different page sizes

**Metrics to Check:**
- [ ] Initial page load < 1s
- [ ] Pagination navigation < 500ms
- [ ] Render time for 50 items < 200ms
- [ ] API response (/api/transactions) < 800ms

### 3. Search & Filter Performance

**Test Steps:**
1. Go to `/transactions`
2. Open DevTools Performance tab
3. Type search query (wait for debounce)
4. Apply multiple filters
5. Clear filters

**Metrics to Check:**
- [ ] Search debounce: 300ms delay working
- [ ] Filter API call < 1s
- [ ] UI update after filter < 200ms
- [ ] No memory leaks during rapid filter changes

**Test Cases:**
```bash
# Test these scenarios:
1. Search by description: "ăn"
2. Filter by type: EXPENSE
3. Filter by category: Food
4. Date range: Last month
5. Amount range: 100,000 - 500,000
6. Combination: All filters together
```

### 4. CSV Export Performance

**Test Steps:**
1. Navigate to `/transactions`
2. Apply filters (optional)
3. Open Network tab
4. Click "Xuất CSV" button
5. Measure time until download starts

**Metrics to Check:**
- [ ] Export 10,000 records < 5s
- [ ] Export 1,000 records < 2s
- [ ] Export 100 records < 1s
- [ ] File size reasonable (< 2MB for 10K)
- [ ] No browser freeze during export

### 5. Memory Usage

**Test Steps:**
1. Open DevTools → Memory tab
2. Take heap snapshot (baseline)
3. Navigate through all pages
4. Apply/clear filters multiple times
5. Take another heap snapshot
6. Compare snapshots

**Metrics to Check:**
- [ ] No significant memory leaks (< 10MB increase)
- [ ] Garbage collection working properly
- [ ] No detached DOM nodes accumulating

## Chrome DevTools Commands

### Performance Profiling
```javascript
// In Console, measure page load
performance.measure('pageLoad', 'navigationStart', 'loadEventEnd');
console.table(performance.getEntriesByType('measure'));

// Clear performance data
performance.clearMarks();
performance.clearMeasures();
```

### Network Analysis
```javascript
// Get all network requests
performance.getEntriesByType('resource').forEach(entry => {
  console.log(`${entry.name}: ${entry.duration}ms`);
});

// Filter API calls
performance.getEntriesByType('resource')
  .filter(e => e.name.includes('/api/'))
  .forEach(e => console.log(`${e.name}: ${e.duration}ms`));
```

### Memory Profiling
```javascript
// Check memory usage
if (performance.memory) {
  console.table({
    'Used JS Heap': `${(performance.memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
    'Total JS Heap': `${(performance.memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
    'Heap Limit': `${(performance.memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`,
  });
}
```

## Optimization Recommendations

### If Dashboard is Slow (> 2s)
- [ ] Add pagination to summary endpoint
- [ ] Implement caching for summary data
- [ ] Consider Redis for frequently accessed data
- [ ] Optimize database queries (check indexes)
- [ ] Add loading skeletons

### If Transaction List is Slow (> 1s)
- [ ] Reduce default page size (50 → 20)
- [ ] Implement virtual scrolling for large lists
- [ ] Add server-side caching
- [ ] Optimize Prisma queries (select only needed fields)

### If Search is Slow (> 1s)
- [ ] Add database full-text search index
- [ ] Implement client-side filtering for small datasets
- [ ] Increase debounce delay (300ms → 500ms)
- [ ] Add search result limit

### If CSV Export is Slow (> 5s)
- [ ] Implement streaming export
- [ ] Add progress indicator
- [ ] Limit max export size
- [ ] Generate exports in background job

## Lighthouse Audit

Run Lighthouse audit for comprehensive metrics:

```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse http://localhost:3000 --output html --output-path ./lighthouse-report.html

# Open report
open lighthouse-report.html
```

**Target Scores:**
- [ ] Performance: > 90
- [ ] Accessibility: > 90
- [ ] Best Practices: > 90
- [ ] SEO: > 90

## Database Performance

### Check Query Performance
```bash
# Enable Prisma query logging
# In .env add:
DEBUG=prisma:query

# Run and check slow queries
npm run dev

# Look for queries taking > 100ms
```

### Optimize Indexes
```sql
-- Check if indexes are being used
EXPLAIN QUERY PLAN 
SELECT * FROM transactions 
WHERE date >= '2024-01-01' AND date <= '2024-12-31'
ORDER BY date DESC
LIMIT 50;

-- Should use index on date field
```

## Results Template

### Test Run: [Date]

**Environment:**
- Node.js version: [version]
- Browser: Chrome [version]
- OS: [OS]
- Database size: [X] transactions

**Performance Metrics:**

| Feature | Target | Actual | Status |
|---------|--------|--------|--------|
| Dashboard load | < 2s | [X]s | ✅/❌ |
| Transaction list | < 1s | [X]s | ✅/❌ |
| Search/filter | < 1s | [X]s | ✅/❌ |
| CSV export | < 5s | [X]s | ✅/❌ |

**Lighthouse Scores:**
- Performance: [X]/100
- Accessibility: [X]/100
- Best Practices: [X]/100
- SEO: [X]/100

**Issues Found:**
- [List any performance issues]

**Optimizations Applied:**
- [List any optimizations made]

## Continuous Monitoring

### Production Monitoring
Consider adding:
- Application Performance Monitoring (APM) tool
- Real User Monitoring (RUM)
- Error tracking (Sentry)
- Database query monitoring

### Automated Testing
```json
// Add to package.json
{
  "scripts": {
    "test:perf": "lighthouse http://localhost:3000 --preset=perf"
  }
}
```

## Cleanup

After performance testing, restore normal dataset:

```bash
# Remove performance data and restore seed
npx prisma migrate reset
npx prisma db seed
```
