import { sampleData } from './sample-data';
import { 
  getProductById, 
  getProductsByType, 
  getTopRatedProducts,
  getLowStockProducts,
  getUserById,
  getActiveUsers,
  getIngredientById,
  getIngredientsByCategory,
  getLowStockIngredients,
  getRecipeById,
  getRecipesByCategory,
  getRecipesWithTraining,
  getTrainingCourseById,
  getPublishedTrainingCourses,
  getOrderById,
  getOrdersByStatus,
  getOrdersByCustomer,
  getBranchById,
  getActiveBranches,
  getDashboardStats,
  searchProducts,
  searchRecipes,
  searchIngredients,
  generateOrderId,
  calculateOrderTotal,
  mockApiDelay,
  mockApiSuccess,
  mockApiError
} from './data-helpers';

// ==================== MOCK API FUNCTIONS ====================

// Products API
export const mockGetProducts = async (page: number = 0, size: number = 10, typeId: number = 0) => {
  await mockApiDelay(800);
  
  let products = [...sampleData.products];
  
  // Filter by type
  if (typeId > 0) {
    const productType = sampleData.productTypes.find(type => type.id === typeId);
    if (productType) {
      products = products.filter(product => product.productType === productType.name);
    }
  }
  
  // Pagination
  const start = page * size;
  const end = start + size;
  const paginatedProducts = products.slice(start, end);
  
  return mockApiSuccess({
    content: paginatedProducts,
    totalElements: products.length,
    totalPages: Math.ceil(products.length / size),
    number: page,
    size: size,
    last: end >= products.length,
  });
};

export const mockGetProductById = async (id: number) => {
  await mockApiDelay(500);
  const product = getProductById(id);
  
  if (!product) {
    throw mockApiError('Product not found');
  }
  
  return mockApiSuccess(product);
};

export const mockGetProductTypes = async () => {
  await mockApiDelay(300);
  return mockApiSuccess(sampleData.productTypes);
};

export const mockGetTopProducts = async (limit: number = 5) => {
  await mockApiDelay(600);
  return mockApiSuccess(getTopRatedProducts(limit));
};

export const mockGetLowStockProducts = async () => {
  await mockApiDelay(400);
  return mockApiSuccess(getLowStockProducts());
};

export const mockSearchProducts = async (query: string) => {
  await mockApiDelay(700);
  return mockApiSuccess(searchProducts(query));
};

// Users API
export const mockGetUsers = async (page: number = 0, size: number = 10) => {
  await mockApiDelay(800);
  
  const start = page * size;
  const end = start + size;
  const paginatedUsers = sampleData.users.slice(start, end);
  
  return mockApiSuccess({
    content: paginatedUsers,
    totalElements: sampleData.users.length,
    totalPages: Math.ceil(sampleData.users.length / size),
    number: page,
    size: size,
    last: end >= sampleData.users.length,
  });
};

export const mockGetUserById = async (id: string) => {
  await mockApiDelay(500);
  const user = getUserById(id);
  
  if (!user) {
    throw mockApiError('User not found');
  }
  
  return mockApiSuccess({ user });
};

export const mockGetActiveUsers = async () => {
  await mockApiDelay(400);
  return mockApiSuccess(getActiveUsers());
};

// Ingredients API
export const mockGetIngredients = async (page: number = 0, size: number = 10, category?: string) => {
  await mockApiDelay(800);
  
  let ingredients = [...sampleData.ingredients];
  
  if (category) {
    ingredients = getIngredientsByCategory(category as any);
  }
  
  const start = page * size;
  const end = start + size;
  const paginatedIngredients = ingredients.slice(start, end);
  
  return mockApiSuccess({
    content: paginatedIngredients,
    totalElements: ingredients.length,
    totalPages: Math.ceil(ingredients.length / size),
    number: page,
    size: size,
    last: end >= ingredients.length,
  });
};

export const mockGetIngredientById = async (id: number) => {
  await mockApiDelay(500);
  const ingredient = getIngredientById(id);
  
  if (!ingredient) {
    throw mockApiError('Ingredient not found');
  }
  
  return mockApiSuccess(ingredient);
};

