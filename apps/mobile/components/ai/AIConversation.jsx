// apps/mobile/components/ai/AIConversation.jsx

import React, { useEffect, useRef } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import AIMessage from "./AIMessage";
import AISuggestion from "./AISuggestion";
import Loader from "../common/Loader";
import EmptyState from "../common/EmptyState";

export default function AIConversation({
  messages = [],
  loading = false,
  suggestions = [],
  onSuggestionPress,
  onMessageLongPress,
  emptyTitle = "How can Gist AI help?",
  emptyMessage = "Ask a question, get ideas, write something, or let Gist AI help you with your conversations.",
}) {
  const listRef = useRef(null);

  useEffect(() => {
    if (messages.length > 0) {
      requestAnimationFrame(() => {
        listRef.current?.scrollToEnd({ animated: true });
      });
    }
  }, [messages.length]);

  const renderMessage = ({ item }) => (
    <AIMessage message={item} onLongPress={() => onMessageLongPress?.(item)} />
  );

  const renderFooter = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <Loader size="small" />
        </View>
      );
    }

    if (messages.length === 0 && suggestions.length > 0) {
      return (
        <View style={styles.suggestions}>
          {suggestions.map((suggestion, index) => (
            <AISuggestion
              key={
                suggestion?.id || `${suggestion?.text || suggestion}-${index}`
              }
              suggestion={suggestion}
              onPress={() => onSuggestionPress?.(suggestion)}
            />
          ))}
        </View>
      );
    }

    return null;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {messages.length === 0 && !loading && suggestions.length === 0 ? (
        <EmptyState title={emptyTitle} message={emptyMessage} />
      ) : (
        <FlatList
          ref={listRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item, index) =>
            String(item?.id || item?._id || `message-${index}`)
          }
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.list}
          ListFooterComponent={renderFooter}
          onContentSizeChange={() => {
            if (messages.length > 0) {
              listRef.current?.scrollToEnd({ animated: false });
            }
          }}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  list: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    flexGrow: 1,
  },
  loadingContainer: {
    paddingVertical: 18,
    alignItems: "flex-start",
  },
  suggestions: {
    paddingTop: 12,
    paddingBottom: 8,
    gap: 10,
  },
});
