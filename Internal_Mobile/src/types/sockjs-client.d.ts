declare module "sockjs-client" {
  interface SockJSOptions {
    server?: string;
    sessionId?: number | (() => string);
    transports?: string | string[];
    timeout?: number;
    devel?: boolean;
    debug?: boolean;
    protocol_whitelist?: string[];
    rtt?: number;
  }

  class SockJS {
    constructor(
      url: string,
      protocols?: string | string[] | null,
      options?: SockJSOptions
    );
    readyState: number;
    protocol: string;
    url: string;
    onopen: ((event: any) => void) | null;
    onmessage: ((event: any) => void) | null;
    onclose: ((event: any) => void) | null;
    onerror: ((event: any) => void) | null;
    send(data: string): void;
    close(code?: number, reason?: string): void;
    addEventListener(type: string, listener: (event: any) => void): void;
    removeEventListener(type: string, listener: (event: any) => void): void;
  }

  export = SockJS;
}
