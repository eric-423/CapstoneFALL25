# 🚀 Kế hoạch 3 ngày chuyển đổi Figma sang Code UI

## 📅 NGÀY 1: Core Components & Layout Foundation
**Thứ 7, 22/9/2025 - Commit: "feat: implement core UI components and layout foundation"**

### ⏰ Timeline: 8-10 giờ code
- **Sáng (9h-12h)**: Setup & Core Components
- **Chiều (14h-17h)**: Layout Components  
- **Tối (19h-21h)**: Testing & Integration

### 🎯 Deliverables (4-5 commits nhỏ):

#### Commit 1: "feat: add core UI components (Button, Input, Card)"
**Files tạo mới:**
```
src/components/ui/
├── Button.tsx           # Primary, secondary, outline, ghost variants
├── Input.tsx            # Text, email, password, validation states
├── Card.tsx             # Product cards, info cards với elevation
├── LoadingSpinner.tsx   # Loading states cho async operations
└── index.ts             # Export barrel file
```

**Figma reference**: `Components.png` - phân tích tất cả button và input states

#### Commit 2: "feat: implement layout components and navigation"
**Files tạo mới:**
```
src/components/layout/
├── Header.tsx           # Logo, navigation, user menu, cart icon
├── Footer.tsx           # Links, contact info, social media
├── Navigation.tsx       # Main nav menu với responsive behavior
├── MobileNav.tsx        # Hamburger menu cho mobile
└── MainLayout.tsx       # Wrapper cho tất cả pages
```

**Figma reference**: `Home.png`, `Home-1.png` - header/footer structure

#### Commit 3: "feat: setup global styles and theme system"
**Files chỉnh sửa:**
```
src/app/globals.css      # CSS custom properties, base styles
src/lib/utils.ts         # className utilities với cn() function
tailwind.config.ts       # Theme tokens, colors, typography
```

#### Commit 4: "feat: create mock data structure"
**Files tạo mới:**
```
src/data/
├── products.ts          # Mock menu items với categories
├── promotions.ts        # Offers và discounts data
├── blog.ts              # Blog posts mock data
└── constants.ts         # App constants, API endpoints placeholder
```

#### Commit 5: "feat: add TypeScript types and interfaces"
**Files tạo mới:**
```
src/types/
├── product.ts           # Product, Category, CartItem interfaces
├── user.ts              # User, Profile, Address interfaces  
├── order.ts             # Order, OrderStatus, Payment interfaces
└── common.ts            # ApiResponse, Pagination, Error types
```

---

## 📅 NGÀY 2: Main Pages & User Flow  
**Chủ nhật, 23/9/2025 - Commit: "feat: implement core user journey pages"**

### ⏰ Timeline: 8-10 giờ code
- **Sáng (9h-12h)**: Home & Menu Pages
- **Chiều (14h-17h)**: Authentication & Cart
- **Tối (19h-21h)**: Integration & Testing

### 🎯 Deliverables (5-6 commits):

#### Commit 1: "feat: implement homepage with all sections"
**Files tạo mới:**
```
src/app/page.tsx                    # Homepage với hero, features, testimonials
src/components/sections/
├── HeroSection.tsx                 # Main banner với CTA
├── FeaturedProducts.tsx            # Món nổi bật 
├── AboutSection.tsx                # Giới thiệu thương hiệu
├── TestimonialsSection.tsx         # Customer reviews
└── NewsletterSection.tsx           # Đăng ký newsletter
```

**Figma reference**: `Home.png`, `Home-1.png` - toàn bộ homepage layout

#### Commit 2: "feat: create menu and product catalog pages"
**Files tạo mới:**
```
src/app/menu/
├── page.tsx                        # Menu listing với filters
├── [category]/page.tsx             # Category-specific menus
└── components/
    ├── ProductCard.tsx             # Individual product display
    ├── ProductGrid.tsx             # Grid layout cho products
    ├── CategoryFilter.tsx          # Filter by category
    └── SearchBar.tsx               # Product search
```

**Figma reference**: `Menu.png` - product cards và layout

