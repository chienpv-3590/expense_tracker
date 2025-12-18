# Expense Tracker - Ứng dụng Theo dõi Thu Chi

Ứng dụng web quản lý tài chính cá nhân với giao diện tiếng Việt, được xây dựng bằng Next.js 16, TypeScript, và Tailwind CSS.

## ✨ Tính năng

### 🎨 Giao diện

- **Chủ đề Đen Trắng**: Thiết kế monochrome tối giản, tập trung vào nội dung
- **Trang Chủ Dashboard**: Hiển thị thống kê tháng hiện tại (thu nhập, chi tiêu, số dư ròng)
- **Giao Dịch Gần Đây**: Xem nhanh 10 giao dịch mới nhất ngay trên trang chủ
- **Responsive Design**: Tối ưu cho cả desktop và mobile với table/card view

### ✅ Đã hoàn thành

**Phase 1-3: Nền tảng**
- ✅ Next.js 16 với TypeScript và App Router
- ✅ Tailwind CSS 4 cho styling
- ✅ Prisma ORM với SQLite database
- ✅ Zod validation
- ✅ Vietnamese localization (định dạng tiền tệ và ngày tháng)
- ✅ UI components (Button, Input, Select, Modal, DatePicker)

**Phase 4: Quản lý Giao dịch (US1)**
- ✅ API endpoints đầy đủ (GET, POST, PUT, DELETE)
- ✅ Danh sách giao dịch với phân trang
- ✅ Thêm giao dịch mới
- ✅ Chỉnh sửa giao dịch
- ✅ Xóa giao dịch (với xác nhận)
- ✅ Lọc theo loại giao dịch
- ✅ Hiển thị responsive (desktop & mobile)
- ✅ Dashboard homepage với thống kê

### 🚧 Đang phát triển

**Phase 5: Quản lý Danh mục**
- ✅ Thêm/sửa/xóa danh mục tùy chỉnh
- ✅ Quản lý danh mục thu nhập và chi tiêu
- ✅ Ngăn chặn xóa danh mục có giao dịch

**Phase 6: Dashboard với Lọc Thời Gian**
- ✅ Dashboard tổng quan (thu, chi, số dư, số giao dịch)
- ✅ Lọc theo ngày/tuần/tháng
- ✅ Di chuyển giữa các kỳ (trước/sau)
- ✅ Phân tích chi tiêu theo danh mục
- ✅ Hiển thị phần trăm chi tiêu

**Phase 7: Tìm kiếm & Lọc Nâng cao**
- ✅ 7 loại filter (type, category, date range, amount range, search)
- ✅ Debounced search (300ms)
- ✅ Active filter chips với nút xóa riêng
- ✅ Server-side filtering với Prisma
- ✅ Collapsible filter bar trên mobile

**Phase 8: Xuất CSV**
- ✅ CSV export utility với UTF-8 BOM
- ✅ RFC 4180 compliant escaping
- ✅ Export API endpoint với filter support
- ✅ Export button trong transactions page
- ✅ Export button trong dashboard
- ✅ Filename với timestamp

**Phase 9: Testing & QA**
- ✅ Unit tests cho utilities (52/82 passing - 63%)
- ✅ Integration tests cho API routes
- ✅ E2E tests với Playwright
- ✅ Vietnamese localization tests
- ✅ Responsive design tests
- ✅ Performance testing (10,000+ transactions seeded)
- ✅ Accessibility testing guide (WCAG 2.1 AA)
- ✅ Error handling & edge case tests

**Phase 10: Polish & Documentation**
- ✅ Loading states và skeletons (spinner, disabled forms, skeleton loaders)
- ✅ Empty state illustrations (transaction list, search results, category breakdown)
- ✅ Toast notifications (react-hot-toast: success/error toasts for all operations)
- ✅ Code quality improvements (Prettier formatting, removed console.logs, TypeScript checks)
- ✅ Comprehensive README (updated with all features, scripts, deployment)
- ✅ Inline code documentation (JSDoc for all utilities, API routes, components)

**Phase 11: Deployment**
- ⏳ Production build optimization
- ⏳ Environment configuration
- ⏳ Deployment to hosting platform
- ⏳ Monitoring setup

## 🚀 Bắt đầu

### Yêu cầu

- Node.js 20 LTS trở lên
- npm hoặc yarn

### Cài đặt

```bash
# Clone repository
git clone <repository-url>
cd expense_tracker

# Cài đặt dependencies
npm install

# Tạo file .env từ template
cp .env.example .env

# Chạy database migrations và seed
npx prisma migrate dev
npx prisma generate

# Khởi động development server
npm run dev
```

Ứng dụng sẽ chạy tại http://localhost:3000

### Environment Variables

**Development (.env)**:
```env
DATABASE_URL="file:./dev.db"
NODE_ENV="development"
```

