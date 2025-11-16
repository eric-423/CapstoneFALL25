import { Client, IMessage } from "@stomp/stompjs";
import { Platform } from "react-native";
let SockJS: any = null;
try {
  SockJS = require("sockjs-client");
} catch (e) {}

class WebSocketService {
  private client: Client | null = null;
  private baseUrl: string;
  private currentToken: string | null = null;
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  connect(token?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (token) {
        this.currentToken = token;
      }
      if (this.client && this.client.connected) {
        resolve();
        return;
      }
      if (this.client) {
        this.client.deactivate();
        this.client = null;
      }
      const timeout = setTimeout(() => {
        if (this.client && !this.client.connected) {
          console.error("WebSocket connection timeout");
          this.client.deactivate();
          this.client = null;
          reject(new Error("Connection timeout"));
        }
      }, 20000);

      const baseUrlWithoutApi = this.baseUrl.replace("/api", "");
      const wsUrl = `${baseUrlWithoutApi}/ws`;

      if (!SockJS) {
        try {
          if (Platform.OS !== "web") {
          } else {
            clearTimeout(timeout);
            reject(new Error("SockJS not available"));
            return;
          }
        } catch (e) {}
      }

      if (SockJS) {
        this.client = new Client({
          webSocketFactory: () => {
            try {
              const socket = new SockJS(wsUrl, null, {
                transports: ["websocket", "xhr-streaming", "xhr-polling"],
                withCredentials: false,
              });
              return socket as any;
            } catch (error) {
              console.error("Error creating SockJS socket:", error);
              throw error;
            }
          },
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
          onConnect: (frame) => {
            clearTimeout(timeout);
            resolve();
          },
          onStompError: (frame) => {
            console.error("STOMP Error:", frame);
            clearTimeout(timeout);
            reject(new Error(frame.headers["message"] || "Connection failed"));
          },
          onWebSocketClose: (event) => {
            if (!this.client?.connected) {
              clearTimeout(timeout);
              reject(
                new Error(
                  `WebSocket closed: ${event.reason || `Code ${event.code}`}`
                )
              );
            }
          },
          onWebSocketError: (error: any) => {
            const errorMessage = error?.message || String(error);
            console.error("WebSocket Error:", errorMessage);
            clearTimeout(timeout);
            reject(new Error(errorMessage));
          },
          connectHeaders: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        });
      } else {
        const wsUrl = baseUrlWithoutApi
          .replace("https://", "wss://")
          .replace("http://", "ws://");
        let brokerURL = `${wsUrl}/ws`;
        if (token) {
          brokerURL = `${wsUrl}/ws?token=${encodeURIComponent(token)}`;
        }

        const headers: any = {};
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        this.client = new Client({
          brokerURL: brokerURL,
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
          onConnect: (frame) => {
            clearTimeout(timeout);
            resolve();
          },
          onStompError: (frame) => {
            console.error("STOMP Error:", frame);
            clearTimeout(timeout);
            reject(
              new Error(
                frame.headers["message"] || frame.body || "Connection failed"
              )
            );
          },
          onWebSocketClose: (event) => {
            if (!this.client?.connected) {
              clearTimeout(timeout);
              reject(
                new Error(
                  `WebSocket closed: ${event.reason || `Code ${event.code}`}`
                )
              );
            }
          },
          onWebSocketError: (error: any) => {
            const errorMessage = error?.message || String(error);
            console.error("WebSocket Error:", errorMessage);
            clearTimeout(timeout);
            reject(new Error(errorMessage));
          },
          connectHeaders: headers,
        });
      }

      try {
        this.client.activate();
      } catch (error) {
        clearTimeout(timeout);
        console.error("Error activating WebSocket client:", error);
        reject(error);
      }
    });
  }
  disconnect(): void {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }
  }
  subscribe(
    destination: string,
    callback: (message: IMessage) => void
  ): () => void {
    if (!this.client || !this.client.connected) {
      throw new Error("WebSocket not connected");
    }

    const subscription = this.client.subscribe(destination, (message) => {
      try {
        const data = JSON.parse(message.body);
        callback(data);
      } catch (error) {
        console.error("Error parsing message:", error);
        callback(message);
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }
  send(destination: string, body: any): void {
    if (!this.client) {
      throw new Error("WebSocket client is null");
    }

    if (!this.client.connected) {
      throw new Error("WebSocket not connected");
    }

    const fullDestination = `/app${destination}`;
    const messageBody = JSON.stringify(body);

    try {
      if (
        !body.orderId ||
        body.latitude === undefined ||
        body.longitude === undefined
      ) {
        throw new Error(
          "Invalid message body: missing orderId, latitude, or longitude"
        );
      }

      const headers: any = {};
      if (this.currentToken) {
        headers.Authorization = `Bearer ${this.currentToken}`;
      }

      this.client.publish({
        destination: fullDestination,
        body: messageBody,
        headers: headers,
      });
    } catch (error: any) {
      console.error("Error publishing WebSocket message:", error);
      throw error;
    }
  }
  isConnected(): boolean {
    return this.client?.connected || false;
  }
}

export default new WebSocketService("https://tam-tac.com");
