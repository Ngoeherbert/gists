import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import RoomMember from "./RoomMember";

export default function RoomMemberList({
  members = [],
  onMemberPress,
  onMemberMore,
  showMore = false,
  ListHeaderComponent,
  ListEmptyComponent,
}) {
  return (
    <FlatList
      data={members}
      keyExtractor={(item, index) => String(item?.id || item?.userId || index)}
      renderItem={({ item }) => (
        <RoomMember
          member={item}
          onPress={onMemberPress}
          onMore={onMemberMore}
          showMore={showMore}
        />
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={
        ListEmptyComponent || (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No members yet</Text>
            <Text style={styles.emptyText}>Room members will appear here.</Text>
          </View>
        )
      }
      contentContainerStyle={
        members.length === 0 ? styles.emptyContainer : undefined
      }
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: "#F1F1F1",
    marginLeft: 76,
  },

  emptyContainer: {
    flexGrow: 1,
  },

  empty: {
    flex: 1,
    minHeight: 220,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  emptyTitle: {
    color: "#000",
    fontSize: 16,
    fontWeight: "800",
  },

  emptyText: {
    color: "#777",
    fontSize: 13,
    textAlign: "center",
    marginTop: 6,
  },
});
