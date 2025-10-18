# Mock Accounts for Testing

## Available Test Accounts

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

### Customer Account
- **Phone**: 0903234567
- **Password**: customer123
- **Role**: CUSTOMER
- **Login Page**: `/login`

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

## Fixed Issues

- ✅ Fixed mock interceptor to return response immediately
- ✅ Fixed response structure to match expected format
- ✅ Fixed error handling for failed login attempts
- ✅ Added proper JWT token generation for mock users
- ✅ Separated login methods: Phone for customers, Email for staff