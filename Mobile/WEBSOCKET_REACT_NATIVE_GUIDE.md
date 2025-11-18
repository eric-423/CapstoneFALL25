# Hướng dẫn kết nối WebSocket cho React Native

## Cấu hình WebSocket hiện tại

### Backend Configuration

- **WebSocket Endpoint**: `ws://your-server:port/ws` hoặc `wss://your-server:port/ws` (HTTPS)
- **Message Broker**: `/topic` (nhận messages từ server)
- **Application Destination**: `/app` (gửi messages tới server)
- **SockJS Support**: Có hỗ trợ SockJS fallback

### Các Topic hiện có:

1. **Shipper Location** (Đã có):

   - Gửi: `/app/shipper/location`
   - Nhận: `/topic/order/{orderId}/location`

2. **Customer Order Status** (Cần thêm):
   - Nhận: `/topic/customer/{customerId}/orders` hoặc `/topic/order/{orderId}/status`

## Cài đặt cho React Native

### 1. Cài đặt thư viện

```bash
npm install @stomp/stompjs sockjs-client
# hoặc
yarn add @stomp/stompjs sockjs-client
```

### 2. Tạo WebSocket Service

```typescript
// services/WebSocketService.ts
import { Client, IMessage } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

class WebSocketService {
  private client: Client | null = null
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  // Kết nối WebSocket
  connect(token?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client = new Client({
        webSocketFactory: () => {
          const socket = new SockJS(`${this.baseUrl}/ws`)
          return socket as any
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          console.log('WebSocket Connected')
          resolve()
        },
        onStompError: (frame) => {
          console.error('STOMP Error:', frame)
          reject(new Error(frame.headers['message'] || 'Connection failed'))
        },
        onWebSocketClose: () => {
          console.log('WebSocket Disconnected')
        },
        // Thêm token vào header nếu có
        connectHeaders: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      })

      this.client.activate()
    })
  }

  // Ngắt kết nối
  disconnect(): void {
    if (this.client) {
      this.client.deactivate()
      this.client = null
    }
  }

  // Subscribe để nhận messages
  subscribe(
    destination: string,
    callback: (message: IMessage) => void
  ): () => void {
    if (!this.client || !this.client.connected) {
      throw new Error('WebSocket not connected')
    }

    const subscription = this.client.subscribe(destination, (message) => {
      try {
        const data = JSON.parse(message.body)
        callback(data)
      } catch (error) {
        console.error('Error parsing message:', error)
        callback(message)
      }
    })

    // Trả về function để unsubscribe
    return () => {
      subscription.unsubscribe()
    }
  }

  // Gửi message
  send(destination: string, body: any): void {
    if (!this.client || !this.client.connected) {
      throw new Error('WebSocket not connected')
    }

    this.client.publish({
      destination: `/app${destination}`,
      body: JSON.stringify(body),
    })
  }

  // Kiểm tra trạng thái kết nối
  isConnected(): boolean {
    return this.client?.connected || false
  }
}

// Production URL
export default new WebSocketService('https://tam-tac.com')

// Development URL (nếu test local)
// export default new WebSocketService('http://localhost:8080')
```

## Sử dụng cho Customer

### 1. Subscribe Order Status Updates

```typescript
// hooks/useCustomerOrderSocket.ts
import { useEffect, useState } from 'react'
import WebSocketService from '../services/WebSocketService'

interface OrderStatusUpdate {
  orderId: number
  status: string
  statusName: string
  timestamp: string
  message?: string
}

export const useCustomerOrderSocket = (
  customerId: number,
  orderId?: number
) => {
  const [orderStatus, setOrderStatus] = useState<OrderStatusUpdate | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Kết nối WebSocket
    const connect = async () => {
      try {
        const token = await getAuthToken() // Lấy token từ storage
        await WebSocketService.connect(token)
        setIsConnected(true)

        // Subscribe theo orderId cụ thể
        if (orderId) {
          const unsubscribe = WebSocketService.subscribe(
            `/topic/order/${orderId}/status`,
            (message: OrderStatusUpdate) => {
              console.log('Order status update:', message)
              setOrderStatus(message)
            }
          )

          return () => {
            unsubscribe()
            WebSocketService.disconnect()
          }
        }

        // Hoặc subscribe tất cả orders của customer
        const unsubscribe = WebSocketService.subscribe(
          `/topic/customer/${customerId}/orders`,
          (message: OrderStatusUpdate) => {
            console.log('Order status update:', message)
            setOrderStatus(message)
          }
        )

        return () => {
          unsubscribe()
          WebSocketService.disconnect()
        }
      } catch (error) {
        console.error('WebSocket connection error:', error)
        setIsConnected(false)
      }
    }

    const cleanup = connect()

    return () => {
      cleanup.then((fn) => fn && fn())
    }
  }, [customerId, orderId])

  return { orderStatus, isConnected }
}
```

### 2. Sử dụng trong Component

```typescript
// screens/OrderDetailScreen.tsx
import React from 'react'
import { View, Text } from 'react-native'
import { useCustomerOrderSocket } from '../hooks/useCustomerOrderSocket'

const OrderDetailScreen = ({ route }) => {
  const { orderId, customerId } = route.params
  const { orderStatus, isConnected } = useCustomerOrderSocket(
    customerId,
    orderId
  )

  return (
    <View>
      <Text>Order Status: {orderStatus?.statusName || 'Loading...'}</Text>
      {!isConnected && <Text>Đang kết nối...</Text>}
      {orderStatus?.message && <Text>{orderStatus.message}</Text>}
    </View>
  )
}
```

## Sử dụng cho Shipper

