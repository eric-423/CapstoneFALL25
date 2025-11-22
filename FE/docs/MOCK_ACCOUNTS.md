# Mock Accounts for Testing

## 🎯 Hybrid Mode: Mock + Real API

The system now supports **both mock accounts and real API** simultaneously:

- ✅ **Mock Account**: Instant login without backend API call
- ✅ **Real Account**: Forwarded to backend API for validation
- ✅ **Both work together** seamlessly during development

Watch browser console for:
- `🎭 [MOCK]` - Mock account used
- `🌐 [REAL API]` - Real API called

---

## Available Mock Accounts

### Customer Account
- **Phone**: 0903234567
- **Password**: customer123
- **Role**: CUSTOMER
- **Login Page**: `/login`

### Admin Account
- **Email**: admin@tamtac.com
- **Password**: admin123
- **Role**: ADMIN
- **Login Page**: `/inside/login`

### Manager Account  
- **Email**: manager@tamtac.com
- **Password**: manager123
- **Role**: MANAGER
- **Login Page**: `/inside/login`

### Chef Account
- **Email**: chef@tamtac.com
- **Password**: chef123
- **Role**: CHEF
- **Login Page**: `/inside/login`

### Waiter Account
- **Email**: waiter@tamtac.com
- **Password**: waiter123
- **Role**: WAITER
- **Login Page**: `/inside/login`

### Shipper Account
- **Email**: shipper@tamtac.com
- **Password**: shipper123
- **Role**: SHIPPER
- **Login Page**: `/inside/login`

## How to Test

### For Customer (Role: CUSTOMER)
1. Go to `/login` page
2. Enter phone number: `0903234567`
3. Enter password: `customer123`
4. Customer login uses **phone number** only
5. You will be redirected to `/` (home page)

### For Staff (Admin, Manager, etc.)
1. Go to `/inside/login` page
2. Enter email: `admin@tamtac.com` or `manager@tamtac.com`
3. Enter password: `admin123` or `manager123`
4. Staff login uses **email** only
5. You will be redirected based on your role:
   - Admin → `/admin`
   - Manager → `/manager`

## Login Methods

- **Customer**: Login with **phone number** at `/login`
- **Staff (Admin, Manager, etc.)**: Login with **email** at `/inside/login`

## Configuration

To disable mock accounts completely (use ONLY real API):

```env
# In .env.local
NEXT_PUBLIC_USE_MOCK_API=false
```

Default is `true` (hybrid mode enabled).

---

## More Information

- Full documentation: `src/utils/mocks/README.md`
- Mock data files: `src/utils/mocks/data/`
- Interceptor logic: `src/utils/mocks/interceptor.ts`

## Fixed Issues

- ✅ Hybrid mode: Mock accounts + Real API work together
- ✅ Priority check: Mock accounts validated first before API call
- ✅ Fixed mock interceptor to return response immediately
- ✅ Fixed response structure to match expected format
- ✅ Fixed error handling for failed login attempts
- ✅ Added proper JWT token generation for mock users
- ✅ Separated login methods: Phone for customers, Email for staff
- ✅ Console logging for debugging (`🎭 [MOCK]` vs `🌐 [REAL API]`)