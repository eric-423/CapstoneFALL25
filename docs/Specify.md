# Specify — Technical Specification

## 1. Stack & phiên bản
- **Framework:** Next.js 15.5.3 (App Router, Turbopack dev)
- **Ngôn ngữ:** TypeScript 5
- **Styles:** TailwindCSS v4 (beta) + inline theme tokens trong `globals.css`
- **Icons:** `lucide-react`
- **Utility:** `clsx`, `tailwind-merge`

## 2. Cấu trúc thư mục chính (`FE/src`)
```
app/
  layout.tsx      # Layout gốc: header, footer, thiết lập font Manrope
  page.tsx        # Trang chủ, render các section marketing
  [route]/page.tsx# Các màn hình tĩnh: menu, giỏ-hàng, ...
components/
  layout/         # SiteHeader, SiteFooter
  marketing/      # HeroSection, BestSellerGrid, ...
  navigation/     # MainNav, MobileNav
  ...
data/
  menu.ts         # Mock danh sách món và danh mục
  promotions.ts   # Mock ưu đãi
  story.ts        # Timeline, giá trị cốt lõi
  contact.ts      # Kênh liên hệ
lib/
  utils.ts        # Hàm `cn` gộp className
```

## 3. Kiến trúc UI
- **Layout:** `layout.tsx` (server component) → bọc `<SiteHeader />` (client) + `<SiteFooter />`
- **Hero & sections:** tách thành component reusable ở `components/marketing`
- **Pages:** mỗi route sử dụng data mock qua import trực tiếp (chưa có API)
- **Responsive:** dùng Tailwind utility theo breakpoint mặc định (`sm`, `md`, `lg`)

## 4. Theme & styling
- `globals.css` định nghĩa CSS custom properties (color, radius) + Tailwind inline theme
- `section-gradient`, `bevel-card`, `container-tight` là class tiện ích cho layout (shadow, spacing)
- Font `Manrope` được inject bằng Next Font (biến `--font-manrope`), gắn vào body

## 5. Data & mô phỏng
- **Menu:** `menuCategories`, `menuItems` (id, price, calories, tags)
- **Promotions:** `promotions` (id, title, description, badge, expiry)
- **Story:** milestone & core values
- **Contact:** hotline, email, Zalo OA
- Các form hiện chưa có submit handler → thay bằng mock (tương lai dùng `react-hook-form` + API)

## 6. Dependency & Script
```json
"scripts": {
  "dev": "next dev --turbopack",
  "build": "next build --turbopack",
  "start": "next start",
  "lint": "eslint"
}
```
- Dự án dùng ESLint cấu hình sẵn từ `create-next-app` (đặt tại `eslint.config.mjs`)
- Tailwind v4 chưa có `tailwind.config.ts` chi tiết → sử dụng mặc định, có thể mở rộng nếu cần custom theme sâu hơn

## 7. Hướng tích hợp tương lai
- Tách data mock thành services (`lib/services/*.ts`) khi có API => create hooks `useMenu`, `usePromotions`
- Tích hợp state management `@tanstack/react-query` hoặc Zustand cho cart/auth
- Form validation: đề xuất `react-hook-form` + `zod`
- Auth: chuẩn bị provider component (ví dụ `AuthGuard`) để wrap trang yêu cầu đăng nhập

## 8. Build & deploy
- Dev: `npm run dev`
- Lint: `npm run lint`
- Prod build: `npm run build` (có thể chuyển về `next build` nếu Turbopack không ổn định)
- Deploy target (dự kiến): Vercel hoặc Netlify (tương thích Next.js)

## 9. Liên kết tài liệu
- Yêu cầu sản phẩm: `PRD.md`
- Lộ trình: `Plan.md`
- Công việc: `Tasks.md`
- Quy ước code: `Rules.md`
