import { View, Text, Pressable, StyleSheet } from "react-native";

export default function DropdownMenu({
  visible,
  options = [],
  onClose,
  style,
}) {
  if (!visible) return null;

  return (
    <>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

      <View style={[styles.menu, style]}>
        {options.map((option, index) => {
          const {
            label,
            onPress,
            icon,
            destructive = false,
            disabled = false,
          } = option;

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
                styles.option,
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
    </>
  );
}

const styles = StyleSheet.create({
  menu: {
    minWidth: 180,
    maxWidth: 280,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 6,
    shadowColor: "#000000",
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 8,
    zIndex: 100,
  },
  option: {
    minHeight: 44,
    borderRadius: 11,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  icon: {
    width: 30,
    alignItems: "center",
    marginRight: 8,
  },
  label: {
    flex: 1,
    fontSize: 14,
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
