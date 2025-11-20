import { cancelOrder, GET_CUSTOMER_ORDER_QUERY_KEY, getCustomerOrders, OrderResponse } from '@/apis/order.api';
import { OrderProductResponse } from '@/apis/product.api';
import { OrderStatus } from '@/utils/enum';
import { getTotalItems } from '@/utils/getTotalItems';
import { STORE_INFO } from '@/utils/mockupData';

import { useEffect, useState } from 'react';

import useAuth from './useAuth';
import { CustomerOrderStatusUpdate, useCustomerOrderSocket } from './useCustomerOrderSocket';

import { useMutation, useQuery } from '@tanstack/react-query';

interface RawOrderItem {
  productId?: number;
  product_id?: number;
  productName?: string;
  name?: string;
  orderId?: number;
  quantity?: number;
  qty?: number;
  price?: number;
  amount?: number;
  note?: string;
  feedback?: string | null;
  feedbackPoint?: number;
  expiredFeedbackTime?: string | null;
  productImg?: string;
  feedBackYet?: boolean;
}

interface RawOrder {
  id: number;
  subTotal?: number;
  promotionCode?: string | null;
  discountValue?: number;
  discountPercent?: number;
  amount?: number;
  shippingFee?: number;
  isPickUp?: boolean;
  pickUp?: boolean;
  delivery_at?: string | null;
  deliveryAt?: string | null;
  orderStatus: string;
  note?: string;
  payment_code?: string;
  paymentCode?: string;
  address?: string | null;
  branchName?: string;
  branchAddress?: string;
  phone?: string;
  customerPhone?: string;
  pointUsed?: number;
  pointEarned?: number;
  createdAt?: string;
  orderDate?: string;
  paymentTime?: string | null;
  pickupTime?: string;
  orderItems?: RawOrderItem[];
  orderItemList?: RawOrderItem[];
  items?: RawOrderItem[];
  itemCount?: number;
  table?: boolean;
  shipperName?: string | null;
  waiterName?: string | null;
  chefName?: string | null;
  customerDTO?: {
    id: number;
    fullName: string;
    email: string;
    phone: string;
  } | null;
  customerName?: string;
}

interface UseCustomerOrdersOptions {
  realtime?: boolean;
  initialStatus?: CustomerOrderStatus;
}

export const CUSTOMER_ORDER_STATUSES = [
  'ALL',
  'CREATED',
  'COOKING',
  'COOKED',
  'IN_PROCESS',
  'SHIPPING',
  'DELIVERED',
  'COMPLETED',
  'CANCEL',
  'PAID',
] as const;

export type CustomerOrderStatus = (typeof CUSTOMER_ORDER_STATUSES)[number];

const extractOrdersFromResponse = (response: unknown): RawOrder[] => {
  if (!response || typeof response !== 'object') {
    return [];
  }

  const candidates = [
    (response as { data?: { content?: RawOrder[] } }).data?.content,
    (response as { data?: RawOrder[] }).data,
    (response as { content?: RawOrder[] }).content,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate as RawOrder[];
    }
  }

  if (Array.isArray(response)) {
    return response as RawOrder[];
  }

  return [];
};

const resolveOrderItems = (order: RawOrder): RawOrderItem[] => {
  if (Array.isArray(order.orderItems)) {
    return order.orderItems;
  }
  if (Array.isArray(order.items)) {
    return order.items;
  }
  if (Array.isArray(order.orderItemList)) {
    return order.orderItemList;
  }
  return [];
};

