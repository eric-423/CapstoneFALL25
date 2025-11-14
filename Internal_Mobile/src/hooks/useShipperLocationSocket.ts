import { useCurrentApp } from "@/context/app.context";
import { sendShipperLocation } from "@/utils/api";
import { useCallback, useEffect, useState } from "react";
import WebSocketService from "../service/WebSocketService";

interface LocationUpdate {
  orderId: number;
  latitude: number;
  longitude: number;
}

export const useShipperLocationSocket = (orderId: number) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionMode, setConnectionMode] = useState<
    "websocket" | "http" | "none"
  >("none");
  const { appState } = useCurrentApp();

  useEffect(() => {
    if (!orderId || !appState?.token) {
      return;
    }

    let isMounted = true;
    let connectionAttempted = false;

    const connect = async () => {
      if (connectionAttempted) {
        return;
      }
      connectionAttempted = true;

      try {
        const token = appState.token;
        await WebSocketService.connect(token);

        if (!isMounted) {
          return;
        }

        if (WebSocketService.isConnected()) {
          setIsConnected(true);
          setConnectionMode("websocket");
        } else {
          throw new Error(
            "WebSocket connected but isConnected() returns false"
          );
        }
      } catch (error: any) {
        if (isMounted) {
          setIsConnected(true);
          setConnectionMode("http");
        }
      }
    };

    connect();

    return () => {
      isMounted = false;
      connectionAttempted = false;
      if (connectionMode === "websocket") {
        WebSocketService.disconnect();
      }
      setConnectionMode("none");
      setIsConnected(false);
    };
  }, [orderId, appState?.token]);

  const sendLocationUpdate = useCallback(
    async (update: LocationUpdate) => {
      if (!appState?.token) {
        console.error("No token available");
        return;
      }
      if (
        !update.orderId ||
        update.latitude === undefined ||
        update.longitude === undefined ||
        isNaN(update.latitude) ||
        isNaN(update.longitude)
      ) {
        console.error("Invalid location update data:", update);
        return;
      }
      try {
        if (connectionMode === "websocket" && WebSocketService.isConnected()) {
          WebSocketService.send("/shipper/location", update);
        } else {
          await sendShipperLocation(appState.token, update);
        }
      } catch (error: any) {
        if (error?.response?.status === 500) {
          return;
        }

        if (error?.response) {
          console.error("Error sending location:", {
            status: error.response.status,
            data: error.response.data,
            message: error.message,
          });
        } else {
          console.error("Error sending location:", error);
        }
      }
    },
    [appState?.token, connectionMode]
  );

  return {
    isConnected,
    sendLocationUpdate,
    connectionMode,
  };
};
