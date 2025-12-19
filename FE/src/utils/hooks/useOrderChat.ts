import { useEffect, useRef, useState } from "react";

import websocketService from "@/utils/services/websocket.service";


export interface OrderChatMessage {
  id?: number;
  orderId: number;
  content: string;
  senderId?: number;
  senderName?: string;
  sendTime?: string;
}

interface UseOrderChatOptions {
  orderId?: number;
  enabled?: boolean;
}

export function useOrderChat({ orderId, enabled = true }: UseOrderChatOptions) {
  const [messages, setMessages] = useState<OrderChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {

    if (typeof window === "undefined" || !orderId || !enabled) {
      setIsConnected(false);
      return;
    }

    let isMounted = true;

    const getToken = async () => {
      try {
        const getToken = await fetch('/api/auth/me/getToken', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await getToken.json().catch(() => null);
        return data?.token ?? null;
      } catch (error) {
        console.log('Failed to fetch JWT token for Order Chat:', error);
        return null;
      }
    };

    const connect = async () => {
      try {
        try {
          const response = await fetch(`/api/orders/${orderId}/chat-messages`, {
            method: "GET",
            credentials: "include",
          });

          if (response.ok) {
            const result = await response.json();
            const history: OrderChatMessage[] =
              (result?.data as OrderChatMessage[]) ?? [];
            if (Array.isArray(history) && history.length > 0) {
              setMessages(history);
            }
          } else {
            console.warn(
              "[useOrderChat] Không thể tải lịch sử chat:",
              response.status,
            );
          }
        } catch (historyError) {
          console.warn(
            "[useOrderChat] Lỗi khi tải lịch sử chat:",
            historyError,
          );
        }

        const token = await getToken();
        await websocketService.connect(token || undefined);
        if (!isMounted) return;

        setIsConnected(true);
        const destination = `/topic/order/${orderId}/chat`;

        const unsubscribe = websocketService.subscribe<OrderChatMessage>(
          destination,
          (message) => {
            setMessages((prev) => [...prev, message]);
          },
        );

        unsubscribeRef.current = () => {
          unsubscribe();
        };
      } catch (err) {
        console.error("[useOrderChat] WebSocket error:", err);
        if (!isMounted) return;
        setError(
          err instanceof Error
            ? err
            : new Error("Không thể kết nối WebSocket chat."),
        );
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

  const sendMessage = async (content: string) => {
    if (!orderId || !content.trim()) return;
    if (!websocketService.isConnected()) {
      setError(new Error("WebSocket chưa kết nối."));
      return;
    }

    setIsSending(true);
    try {
      const payload = {
        orderId,
        content: content.trim(),
      };
      websocketService.send("/chat/order", payload);
    } catch (err) {
      console.error("[useOrderChat] sendMessage error:", err);
      setError(
        err instanceof Error
          ? err
          : new Error("Không thể gửi tin nhắn. Vui lòng thử lại."),
      );
    } finally {
      setIsSending(false);
    }
  };

  return {
    messages,
    isConnected,
    isSending,
    error,
    sendMessage,
  };
}

export default useOrderChat;


