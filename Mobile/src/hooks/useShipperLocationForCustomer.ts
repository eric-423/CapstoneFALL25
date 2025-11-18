import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import WebSocketService from "@/services/WebSocketService";

export interface ShipperLocationPayload {
  orderId: number;
  shipperId: number;
  shipperName: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  customerAddress: string;
}

export const useShipperLocationForCustomer = (orderId?: number) => {
  const [shipperLocation, setShipperLocation] =
    useState<ShipperLocationPayload | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let isMounted = true;

    const connect = async () => {
      if (!orderId) return;
      try {
        const token = await AsyncStorage.getItem("access_token");
        await WebSocketService.connect(token);
        if (!isMounted) {
          return;
        }
        setIsConnected(true);
        unsubscribe = WebSocketService.subscribe(
          `/topic/order/${orderId}/location`,
          (message) => {
            setShipperLocation(message);
          }
        );
      } catch (err: any) {
        console.error("WebSocket connection error:", err);
        if (isMounted) {
          setError(
            err?.message || "Không thể kết nối WebSocket. Vui lòng thử lại."
          );
          setIsConnected(false);
        }
      }
    };

    connect();

    return () => {
      isMounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
      WebSocketService.disconnect();
    };
  }, [orderId]);

  return { shipperLocation, isConnected, error };
};
