# Development Rules & Guidelines
## TamTech Customer Portal - Coding Standards & Best Practices

### 📋 General Development Principles

#### Code Quality Standards
```typescript
// ✅ Good: Clear, descriptive naming
const calculateCartTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// ❌ Bad: Unclear, abbreviated naming
const calcTotal = (its: any[]): any => {
  return its.reduce((t, i) => t + i.p * i.q, 0);
};
```

#### TypeScript Usage Rules
```typescript
// ✅ Always define proper interfaces
interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
  onFavorite?: (productId: string) => void;
  showQuickView?: boolean;
}

// ✅ Use strict type checking
const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  onFavorite,
  showQuickView = false 
}) => {
  // Component implementation
};

// ❌ Avoid any types unless absolutely necessary
const badComponent = (props: any) => { /* ... */ };
```

#### Component Composition Rules
```typescript
// ✅ Good: Composable, reusable components
<Card variant="elevated" padding="md">
  <CardHeader title="Product Name" subtitle="Category" />
  <CardBody>
    <ProductImage src={product.image} alt={product.name} />
    <ProductPrice price={product.price} discount={product.discount} />
  </CardBody>
  <CardFooter>
    <Button variant="primary" onClick={handleAddToCart}>
      Add to Cart
    </Button>
  </CardFooter>
</Card>

// ❌ Bad: Monolithic, hard-coded components
<div className="card-with-everything">
  {/* Large, non-reusable component */}
</div>
```

---

### 🎨 Styling & CSS Guidelines

#### TailwindCSS Best Practices
```typescript
// ✅ Use utility classes with proper grouping
const buttonClasses = cn(
  // Base styles
  "inline-flex items-center justify-center rounded-md font-medium transition-colors",
  // Focus styles
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  // Variant styles
  variant === 'primary' && "bg-primary text-primary-foreground hover:bg-primary/90",
  variant === 'secondary' && "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  // Size styles
  size === 'sm' && "h-9 px-3 text-sm",
  size === 'md' && "h-10 px-4 text-base",
  size === 'lg' && "h-11 px-6 text-lg",
  className
);

// ❌ Avoid inline styles for complex styling
style={{ backgroundColor: '#f97316', padding: '8px 16px', borderRadius: '6px' }}
```

#### CSS Custom Properties Usage
```css
/* ✅ Use CSS custom properties for theming */
.button-primary {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}

.button-primary:hover {
  background-color: hsl(var(--primary) / 0.9);
}

/* ❌ Avoid hard-coded colors */
.button-bad {
  background-color: #f97316;
  color: #ffffff;
}
```

#### Responsive Design Rules
```typescript
// ✅ Mobile-first responsive design
<div className={cn(
  // Mobile styles (default)
  "flex flex-col p-4 gap-4",
  // Tablet styles
  "md:flex-row md:p-6 md:gap-6",
  // Desktop styles
  "lg:p-8 lg:gap-8 lg:max-w-6xl lg:mx-auto"
)}>

// ✅ Use semantic breakpoints
const breakpoints = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1400px',
} as const;
```

---

### 🧩 Component Architecture Rules

#### Component Organization
```
src/components/
├── ui/                     # Basic UI components (Button, Input, Card)
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.types.ts
│   │   └── index.ts
├── layout/                 # Layout components (Header, Footer, Navigation)
├── features/               # Feature-specific components
│   ├── auth/              # Authentication components
│   ├── products/          # Product-related components
│   ├── cart/              # Shopping cart components
│   └── orders/            # Order management components
└── forms/                  # Form components and validation
```

#### Component Structure Template
```typescript
// ComponentName.types.ts
export interface ComponentNameProps {
  // Props interface
}

// ComponentName.tsx
import { ComponentNameProps } from './ComponentName.types';

export const ComponentName: React.FC<ComponentNameProps> = ({
  // Destructured props
}) => {
  // Component logic
  
  return (
    // JSX
  );
};

// index.ts
export { ComponentName } from './ComponentName';
export type { ComponentNameProps } from './ComponentName.types';
```

