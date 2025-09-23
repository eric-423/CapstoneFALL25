// Order and Delivery types for Cơm Tấm customer portal
import { CartItem, Product } from './product';
import { Address, User } from './user';

export interface Order {
  id: string;
  orderNumber: string; // Display-friendly order number
  userId: string;
  user?: User;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  items: OrderItem[];
  pricing: OrderPricing;
  delivery: DeliveryInfo;
  payment: PaymentInfo;
  timeline: OrderTimeline[];
  notes?: string;
  specialInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
  estimatedDeliveryTime?: Date;
  actualDeliveryTime?: Date;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  variantId?: string;
  variantName?: string;
  specialInstructions?: string;
}

export interface OrderPricing {
  subtotal: number;
  deliveryFee: number;
  tax: number;
  serviceFee: number;
  discount: number;
  couponDiscount: number;
  total: number;
  currency: string;
}

export interface DeliveryInfo {
  type: 'delivery' | 'pickup';
  address?: Address;
  pickupLocation?: PickupLocation;
  instructions?: string;
  estimatedTime?: number; // minutes
  actualTime?: number; // minutes
  driver?: DriverInfo;
  trackingCode?: string;
}

export interface PickupLocation {
  id: string;
  name: string;
  address: string;
  phone: string;
  workingHours: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface DriverInfo {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  vehicle: {
    type: 'motorbike' | 'car' | 'bicycle';
    licensePlate: string;
  };
  rating: number;
  location?: {
    lat: number;
    lng: number;
    updatedAt: Date;
  };
}

export interface PaymentInfo {
  method: PaymentMethod;
  transactionId?: string;
  gatewayResponse?: Record<string, unknown>;
  paidAt?: Date;
  refundedAt?: Date;
  refundAmount?: number;
}

export interface OrderTimeline {
  id: string;
  status: OrderStatus;
  timestamp: Date;
  description: string;
  note?: string;
  updatedBy?: string; // system, user, admin, driver
}

// Enums and constants
export type OrderStatus = 
  | 'pending'           // Đang chờ xác nhận
  | 'confirmed'         // Đã xác nhận
  | 'preparing'         // Đang chuẩn bị
  | 'ready'            // Sẵn sàng giao hàng/lấy hàng
  | 'picked_up'        // Đã lấy hàng (cho delivery)
  | 'in_transit'       // Đang giao hàng
  | 'delivered'        // Đã giao hàng
  | 'completed'        // Hoàn thành
  | 'cancelled'        // Đã hủy
  | 'refunded';        // Đã hoàn tiền

export type PaymentStatus = 
  | 'pending'          // Chờ thanh toán
  | 'processing'       // Đang xử lý
  | 'paid'            // Đã thanh toán
  | 'failed'          // Thanh toán thất bại
  | 'cancelled'       // Đã hủy
  | 'refunded'        // Đã hoàn tiền
  | 'partial_refund'; // Hoàn tiền một phần

export type PaymentMethod = 
  | 'cash'            // Tiền mặt
  | 'credit_card'     // Thẻ tín dụng
  | 'debit_card'      // Thẻ ghi nợ
  | 'bank_transfer'   // Chuyển khoản ngân hàng
  | 'momo'           // MoMo
  | 'zalopay'        // ZaloPay
  | 'vnpay'          // VNPay
  | 'shopee_pay'     // ShopeePay
  | 'grab_pay';      // GrabPay

// Order creation and management
export interface CreateOrderRequest {
  items: CartItem[];
  deliveryType: 'delivery' | 'pickup';
  addressId?: string; // for delivery
  pickupLocationId?: string; // for pickup
  paymentMethod: PaymentMethod;
  specialInstructions?: string;
  couponCode?: string;
  loyaltyPointsUsed?: number;
}

export interface OrderTrackingInfo {
  order: Order;
  currentStatus: OrderStatus;
  estimatedDeliveryTime?: Date;
  driver?: DriverInfo;
  timeline: OrderTimeline[];
  canCancel: boolean;
  canReorder: boolean;
  canRate: boolean;
}

// Order search and filtering
export interface OrderFilters {
  status?: OrderStatus[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  paymentMethod?: PaymentMethod[];
  deliveryType?: ('delivery' | 'pickup')[];
  minAmount?: number;
  maxAmount?: number;
}

export interface OrderSearchResult {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  filters: OrderFilters;
}

// Order rating and feedback
export interface OrderRating {
  orderId: string;
  overallRating: number; // 1-5
  foodRating: number; // 1-5
  deliveryRating: number; // 1-5
  serviceRating: number; // 1-5
  comment?: string;
  images?: string[];
  wouldRecommend: boolean;
  createdAt: Date;
}

// Reorder functionality
export interface ReorderRequest {
  originalOrderId: string;
  items?: OrderItem[]; // Modified items, if empty use original
  deliveryType?: 'delivery' | 'pickup';
  addressId?: string;
  paymentMethod?: PaymentMethod;
}