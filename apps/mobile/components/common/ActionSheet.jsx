import { View, Text, Pressable, StyleSheet } from "react-native";
import BottomSheet from "./BottomSheet";

export default function ActionSheet({ visible, onClose, title, actions = [] }) {
  return (
    <BottomSheet visible={visible} onClose={onClose} title={title}>
      <View style={styles.container}>
        {actions.map((action, index) => {
          const {
            label,
            onPress,
            icon,
            destructive = false,
            disabled = false,
          } = action;

          return (
            <Pressable
              key={`${label}-${index}`}
              onPress={() => {
                if (disabled) return;
                onPress?.();
                onClose?.();
              }}
              disabled={disabled}
              style={({ pressed }) => [
                styles.action,
                pressed && !disabled && styles.pressed,
                disabled && styles.disabled,
              ]}
            >
              {icon ? <View style={styles.icon}>{icon}</View> : null}

              <Text style={[styles.label, destructive && styles.destructive]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
  },
  action: {
    minHeight: 56,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },
  icon: {
    width: 32,
    alignItems: "center",
    marginRight: 10,
  },
  label: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#111111",
  },
  destructive: {
    color: "#D64545",
  },
  pressed: {
    backgroundColor: "#F5F5F5",
  },
  disabled: {
    opacity: 0.4,
  },
});
