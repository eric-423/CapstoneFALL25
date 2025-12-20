import { wsBaseURL, wsEndpoint } from '@/utils/configs/environment';

import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const removeTrailingSlash = (value?: string) => (value ? value.replace(/\/+$/, '') : '');
const ensureLeadingSlash = (value?: string) => {
  if (!value) return '/ws';
  return value.startsWith('/') ? value : `/${value}`;
};

export interface OrderStatusMessage {
  orderId: number;
  status?: string;
  statusName?: string;
  timestamp?: string;
  message?: string;
  [key: string]: unknown;
}

export interface OrderLocationMessage {
  orderId: number;
  latitude: number;
  longitude: number;
  timestamp?: string;
  customerAddress?: string;
  shipperId?: number;
  shipperName?: string;
  [key: string]: unknown;
}

class WebSocketService {
  private client: Client | null = null;
  private connectingPromise: Promise<void> | null = null;
  private activeSubscriptions = 0;
  private readonly socketBaseUrl: string;
  private readonly debugEnabled = process.env.NODE_ENV !== 'production';
  private readonly transports = ['websocket', 'xhr-streaming', 'xhr-polling'];

  constructor() {
    this.socketBaseUrl = this.buildSocketBaseUrl();
  }

  private buildSocketBaseUrl(): string {
    const base = removeTrailingSlash(wsBaseURL);
    const path = ensureLeadingSlash(wsEndpoint);

    return base ? `${base}${path}` : '';
  }

  private buildSocketUrl(token?: string): string {
    if (!this.socketBaseUrl) return '';
    if (!token) return this.socketBaseUrl;

    const hasQuery = this.socketBaseUrl.includes('?');
    const delimiter = hasQuery ? '&' : '?';
    return `${this.socketBaseUrl}${delimiter}token=${encodeURIComponent(token)}`;
  }

  private ensureBrowser() {
    if (typeof window === 'undefined') {
      throw new Error('WebSocket chỉ khả dụng ở môi trường trình duyệt.');
    }
  }

  async connect(token?: string): Promise<void> {
    this.ensureBrowser();

    if (!this.socketBaseUrl) {
      throw new Error('Chưa cấu hình WS base URL (NEXT_PUBLIC_WS_BASE_URL).');
    }

    if (this.client?.connected) {
      return;
    }

    if (this.connectingPromise) {
      return this.connectingPromise;
    }

    const socketUrl = this.buildSocketUrl(token);
    if (!socketUrl) {
      throw new Error('Không thể xây dựng URL kết nối WebSocket.');
    }


    this.connectingPromise = new Promise((resolve, reject) => {
      this.client = new Client({
        webSocketFactory: () => this.createSocket(socketUrl),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        connectHeaders: token
          ? {
            Authorization: `Bearer ${token}`,
          }
          : {},
        onConnect: () => {
          this.connectingPromise = null;
          resolve();
        },
        onStompError: (frame) => {
          this.connectingPromise = null;
          this.teardownClient();
          reject(new Error(frame.headers['message'] || 'Không thể kết nối.'));
        },
      });

      this.client.activate();
    });

    return this.connectingPromise;
  }

  private createSocket(url: string) {
    const socket = new SockJS(url, null, {
      transports: this.transports,
    });
    return socket;
  }


  private teardownClient() {
    this.activeSubscriptions = 0;
    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }
  }

  disconnect() {
    this.connectingPromise = null;
    this.teardownClient();
  }

  subscribe<T = unknown>(destination: string, callback: (message: T) => void): () => void {
    if (!this.client || !this.client.connected) {
      throw new Error('WebSocket chưa kết nối.');
    }

    const subscription: StompSubscription = this.client.subscribe(destination, (message: IMessage) => {
      let payload: unknown = message.body;
      if (message.body) {
        try {
          payload = JSON.parse(message.body);
        } catch {
        }
      }

      callback(payload as T);
    });

    this.activeSubscriptions += 1;

    return () => {
      subscription.unsubscribe();
      this.activeSubscriptions = Math.max(0, this.activeSubscriptions - 1);
      if (this.activeSubscriptions === 0) {
        this.disconnect();
      }
    };
  }

  subscribeToOrderStatus(orderId: number, callback: (message: OrderStatusMessage) => void) {
    return this.subscribe<OrderStatusMessage>(`/topic/order/${orderId}/status`, callback);
  }

  subscribeToOrderLocation(orderId: number, callback: (message: OrderLocationMessage) => void) {
    return this.subscribe<OrderLocationMessage>(`/topic/order/${orderId}/location`, callback);
  }

  sendShipperLocationUpdate(payload: {
    orderId: number;
    latitude: number;
    longitude: number;
  }) {
    this.send('/shipper/location', payload);
  }

  send(destination: string, body: unknown) {
    if (!this.client || !this.client.connected) {
      throw new Error('WebSocket chưa kết nối.');
    }

    const finalDestination = destination.startsWith('/app') ? destination : `/app${destination}`;

    this.client.publish({
      destination: finalDestination,
      body: JSON.stringify(body),
    });
  }

  isConnected() {
    return Boolean(this.client?.connected);
  }

  hasActiveSubscriptions() {
    return this.activeSubscriptions > 0;
  }
}

const websocketService = new WebSocketService();

export default websocketService;

