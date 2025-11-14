# WebSocket Setup Guide cho React Native

## Tổng quan

Server đã được cấu hình để hỗ trợ cả **SockJS** (cho web) và **Native WebSocket** (cho React Native).

## Endpoints

- **SockJS (Web)**: `https://tam-tac.com/ws` - Sử dụng SockJS client
- **Native WebSocket (React Native)**: `wss://tam-tac.com/ws` - Sử dụng native WebSocket

## Cấu hình Server (Spring Boot)

### ✅ Đã hoàn thành:

1. **WebSocketConfig**: Đã đăng ký cả SockJS và native WebSocket endpoint
2. **WebSocketHandshakeInterceptor**: Xử lý authentication và CORS cho WebSocket
3. **SockJSCorsFilter**: Xử lý CORS và WebSocket upgrade requests
4. **SecurityConfig**: Đã permitAll cho `/ws/**`

### Authentication

WebSocket hỗ trợ authentication qua:

- **Authorization header**: `Authorization: Bearer <token>`
- **Query parameter**: `?token=<token>`
- **Sec-WebSocket-Protocol header**: `Bearer <token>`

Nếu không có token, connection vẫn được cho phép (để test).

## Cấu hình Nginx (Nếu có)

Nếu bạn sử dụng Nginx làm reverse proxy, cần cấu hình như sau:

```nginx
server {
    listen 443 ssl http2;
    server_name tam-tac.com;

    # SSL configuration
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # WebSocket configuration
    location /ws {
        proxy_pass http://localhost:8080;  # Port của Spring Boot app
        proxy_http_version 1.1;

        # WebSocket upgrade headers
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # Standard proxy headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket specific headers
        proxy_set_header Sec-WebSocket-Key $http_sec_websocket_key;
        proxy_set_header Sec-WebSocket-Version $http_sec_websocket_version;
        proxy_set_header Sec-WebSocket-Protocol $http_sec_websocket_protocol;
        proxy_set_header Sec-WebSocket-Extensions $http_sec_websocket_extensions;

        # Timeouts for long-lived connections
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
        proxy_connect_timeout 60s;

        # Buffer settings
        proxy_buffering off;
    }

    # Other locations...
}
```

## Cấu hình Apache (Nếu có)

Nếu bạn sử dụng Apache, cần enable mod_proxy_wstunnel:

```apache
# Enable required modules
LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_http_module modules/mod_proxy_http.so
LoadModule proxy_wstunnel_module modules/mod_proxy_wstunnel.so

<VirtualHost *:443>
    ServerName tam-tac.com

    # SSL configuration
    SSLEngine on
    SSLCertificateFile /path/to/cert.pem
    SSLCertificateKeyFile /path/to/key.pem

    # WebSocket proxy
    ProxyPreserveHost On
    ProxyRequests Off

    # WebSocket endpoint
    RewriteEngine on
    RewriteCond %{HTTP:Upgrade} websocket [NC]
    RewriteCond %{HTTP:Connection} upgrade [NC]
    RewriteRule ^/ws(.*)$ ws://localhost:8080/ws$1 [P,L]

    # Regular HTTP proxy
    ProxyPass /ws http://localhost:8080/ws
    ProxyPassReverse /ws http://localhost:8080/ws

    # Timeouts
    ProxyTimeout 3600
</VirtualHost>
```

## Test WebSocket Connection

### 1. Test bằng curl:

```bash
# Test WebSocket upgrade request
curl -i -N \
  -H "Connection: Upgrade" \
  -H "Upgrade: websocket" \
  -H "Sec-WebSocket-Version: 13" \
  -H "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==" \
  https://tam-tac.com/ws
```

**Kết quả mong đợi:**

- HTTP/1.1 101 Switching Protocols → ✅ Server hỗ trợ WebSocket
- HTTP/1.1 404 Not Found → ❌ Endpoint chưa được cấu hình
- HTTP/1.1 502 Bad Gateway → ❌ Proxy chưa được cấu hình đúng

### 2. Test bằng HTML file:

Mở file `test-websocket-production.html` trong browser để test.

### 3. Test từ React Native:

```javascript
import { Client } from '@stomp/stompjs'

const client = new Client({
  brokerURL: 'wss://tam-tac.com/ws',
  connectHeaders: {
    Authorization: 'Bearer YOUR_JWT_TOKEN', // Optional
  },
  debug: function (str) {
    console.log('STOMP: ' + str)
  },
  reconnectDelay: 5000,
  heartbeatIncoming: 4000,
  heartbeatOutgoing: 4000,
})

client.onConnect = function (frame) {
  console.log('Connected: ' + frame)

  // Subscribe to location updates
  client.subscribe('/topic/order/1/location', function (message) {
    console.log('Location update:', JSON.parse(message.body))
  })
}

client.onStompError = function (frame) {
  console.error('STOMP error:', frame.headers['message'], frame.body)
}

client.activate()
```

## Troubleshooting

### Vấn đề: React Native không kết nối được

**Kiểm tra:**

1. **Server có hỗ trợ native WebSocket không?**

   ```bash
   curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" https://tam-tac.com/ws
   ```

   Phải thấy `101 Switching Protocols`

2. **Nginx/Apache có cấu hình đúng không?**

   - Kiểm tra logs: `tail -f /var/log/nginx/error.log`
   - Đảm bảo có `proxy_set_header Upgrade` và `Connection`

3. **Firewall có block không?**

   - Kiểm tra port 8080 (Spring Boot) có mở không
   - Kiểm tra port 443 (HTTPS/WSS) có mở không

4. **SSL Certificate có valid không?**
   - React Native yêu cầu valid SSL certificate
   - Test: `openssl s_client -connect tam-tac.com:443`

### Vấn đề: 404 Not Found

- Kiểm tra endpoint có đúng không: `/ws` (không phải `/ws/`)
- Kiểm tra SecurityConfig có permitAll cho `/ws/**` không

### Vấn đề: 502 Bad Gateway

- Kiểm tra Spring Boot app có chạy không
- Kiểm tra Nginx/Apache có proxy đúng port không
- Kiểm tra logs của proxy server

### Vấn đề: Connection timeout

- Tăng timeout trong Nginx/Apache config
- Kiểm tra network connectivity
- Kiểm tra firewall rules

## STOMP Protocol

Server sử dụng STOMP protocol trên WebSocket:

- **Message Broker**: `/topic` (subscribe)
- **Application Destination**: `/app` (send messages)

### Subscribe:

```
SUBSCRIBE
destination:/topic/order/{orderId}/location
```

### Send Message:

```
SEND
destination:/app/shipper/location
content-type:application/json

{"orderId": 1, "latitude": 10.762622, "longitude": 106.660172}
```

## Notes

- Native WebSocket endpoint (`/ws`) không cần SockJS
- React Native nên sử dụng `wss://` (WebSocket Secure) thay vì `ws://`
- Authentication là optional, nhưng nên sử dụng trong production
- Server cho phép connection không có authentication để dễ test
