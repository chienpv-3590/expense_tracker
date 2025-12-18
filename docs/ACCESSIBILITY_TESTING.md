# Accessibility Testing Guide

## Overview
This guide covers accessibility (a11y) testing for the Expense Tracker application to ensure WCAG 2.1 Level AA compliance.

## Testing Tools

### Browser Extensions
1. **axe DevTools** (Recommended)
   - Install: [Chrome](https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd)
   - Run automated scans
   - Get detailed violation reports

2. **WAVE** 
   - Install: [Chrome](https://chrome.google.com/webstore/detail/wave-evaluation-tool/jbbplnpkjmmeebjpijfedlgcdilocofh)
   - Visual feedback
   - In-page annotations

3. **Lighthouse**
   - Built into Chrome DevTools
   - Comprehensive audits

### Screen Readers
- **macOS**: VoiceOver (Cmd+F5)
- **Windows**: NVDA (free) or JAWS
- **Linux**: Orca

### Keyboard Testing
- No additional tools needed
- Test with keyboard only (no mouse)

## WCAG 2.1 Level AA Checklist

### 1. Perceivable

#### Text Alternatives (1.1)
- [ ] All images have alt text
- [ ] Decorative images have empty alt=""
- [ ] Icons have aria-labels
- [ ] Form inputs have labels

**Test:**
```bash
# Open axe DevTools → Images tab
# Verify all images have proper alternatives
```

#### Color Contrast (1.4.3)
- [ ] Text contrast ratio ≥ 4.5:1
- [ ] Large text (18pt+) ≥ 3:1
- [ ] UI components ≥ 3:1

**Test:**
```javascript
// Use axe DevTools → Color Contrast
// Or manual check with contrast checker:
// Background: #FFFFFF (white)
// Text: #000000 (black) → Ratio: 21:1 ✅
// Text: #374151 (gray-700) → Ratio: 11.48:1 ✅
// Links: #2563EB (blue-600) → Ratio: 7.37:1 ✅
```

**Our Colors:**
- Primary text (black on white): 21:1 ✅
- Secondary text (gray-600 on white): 7.37:1 ✅
- Error text (red-600 on white): 5.14:1 ✅
- Success text (green-600 on white): 4.54:1 ✅

#### Resize Text (1.4.4)
- [ ] Text can be resized to 200% without loss of content
- [ ] No horizontal scrolling at 200% zoom

**Test:**
```bash
# Zoom to 200% (Cmd/Ctrl + Plus)
# Check all pages:
# - Dashboard
# - Transactions list
# - Transaction form
# - Categories
# Verify: No text cut off, no horizontal scroll
```

### 2. Operable

#### Keyboard Accessible (2.1)

**Test Steps:**
1. Unplug mouse / Don't use trackpad
2. Use only keyboard:
   - `Tab` - Move forward
   - `Shift+Tab` - Move backward
   - `Enter` - Activate button/link
   - `Space` - Toggle checkbox
   - `Esc` - Close modal
   - `Arrow keys` - Navigate select/radio

**Checklist:**
- [ ] All interactive elements reachable
- [ ] Tab order is logical
- [ ] Focus visible on all elements
- [ ] No keyboard traps
- [ ] Skip to main content link (optional)

**Test Cases:**

```bash
# Test 1: Dashboard Navigation
1. Tab through all interactive elements
2. Verify focus order: 
   - Time filter buttons (Ngày/Tuần/Tháng)
   - Previous/Next buttons
   - "Hôm nay" button
   - Action buttons (Thêm Giao Dịch, etc.)
3. All elements should have visible focus ring

# Test 2: Transaction Form
1. Tab to each form field
2. Verify:
   - Amount input receives focus
   - Type select can be changed with arrows
   - Date picker works with keyboard
   - Category select navigable
   - Submit button reachable
3. Press Enter to submit form
4. Press Esc to close modal (if applicable)

# Test 3: Transaction List
1. Tab through filter controls
2. Tab through table/card elements
3. Tab to action buttons (Edit/Delete)
4. Test pagination with keyboard
5. Verify: Enter key works on all buttons

# Test 4: Delete Confirmation
1. Tab to Delete button and press Enter
2. Modal opens
3. Tab between Cancel and Delete buttons
4. Press Esc to close modal
5. Verify focus returns to Delete button
```

#### Focus Visible (2.4.7)
- [ ] All focusable elements have visible focus indicator
- [ ] Focus indicator has sufficient contrast

**CSS Check:**
```css
/* Our focus styles should be visible */
button:focus-visible,
input:focus-visible,
select:focus-visible,
a:focus-visible {
  outline: 2px solid blue;
  outline-offset: 2px;
}
```

#### Page Title (2.4.2)
- [ ] Each page has unique, descriptive title
- [ ] Title format: "[Page] - Expense Tracker"

**Test:**
```javascript
// Check page titles
console.log(document.title);

// Expected:
// "/" → "Quản Lý Chi Tiêu - Expense Tracker"
// "/transactions" → "Giao Dịch - Expense Tracker"
// "/transactions/new" → "Thêm Giao Dịch - Expense Tracker"
// "/categories" → "Danh Mục - Expense Tracker"
```

### 3. Understandable

#### Language (3.1.1)
- [ ] HTML lang attribute set
- [ ] Correct language code

**Test:**
```html
<!-- Check in browser inspector -->
<html lang="vi">
<!-- Should be "vi" for Vietnamese -->
```

#### Labels (3.3.2)
- [ ] All form inputs have labels
- [ ] Labels are properly associated
- [ ] Placeholder text is NOT the only label

**Test:**
```html
<!-- Good ✅ -->
<label for="amount">Số tiền</label>
<input id="amount" name="amount" />

<!-- Bad ❌ -->
<input name="amount" placeholder="Số tiền" />
```

#### Error Identification (3.3.1)
- [ ] Form errors are announced
- [ ] Error messages are descriptive
- [ ] Errors linked to input via aria-describedby

**Test:**
```bash
# Submit form with errors
1. Leave amount field empty
2. Submit form
3. Check:
   - Error message appears
   - Input has aria-invalid="true"
   - Error has role="alert" or aria-live="polite"
   - Screen reader announces error
```

### 4. Robust

#### Parsing (4.1.1)
- [ ] Valid HTML
- [ ] No duplicate IDs
- [ ] Properly nested elements

**Test:**
```bash
# Use W3C Validator
# https://validator.w3.org/nu/?doc=http://localhost:3000

# Or check console for HTML errors
```

#### Name, Role, Value (4.1.2)
- [ ] Custom components have proper ARIA
- [ ] Interactive elements have accessible names
- [ ] State changes are announced

**Test:**
```html
<!-- Button should have accessible name -->
<button aria-label="Thêm giao dịch mới">+</button>

<!-- Toggle should announce state -->
<button aria-pressed="false">Lọc</button>

<!-- Loading state should be announced -->
<div role="status" aria-live="polite">
  Đang tải...
</div>
```

## Screen Reader Testing

### VoiceOver (macOS)

**Setup:**
```bash
# Enable VoiceOver
Cmd + F5

# Basic commands
# VoiceOver + A - Start reading
# VoiceOver + Right Arrow - Next item
# VoiceOver + Left Arrow - Previous item
# VoiceOver + Space - Activate
```

**Test Script:**

```bash
# Test 1: Dashboard
1. Navigate to homepage
2. Listen to page announcement
3. Navigate through summary cards
4. Verify each card announces:
   - Label (e.g., "Tổng thu nhập")
   - Value (e.g., "1.000.000 đồng")
5. Navigate through time filter
6. Verify button states announced

# Test 2: Transaction Form
1. Navigate to /transactions/new
2. Tab through form
3. Verify each field announces:
   - Label
   - Field type
   - Current value
   - Required status
   - Validation errors (if any)

# Test 3: Transaction List
1. Navigate to /transactions
2. Navigate through table
3. Verify announces:
   - Row numbers
   - Column headers
   - Cell values
   - Action button purposes
```

### Expected Announcements

```text
Dashboard:
"Quản Lý Chi Tiêu, heading level 1"
"Tổng thu nhập, 1.000.000 đồng"
"Tổng chi tiêu, 500.000 đồng"
"Button, Ngày, selected"
"Button, Tuần"
"Button, Tháng"

Transaction Form:
"Thêm Giao Dịch, heading level 1"
"Số tiền, required, edit text"
"Loại giao dịch, required, popup button"
"Ngày, required, date field"
"Danh mục, required, popup button"
"Mô tả, edit text"
"Button, Lưu"
```

## Common Issues & Fixes

### Issue 1: Missing Form Labels
```html
<!-- Before ❌ -->
<input type="text" placeholder="Số tiền" />

<!-- After ✅ -->
<label htmlFor="amount">Số tiền</label>
<input id="amount" type="text" />
```

### Issue 2: Button Without Accessible Name
```html
<!-- Before ❌ -->
<button>
  <svg>...</svg>
</button>

<!-- After ✅ -->
<button aria-label="Xóa giao dịch">
  <svg aria-hidden="true">...</svg>
</button>
```

### Issue 3: Low Contrast Text
```css
/* Before ❌ */
.text-gray-400 { color: #9CA3AF; } /* 2.8:1 ratio */

/* After ✅ */
.text-gray-600 { color: #4B5563; } /* 7.37:1 ratio */
```

### Issue 4: Focus Not Visible
```css
/* Add to global CSS */
*:focus-visible {
  outline: 2px solid #2563EB;
  outline-offset: 2px;
}
```

### Issue 5: Modal Traps Focus
```typescript
// Add focus trap in modal
useEffect(() => {
  if (isOpen) {
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements?.[0];
    const lastElement = focusableElements?.[focusableElements.length - 1];
    
    // Focus first element
    (firstElement as HTMLElement)?.focus();
    
    // Trap focus
    const handleTab = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          (lastElement as HTMLElement)?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          (firstElement as HTMLElement)?.focus();
        }
      }
    };
    
    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }
}, [isOpen]);
```

## Automated Testing

### Using axe DevTools

```bash
# 1. Install axe DevTools extension
# 2. Open DevTools → axe DevTools tab
# 3. Click "Scan ALL of my page"
# 4. Review violations
# 5. Fix issues
# 6. Re-scan
```

### Using Lighthouse

```bash
# In Chrome DevTools
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Select "Accessibility" category
4. Click "Generate report"
5. Review score and issues
6. Target: > 90/100
```

### Automated Testing Script

```typescript
// __tests__/a11y/accessibility.test.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility tests', () => {
  test('Dashboard should not have accessibility violations', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Transactions page should not have violations', async ({ page }) => {
    await page.goto('/transactions');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Transaction form should not have violations', async ({ page }) => {
    await page.goto('/transactions/new');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
```

## Testing Checklist

### Before Release
- [ ] Run axe DevTools on all pages
- [ ] Run Lighthouse accessibility audit
- [ ] Test keyboard navigation
- [ ] Test with screen reader
- [ ] Check color contrast
- [ ] Verify form labels
- [ ] Test error messages
- [ ] Check focus indicators
- [ ] Verify page titles
- [ ] Test at 200% zoom
- [ ] Validate HTML
- [ ] Test with keyboard only for 15 minutes

### Target Metrics
- [ ] axe DevTools: 0 violations
- [ ] Lighthouse: > 90/100
- [ ] WAVE: 0 errors
- [ ] All pages navigable with keyboard
- [ ] All content accessible via screen reader

## Resources

- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

## Report Template

### Accessibility Audit: [Date]

**Pages Tested:**
- Dashboard (/)
- Transactions (/transactions)
- Transaction form (/transactions/new)
- Categories (/categories)

**Tools Used:**
- axe DevTools
- Lighthouse
- VoiceOver/NVDA
- Keyboard navigation

**Results:**
| Page | axe Score | Lighthouse | Issues |
|------|-----------|------------|--------|
| Dashboard | [X violations] | [X]/100 | [List] |
| Transactions | [X violations] | [X]/100 | [List] |
| Form | [X violations] | [X]/100 | [List] |

**Critical Issues:**
- [List P0 issues]

**Recommendations:**
- [List improvements]

**Status:** ✅ Pass / ❌ Fail
