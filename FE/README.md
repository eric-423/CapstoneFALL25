# 🍛 Tấm Tắc - Cơm Tấm Ngon

Thương hiệu Cơm Tấm hiện đại được tạo ra bởi sinh viên, dành cho sinh viên. Đặt món online, giao hàng nhanh, giá cả phải chăng.

## 🚀 Tính năng chính

### 👥 Đa vai trò
- **Khách hàng**: Đặt món, thanh toán, theo dõi đơn hàng
- **Quản lý**: Quản lý chi nhánh, đơn hàng, nhân viên
- **Admin**: Quản trị hệ thống, báo cáo, cài đặt

### 🛒 Chức năng đặt hàng
- Xem thực đơn đa dạng
- Thêm vào giỏ hàng
- Thanh toán an toàn
- Theo dõi trạng thái đơn hàng
- Lịch sử đơn hàng

### 📊 Dashboard quản trị
- Thống kê doanh thu
- Quản lý sản phẩm
- Quản lý đơn hàng
- Quản lý người dùng
- Báo cáo chi tiết

## 🛠️ Công nghệ sử dụng

### Frontend
- **Next.js 15** - React framework với App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **TanStack Query** - Data fetching và caching
- **React Hook Form** - Form management
- **Zod** - Schema validation

### UI Components
- **Radix UI** - Headless UI components
- **Lucide React** - Icon library
- **Ant Design** - Admin dashboard components

### Backend Integration
- **Axios** - HTTP client
- **JWT** - Authentication
- **WebSocket** - Real-time updates

### Testing
- **Jest** - Testing framework
- **Testing Library** - Component testing
- **MSW** - API mocking

## 📁 Cấu trúc dự án

```
src/
├── app/                    # Next.js App Router
│   ├── (main)/            # Public pages
│   ├── admin/             # Admin dashboard
│   ├── manager/           # Manager dashboard
│   ├── api/               # API routes
│   └── actions/           # Server Actions
├── components/            # Reusable components
│   ├── common/            # Common components
│   ├── ui/                # UI components
│   └── guards/            # Route guards
├── data/                  # Sample data and mock APIs
│   ├── sample-data.ts     # Complete sample data
│   ├── data-helpers.ts    # Data manipulation helpers
│   ├── mock-api.ts        # Mock API functions
│   └── index.ts           # Export all data
├── utils/                 # Utilities
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom hooks
│   ├── types/             # TypeScript types
│   └── configs/           # Configuration files
├── lib/                   # Library functions
├── __tests__/             # Test files
└── assets/                # Static assets
```

## 📊 Sample Data

Dự án bao gồm sample data hoàn chỉnh cho development và testing:

### 🛍️ Products & Menu
- **10 sản phẩm** đa dạng (Cơm Tấm, Cơm Dĩa, Nước Uống, Tráng Miệng)
- **5 loại sản phẩm** với giá cả và mô tả chi tiết
- **Đánh giá và số lượng** tồn kho thực tế

### 👥 Users & Authentication
- **3 user roles** (Customer, Manager, Admin)
- **Thông tin đầy đủ** (địa chỉ, điểm thành viên, rank)
- **Authentication data** với JWT tokens

### 🥘 Recipes & Ingredients
- **3 công thức nấu ăn** chi tiết với nguyên liệu
- **6 nguyên liệu** với thông tin nhà cung cấp, giá cả
- **Calories và thời gian** chuẩn bị

### 📚 Training & Courses
- **4 khóa đào tạo** cho nhân viên
- **Video và tài liệu** PDF
- **Theo dõi tiến độ** học tập

### 📋 Orders & Branches
- **2 đơn hàng mẫu** với trạng thái khác nhau
- **3 chi nhánh** với thông tin quản lý
- **Dashboard stats** đầy đủ

### 🚀 Cách sử dụng

```typescript
import { sampleData, mockApi, getProductById } from '@/data';

// Sử dụng sample data trực tiếp
const products = sampleData.products;
const topProducts = getTopRatedProducts(5);

// Sử dụng mock API
const products = await mockApi.getProducts(0, 10);
const product = await mockApi.getProductById(1);
```

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js 18+ 
- npm hoặc yarn
- Git

