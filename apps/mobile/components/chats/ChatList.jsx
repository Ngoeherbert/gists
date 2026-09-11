// apps/mobile/components/chats/ChatList.jsx
import { FlatList, StyleSheet, Text, View } from "react-native";
import ChatItem from "./ChatItem";

export default function ChatList({
  chats = [],
  onChatPress,
  onChatLongPress,
  refreshing = false,
  onRefresh,
  ListHeaderComponent,
  ListEmptyComponent,
}) {
  const renderItem = ({ item }) => (
    <ChatItem
      id={item.id}
      name={item.name}
      avatar={item.avatar || item.photo || item.profilePhoto}
      message={item.message || item.lastMessage}
      timestamp={item.timestamp || item.lastMessageTime}
      unreadCount={item.unreadCount || item.unread || 0}
      online={item.online}
      muted={item.muted}
      pinned={item.pinned}
      typing={item.typing}
      isGroup={item.isGroup}
      onPress={onChatPress}
      onLongPress={onChatLongPress}
    />
  );

  return (
    <FlatList
      data={chats}
      keyExtractor={(item, index) => String(item.id ?? index)}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      refreshing={refreshing}
      onRefresh={onRefresh}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={
        ListEmptyComponent || (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No chats yet</Text>
            <Text style={styles.emptyText}>
              Start a conversation with someone to see your chats here.
            </Text>
          </View>
        )
      }
      contentContainerStyle={[
        styles.content,
        chats.length === 0 && styles.emptyContainer,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 100,
  },
  emptyContainer: {
    flexGrow: 1,
  },
  empty: {
    flex: 1,
    minHeight: 300,
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    color: "#111111",
    fontSize: 17,
    fontWeight: "700",
  },
  emptyText: {
    maxWidth: 300,
    marginTop: 8,
    color: "#777777",
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
  },
});
