import { useEffect, useRef, useState } from 'react';

import websocketService from '@/utils/services/websocket.service';
import type { OrderLocationMessage } from '@/utils/services/websocket.service';
import { getAuthToken } from '@/utils/cookies.client';


export interface CustomerOrderStatusUpdate {
  orderId: number;
  status?: string;
  statusName?: string;
  timestamp?: string;
  message?: string;
  [key: string]: unknown;
}

interface UseCustomerOrderSocketParams {
  customerId?: number;
  orderId?: number;
  enabled?: boolean;
}

export const useCustomerOrderSocket = ({
  customerId,
  orderId,
  enabled = true,
}: UseCustomerOrderSocketParams) => {
  const [orderStatus, setOrderStatus] = useState<CustomerOrderStatusUpdate | null>(null);
  const [orderLocation, setOrderLocation] = useState<OrderLocationMessage | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !enabled || (!customerId && !orderId)) {
      setIsConnected(false);
      return;
    }

    let isMounted = true;

    const connect = async () => {
      try {
        const token = getAuthToken();
        await websocketService.connect(token);
        if (!isMounted) return;

        setIsConnected(true);
        const unsubs: Array<() => void> = [];

        if (orderId) {
          const statusDestination = `/topic/order/${orderId}/status`;
          const locationDestination = `/topic/order/${orderId}/location`;

          unsubs.push(
            websocketService.subscribe<CustomerOrderStatusUpdate>(statusDestination, (message) => {
              console.log('[useCustomerOrderSocket] 📦 Order Status Update:', {
                orderId,
                destination: statusDestination,
                message,
                timestamp: new Date().toISOString(),
              });
              setOrderStatus(message);
            }),
          );

          unsubs.push(
            websocketService.subscribe<OrderLocationMessage>(locationDestination, (message) => {
              console.log('[useCustomerOrderSocket] 📍 Order Location Update:', {
                orderId,
                destination: locationDestination,
                message,
                timestamp: new Date().toISOString(),
              });
              setOrderLocation(message);
            }),
          );
        } else if (customerId) {
          const customerDestination = `/topic/customer/${customerId}/orders`;
          unsubs.push(
            websocketService.subscribe<CustomerOrderStatusUpdate>(customerDestination, (message) => {
              console.log('[useCustomerOrderSocket] 👤 Customer Orders Update:', {
                customerId,
                destination: customerDestination,
                message,
                timestamp: new Date().toISOString(),
              });
              setOrderStatus(message);
            }),
          );
          setOrderLocation(null);
        }

        unsubscribeRef.current = () => {
          unsubs.forEach((unsubscribe) => unsubscribe());
        };
      } catch (err) {
        console.error('[useCustomerOrderSocket] Lỗi WebSocket:', err);
        if (!isMounted) return;
        setError(err instanceof Error ? err : new Error('Không thể kết nối WebSocket.'));
        setIsConnected(false);
      }
    };

    connect();

    return () => {
      isMounted = false;
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      setIsConnected(false);
      setOrderLocation(null);
    };
  }, [customerId, orderId, enabled]);

  return { orderStatus, orderLocation, isConnected, error };
};

export default useCustomerOrderSocket;

