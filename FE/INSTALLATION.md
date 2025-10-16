# 🚀 Hướng dẫn cài đặt Tấm Tắc

Hướng dẫn chi tiết để cài đặt và chạy dự án Tấm Tắc với React 19.

## ⚠️ Lỗi React 19 Compatibility

Dự án sử dụng **React 19** mới nhất, có thể gây conflict với một số thư viện chưa cập nhật. Đây là cách giải quyết:

## 🔧 Cài đặt tự động (Khuyến nghị)

### Windows (PowerShell)
```powershell
# Chạy script cài đặt tự động
npm run install:safe:win

# Hoặc chạy trực tiếp
powershell -ExecutionPolicy Bypass -File install-deps.ps1
```

### macOS/Linux
```bash
# Chạy script cài đặt tự động
npm run install:safe

# Hoặc chạy trực tiếp
node install-deps.js
```

## 🛠️ Cài đặt thủ công

### Bước 1: Clean installation
```bash
# Xóa dependencies cũ
npm run clean

# Windows
npm run clean:win
```

### Bước 2: Cài đặt với legacy peer deps
```bash
# Phương pháp 1: Legacy peer deps (Khuyến nghị)
npm install --legacy-peer-deps

# Phương pháp 2: Force install (nếu phương pháp 1 thất bại)
npm install --force

# Phương pháp 3: Yarn (alternative)
yarn install
```

### Bước 3: Verify installation
```bash
# Kiểm tra TypeScript
npm run type-check

# Kiểm tra tests
npm test

# Chạy development server
npm run dev
```

## 🐛 Troubleshooting

### Lỗi: "ERESOLVE unable to resolve dependency tree"

**Nguyên nhân:** React 19 chưa được hỗ trợ đầy đủ bởi tất cả thư viện.

**Giải pháp:**
```bash
# 1. Clean install
rm -rf node_modules package-lock.json
npm cache clean --force

# 2. Install với legacy peer deps
npm install --legacy-peer-deps

# 3. Nếu vẫn lỗi, dùng force
npm install --force
```

### Lỗi: "Cannot resolve module"

**Giải pháp:**
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### Lỗi: "Testing Library compatibility"

**Giải pháp:** Đã được cập nhật trong package.json:
- `@testing-library/react@^16.0.0` (React 19 compatible)
- `@testing-library/jest-dom@^6.1.4`
- `@testing-library/user-event@^14.5.1`

## 📋 Dependencies đã được tối ưu

### React 19 Compatible
- ✅ `react@19.1.0`
- ✅ `react-dom@19.1.0`
- ✅ `@types/react@^19.1.3`
- ✅ `@types/react-dom@^19.0.4`

### Testing Libraries (React 19 compatible)
- ✅ `@testing-library/react@^16.0.0`
- ✅ `@testing-library/jest-dom@^6.1.4`
- ✅ `@testing-library/user-event@^14.5.1`
- ✅ `jest@^29.7.0`
- ✅ `jest-environment-jsdom@^29.7.0`

### Next.js 15
- ✅ `next@15.5.4`
- ✅ `eslint-config-next@15.5.4`

### Overrides
```json
{
  "overrides": {
    "react": "19.1.0",
    "react-dom": "19.1.0"
  }
}
```

## 🚀 Sau khi cài đặt thành công

```bash
# 1. Chạy development server
npm run dev

# 2. Mở trình duyệt
# http://localhost:3000

# 3. Kiểm tra menu page
# http://localhost:3000/menu
```

## ✅ Kiểm tra hoạt động

### 1. Development Server
```bash
npm run dev
# ✅ Server chạy tại http://localhost:3000
# ✅ Hot reload hoạt động
# ✅ TypeScript compilation thành công
```

### 2. Menu Page với Sample Data
```bash
# Truy cập: http://localhost:3000/menu
# ✅ Hiển thị 10 sản phẩm sample
# ✅ Filtering theo danh mục hoạt động
# ✅ Infinite scroll hoạt động
# ✅ Responsive design
```

### 3. Testing
```bash
npm test
# ✅ Jest chạy thành công
# ✅ Component tests pass
# ✅ Mock API tests pass
```

### 4. Type Checking
```bash
npm run type-check
# ✅ TypeScript compilation thành công
# ✅ Không có type errors
```

## 🎯 Features hoạt động với Sample Data

- ✅ **Menu Page**: Hiển thị 10 sản phẩm với đầy đủ thông tin
- ✅ **Product Filtering**: Lọc theo danh mục (Cơm Tấm, Cơm Dĩa, v.v.)
- ✅ **Branch Selection**: Chọn chi nhánh
- ✅ **Product Cards**: Hiển thị hình ảnh, giá, rating
- ✅ **Infinite Scroll**: Load more products
- ✅ **Responsive Design**: Mobile/Desktop
- ✅ **Loading States**: Spinner và skeleton
- ✅ **Search Functionality**: Tìm kiếm sản phẩm

## 🆘 Cần hỗ trợ?

Nếu vẫn gặp lỗi, hãy thử:

1. **Update Node.js** lên phiên bản mới nhất (18+)
2. **Clear npm cache**: `npm cache clean --force`
3. **Use Yarn**: `yarn install`
4. **Check Node version**: `node --version` (phải >= 18.0.0)

## 📝 Notes

- Một số peer dependency warnings là bình thường với React 19
- Sample data được tối ưu cho development
- Production sẽ sử dụng real API
- Testing setup hoàn chỉnh với coverage reports
