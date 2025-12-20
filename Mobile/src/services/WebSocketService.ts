import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { BASE_URL } from "@/utils/constant";

const WS_BASE_URL = BASE_URL;

class WebSocketService {
  private client: Client | null = null;
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  connect(token?: string | null): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.client?.connected) {
        resolve();
        return;
      }

      const wsUrl = token
        ? `${this.baseUrl}/ws?token=${encodeURIComponent(token)}`
        : `${this.baseUrl}/ws`;

      this.client = new Client({
        webSocketFactory: () => {
          const socket = new SockJS(wsUrl, null, {
            transports: ["websocket", "xhr-streaming", "xhr-polling"],
          });
          return socket as any;
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 0,
        heartbeatOutgoing: 0,
        connectHeaders: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
        onConnect: () => {
          console.log("WebSocket connected");
          resolve();
        },
        onStompError: (frame) => {
          console.error("STOMP error:", frame);
          reject(new Error(frame.headers["message"] || "Connection failed"));
        },
        onWebSocketClose: () => {
          console.log("WebSocket disconnected");
        },
      });

      this.client.activate();
    });
  }

  disconnect(): void {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }
  }

  subscribe(destination: string, callback: (message: any) => void): () => void {
    if (!this.client || !this.client.connected) {
      throw new Error("WebSocket not connected");
    }

    const subscription = this.client.subscribe(
      destination,
      (message: IMessage) => {
        try {
          const data = JSON.parse(message.body);
          callback(data);
        } catch (error) {
          console.error("Error parsing message:", error);
          callback(message.body);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }

  send(destination: string, body: any): void {
    if (!this.client || !this.client.connected) {
      throw new Error("WebSocket not connected");
    }

    this.client.publish({
      destination: `/app${destination}`,
      body: JSON.stringify(body),
    });
  }

  isConnected(): boolean {
    return !!this.client?.connected;
  }
}

const webSocketService = new WebSocketService(WS_BASE_URL);

export default webSocketService;
