// apps/mobile/components/create/MentionPicker.jsx
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function MentionPicker({ users = [], query = "", onSelect }) {
  const normalizedQuery = query.trim().toLowerCase();

  const filteredUsers = normalizedQuery
    ? users.filter((user) =>
        `${user.name || ""} ${user.username || ""}`
          .toLowerCase()
          .includes(normalizedQuery),
      )
    : users;

  return (
    <View style={styles.container}>
      {filteredUsers.map((user, index) => {
        const name = user.name || user.username || "User";
        const avatar = user.avatar || user.photo || user.profilePhoto;

        return (
          <Pressable
            key={String(user.id ?? user.username ?? index)}
            onPress={() => onSelect?.(user)}
            style={({ pressed }) => [styles.item, pressed && styles.pressed]}
          >
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.placeholder}>
                <Text style={styles.initial}>
                  {name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}

            <View style={styles.info}>
              <Text style={styles.name}>{name}</Text>

              {user.username ? (
                <Text style={styles.username}>
                  @{user.username.replace(/^@/, "")}
                </Text>
              ) : null}
            </View>
          </Pressable>
        );
      })}

      {filteredUsers.length === 0 && (
        <Text style={styles.empty}>No users found</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    overflow: "hidden",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },
  item: {
    minHeight: 60,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEEEEE",
  },
  placeholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E8E8E8",
  },
  initial: {
    color: "#111111",
    fontSize: 15,
    fontWeight: "700",
  },
  info: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    color: "#111111",
    fontSize: 14,
    fontWeight: "700",
  },
  username: {
    marginTop: 2,
    color: "#777777",
    fontSize: 12,
  },
  empty: {
    padding: 20,
    color: "#888888",
    fontSize: 13,
    textAlign: "center",
  },
  pressed: {
    backgroundColor: "#F5F5F5",
  },
});
