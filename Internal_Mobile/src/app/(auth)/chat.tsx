import { APP_COLOR, APP_FONT } from "@/constants/Colors";
import { useCurrentApp } from "@/context/app.context";
import WebSocketService from "@/service/WebSocketService";
import { getChatMessages } from "@/utils/api";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-root-toast";
import { SafeAreaView } from "react-native-safe-area-context";

interface ChatMessage {
  id: number;
  content: string;
  senderId: number;
  sendTime: string;
}

const ChatScreen = () => {
  const router = useRouter();
  const { orderId, customerName } = useLocalSearchParams<{
    orderId: string;
    customerName?: string;
  }>();
  const { appState } = useCurrentApp();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const orderIdNum = orderId ? parseInt(orderId, 10) : 0;
  const currentUserId = appState?.userInfo?.id
    ? parseInt(appState.userInfo.id, 10)
    : null;

  useEffect(() => {
    if (!orderIdNum || !appState?.token) {
      return;
    }

    let isMounted = true;

    const connectAndLoad = async () => {
      try {
        await WebSocketService.connect(appState.token);
        if (!isMounted) return;

        if (WebSocketService.isConnected()) {
          setIsConnected(true);
          const topic = `/topic/order/${orderIdNum}/chat`;
          const unsubscribe = WebSocketService.subscribe(
            topic,
            (messageData) => {
              if (isMounted) {
                const chatMsg = messageData as unknown as ChatMessage;
                setMessages((prev) => [...prev, chatMsg]);
                setTimeout(() => {
                  scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 100);
              }
            }
          );
          unsubscribeRef.current = unsubscribe;

          try {
            const historyResponse = await getChatMessages(
              appState.token,
              orderIdNum
            );
            if (isMounted && historyResponse?.data) {
              setMessages(historyResponse.data);
              setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: false });
              }, 100);
            }
          } catch (error) {
            console.error("Error loading chat history:", error);
          }
        }
      } catch (error) {
        console.error("Error connecting WebSocket:", error);
        Toast.show("Không thể kết nối chat. Vui lòng thử lại.", {
          duration: Toast.durations.LONG,
          textColor: "white",
          backgroundColor: APP_COLOR.CANCEL,
          opacity: 1,
        });
      }
    };

    connectAndLoad();

    return () => {
      isMounted = false;
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [orderIdNum, appState?.token]);

  const handleSendMessage = async () => {
    if (!message.trim() || !isConnected || !orderIdNum) {
      return;
    }

    try {
      WebSocketService.sendChatMessage(orderIdNum, message.trim());
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      Toast.show("Không thể gửi tin nhắn. Vui lòng thử lại.", {
        duration: Toast.durations.LONG,
        textColor: "white",
        backgroundColor: APP_COLOR.CANCEL,
        opacity: 1,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color={APP_COLOR.BROWN} />
        </Pressable>
        <Text style={styles.headerTitle}>
          Chat với {customerName || "khách hàng"}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Chưa có tin nhắn. Bắt đầu trò chuyện với khách hàng!
            </Text>
          </View>
        ) : (
          messages.map((msg) => {
            const isSent =
              currentUserId !== null && msg.senderId === currentUserId;
            return (
              <View
                key={msg.id}
                style={[
                  styles.messageBubble,
                  isSent
                    ? styles.messageBubbleSent
                    : styles.messageBubbleReceived,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    isSent
                      ? styles.messageTextSent
                      : styles.messageTextReceived,
                  ]}
                >
                  {msg.content}
                </Text>
                <Text
                  style={[
                    styles.messageTime,
                    isSent
                      ? styles.messageTimeSent
                      : styles.messageTimeReceived,
                  ]}
                >
                  {new Date(msg.sendTime).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            );
          })
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhập tin nhắn..."
          value={message}
          onChangeText={setMessage}
          multiline
          placeholderTextColor={APP_COLOR.BROWN}
        />
        <Pressable
          onPress={handleSendMessage}
          style={[
            styles.sendButton,
            (!message.trim() || !isConnected) && styles.sendButtonDisabled,
          ]}
          disabled={!message.trim() || !isConnected}
        >
          <AntDesign
            name="arrowup"
            size={24}
            color={
              message.trim() && isConnected ? APP_COLOR.WHITE : APP_COLOR.BROWN
            }
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLOR.WHITE,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontFamily: APP_FONT.SEMIBOLD,
    fontSize: 18,
    color: APP_COLOR.BROWN,
  },
  placeholder: {
    width: 40,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontFamily: APP_FONT.REGULAR,
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  messageBubble: {
    padding: 12,
    borderRadius: 12,
    maxWidth: "80%",
    marginBottom: 8,
  },
  messageBubbleSent: {
    backgroundColor: APP_COLOR.ORANGE,
    alignSelf: "flex-end",
  },
  messageBubbleReceived: {
    backgroundColor: "#E5E5E5",
    alignSelf: "flex-start",
  },
  messageText: {
    fontFamily: APP_FONT.REGULAR,
    fontSize: 14,
    marginBottom: 4,
  },
  messageTextSent: {
    color: APP_COLOR.WHITE,
  },
  messageTextReceived: {
    color: APP_COLOR.BROWN,
  },
  messageTime: {
    fontFamily: APP_FONT.REGULAR,
    fontSize: 10,
    alignSelf: "flex-end",
  },
  messageTimeSent: {
    color: "rgba(255, 255, 255, 0.8)",
  },
  messageTimeReceived: {
    color: "#999",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    gap: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontFamily: APP_FONT.REGULAR,
    fontSize: 14,
    color: APP_COLOR.BROWN,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: APP_COLOR.ORANGE,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#E5E5E5",
    opacity: 0.5,
  },
});

export default ChatScreen;
