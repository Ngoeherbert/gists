import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HeaderAction({
  icon,
  label,
  onPress,
  color = '#000',
  badge,
  disabled = false,
  size = 22,
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label || 'Header action'}
      hitSlop={8}
      style={({ pressed }) => [
        styles.button,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <View style={styles.iconWrapper}>
        {icon ? (
          <Ionicons name={icon} size={size} color={color} />
        ) : null}

        {badge !== undefined && badge !== null && Number(badge) > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {Number(badge) > 99 ? '99+' : badge}
            </Text>
          </View>
        ) : null}
      </View>

      {label ? (
        <Text style={[styles.label, { color }]} numberOfLines={1}>
          {label}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: 44,
    minHeight: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },

  iconWrapper: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  label: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },

  badge: {
    position: 'absolute',
    top: -5,
    right: -8,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: '#000',
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },

  badgeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '800',
  },

  pressed: {
    backgroundColor: '#f2f2f2',
  },

  disabled: {
    opacity: 0.4,
  },
});