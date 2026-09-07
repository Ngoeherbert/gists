// apps/mobile/components/comments/CommentActions.jsx

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CommentActions({
  liked = false,
  likeCount = 0,
  onLike,
  onReply,
  onMore,
  showMore = true,
}) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={onLike}
        style={styles.action}
        accessibilityRole="button"
        accessibilityLabel={liked ? 'Unlike comment' : 'Like comment'}
      >
        <Ionicons
          name={liked ? 'heart' : 'heart-outline'}
          size={18}
          color={liked ? '#000' : '#555'}
        />
        {likeCount > 0 && <Text style={styles.count}>{likeCount}</Text>}
      </Pressable>

      <Pressable
        onPress={onReply}
        style={styles.action}
        accessibilityRole="button"
        accessibilityLabel="Reply to comment"
      >
        <Ionicons name="chatbubble-outline" size={17} color="#555" />
        <Text style={styles.label}>Reply</Text>
      </Pressable>

      {showMore && (
        <Pressable
          onPress={onMore}
          style={styles.moreButton}
          accessibilityRole="button"
          accessibilityLabel="Comment options"
        >
          <Ionicons name="ellipsis-horizontal" size={18} color="#555" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 16,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    minHeight: 30,
  },
  count: {
    fontSize: 12,
    color: '#555',
    fontWeight: '600',
  },
  label: {
    fontSize: 12,
    color: '#555',
    fontWeight: '500',
  },
  moreButton: {
    marginLeft: 'auto',
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});