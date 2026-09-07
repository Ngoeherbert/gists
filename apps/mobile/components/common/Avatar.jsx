import { View, Image, Text, StyleSheet } from "react-native";

export default function Avatar({
  uri,
  name,
  size = 48,
  online = false,
  border = false,
  style,
}) {
  const initial = name?.trim()?.charAt(0)?.toUpperCase() || "?";
  const onlineSize = Math.max(10, size * 0.25);

  return (
    <View
      style={[
        styles.wrapper,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        border && styles.border,
        style,
      ]}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={[
            styles.image,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
        />
      ) : (
        <View
          style={[
            styles.placeholder,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
        >
          <Text
            style={[
              styles.initial,
              {
                fontSize: Math.max(12, size * 0.38),
              },
            ]}
          >
            {initial}
          </Text>
        </View>
      )}

      {online && (
        <View
          style={[
            styles.online,
            {
              width: onlineSize,
              height: onlineSize,
              borderRadius: onlineSize / 2,
              right: 0,
              bottom: 0,
              borderWidth: Math.max(2, size * 0.05),
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    overflow: "visible",
  },
  border: {
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  image: {
    backgroundColor: "#F1F1F1",
  },
  placeholder: {
    backgroundColor: "#EAEAEA",
    alignItems: "center",
    justifyContent: "center",
  },
  initial: {
    color: "#111111",
    fontWeight: "700",
  },
  online: {
    position: "absolute",
    backgroundColor: "#111111",
    borderColor: "#FFFFFF",
  },
});