#### Commit 3: "feat: implement authentication pages"
**Files tạo mới:**
```
src/app/(auth)/
├── login/
│   └── page.tsx                    # Login form với validation
├── register/  
│   └── page.tsx                    # Registration form
└── components/
    ├── LoginForm.tsx               # Reusable login component
    ├── RegisterForm.tsx            # Registration với OTP
    └── AuthLayout.tsx              # Auth pages layout
```

**Figma reference**: `Login - customer.png`, `Login - customer-1.png`, `Login - OTP.png`

#### Commit 4: "feat: build shopping cart functionality"
**Files tạo mới:**
```
src/app/cart/
├── page.tsx                        # Cart page với item management
└── components/
    ├── CartItem.tsx                # Individual cart item
    ├── CartSummary.tsx             # Totals và checkout button
    └── CartDrawer.tsx              # Slide-out cart sidebar
```

**Files chỉnh sửa:**
```
src/contexts/CartContext.tsx        # Cart state management
src/hooks/useCart.ts                # Cart operations hooks
```

**Figma reference**: `Cart - tooltip.png`, `Add to cart - Popup.png`

#### Commit 5: "feat: add checkout process"
**Files tạo mới:**
```
src/app/checkout/
├── page.tsx                        # Multi-step checkout
└── components/
    ├── CheckoutForm.tsx            # Delivery info, payment
    ├── OrderSummary.tsx            # Final review
    └── PaymentMethods.tsx          # Payment options
```

**Figma reference**: `Checkout.png`

#### Commit 6: "feat: implement navigation and routing"
**Files chỉnh sửa:**
```
src/components/layout/Header.tsx    # Add active states, cart counter
src/components/layout/Navigation.tsx # Add routing logic
src/app/layout.tsx                  # Root layout với context providers
```

---

## 📅 NGÀY 3: Advanced Features & Polish
**Thứ 2, 24/9/2025 - Commit: "feat: complete UI implementation with advanced features"**

### ⏰ Timeline: 8-10 giờ code  
- **Sáng (9h-12h)**: User Profile & Orders
- **Chiều (14h-17h)**: Content Pages & Blog
- **Tối (19h-21h)**: Final Polish & Testing

### 🎯 Deliverables (6-7 commits):

#### Commit 1: "feat: implement user profile and account management"
**Files tạo mới:**
```
src/app/profile/
├── page.tsx                        # User profile overview
├── edit/page.tsx                   # Edit profile form
├── addresses/page.tsx              # Address management
└── components/
    ├── ProfileForm.tsx             # Editable profile info
    ├── AddressList.tsx             # Address CRUD
    └── ProfileTabs.tsx             # Tab navigation
```

**Figma reference**: `User.png`, `Edit Information.png`, `Addresses.png`

#### Commit 2: "feat: build order management system"
**Files tạo mới:**
```
src/app/orders/
├── page.tsx                        # Order history listing
├── [orderId]/page.tsx              # Order detail view
└── components/
    ├── OrderCard.tsx               # Order summary card
    ├── OrderTracking.tsx           # Status tracking
    └── OrderActions.tsx            # Cancel, reorder buttons
```

**Figma reference**: `OrderHistory.png`, `User - Order History.png`, `User - Order Tracking.png`, `TrackOrderJa.png`, `TrackOrderNo.png`

#### Commit 3: "feat: create blog and content pages"
**Files tạo mới:**
```
src/app/blog/
├── page.tsx                        # Blog listing
├── [slug]/page.tsx                 # Individual blog post
├── category/[category]/page.tsx    # Category-specific posts
└── components/
    ├── BlogCard.tsx                # Blog post preview
    ├── BlogContent.tsx             # Article content layout
    └── BlogSidebar.tsx             # Categories, recent posts
```

**Figma reference**: `Blog.png`, `Blog - Category.png`, `Blog - Detail.png`

#### Commit 4: "feat: implement promotions and offers"
**Files tạo mới:**
```
src/app/promotions/
├── page.tsx                        # Promotions listing
└── components/
    ├── PromotionCard.tsx           # Individual promotion
    ├── PromotionBanner.tsx         # Hero promotions
    └── CouponCode.tsx              # Discount code application
```

