# 📊 Sample Data Guide

Hướng dẫn sử dụng sample data trong dự án Tấm Tắc.

## 🚀 Cách sử dụng

### 1. Import Sample Data

```typescript
import { sampleData, getProductById, searchProducts } from '@/data';

// Sử dụng trực tiếp
const products = sampleData.products;
const topProducts = getTopRatedProducts(5);
```

### 2. Sử dụng Hooks

```typescript
import { useSampleProducts, useSampleProductTypes, useSampleBranches } from '@/utils/hooks/useSampleData';

// Trong component
const { products, isLoading, nextPage } = useSampleProducts({
  size: 12,
  productType: 1, // Cơm Tấm
});

const { productTypes } = useSampleProductTypes();
const { branches } = useSampleBranches();
```

### 3. Sử dụng Mock API

```typescript
import { mockApi } from '@/data';

// API calls
const products = await mockApi.getProducts(0, 10);
const product = await mockApi.getProductById(1);
const orders = await mockApi.getOrdersByCustomer('1');
```

## 📋 Dữ liệu có sẵn

### Products (10 items)
- Cơm Tấm Sườn Nướng - 35,000đ ⭐4.8
- Cơm Tấm Bì - 30,000đ ⭐4.6
- Cơm Tấm Sườn Bì Chả - 40,000đ ⭐4.9
- Cơm Dĩa Thịt Kho - 32,000đ ⭐4.5
- Cơm Dĩa Gà Nướng - 38,000đ ⭐4.7
- Trà Đá - 5,000đ ⭐4.2
- Nước Mía - 8,000đ ⭐4.4
- Chè Đậu Đỏ - 12,000đ ⭐4.6
- Bánh Flan - 15,000đ ⭐4.8
- Canh Chua Cá - 18,000đ ⭐4.5

### Product Types (5 categories)
- Tất cả
- Cơm Tấm
- Cơm Dĩa
- Nước Uống
- Tráng Miệng
- Đồ Ăn Kèm

### Users (3 roles)
- Nguyễn Văn An (Customer) - Gold member
- Trần Thị Bình (Manager) - Silver member
- Lê Minh Cường (Admin) - Platinum member

### Branches (3 locations)
- Chi Nhánh Quận 1
- Chi Nhánh Quận 3
- Chi Nhánh Thủ Đức

### Ingredients (6 items)
- Gạo Tấm, Sườn Heo, Bì Heo, Trứng Gà, Dưa Leo, Nước Mắm

### Recipes (3 dishes)
- Cơm Tấm Sườn Nướng (45 phút, 650 cal)
- Cơm Tấm Bì (35 phút, 580 cal)
- Canh Chua Cá (25 phút, 320 cal)

### Training Courses (4 courses)
- Cách Nấu Cơm Tấm Sườn Nướng (60 phút)
- Kỹ Thuật Nấu Cơm Tấm Bì (45 phút)
- Quản Lý Chi Nhánh Hiệu Quả (90 phút)
- Phục Vụ Khách Hàng Chuyên Nghiệp (30 phút)

## 🔧 Helper Functions

### Search & Filter
```typescript
// Tìm kiếm sản phẩm
const results = searchProducts('cơm tấm');

// Lọc theo loại
const comTamProducts = getProductsByType('Cơm Tấm');

// Sản phẩm đánh giá cao nhất
const topProducts = getTopRatedProducts(5);

// Sản phẩm sắp hết hàng
const lowStock = getLowStockProducts();
```

### Utility Functions
```typescript
// Format tiền tệ
const price = formatCurrency(35000); // "35.000 ₫"

// Format ngày tháng
const date = formatDate('2024-10-15T12:30:00Z');

// Generate Order ID
const orderId = generateOrderId(); // "ORD123456789"
```

## 🎯 Environment Configuration

Tạo file `.env.local`:

```env
# Sử dụng sample data
NEXT_PUBLIC_USE_SAMPLE_DATA=true

# Sử dụng mock API
NEXT_PUBLIC_USE_MOCK_API=true

# API URL (nếu có backend)
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## 📱 Testing với Sample Data

```typescript
// Test component với sample data
import { render, screen } from '@testing-library/react';
import { sampleData } from '@/data';
import ProductList from './ProductList';

test('renders product list', () => {
  render(<ProductList products={sampleData.products} />);
  expect(screen.getByText('Cơm Tấm Sườn Nướng')).toBeInTheDocument();
});
```

## 🔄 Chuyển đổi giữa Sample Data và Real API

```typescript
import { useSampleDataFlag } from '@/utils/configs/environment';

const MyComponent = () => {
  const useSample = useSampleDataFlag;
  
  if (useSample) {
    // Sử dụng sample data
    const { products } = useSampleProducts();
  } else {
    // Sử dụng real API
    const { data: products } = useQuery(['products'], fetchProducts);
  }
};
```

## 🎨 Customization

### Thêm sản phẩm mới
```typescript
// Trong sample-data.ts
export const sampleProducts: Product[] = [
  // ... existing products
  {
    productId: 11,
    productName: 'Cơm Tấm Gà Nướng',
    productDescription: 'Cơm tấm gà nướng thơm ngon',
    productImage: '/images/products/com-tam-ga-nuong.jpg',
    productPrice: 33000,
    rating: 4.7,
    productType: 'Cơm Tấm',
    productQuantity: 25,
  },
];
```

### Thêm loại sản phẩm mới
```typescript
export const sampleProductTypes: ProductType[] = [
  // ... existing types
  { id: 6, name: 'Đồ Chay' },
];
```

---

**Lưu ý:** Sample data này được tối ưu cho development và testing. Trong production, hãy sử dụng real API và database.