export const mockGetLowStockIngredients = async () => {
  await mockApiDelay(400);
  return mockApiSuccess(getLowStockIngredients());
};

export const mockSearchIngredients = async (query: string) => {
  await mockApiDelay(600);
  return mockApiSuccess(searchIngredients(query));
};

// Recipes API
export const mockGetRecipes = async (page: number = 0, size: number = 10, category?: string) => {
  await mockApiDelay(800);
  
  let recipes = [...sampleData.recipes];
  
  if (category) {
    recipes = getRecipesByCategory(category as any);
  }
  
  const start = page * size;
  const end = start + size;
  const paginatedRecipes = recipes.slice(start, end);
  
  return mockApiSuccess({
    content: paginatedRecipes,
    totalElements: recipes.length,
    totalPages: Math.ceil(recipes.length / size),
    number: page,
    size: size,
    last: end >= recipes.length,
  });
};

export const mockGetRecipeById = async (id: number) => {
  await mockApiDelay(500);
  const recipe = getRecipeById(id);
  
  if (!recipe) {
    throw mockApiError('Recipe not found');
  }
  
  return mockApiSuccess(recipe);
};

export const mockGetRecipesWithTraining = async () => {
  await mockApiDelay(400);
  return mockApiSuccess(getRecipesWithTraining());
};

export const mockSearchRecipes = async (query: string) => {
  await mockApiDelay(600);
  return mockApiSuccess(searchRecipes(query));
};

// Training Courses API
export const mockGetTrainingCourses = async (page: number = 0, size: number = 10, role?: string) => {
  await mockApiDelay(800);
  
  let courses = [...sampleData.trainingCourses];
  
  if (role) {
    courses = courses.filter(course => course.assignedRoles.includes(role as any));
  }
  
  const start = page * size;
  const end = start + size;
  const paginatedCourses = courses.slice(start, end);
  
  return mockApiSuccess({
    content: paginatedCourses,
    totalElements: courses.length,
    totalPages: Math.ceil(courses.length / size),
    number: page,
    size: size,
    last: end >= courses.length,
  });
};

export const mockGetTrainingCourseById = async (id: number) => {
  await mockApiDelay(500);
  const course = getTrainingCourseById(id);
  
  if (!course) {
    throw mockApiError('Training course not found');
  }
  
  return mockApiSuccess(course);
};

export const mockGetPublishedTrainingCourses = async () => {
  await mockApiDelay(400);
  return mockApiSuccess(getPublishedTrainingCourses());
};

// Orders API
export const mockGetOrders = async (page: number = 0, size: number = 10, status?: string) => {
  await mockApiDelay(800);
  
  let orders = [...sampleData.orders];
  
  if (status) {
    orders = getOrdersByStatus(status);
  }
  
  const start = page * size;
  const end = start + size;
  const paginatedOrders = orders.slice(start, end);
  
  return mockApiSuccess({
    content: paginatedOrders,
    totalElements: orders.length,
    totalPages: Math.ceil(orders.length / size),
    number: page,
    size: size,
    last: end >= orders.length,
  });
};

export const mockGetOrderById = async (orderId: string) => {
  await mockApiDelay(500);
  const order = getOrderById(orderId);
  
  if (!order) {
    throw mockApiError('Order not found');
  }
  
  return mockApiSuccess(order);
};

export const mockGetOrdersByCustomer = async (customerId: string) => {
  await mockApiDelay(600);
  return mockApiSuccess(getOrdersByCustomer(customerId));
};

export const mockCreateOrder = async (orderData: any) => {
  await mockApiDelay(1000);
  
  const newOrder = {
    orderId: generateOrderId(),
    ...orderData,
    totalAmount: calculateOrderTotal(orderData.items),
    status: 'PENDING',
    orderTime: new Date().toISOString(),
  };
  
  return mockApiSuccess(newOrder);
};