### Cài đặt

1. **Clone repository**
```bash
git clone <repository-url>
cd capstone-next
```

2. **Cài đặt dependencies**
```bash
npm install
```

3. **Cấu hình environment**
```bash
cp .env.example .env.local
```

Cập nhật các biến môi trường trong `.env.local`:
```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_USE_MOCK=false
```

4. **Chạy development server**
```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## 📝 Scripts

```bash
# Development
npm run dev              # Chạy development server
npm run build            # Build production
npm run start            # Chạy production server

# Code quality
npm run lint             # Kiểm tra linting
npm run lint:fix         # Sửa linting errors
npm run prettier         # Kiểm tra formatting
npm run prettier:fix     # Sửa formatting
npm run type-check       # Kiểm tra TypeScript

# Testing
npm run test             # Chạy tests
npm run test:watch       # Chạy tests với watch mode
npm run test:coverage    # Chạy tests với coverage report
```

## 🧪 Testing

Dự án sử dụng Jest và Testing Library cho testing:

```bash
# Chạy tất cả tests
npm test

# Chạy tests với coverage
npm run test:coverage

# Chạy tests với watch mode
npm run test:watch
```

### Cấu trúc tests
```
src/__tests__/
├── components/           # Component tests
├── api/                 # API route tests
├── actions/             # Server action tests
└── utils/               # Utility function tests
```

## 🔧 Cấu hình

### Next.js Config
- **Image Optimization**: Hỗ trợ AVIF, WebP
- **Security Headers**: X-Frame-Options, CSP
- **Performance**: Bundle optimization, compression
- **Experimental**: Server components, CSS optimization

### TypeScript
- **Strict Mode**: Enabled
- **Path Mapping**: `@/*` alias
- **Type Checking**: Comprehensive type definitions

### ESLint & Prettier
- **Next.js Config**: Core web vitals
- **TypeScript**: Type-aware linting
- **Import Sorting**: Automatic import organization
- **Code Formatting**: Consistent style

## 🚀 Deployment

### Vercel (Recommended)
1. Push code lên GitHub
2. Kết nối repository với Vercel
3. Cấu hình environment variables
4. Deploy tự động

### Docker
```bash
# Build Docker image
docker build -t tam-tac-app .

# Run container
docker run -p 3000:3000 tam-tac-app
```

### Manual Deployment
```bash
# Build production
npm run build

# Start production server
npm start
```

## 📊 Performance

### Web Vitals
- **LCP**: Largest Contentful Paint
- **FID**: First Input Delay  
- **CLS**: Cumulative Layout Shift
- **FCP**: First Contentful Paint
- **TTFB**: Time to First Byte

### Optimizations
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic route-based splitting
- **Bundle Analysis**: Webpack bundle analyzer
- **Caching**: Static generation và ISR
- **CDN**: Static asset delivery

## 🔐 Bảo mật

### Authentication
- **JWT Tokens**: Secure authentication
- **Refresh Tokens**: Automatic token renewal
- **Route Protection**: Middleware-based guards
- **Role-based Access**: Admin, Manager, Customer

### Security Headers
- **CSP**: Content Security Policy
- **HSTS**: HTTP Strict Transport Security
- **X-Frame-Options**: Clickjacking protection
- **X-Content-Type-Options**: MIME sniffing protection

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

### Coding Standards
- Sử dụng TypeScript
- Tuân thủ ESLint rules
- Viết tests cho new features
- Update documentation
- Follow Git commit conventions

## 📄 License

Dự án này được phát triển cho mục đích học tập và nghiên cứu.

## 👥 Team

**Tấm Tắc Development Team**
- Capstone Project FALL 2025
- Đại học Khoa học Tự nhiên TP.HCM

## 📞 Liên hệ

- **Website**: [Tấm Tắc](https://tamtac.com)
- **Email**: support@tamtac.com
- **Phone**: 1900-xxxx

---

⭐ **Nếu bạn thấy dự án này hữu ích, hãy cho chúng tôi một star!**