**Production**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete production environment setup with PostgreSQL, monitoring, and security configuration.

## 📁 Cấu trúc Dự án

```
expense_tracker/
├── prisma/
│   ├── schema.prisma           # Database schema
│   ├── migrations/             # Database migrations
│   ├── seed.ts                 # Seed default categories (10 categories)
│   └── seed-performance.ts     # Performance testing seed (10,000+ transactions)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── transactions/   # Transaction API routes
│   │   │   │   ├── route.ts    # List & create
│   │   │   │   ├── [id]/       # Get, update, delete
│   │   │   │   ├── summary/    # Dashboard statistics
│   │   │   │   └── export/     # CSV export
│   │   │   └── categories/     # Category API routes
│   │   ├── transactions/       # Transaction pages
│   │   │   ├── page.tsx        # List with filters & pagination
│   │   │   ├── new/            # Create transaction
│   │   │   └── [id]/           # View & edit transaction
│   │   ├── categories/         # Category pages
│   │   ├── layout.tsx          # Root layout with navigation & toasts
│   │   └── page.tsx            # Dashboard homepage
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Loading.tsx     # Skeleton loaders & spinners
│   │   │   └── EmptyState.tsx  # Empty state illustrations
│   │   ├── transactions/       # Transaction-specific components
│   │   ├── categories/         # Category-specific components
│   │   ├── dashboard/          # Dashboard widgets
│   │   └── layout/             # Navigation component
│   ├── lib/
│   │   ├── prisma.ts           # Prisma client singleton
│   │   ├── validations.ts      # Zod validation schemas
│   │   ├── formatters.ts       # Vietnamese formatters
│   │   ├── date-utils.ts       # Date range calculations
│   │   ├── csv-export.ts       # CSV generation utility
│   │   └── errors.ts           # Error handling
│   └── types/                  # TypeScript type definitions
├── __tests__/                  # Test files (unit, integration, E2E)
├── specs/                      # Feature specifications & documentation
└── .specify/                   # Project documentation & guides
```

## 🛠 Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.3+
- **Styling**: Tailwind CSS 4.x
- **Database**: SQLite (development) / PostgreSQL (production)
- **ORM**: Prisma 5.x
- **Validation**: Zod 4.x
- **Testing**: Jest + React Testing Library, Playwright

## 📝 Available Scripts

```bash
# Development
npm run dev              # Start development server (http://localhost:3000)

# Building
npm run build           # Build for production
npm run start           # Start production server

# Code Quality
npm run format          # Format code with Prettier
npm run format:check    # Check code formatting
npm run type-check      # Run TypeScript type checking

# Testing
npm test                # Run unit tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage
npm run test:integration # Run integration tests
npm run test:e2e        # Run E2E tests with Playwright
npm run test:e2e:ui     # Run E2E tests with UI
npm run test:e2e:headed # Run E2E tests with browser visible

# Database
npx prisma studio       # Open Prisma Studio (database GUI)
npx prisma migrate dev  # Run database migrations
npx prisma db seed      # Seed database with default categories
npx tsx prisma/seed-performance.ts  # Seed 10,000+ test transactions
```

## 🌐 API Endpoints

### Transactions
- `GET /api/transactions` - List transactions (with filters & pagination)
- `POST /api/transactions` - Create transaction
- `GET /api/transactions/[id]` - Get single transaction
- `PUT /api/transactions/[id]` - Update transaction
- `DELETE /api/transactions/[id]` - Delete transaction
- `GET /api/transactions/summary` - Dashboard summary with date range
- `GET /api/transactions/export` - Export transactions as CSV

### Categories
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category
- `GET /api/categories/[id]` - Get single category
- `PUT /api/categories/[id]` - Update category
- `DELETE /api/categories/[id]` - Delete category (blocked if has transactions)

## 🎨 Features

### Vietnamese Localization
- Định dạng tiền tệ: `1.000.000 ₫`
- Định dạng ngày: `17/12/2025`
- Giao diện hoàn toàn tiếng Việt

### Default Categories
**Thu nhập**:
- Lương
- Thu nhập khác

**Chi tiêu**:
- Ăn uống
- Di chuyển
- Giải trí
- Hóa đơn
- Mua sắm
- Y tế
- Chi phí khác

## 🚀 Deployment

For complete production deployment guide, see **[DEPLOYMENT.md](./DEPLOYMENT.md)**.

### Quick Start (Vercel)

1. **Push code to GitHub**
2. **Import project on Vercel**: https://vercel.com/new
3. **Configure environment variables**:
   ```env
   DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
   NODE_ENV=production
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```
4. **Deploy**: Automatic from GitHub

### Production Checklist