export const mockUpdateOrderStatus = async (orderId: string, status: string) => {
  await mockApiDelay(800);
  
  const order = getOrderById(orderId);
  if (!order) {
    throw mockApiError('Order not found');
  }
  
  const updatedOrder = { ...order, status };
  return mockApiSuccess(updatedOrder);
};

// Branches API
export const mockGetBranches = async () => {
  await mockApiDelay(600);
  return mockApiSuccess(sampleData.branches);
};

export const mockGetBranchById = async (branchId: number) => {
  await mockApiDelay(500);
  const branch = getBranchById(branchId);
  
  if (!branch) {
    throw mockApiError('Branch not found');
  }
  
  return mockApiSuccess(branch);
};

export const mockGetActiveBranches = async () => {
  await mockApiDelay(400);
  return mockApiSuccess(getActiveBranches());
};

// Dashboard API
export const mockGetDashboardStats = async () => {
  await mockApiDelay(800);
  return mockApiSuccess(getDashboardStats());
};


export const mockGetRecentOrders = async (limit: number = 10) => {
  await mockApiDelay(500);
  return mockApiSuccess(getDashboardStats().recentOrders.slice(0, limit));
};

export const mockGetLowStockAlerts = async () => {
  await mockApiDelay(400);
  return mockApiSuccess(getDashboardStats().lowStockProducts);
};

// Auth API
export const mockLogin = async (phoneNumber: string, password: string) => {
  await mockApiDelay(1000);
  
  const user = sampleData.users.find(u => u.phone === phoneNumber);
  if (!user) {
    throw mockApiError('Invalid credentials');
  }
  
  const userAuthData = sampleData.userAuthData.find(u => u.phoneNumber === phoneNumber);
  if (!userAuthData) {
    throw mockApiError('User not found');
  }
  
  return mockApiSuccess({
    access_token: 'mock_access_token_' + Date.now(),
    refresh_token: 'mock_refresh_token_' + Date.now(),
    user: userAuthData,
  });
};

export const mockLogout = async () => {
  await mockApiDelay(500);
  return mockApiSuccess({ message: 'Logged out successfully' });
};

// ==================== EXPORT ALL MOCK APIs ====================
export const mockApi = {
  // Products
  getProducts: mockGetProducts,
  getProductById: mockGetProductById,
  getProductTypes: mockGetProductTypes,
  getTopProducts: mockGetTopProducts,
  getLowStockProducts: mockGetLowStockProducts,
  searchProducts: mockSearchProducts,
  
  // Users
  getUsers: mockGetUsers,
  getUserById: mockGetUserById,
  getActiveUsers: mockGetActiveUsers,
  
  // Ingredients
  getIngredients: mockGetIngredients,
  getIngredientById: mockGetIngredientById,
  getLowStockIngredients: mockGetLowStockIngredients,
  searchIngredients: mockSearchIngredients,
  
  // Recipes
  getRecipes: mockGetRecipes,
  getRecipeById: mockGetRecipeById,
  getRecipesWithTraining: mockGetRecipesWithTraining,
  searchRecipes: mockSearchRecipes,
  
  // Training Courses
  getTrainingCourses: mockGetTrainingCourses,
  getTrainingCourseById: mockGetTrainingCourseById,
  getPublishedTrainingCourses: mockGetPublishedTrainingCourses,
  
  // Orders
  getOrders: mockGetOrders,
  getOrderById: mockGetOrderById,
  getOrdersByCustomer: mockGetOrdersByCustomer,
  createOrder: mockCreateOrder,
  updateOrderStatus: mockUpdateOrderStatus,
  
  // Branches
  getBranches: mockGetBranches,
  getBranchById: mockGetBranchById,
  getActiveBranches: mockGetActiveBranches,
  
  // Dashboard
  getDashboardStats: mockGetDashboardStats,
  getRecentOrders: mockGetRecentOrders,
  getLowStockAlerts: mockGetLowStockAlerts,
  
  // Auth
  login: mockLogin,
  logout: mockLogout,
};

export default mockApi;
