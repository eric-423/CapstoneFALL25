"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import useOrderChat, {
  OrderChatMessage,
} from "@/utils/hooks/useOrderChat";

interface OrderChatPanelProps {
  orderId: number;
  shipperName?: string | null;
}

export function OrderChatPanel({ orderId, shipperName }: OrderChatPanelProps) {
  const [draft, setDraft] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const {
    messages,
    isConnected,
    isSending,
    error,
    sendMessage,
  } = useOrderChat({ orderId, enabled: true });

  const sortedMessages = useMemo<OrderChatMessage[]>(() => {
    return [...messages].sort((a, b) => {
      const ta = a.sendTime ? new Date(a.sendTime).getTime() : 0;
      const tb = b.sendTime ? new Date(b.sendTime).getTime() : 0;
      return ta - tb;
    });
  }, [messages]);

  useEffect(() => {
    if (messagesContainerRef.current && messagesEndRef.current) {
      const container = messagesContainerRef.current;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      
      // Chỉ scroll nếu có nội dung vượt quá chiều cao container
      if (scrollHeight > clientHeight) {
        container.scrollTo({
          top: scrollHeight,
          behavior: "smooth",
        });
      }
    }
  }, [sortedMessages.length]);

  const handleSend = () => {
    const content = draft.trim();
    if (!content) return;
    sendMessage(content);
    setDraft("");
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <aside className="mt-4 w-full">
      <Card className="border-none shadow-sm bg-white/80 h-full flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-primary" />
            Chat với shipper
          </CardTitle>
          {shipperName && (
            <p className="text-xs text-muted-foreground">
              Shipper: <span className="font-medium">{shipperName}</span>
            </p>
          )}
          <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">
            {isConnected
              ? "Bạn đang chat trực tiếp với shipper."
              : "Đang kết nối tới server chat..."}
          </p>
          {error && (
            <p className="text-[11px] text-red-500 mt-1">
              {error.message}
            </p>
          )}
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-3 pb-4">
          <div 
            ref={messagesContainerRef}
            className="flex-1 space-y-3 overflow-y-auto pr-1 text-xs sm:text-sm max-h-[35vh]"
          >
            {sortedMessages.length === 0 && (
              <p className="text-center text-[11px] text-gray-400 py-4">
                Chưa có tin nhắn nào. Hãy gửi tin đầu tiên cho shipper.
              </p>
            )}
            {sortedMessages.map((msg) => {
              const timeLabel = msg.sendTime
                ? new Date(msg.sendTime).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
                : "";

              const isFromShipper =
                msg.senderName?.toLowerCase().includes("shipper") ||
                msg.senderId === 0;

              if (isFromShipper) {
                return (
                  <div key={msg.id ?? `${msg.orderId}-${msg.sendTime}-${msg.content}`} className="flex justify-start">
                    <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-gray-100 text-gray-900 px-3 py-2 shadow-sm">
                      <p className="font-medium text-[11px] text-gray-700 mb-0.5">
                        Shipper
                      </p>
                      <p>{msg.content}</p>
                      {timeLabel && (
                        <p className="mt-1 text-[10px] text-gray-400 text-right">
                          {timeLabel}
                        </p>
                      )}
                    </div>
                  </div>
                );
              }

              return (
                <div key={msg.id ?? `${msg.orderId}-${msg.sendTime}-${msg.content}`} className="flex justify-end">
                  <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary text-white px-3 py-2 shadow-sm">
                    <p>{msg.content}</p>
                    {timeLabel && (
                      <p className="mt-1 text-[10px] text-orange-100 text-right">
                        {timeLabel}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Nhập tin nhắn..."
                className="h-9 text-xs sm:text-sm"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={!isConnected || isSending}
              />
              <Button
                type="button"
                size="sm"
                className="h-9 px-3 text-xs sm:text-sm"
                onClick={handleSend}
                disabled={!isConnected || isSending || !draft.trim()}
              >
                {isSending ? "Đang gửi..." : "Gửi"}
              </Button>
            </div>

          </div>
        </CardContent>
      </Card>
    </aside>
  );
}


