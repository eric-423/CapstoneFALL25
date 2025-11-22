import { useEffect, useRef, useState } from 'react';

import websocketService from '@/utils/services/websocket.service';
import { getAuthToken } from '@/utils/cookies.client';

export interface ShipperLocationUpdate {
  orderId: number;
  shipperId?: number;
  shipperName?: string;
  latitude: number;
  longitude: number;
  timestamp?: string;
  customerAddress?: string;
  message?: string;
  [key: string]: unknown;
}

interface UseShipperLocationOptions {
  enabled?: boolean;
}

const parseCoordinate = (value: unknown): number | null => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

export const useShipperLocationForCustomer = (
  orderId?: number,
  options: UseShipperLocationOptions = {},
) => {
  const { enabled = true } = options;
  const [shipperLocation, setShipperLocation] = useState<ShipperLocationUpdate | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !enabled || !orderId) {
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
        unsubscribeRef.current = websocketService.subscribe<ShipperLocationUpdate>(
          `/topic/order/${orderId}/location`,
          (message) => {
            const normalizedLatitude = parseCoordinate(message?.latitude);
            const normalizedLongitude = parseCoordinate(message?.longitude);

            setShipperLocation({
              ...message,
              latitude: normalizedLatitude ?? 0,
              longitude: normalizedLongitude ?? 0,
            });
          },
        );
      } catch (err) {
        console.error('[useShipperLocationForCustomer] Lỗi WebSocket:', err);
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
    };
  }, [orderId, enabled]);

  return { shipperLocation, isConnected, error };
};

export default useShipperLocationForCustomer;

