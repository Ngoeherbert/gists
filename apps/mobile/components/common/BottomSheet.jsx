import { View, Text, Pressable, StyleSheet } from "react-native";
import Modal from "./Modal";

export default function BottomSheet({
  visible,
  onClose,
  children,
  title,
  showHandle = true,
  dismissOnBackdrop = true,
}) {
  return (
    <Modal
      visible={visible}
      onClose={onClose}
      position="bottom"
      dismissOnBackdrop={dismissOnBackdrop}
      animationType="slide"
    >
      <View style={styles.container}>
        {showHandle ? <View style={styles.handle} /> : null}

        {title ? (
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>

            <Pressable onPress={onClose} hitSlop={8} style={styles.close}>
              <Text style={styles.closeText}>×</Text>
            </Pressable>
          </View>
        ) : null}

        <View style={styles.content}>{children}</View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    paddingTop: 10,
    paddingBottom: 28,
  },
  handle: {
    alignSelf: "center",
    width: 42,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#D8D8D8",
    marginBottom: 12,
  },
  header: {
    minHeight: 52,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: "#111111",
  },
  close: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    fontSize: 28,
    lineHeight: 30,
    color: "#111111",
  },
  content: {
    paddingHorizontal: 20,
  },
});
