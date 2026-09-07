import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function KYCStep({
  title,
  description,
  status = 'pending',
  step,
  onPress,
}) {
  const isCompleted = status === 'completed';
  const isActive = status === 'active';
  const isRejected = status === 'rejected';

  const iconName = isCompleted
    ? 'checkmark'
    : isRejected
      ? 'close'
      : isActive
        ? 'ellipsis-horizontal'
        : 'lock-closed-outline';

  const content = (
    <View style={styles.container}>
      <View
        style={[
          styles.stepCircle,
          isCompleted && styles.completedCircle,
          isActive && styles.activeCircle,
          isRejected && styles.rejectedCircle,
        ]}
      >
        {isCompleted || isRejected || isActive ? (
          <Ionicons name={iconName} size={18} color="#fff" />
        ) : (
          <Text style={styles.stepNumber}>{step}</Text>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>

        {description ? (
          <Text style={styles.description}>{description}</Text>
        ) : null}
      </View>

      {onPress && !isCompleted ? (
        <Ionicons name="chevron-forward" size={19} color="#888" />
      ) : null}
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [pressed && styles.pressed]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#eee',
  },

  stepCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },

  completedCircle: {
    backgroundColor: '#000',
  },

  activeCircle: {
    backgroundColor: '#000',
  },

  rejectedCircle: {
    backgroundColor: '#d93025',
  },

  stepNumber: {
    color: '#666',
    fontSize: 14,
    fontWeight: '800',
  },

  content: {
    flex: 1,
    marginHorizontal: 13,
  },

  title: {
    color: '#000',
    fontSize: 14,
    fontWeight: '800',
  },

  description: {
    color: '#888',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },

  pressed: {
    opacity: 0.7,
  },
});