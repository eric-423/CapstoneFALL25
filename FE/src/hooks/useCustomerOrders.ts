import { cancelOrder, GET_CUSTOMER_ORDER_QUERY_KEY, getCustomerOrders } from '@/apis/order.api';
import { OrderResponse } from '@/types/order.type';
import { OrderProductResponse } from '@/types/product.type';
import { OrderStatus } from '@/utils/enum';
import { getTotalItems } from '@/utils/getTotalItems';
import { STORE_INFO } from '@/utils/mockupData';

import { useEffect, useState } from 'react';

import useAuth from './useAuth';

import { useMutation, useQuery } from '@tanstack/react-query';

interface RawOrderItem {
  productId: number;
  productName: string;
  orderId: number;
  quantity: number;
  price: number;
  note: string;
  feedback: string | null;
  feedbackPoint: number;
  expiredFeedbackTime: string | null;
  productImg: string;
  feedBackYet: boolean;
}

interface RawOrder {
  id: number;
  subTotal: number;
  promotionCode: string | null;
  discountValue: number;
  discountPercent: number;
  amount: number;
  shippingFee: number;
  isPickUp: boolean;
  delivery_at: string | null;
  orderStatus: string;
  note: string;
  payment_code: string;
  address: string | null;
  phone: string;
  pointUsed: number;
  pointEarned: number;
  createdAt: string;
  orderItems: RawOrderItem[];
  pickupTime: string;
  customerDTO: any | null; // Replace `any` with the actual customer interface if available
}

export const useCustomerOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const { data: fetchedOrders, isLoading: isLoadingOrders } = useQuery({
    queryKey: [GET_CUSTOMER_ORDER_QUERY_KEY],
    queryFn: () => getCustomerOrders(user?.id || 0),
    select: (data) => data.data.content.reverse(),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const { mutate: cancelOrderMutation, isPending: isCancelingOrder } = useMutation({
    mutationFn: (orderId: number) => cancelOrder(orderId, user?.id || 0),
  });

  const filterOrders = (order: RawOrder) => {
    const items = order.orderItems.map(
      (item: RawOrderItem) =>
        ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
          note: item.note,
          feedback: item.feedback,
        }) as OrderProductResponse,
    );
    return {
      id: order.id,
      date: new Date(order.createdAt),
      restaurant: STORE_INFO.name,
      items,
      totalItems: getTotalItems(items),
      customerName: order.customerDTO?.fullName || 'Khách hàng',
      customerPhone: order.phone,
      subTotal: order.subTotal,
      paymentStatus: order.orderStatus === OrderStatus.UNPAID ? OrderStatus.UNPAID : OrderStatus.PAID,
      orderStatus: order.orderStatus,
      rated: items.some((item) => item.feedback !== null),
      payment_code: order.payment_code,
      pickupTime: order?.pickupTime,
    } as OrderResponse;
  };

  useEffect(() => {
    if (fetchedOrders) {
      const formattedOrders = fetchedOrders.map((order: RawOrder) => filterOrders(order));
      setOrders(formattedOrders);
    }
  }, [fetchedOrders]);

  return { orders, isLoadingOrders, cancelOrderMutation, isCancelingOrder };
};
