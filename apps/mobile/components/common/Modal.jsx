import { Modal as RNModal, Pressable, View, StyleSheet } from "react-native";

export default function Modal({
  visible,
  onClose,
  children,
  position = "center",
  dismissOnBackdrop = true,
  transparent = true,
  animationType = "fade",
  style,
}) {
  const handleBackdropPress = () => {
    if (dismissOnBackdrop) {
      onClose?.();
    }
  };

  return (
    <RNModal
      visible={visible}
      transparent={transparent}
      animationType={animationType}
      onRequestClose={onClose}
    >
      <View
        style={[styles.overlay, position === "bottom" && styles.bottomOverlay]}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={handleBackdropPress}
        />

        <View
          style={[
            styles.content,
            position === "bottom" && styles.bottomContent,
            position === "top" && styles.topContent,
            style,
          ]}
        >
          {children}
        </View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  bottomOverlay: {
    justifyContent: "flex-end",
    padding: 0,
  },
  content: {
    width: "100%",
    maxWidth: 480,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  bottomContent: {
    maxWidth: "100%",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  topContent: {
    alignSelf: "flex-start",
  },
});