#### Prop Naming Conventions
```typescript
// ✅ Use clear, descriptive prop names
interface ProductCardProps {
  product: Product;                    // Data objects
  isLoading?: boolean;                // Boolean flags with 'is' prefix
  showQuickView?: boolean;            // Boolean flags with 'show' prefix
  onAddToCart: (id: string) => void;  // Event handlers with 'on' prefix
  className?: string;                 // Optional styling
  children?: React.ReactNode;         // Content composition
}

// ❌ Avoid unclear or abbreviated prop names
interface BadProps {
  data: any;        // Too generic
  flag: boolean;    // Unclear purpose
  cb: () => void;   // Abbreviated
}
```

---

### 🔧 State Management Rules

#### Local State Guidelines
```typescript
// ✅ Use appropriate state hooks
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [formData, setFormData] = useReducer(formReducer, initialFormState);

// ✅ Prefer specific state over generic objects
const [user, setUser] = useState<User | null>(null);
const [cartItems, setCartItems] = useState<CartItem[]>([]);

// ❌ Avoid overly generic state
const [data, setData] = useState<any>({}); // Too generic
```

#### Context Usage Rules
```typescript
// ✅ Create focused contexts for specific domains
const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const CartContext = createContext<CartContextValue | undefined>(undefined);

// ✅ Provide custom hooks for context consumption
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// ❌ Avoid massive, monolithic contexts
const AppContext = createContext<{
  user: User;
  cart: Cart;
  products: Product[];
  orders: Order[];
  // ... many more properties
}>(/* ... */);
```

---

### 🌐 API Integration Rules

#### API Client Structure
```typescript
// lib/api/client.ts
export class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor(config: ApiConfig) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout;
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    // Implementation
  }

  async post<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    // Implementation
  }
}

// lib/api/endpoints.ts
export const endpoints = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
  },
  products: {
    list: '/products',
    detail: (id: string) => `/products/${id}`,
    search: '/products/search',
  },
} as const;
```

#### Error Handling Standards
```typescript
// ✅ Consistent error handling
interface ApiError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: string;
}

const handleApiError = (error: ApiError): string => {
  switch (error.code) {
    case 'VALIDATION_ERROR':
      return 'Please check your input and try again.';
    case 'NOT_FOUND':
      return 'The requested resource was not found.';
    case 'UNAUTHORIZED':
      return 'Please log in to continue.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};

// ✅ Use try-catch with proper error types
const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await apiClient.get<Product[]>('/products');
    return response.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(handleApiError(error));
    }
    throw new Error('Failed to fetch products');
  }
};
```

---

### 🔒 Security & Performance Rules

#### Security Best Practices
```typescript
// ✅ Sanitize user input
import DOMPurify from 'dompurify';

const sanitizeHTML = (html: string): string => {
  return DOMPurify.sanitize(html);
};

// ✅ Validate data at boundaries
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// ✅ Handle authentication tokens securely
const storeAuthToken = (token: string): void => {
  // Store in memory or secure HTTP-only cookies
  // Avoid localStorage for sensitive data
};
```

#### Performance Optimization Rules
```typescript
// ✅ Use React.memo for expensive components
export const ProductCard = React.memo<ProductCardProps>(({ product, onAddToCart }) => {
  // Component implementation
});

// ✅ Implement proper loading states
const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div>
      {isLoading ? (
        <ProductListSkeleton />
      ) : (
        products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))
      )}
    </div>
  );
};

// ✅ Use dynamic imports for code splitting
const LazyCheckout = lazy(() => import('../pages/Checkout'));
```

---

### 📝 Documentation Rules

#### Code Comments Guidelines
```typescript
/**
 * Calculates the total price for cart items including taxes and discounts
 * @param items - Array of cart items
 * @param taxRate - Tax rate as decimal (e.g., 0.1 for 10%)
 * @param discountCode - Optional discount code to apply
 * @returns Object containing subtotal, tax, discount, and total amounts
 */
const calculateCartTotal = (
  items: CartItem[], 
  taxRate: number, 
  discountCode?: string
): CartTotal => {
  // Implementation with clear logic flow
};

// ✅ Comment complex business logic
// Apply member discount if user has premium membership
// and order total exceeds minimum threshold
if (user.isPremium && subtotal >= PREMIUM_DISCOUNT_THRESHOLD) {
  discount = calculatePremiumDiscount(subtotal);
}
```

