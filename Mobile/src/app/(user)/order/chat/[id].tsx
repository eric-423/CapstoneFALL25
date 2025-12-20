import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { APP_COLOR } from "@/utils/constant";
import { FONTS } from "@/theme/typography";
import webSocketService from "@/services/WebSocketService";
import { GetChatMessages } from "@/utils/api";
import ShareButton from "@/components/button/share.button";
import { useCurrentApp } from "@/context/app.context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { jwtDecode } from "jwt-decode";

interface ChatMessage {
  id: number;
  content: string;
  senderId: number;
  sendTime: string;
}

const ChatWithShipperPage = () => {
  const params = useLocalSearchParams<{ id: string }>();
  const orderIdParam = Array.isArray(params.id) ? params.id[0] : params.id;
  const orderId = Number(orderIdParam);
  const { appState } = useCurrentApp();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      if (appState?.userInfo?.id) {
        setCurrentUserId(appState.userInfo.id);
      } else {
        try {
          const token = await AsyncStorage.getItem("access_token");
          if (token) {
            const decoded: any = jwtDecode(token);
            const userId =
              decoded.i || decoded.userId || decoded.sub || decoded.id || null;
            setCurrentUserId(userId);
          }
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
    };
    getUserId();
  }, [appState]);

  useEffect(() => {
    if (!orderIdParam || !Number.isFinite(orderId)) {
      setError("Không tìm thấy mã đơn hàng hợp lệ.");
      setIsLoading(false);
      return;
    }

    initializeChat();

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      webSocketService.disconnect();
    };
  }, [orderId]);

  const initializeChat = async () => {
    try {
      setIsLoading(true);
      setError(null);

      await loadChatHistory();

      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        setError("Vui lòng đăng nhập để sử dụng tính năng chat.");
        setIsLoading(false);
        return;
      }

      await webSocketService.connect(token);
      setIsConnected(true);

      const topic = `/topic/order/${orderId}/chat`;
      const unsubscribe = webSocketService.subscribe(topic, (messageData) => {
        loadChatHistory();
      });

      unsubscribeRef.current = unsubscribe;
      setIsLoading(false);
    } catch (err: any) {
      console.error("Error initializing chat:", err);
      setError(err.message || "Không thể kết nối chat. Vui lòng thử lại.");
      setIsLoading(false);
    }
  };

  const loadChatHistory = async () => {
    try {
      const response = await GetChatMessages(orderId);
      if (response.data?.data) {
        setMessages(response.data.data);
        setTimeout(() => scrollToBottom(), 100);
      }
    } catch (err: any) {
      console.error("Error loading chat history:", err);
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim() || isSending || !isConnected) return;

    const content = messageText.trim();
    setMessageText("");
    setIsSending(true);

    try {
      webSocketService.send("/chat/order", {
        orderId: orderId,
        content: content,
      });
      setTimeout(() => {
        loadChatHistory();
      }, 500);
    } catch (err: any) {
      console.error("Error sending message:", err);
      setError("Không thể gửi tin nhắn. Vui lòng thử lại.");
    } finally {
      setIsSending(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  if (!orderIdParam || !Number.isFinite(orderId)) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Không tìm thấy mã đơn hàng hợp lệ.</Text>
        <ShareButton
          title="Quay lại"
          onPress={() => router.back()}
          btnStyle={{ marginTop: 10 }}
          textStyle={{ color: APP_COLOR.WHITE, fontFamily: FONTS.bold }}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={APP_COLOR.BROWN} />
        </Pressable>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Chat với Shipper</Text>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isConnected ? "#4CAF50" : "#f44336" },
              ]}
            />
            <Text style={styles.statusText}>
              {isConnected ? "Đã kết nối" : "Đang kết nối..."}
            </Text>
          </View>
        </View>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={scrollToBottom}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={APP_COLOR.ORANGE} size="large" />
            <Text style={styles.loadingText}>Đang tải tin nhắn...</Text>
          </View>
        ) : messages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="chatbubbles-outline"
              size={64}
              color={APP_COLOR.GRAY}
            />
            <Text style={styles.emptyText}>
              Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!
            </Text>
          </View>
        ) : (
          messages.map((message) => {
            const messageSenderId = Number(message.senderId);
            const userId = currentUserId ? Number(currentUserId) : null;
            const isSent = userId !== null && messageSenderId === userId;

            if (__DEV__ && messages.indexOf(message) < 3) {
              console.log("Message check:", {
                messageId: message.id,
                senderId: messageSenderId,
                currentUserId: userId,
                isSent: isSent,
                content: message.content.substring(0, 20),
              });
            }
            const time = new Date(message.sendTime).toLocaleTimeString(
              "vi-VN",
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            );

            return (
              <View
                key={message.id}
                style={[
                  styles.messageBubble,
                  isSent ? styles.sentMessage : styles.receivedMessage,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    isSent
                      ? styles.sentMessageText
                      : styles.receivedMessageText,
                  ]}
                >
                  {message.content}
                </Text>
                <Text
                  style={[
                    styles.messageTime,
                    isSent
                      ? styles.sentMessageTime
                      : styles.receivedMessageTime,
                  ]}
                >
                  {time}
                </Text>
              </View>
            );
          })
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Nhập tin nhắn..."
          placeholderTextColor={APP_COLOR.GRAY}
          value={messageText}
          onChangeText={setMessageText}
          multiline
          maxLength={500}
          editable={isConnected && !isSending}
        />
        <Pressable
          onPress={sendMessage}
          disabled={!messageText.trim() || !isConnected || isSending}
          style={[
            styles.sendButton,
            (!messageText.trim() || !isConnected || isSending) &&
              styles.sendButtonDisabled,
          ]}
        >
          {isSending ? (
            <ActivityIndicator color={APP_COLOR.WHITE} size="small" />
          ) : (
            <Ionicons name="send" size={24} color={APP_COLOR.WHITE} />
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: APP_COLOR.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: APP_COLOR.BROWN,
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: APP_COLOR.GRAY,
  },
  errorContainer: {
    backgroundColor: "#FFEBEE",
    padding: 12,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: APP_COLOR.CANCEL,
  },
  errorText: {
    fontFamily: FONTS.regular,
    color: APP_COLOR.CANCEL,
    fontSize: 14,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontFamily: FONTS.regular,
    color: APP_COLOR.GRAY,
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontFamily: FONTS.regular,
    color: APP_COLOR.GRAY,
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 32,
  },
  messageBubble: {
    maxWidth: "75%",
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: APP_COLOR.ORANGE,
    borderBottomRightRadius: 4,
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: APP_COLOR.WHITE,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontFamily: FONTS.regular,
    fontSize: 15,
    lineHeight: 20,
  },
  sentMessageText: {
    color: APP_COLOR.WHITE,
  },
  receivedMessageText: {
    color: APP_COLOR.BROWN,
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
    fontFamily: FONTS.regular,
  },
  sentMessageTime: {
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "right",
  },
  receivedMessageTime: {
    color: APP_COLOR.GRAY,
    textAlign: "left",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: APP_COLOR.WHITE,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    gap: 8,
    paddingBottom: 50,
  },
  textInput: {
    flex: 1,
    backgroundColor: APP_COLOR.BACKGROUND_ORANGE,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontFamily: FONTS.regular,
    fontSize: 15,
    color: APP_COLOR.BROWN,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: APP_COLOR.ORANGE,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: APP_COLOR.ORANGE,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    backgroundColor: APP_COLOR.GRAY,
    opacity: 0.5,
  },
});

export default ChatWithShipperPage;