const normalizeOrder = (order: RawOrder): OrderResponse => {
  const rawItems = resolveOrderItems(order);
  const items = rawItems
    .map(
      (item: RawOrderItem) =>
        ({
          productId: item.productId ?? item.product_id ?? 0,
          productName: item.productName ?? item.name ?? 'Sản phẩm',
          quantity: item.quantity ?? item.qty ?? 0,
          price: item.price ?? item.amount ?? 0,
          note: item.note ?? '',
          feedback: item.feedback ?? undefined,
        }) as OrderProductResponse,
    )
    .filter((item) => item.productName);

  const orderDate =
    order.createdAt ||
    order.orderDate ||
    order.paymentTime ||
    order.deliveryAt ||
    order.delivery_at ||
    order.pickupTime ||
    new Date().toISOString();

  const pickupTime = order.pickupTime || order.deliveryAt || order.delivery_at || orderDate;

  const subTotal =
    typeof order.subTotal === 'number'
      ? order.subTotal
      : typeof order.amount === 'number'
        ? order.amount
        : 0;

  const customerName = order.customerDTO?.fullName || order.customerName || 'Khách hàng';
  const customerPhone = order.customerDTO?.phone || order.customerPhone || order.phone || '';
  const address = order.address ?? null;

  const branchName = order.branchName || STORE_INFO.name;
  const branchAddress = order.branchAddress || STORE_INFO.address;

  const shippingFee = typeof order.shippingFee === 'number' ? order.shippingFee : 0;
  const discountValue = typeof order.discountValue === 'number' ? order.discountValue : 0;
  const amount =
    typeof order.amount === 'number'
      ? order.amount
      : subTotal + shippingFee - discountValue;
  const promotionCode = order.promotionCode ?? '';
  const pointUsed = typeof order.pointUsed === 'number' ? order.pointUsed : 0;
  const pointEarned = typeof order.pointEarned === 'number' ? order.pointEarned : 0;

  const normalizedStatus = order.orderStatus?.toString().toUpperCase() || 'CREATED';

  const totalItems = items.length > 0 ? getTotalItems(items) : order.itemCount ?? 0;

  return {
    id: order.id,
    date: new Date(orderDate),
    restaurant: branchName,
    branchName,
    branchAddress,
    address,
    items,
    totalItems,
    customerName,
    customerPhone,
    subTotal,
    shippingFee,
    discountValue,
    amount,
    promotionCode,
    pointUsed,
    pointEarned,
    shipperName: order.shipperName ?? null,
    waiterName: order.waiterName ?? null,
    chefName: order.chefName ?? null,
    paymentStatus: normalizedStatus === 'UNPAID' ? 'UNPAID' : normalizedStatus === 'PAID' ? 'PAID' : 'PAID',
    orderStatus: normalizedStatus,
    rated: items.some((item) => item.feedback !== null && item.feedback !== undefined),
    payment_code: order.payment_code || order.paymentCode || '',
    pickupTime,
    orderDate: order.orderDate || orderDate,
    paymentTime: order.paymentTime ?? null,
    deliveryAt: order.deliveryAt || order.delivery_at || null,
  } as OrderResponse;
};

export const useCustomerOrders = ({ realtime = false, initialStatus = 'ALL' }: UseCustomerOrdersOptions = {}) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [lastRealtimeUpdate, setLastRealtimeUpdate] = useState<CustomerOrderStatusUpdate | null>(null);
  const [statusFilter, setStatusFilter] = useState<CustomerOrderStatus>(initialStatus);
  const [totalOrdersCount, setTotalOrdersCount] = useState<number>(0);

  const normalizedStatus = statusFilter === 'ALL' ? undefined : statusFilter;

  const {
    data: fetchedOrders,
    isLoading: isLoadingOrders,
    isFetching: isFetchingOrders,
    refetch,
  } = useQuery({
    queryKey: [GET_CUSTOMER_ORDER_QUERY_KEY, normalizedStatus],
    queryFn: async () => {
      const response = await getCustomerOrders(normalizedStatus);
      const rawOrders = extractOrdersFromResponse(response);
      return [...rawOrders].reverse();
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const { mutate: cancelOrderMutation, isPending: isCancelingOrder } = useMutation({
    mutationFn: (orderId: number) => cancelOrder(orderId, user?.id || 0),
  });

  const { orderStatus: realtimeOrderStatus, isConnected: isRealtimeConnected } = useCustomerOrderSocket({
    customerId: user?.id,
    enabled: realtime && Boolean(user?.id),
  });

  useEffect(() => {
    if (!fetchedOrders) {
      return;
    }

    const formattedOrders = fetchedOrders.map((order: RawOrder) => normalizeOrder(order));
    setOrders(formattedOrders);

    if (statusFilter === 'ALL') {
      setTotalOrdersCount(formattedOrders.length);
    }
  }, [fetchedOrders, statusFilter]);

  useEffect(() => {
    if (!realtimeOrderStatus) return;

    const normalizedStatus = realtimeOrderStatus.status || realtimeOrderStatus.statusName;
    if (!normalizedStatus) return;

    setLastRealtimeUpdate(realtimeOrderStatus);

    setOrders((prev) => {
      const index = prev.findIndex((order) => order.id === realtimeOrderStatus.orderId);
      if (index === -1) {
        return prev;
      }

      const updatedOrder = {
        ...prev[index],
        orderStatus: normalizedStatus as OrderStatus,
      };

      const next = [...prev];
      next[index] = updatedOrder;
      return next;
    });
  }, [realtimeOrderStatus]);

  return {
    orders,
    statusFilter,
    setStatusFilter,
    statusOptions: CUSTOMER_ORDER_STATUSES,
    totalOrdersCount,
    isLoadingOrders,
    isFetchingOrders,
    refetchOrders: refetch,
    cancelOrderMutation,
    isCancelingOrder,
    realtimeStatus: lastRealtimeUpdate,
    isRealtimeConnected,
  };
};