#### Component Documentation
```typescript
/**
 * ProductCard - Displays product information in a card format
 * 
 * Features:
 * - Product image with lazy loading
 * - Price display with discount handling
 * - Add to cart functionality
 * - Favorite/wishlist toggle
 * - Quick view modal trigger
 * 
 * @example
 * <ProductCard 
 *   product={product} 
 *   onAddToCart={handleAddToCart}
 *   showQuickView={true}
 * />
 */
export const ProductCard: React.FC<ProductCardProps> = ({ ... }) => {
  // Component implementation
};
```

---

### 🧪 Testing Guidelines

#### Unit Testing Rules
```typescript
// ✅ Test component behavior, not implementation
describe('ProductCard', () => {
  it('should display product information correctly', () => {
    render(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />);
    
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(`$${mockProduct.price}`)).toBeInTheDocument();
  });

  it('should call onAddToCart when add button is clicked', () => {
    const mockAddToCart = jest.fn();
    render(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />);
    
    fireEvent.click(screen.getByText('Add to Cart'));
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct.id);
  });
});
```

#### Integration Testing Approach
```typescript
// ✅ Test user workflows and interactions
describe('Shopping Cart Flow', () => {
  it('should allow users to add items and proceed to checkout', async () => {
    render(<App />);
    
    // Add product to cart
    fireEvent.click(screen.getByText('Add to Cart'));
    
    // Verify cart update
    expect(screen.getByText('1 item in cart')).toBeInTheDocument();
    
    // Proceed to checkout
    fireEvent.click(screen.getByText('Checkout'));
    
    // Verify checkout page loads
    expect(screen.getByText('Checkout')).toBeInTheDocument();
  });
});
```

---

### 🚀 Deployment & Build Rules

#### Environment Configuration
```typescript
// config/environment.ts
export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  environment: process.env.NODE_ENV || 'development',
  enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
} as const;

// ✅ Validate environment variables at startup
const requiredEnvVars = ['NEXT_PUBLIC_API_URL'] as const;

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});
```

#### Build Optimization
```typescript
// next.config.ts
const nextConfig = {
  // Enable bundle analyzer in development
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config: any) => {
      config.plugins.push(new BundleAnalyzerPlugin());
      return config;
    },
  }),
  
  // Optimize images
  images: {
    domains: ['api.tamtech.vn'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Enable experimental features
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
};
```

---

### ⚠️ Common Pitfalls to Avoid

#### Anti-Patterns
```typescript
// ❌ Don't mutate props directly
const BadComponent = ({ items }: { items: Item[] }) => {
  items.push(newItem); // Mutating props!
  return <div>{/* ... */}</div>;
};

// ✅ Create new arrays/objects instead
const GoodComponent = ({ items }: { items: Item[] }) => {
  const updatedItems = [...items, newItem];
  return <div>{/* ... */}</div>;
};

// ❌ Don't use array indices as keys for dynamic lists
{items.map((item, index) => (
  <Item key={index} data={item} /> // Bad!
))}

// ✅ Use stable, unique identifiers
{items.map(item => (
  <Item key={item.id} data={item} /> // Good!
))}

// ❌ Don't call hooks conditionally
const BadComponent = ({ condition }: { condition: boolean }) => {
  if (condition) {
    const [state, setState] = useState(''); // Breaks rules of hooks!
  }
  return <div>Content</div>;
};

// ✅ Call hooks at the top level
const GoodComponent = ({ condition }: { condition: boolean }) => {
  const [state, setState] = useState('');
  
  if (condition) {
    // Use the state here
  }
  
  return <div>Content</div>;
};
```

### 📊 Code Review Checklist

#### Before Submitting Code
- [ ] TypeScript compilation passes without errors
- [ ] ESLint rules pass without warnings
- [ ] Components are properly typed
- [ ] Accessibility guidelines followed
- [ ] Mobile responsiveness verified
- [ ] Error states handled appropriately
- [ ] Loading states implemented
- [ ] Performance optimizations applied
- [ ] Security best practices followed
- [ ] Code is properly documented
- [ ] Tests written and passing
- [ ] No console.log statements in production code

#### Review Focus Areas
1. **Type Safety**: All components and functions properly typed
2. **Performance**: No unnecessary re-renders or expensive operations
3. **Accessibility**: Keyboard navigation and screen reader support
4. **Security**: Input validation and XSS prevention
5. **Maintainability**: Clear code structure and documentation
6. **Consistency**: Follows established patterns and conventions