- [ ] PostgreSQL database created (Vercel Postgres, Supabase, Railway)
- [ ] Environment variables configured (see [.env.production.example](./.env.production.example))
- [ ] Database migrations deployed: `npx prisma migrate deploy`
- [ ] Default categories seeded: `npx prisma db seed`
- [ ] Production build tested: `npm run build && npm start`
- [ ] Security review completed (see [DEPLOYMENT.md](./DEPLOYMENT.md#security-checklist))

### Supported Platforms

- ✅ **Vercel** (Recommended - optimized for Next.js)
- ✅ **Railway** (Easy PostgreSQL integration)
- ✅ **Render** (Free tier available)
- ⚠️ **Netlify** (Limited Node.js support)

### Performance Optimization

- ✅ Next.js 16 automatic optimizations (code splitting, image optimization)
- ✅ Static page generation where possible
- **Chủ đề Đen Trắng**: Thiết kế monochrome tối giản, tập trung vào nội dung
- **Trang Chủ Dashboard**: Hiển thị thống kê tháng hiện tại (thu nhập, chi tiêu, số dư ròng)
- **Giao Dịch Gần Đây**: Xem nhanh 10 giao dịch mới nhất ngay trên trang chủ
- **Responsive Design**: Tối ưu cho cả desktop và mobile với table/card view

### ✅ Đã hoàn thành

**Phase 1-3: Nền tảng**
- ✅ Next.js 16 với TypeScript và App Router
- ✅ Tailwind CSS 4 cho styling
- ✅ Prisma ORM với SQLite database
- ✅ Zod validation
- ✅ Vietnamese localization (định dạng tiền tệ và ngày tháng)
- ✅ UI components (Button, Input, Select, Modal, DatePicker)

**Phase 4: Quản lý Giao dịch (US1)**
- ✅ API endpoints đầy đủ (GET, POST, PUT, DELETE)
- ✅ Danh sách giao dịch với phân trang
- ✅ Thêm giao dịch mới
- ✅ Chỉnh sửa giao dịch
- ✅ Xóa giao dịch (với xác nhận)
- ✅ Lọc theo loại giao dịch
- ✅ Hiển thị responsive (desktop & mobile)
- ✅ Dashboard homepage với thống kê

### 🚧 Đang phát triển

**Phase 5: Quản lý Danh mục**
- ✅ Thêm/sửa/xóa danh mục tùy chỉnh
- ✅ Quản lý danh mục thu nhập và chi tiêu
- ✅ Ngăn chặn xóa danh mục có giao dịch

**Phase 6: Dashboard với Lọc Thời Gian**
- ✅ Dashboard tổng quan (thu, chi, số dư, số giao dịch)
- ✅ Lọc theo ngày/tuần/tháng
- ✅ Di chuyển giữa các kỳ (trước/sau)
- ✅ Phân tích chi tiêu theo danh mục
- ✅ Hiển thị phần trăm chi tiêu

**Phase 7: Tìm kiếm & Lọc Nâng cao**
- ✅ 7 loại filter (type, category, date range, amount range, search)
- ✅ Debounced search (300ms)
- ✅ Active filter chips với nút xóa riêng
- ✅ Server-side filtering với Prisma
- ✅ Collapsible filter bar trên mobile

**Phase 8: Xuất CSV**
- ✅ CSV export utility với UTF-8 BOM
- ✅ RFC 4180 compliant escaping
- ✅ Export API endpoint với filter support
- ✅ Export button trong transactions page
- ✅ Export button trong dashboard
- ✅ Filename với timestamp

**Phase 9: Testing & QA**
- ✅ Unit tests cho utilities (52/82 passing - 63%)
- ✅ Integration tests cho API routes
- ✅ E2E tests với Playwright
- ✅ Vietnamese localization tests
- ✅ Responsive design tests
- ✅ Performance testing (10,000+ transactions seeded)
- ✅ Accessibility testing guide (WCAG 2.1 AA)
- ✅ Error handling & edge case tests

**Phase 10: Polish & Documentation**
- ✅ Loading states và skeletons (spinner, disabled forms, skeleton loaders)
- ✅ Empty state illustrations (transaction list, search results, category breakdown)
- ✅ Toast notifications (react-hot-toast: success/error toasts for all operations)
- ✅ Code quality improvements (Prettier formatting, removed console.logs, TypeScript checks)
- ✅ Comprehensive README (updated with all features, scripts, deployment)
- ✅ Inline code documentation (JSDoc for all utilities, API routes, components)

**Phase 11: Deployment**
- ⏳ Production build optimization
- ⏳ Environment configuration
- ⏳ Deployment to hosting platform
- ⏳ Monitoring setup

## 🚀 Bắt đầu

### Yêu cầu

- Node.js 20 LTS trở lên
- npm hoặc yarn

### Cài đặt

```bash
# Clone repository
git clone <repository-url>
cd expense_tracker

# Cài đặt dependencies
npm install

# Tạo file .env từ template
cp .env.example .env

# Chạy database migrations và seed
npx prisma migrate dev
npx prisma generate

# Khởi động development server
npm run dev
```

Ứng dụng sẽ chạy tại http://localhost:3000

### Environment Variables

**Development (.env)**:
```env
DATABASE_URL="file:./dev.db"
NODE_ENV="development"
```

**Production**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete production environment setup with PostgreSQL, monitoring, and security configuration.

## 📁 Cấu trúc Dự án

```
expense_tracker/
├── prisma/
│   ├── schema.prisma           # Database schema
│   ├── migrations/             # Database migrations
│   ├── seed.ts                 # Seed default categories (10 categories)
│   └── seed-performance.ts     # Performance testing seed (10,000+ transactions)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── transactions/   # Transaction API routes
│   │   │   │   ├── route.ts    # List & create
│   │   │   │   ├── [id]/       # Get, update, delete
│   │   │   │   ├── summary/    # Dashboard statistics
│   │   │   │   └── export/     # CSV export
│   │   │   └── categories/     # Category API routes
│   │   ├── transactions/       # Transaction pages
│   │   │   ├── page.tsx        # List with filters & pagination
│   │   │   ├── new/            # Create transaction
│   │   │   └── [id]/           # View & edit transaction
│   │   ├── categories/         # Category pages
│   │   ├── layout.tsx          # Root layout with navigation & toasts
│   │   └── page.tsx            # Dashboard homepage
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Loading.tsx     # Skeleton loaders & spinners
│   │   │   └── EmptyState.tsx  # Empty state illustrations
│   │   ├── transactions/       # Transaction-specific components
│   │   ├── categories/         # Category-specific components
│   │   ├── dashboard/          # Dashboard widgets
│   │   └── layout/             # Navigation component
│   ├── lib/
│   │   ├── prisma.ts           # Prisma client singleton
│   │   ├── validations.ts      # Zod validation schemas
│   │   ├── formatters.ts       # Vietnamese formatters
│   │   ├── date-utils.ts       # Date range calculations
│   │   ├── csv-export.ts       # CSV generation utility
│   │   └── errors.ts           # Error handling
│   └── types/                  # TypeScript type definitions
├── __tests__/                  # Test files (unit, integration, E2E)
├── specs/                      # Feature specifications & documentation
└── .specify/                   # Project documentation & guides
```

## 🛠 Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.3+
- **Styling**: Tailwind CSS 4.x
- **Database**: SQLite (development) / PostgreSQL (production)
- **ORM**: Prisma 5.x
- **Validation**: Zod 4.x
- **Testing**: Jest + React Testing Library, Playwright

## 📝 Available Scripts

```bash
# Development
npm run dev              # Start development server (http://localhost:3000)

# Building
npm run build           # Build for production
npm run start           # Start production server

# Code Quality
npm run format          # Format code with Prettier
npm run format:check    # Check code formatting
npm run type-check      # Run TypeScript type checking

# Testing
npm test                # Run unit tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage
npm run test:integration # Run integration tests
npm run test:e2e        # Run E2E tests with Playwright
npm run test:e2e:ui     # Run E2E tests with UI
npm run test:e2e:headed # Run E2E tests with browser visible

# Database
npx prisma studio       # Open Prisma Studio (database GUI)
npx prisma migrate dev  # Run database migrations
npx prisma db seed      # Seed database with default categories
npx tsx prisma/seed-performance.ts  # Seed 10,000+ test transactions
```

## 🌐 API Endpoints

### Transactions
- `GET /api/transactions` - List transactions (with filters & pagination)
- `POST /api/transactions` - Create transaction
- `GET /api/transactions/[id]` - Get single transaction
- `PUT /api/transactions/[id]` - Update transaction
- `DELETE /api/transactions/[id]` - Delete transaction
- `GET /api/transactions/summary` - Dashboard summary with date range
- `GET /api/transactions/export` - Export transactions as CSV

### Categories
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category
- `GET /api/categories/[id]` - Get single category
- `PUT /api/categories/[id]` - Update category
- `DELETE /api/categories/[id]` - Delete category (blocked if has transactions)

## 🎨 Features

### Vietnamese Localization
- Định dạng tiền tệ: `1.000.000 ₫`
- Định dạng ngày: `17/12/2025`
- Giao diện hoàn toàn tiếng Việt

### Default Categories
**Thu nhập**:
- Lương
- Thu nhập khác

**Chi tiêu**:
- Ăn uống
- Di chuyển
- Giải trí
- Hóa đơn
- Mua sắm
- Y tế
- Chi phí khác

## �📄 License

ISC

## 👥 Contributing

Đây là dự án học tập. Mọi đóng góp đều được chào đón!