### 1. Subscribe và Gửi Location Updates

```typescript
// hooks/useShipperLocationSocket.ts
import { useEffect, useState, useCallback } from 'react'
import WebSocketService from '../services/WebSocketService'

interface LocationUpdate {
  orderId: number
  latitude: number
  longitude: number
}

interface ShipperLocation {
  orderId: number
  shipperId: number
  shipperName: string
  latitude: number
  longitude: number
  timestamp: string
  customerAddress: string
}

export const useShipperLocationSocket = (orderId: number) => {
  const [location, setLocation] = useState<ShipperLocation | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const connect = async () => {
      try {
        const token = await getAuthToken()
        await WebSocketService.connect(token)
        setIsConnected(true)

        // Subscribe để nhận location updates (nếu cần)
        const unsubscribe = WebSocketService.subscribe(
          `/topic/order/${orderId}/location`,
          (message: ShipperLocation) => {
            console.log('Location update received:', message)
            setLocation(message)
          }
        )

        return () => {
          unsubscribe()
          WebSocketService.disconnect()
        }
      } catch (error) {
        console.error('WebSocket connection error:', error)
        setIsConnected(false)
      }
    }

    const cleanup = connect()
    return () => {
      cleanup.then((fn) => fn && fn())
    }
  }, [orderId])

  // Gửi location update
  const sendLocationUpdate = useCallback((update: LocationUpdate) => {
    try {
      WebSocketService.send('/shipper/location', update)
    } catch (error) {
      console.error('Error sending location:', error)
    }
  }, [])

  return { location, isConnected, sendLocationUpdate }
}
```

### 2. Sử dụng trong Shipper App

```typescript
// screens/ShipperTrackingScreen.tsx
import React, { useEffect } from 'react'
import { View, Text, Button } from 'react-native'
import { useShipperLocationSocket } from '../hooks/useShipperLocationSocket'
import Geolocation from '@react-native-community/geolocation'

const ShipperTrackingScreen = ({ route }) => {
  const { orderId } = route.params
  const { location, isConnected, sendLocationUpdate } =
    useShipperLocationSocket(orderId)

  // Tự động gửi location mỗi 5 giây
  useEffect(() => {
    const interval = setInterval(() => {
      Geolocation.getCurrentPosition(
        (position) => {
          sendLocationUpdate({
            orderId,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (error) => console.error('Location error:', error)
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [orderId, sendLocationUpdate])

  return (
    <View>
      <Text>Tracking Order: {orderId}</Text>
      {location && (
        <View>
          <Text>Lat: {location.latitude}</Text>
          <Text>Lng: {location.longitude}</Text>
        </View>
      )}
    </View>
  )
}
```

## Customer nhận Location của Shipper

```typescript
// hooks/useShipperLocationForCustomer.ts
import { useEffect, useState } from 'react'
import WebSocketService from '../services/WebSocketService'

export const useShipperLocationForCustomer = (orderId: number) => {
  const [shipperLocation, setShipperLocation] = useState<any>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const connect = async () => {
      try {
        const token = await getAuthToken()
        await WebSocketService.connect(token)
        setIsConnected(true)

        // Customer subscribe để nhận location của shipper
        const unsubscribe = WebSocketService.subscribe(
          `/topic/order/${orderId}/location`,
          (message) => {
            console.log('Shipper location update:', message)
            setShipperLocation(message)
          }
        )

        return () => {
          unsubscribe()
          WebSocketService.disconnect()
        }
      } catch (error) {
        console.error('WebSocket connection error:', error)
        setIsConnected(false)
      }
    }

    const cleanup = connect()
    return () => {
      cleanup.then((fn) => fn && fn())
    }
  }, [orderId])

  return { shipperLocation, isConnected }
}
```

## Cần thêm vào Backend

### 1. Tạo Controller cho Customer Order Status Updates

```java
@Controller
public class OrderStatusNotificationController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // Gửi notification khi order status thay đổi
    public void notifyOrderStatusChange(int orderId, int customerId, String status) {
        OrderStatusUpdateDTO update = new OrderStatusUpdateDTO();
        update.setOrderId(orderId);
        update.setStatus(status);
        update.setTimestamp(new Date());

        // Gửi tới customer cụ thể
        messagingTemplate.convertAndSend("/topic/customer/" + customerId + "/orders", update);

        // Hoặc gửi tới order cụ thể
        messagingTemplate.convertAndSend("/topic/order/" + orderId + "/status", update);
    }
}
```

### 2. Cập nhật OrderServiceImpl

Thêm `SimpMessagingTemplate` và gọi notification khi order status thay đổi:

```java
@Autowired
private SimpMessagingTemplate messagingTemplate;

// Trong các method như assignOrderToCheff, markAsCooked, etc.
public boolean markAsCooked(int orderId) {
    // ... existing code ...

    // Gửi notification
    if (order.getCustomer() != null) {
        orderStatusNotificationController.notifyOrderStatusChange(
            orderId,
            order.getCustomer().getId(),
            "COOKED"
        );
    }

    return true;
}
```

## Tóm tắt Endpoints

### Customer:

- **Subscribe**: `/topic/customer/{customerId}/orders` hoặc `/topic/order/{orderId}/status`
- **Nhận**: Order status updates, shipper location

### Shipper:

- **Gửi**: `/app/shipper/location` (với body: `{orderId, latitude, longitude}`)
- **Nhận**: `/topic/order/{orderId}/location` (nếu cần)

### Cả hai:

- **Connect**: `ws://server:port/ws`
- **SockJS**: Hỗ trợ fallback nếu WebSocket không khả dụng
