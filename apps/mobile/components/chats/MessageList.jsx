// apps/mobile/components/chats/MessageList.jsx
import { FlatList, StyleSheet, Text, View } from "react-native";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

function formatTime(value) {
  if (!value) return "";

  if (typeof value === "string" && !value.includes("T")) {
    return value;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function MessageList({
  messages = [],
  currentUserId,
  onMessageLongPress,
  onReply,
  typing = false,
  ListHeaderComponent,
  ListFooterComponent,
  refreshing = false,
  onRefresh,
  renderItemOverride,
  ListEmptyComponent,
}) {
  const defaultRenderItem = ({ item }) => {
    const isMine =
      item.isMine ??
      String(item.senderId ?? item.userId) === String(currentUserId);

    return (
      <View>
        {item.dateLabel ? (
          <View style={styles.dateSeparator}>
            <Text style={styles.dateText}>{item.dateLabel}</Text>
          </View>
        ) : null}

        <MessageBubble
          message={item.text || item.message}
          isMine={isMine}
          timestamp={formatTime(item.timestamp || item.createdAt)}
          status={item.status}
          reply={item.reply}
          onLongPress={() => onMessageLongPress?.(item)}
        />
      </View>
    );
  };

  const emptyList = ListEmptyComponent ?? (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>No messages yet</Text>
      <Text style={styles.emptyText}>Say hello to start the conversation.</Text>
    </View>
  );

  return (
    <FlatList
      inverted
      data={[...messages].reverse()}
      keyExtractor={(item, index) => String(item.id ?? index)}
      renderItem={renderItemOverride || defaultRenderItem}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      refreshing={refreshing}
      onRefresh={onRefresh}
      ListHeaderComponent={
        <>
          {typing && <TypingIndicator />}
          {ListHeaderComponent}
        </>
      }
      ListFooterComponent={ListFooterComponent}
      ListEmptyComponent={emptyList}
      contentContainerStyle={styles.content}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 14,
    paddingBottom: 10,
  },
  dateSeparator: {
    alignSelf: "center",
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: "#F0F0F0",
  },
  dateText: {
    color: "#777777",
    fontSize: 11,
    fontWeight: "600",
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingVertical: 30,
    gap: 10,
  },
  emptyTitle: {
    color: "#111111",
    fontSize: 16,
    fontWeight: "700",
  },
  emptyText: {
    color: "#777777",
    fontSize: 13,
    textAlign: "center",
  },
});
