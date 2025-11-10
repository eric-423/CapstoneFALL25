import { sampleData } from './sample-data';
import { Product } from '@/apis/product.api';
import { User } from '@/utils/types/user.type';
import { Ingredient } from '@/utils/types/ingredient.type';
import { Recipe } from '@/utils/types/recipe.type';
import { TrainingCourse } from '@/utils/types/training.type';

export const getProductById = (id: number): Product | undefined => {
  return sampleData.products.find(product => product.productId === id);
};

export const getProductsByType = (type: string): Product[] => {
  return sampleData.products.filter(product => product.productType === type);
};

export const getProductsByPriceRange = (min: number, max: number): Product[] => {
  return sampleData.products.filter(product =>
    product.productPrice >= min && product.productPrice <= max
  );
};

export const getTopRatedProducts = (limit: number = 5): Product[] => {
  return sampleData.products
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, limit);
};

export const getLowStockProducts = (threshold: number = 20): Product[] => {
  return sampleData.products.filter(product => (product.productQuantity ?? 0) < threshold);
};

export const getUserById = (id: string): User | undefined => {
  return sampleData.users.find(user => user.id === id);
};

export const getUserByPhone = (phone: string): User | undefined => {
  return sampleData.users.find(user => user.phone === phone);
};

export const getUsersByRank = (rank: string): User[] => {
  return sampleData.users.filter(user => user.memberRank === rank);
};

export const getActiveUsers = (): User[] => {
  return sampleData.users.filter(user => user.isActive);
};

export const getIngredientById = (id: number): Ingredient | undefined => {
  return sampleData.ingredients.find(ingredient => ingredient.id === id);
};

export const getIngredientsByCategory = (category: Ingredient['category']): Ingredient[] => {
  return sampleData.ingredients.filter(ingredient => ingredient.category === category);
};

export const getLowStockIngredients = (): Ingredient[] => {
  return sampleData.ingredients.filter(ingredient =>
    ingredient.quantity < ingredient.threshold
  );
};

export const getIngredientsBySupplier = (supplier: string): Ingredient[] => {
  return sampleData.ingredients.filter(ingredient =>
    ingredient.supplier.toLowerCase().includes(supplier.toLowerCase())
  );
};


export const getRecipeById = (id: number): Recipe | undefined => {
  return sampleData.recipes.find(recipe => recipe.id === id);
};

export const getRecipesByCategory = (category: Recipe['category']): Recipe[] => {
  return sampleData.recipes.filter(recipe => recipe.category === category);
};

export const getRecipesByDifficulty = (difficulty: Recipe['difficulty']): Recipe[] => {
  return sampleData.recipes.filter(recipe => recipe.difficulty === difficulty);
};

export const getRecipesWithTraining = (): Recipe[] => {
  return sampleData.recipes.filter(recipe => recipe.hasTrainingCourse);
};

export const getRecipesByPrepTime = (maxTime: number): Recipe[] => {
  return sampleData.recipes.filter(recipe => recipe.prepTime <= maxTime);
};

export const getTrainingCourseById = (id: number): TrainingCourse | undefined => {
  return sampleData.trainingCourses.find(course => course.id === id);
};

export const getTrainingCoursesByRole = (role: string): TrainingCourse[] => {
  return sampleData.trainingCourses.filter(course =>
    course.assignedRoles.includes(role as TrainingCourse['assignedRoles'][number])
  );
};

export const getPublishedTrainingCourses = (): TrainingCourse[] => {
  return sampleData.trainingCourses.filter(course => course.status === 'PUBLISHED');
};

export const getTrainingCoursesByRecipe = (recipeId: number): TrainingCourse[] => {
  return sampleData.trainingCourses.filter(course => course.recipeId === recipeId);
};

export const getOrderById = (orderId: string) => {
  return sampleData.orders.find(order => order.orderId === orderId);
};

export const getOrdersByStatus = (status: string) => {
  return sampleData.orders.filter(order => order.status === status);
};

export const getOrdersByCustomer = (customerId: string) => {
  return sampleData.orders.filter(order => order.customerId === customerId);
};

export const getOrdersByBranch = (branchId: number) => {
  return sampleData.orders.filter(order => order.branchId === branchId);
};

export const getBranchById = (branchId: number) => {
  return sampleData.branches.find(branch => branch.branchId === branchId);
};

export const getActiveBranches = () => {
  return sampleData.branches.filter(branch => branch.isActive);
};

export const getBranchByManager = (managerId: string) => {
  return sampleData.branches.find(branch => branch.managerId === managerId);
};

export const getDashboardStats = () => {
  return sampleData.dashboardStats;
};

export const getTopProducts = (limit: number = 5) => {
  return sampleData.dashboardStats.topProducts.slice(0, limit);
};

export const getRecentOrders = (limit: number = 10) => {
  return sampleData.dashboardStats.recentOrders.slice(0, limit);
};

export const getLowStockAlerts = () => {
  return sampleData.dashboardStats.lowStockProducts;
};

export const searchProducts = (query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase();
  return sampleData.products.filter(product =>
    product.productName.toLowerCase().includes(lowercaseQuery) ||
    product.productDescription.toLowerCase().includes(lowercaseQuery) ||
    product.productType.toLowerCase().includes(lowercaseQuery)
  );
};

export const searchRecipes = (query: string): Recipe[] => {
  const lowercaseQuery = query.toLowerCase();
  return sampleData.recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(lowercaseQuery) ||
    recipe.description.toLowerCase().includes(lowercaseQuery)
  );
};

export const searchIngredients = (query: string): Ingredient[] => {
  const lowercaseQuery = query.toLowerCase();
  return sampleData.ingredients.filter(ingredient =>
    ingredient.name.toLowerCase().includes(lowercaseQuery) ||
    ingredient.supplier.toLowerCase().includes(lowercaseQuery)
  );
};

export const generateOrderId = (): string => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD${timestamp}${random}`;
};

export const calculateOrderTotal = (items: Array<{ quantity: number; price: number }>): number => {
  return items.reduce((total, item) => total + (item.quantity * item.price), 0);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const mockApiDelay = (ms: number = 1000): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const mockApiError = (message: string = 'API Error'): Promise<never> => {
  return Promise.reject(new Error(message));
};

export const mockApiSuccess = <T>(data: T, delay: number = 500): Promise<T> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(data), delay);
  });
};