**Figma reference**: `Promotion.png`

#### Commit 5: "feat: add feedback and interaction features"
**Files tạo mới:**
```
src/components/feedback/
├── FeedbackModal.tsx               # Feedback popup
├── RatingStars.tsx                 # Product rating component
└── ReviewForm.tsx                  # Submit review form

src/components/common/
├── Modal.tsx                       # Reusable modal component
├── Toast.tsx                       # Notification system
└── Tooltip.tsx                     # Hover information
```

**Figma reference**: `Feedback - popup.png`

#### Commit 6: "feat: implement payment success and result pages"
**Files tạo mới:**
```
src/app/payment/
├── success/page.tsx                # Payment success confirmation
├── failed/page.tsx                 # Payment failure handling
└── components/
    ├── PaymentResult.tsx           # Success/failure display
    └── OrderConfirmation.tsx       # Order confirmation details
```

**Figma reference**: `Payment success.png`

#### Commit 7: "feat: responsive optimization and final polish"
**Files chỉnh sửa:**
```
src/app/globals.css                 # Mobile-first responsive styles
src/components/**/*.tsx             # Add responsive classes
tailwind.config.ts                  # Finalize breakpoints
```

**Final testing:**
- Mobile responsiveness (320px - 768px)
- Tablet optimization (768px - 1024px)  
- Desktop experience (1024px+)
- Cross-browser compatibility
- Performance optimization

---

## 📋 Commit Message Strategy

### Pattern: `type(scope): description`
```bash
# Ngày 1
git commit -m "feat(ui): add core UI components (Button, Input, Card)"
git commit -m "feat(layout): implement responsive header and navigation" 
git commit -m "feat(theme): setup TailwindCSS theme system and global styles"
git commit -m "feat(data): create mock data structure for products and users"
git commit -m "feat(types): add TypeScript interfaces for all entities"

# Ngày 2  
git commit -m "feat(home): implement homepage with hero and feature sections"
git commit -m "feat(menu): create product catalog and menu pages"
git commit -m "feat(auth): implement login and registration pages"
git commit -m "feat(cart): build shopping cart functionality and state management"
git commit -m "feat(checkout): add checkout process and payment flow"
git commit -m "feat(navigation): implement routing and active navigation states"

# Ngày 3
git commit -m "feat(profile): implement user profile and account management"
git commit -m "feat(orders): build order management and tracking system"
git commit -m "feat(blog): create blog and content management pages"
git commit -m "feat(promotions): implement promotions and offers display"
git commit -m "feat(feedback): add feedback modals and interaction features"
git commit -m "feat(payment): implement payment result and confirmation pages"
git commit -m "feat(responsive): optimize for mobile and responsive design"
```

## 🎯 Success Metrics

### End of Day 1:
- [ ] 5 commits với core components hoàn chỉnh
- [ ] Layout foundation responsive
- [ ] TypeScript types đầy đủ
- [ ] Build successful (`npm run build`)

### End of Day 2:
- [ ] 6 commits với main user journey
- [ ] Home, Menu, Auth, Cart pages functional
- [ ] Navigation working correctly
- [ ] State management setup

### End of Day 3:
- [ ] 7 commits với advanced features
- [ ] All 25 Figma designs implemented
- [ ] Fully responsive design
- [ ] Production-ready codebase
- [ ] Documentation updated

## 🔧 Daily Workflow

### Morning Setup (30 phút):
```bash
git pull origin main
npm install
npm run dev
# Review Figma designs cho ngày hôm đó
```

### Development Loop (mỗi 2-3 giờ):
```bash
# Code implementation
npm run lint           # Check code quality
npm run build          # Verify build success
git add .
git commit -m "feat(scope): description"
git push origin main
```

### Evening Review (30 phút):
- Test responsive trên multiple devices
- Review code quality và performance
- Plan tomorrow's tasks
- Update documentation if needed

Với kế hoạch này, bạn sẽ có 15-20 commits tự nhiên trải đều trong 3 ngày, mỗi commit có scope rõ ràng và progress hợp lý. Ready để bắt đầu implement chưa? 🚀