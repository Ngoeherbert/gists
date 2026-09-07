// apps/mobile/components/chats/MessageInput.jsx
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

export default function MessageInput({
  value,
  onChangeText,
  onSend,
  onAttachment,
  onCamera,
  onVoice,
  placeholder = "Message",
  disabled = false,
  replyingTo = null,
  onCancelReply,
}) {
  const canSend = Boolean(value?.trim()) && !disabled;

  return (
    <View style={styles.container}>
      {replyingTo && (
        <View style={styles.replyBar}>
          <View style={styles.replyContent}>
            <View style={styles.replyLine} />
            <View style={styles.replyTextContainer}>
              <View>
                <View>
                  <Ionicons
                    name="return-down-forward"
                    size={13}
                    color="#111111"
                  />
                </View>
              </View>
              <View style={styles.replyCopy}>
                <View style={styles.replyTitleRow}>
                  <Ionicons
                    name="return-down-forward"
                    size={13}
                    color="#111111"
                  />
                </View>
                <View style={styles.replyMessage}>
                  <View />
                </View>
              </View>
            </View>
          </View>

          <Pressable
            onPress={onCancelReply}
            hitSlop={8}
            style={styles.closeReply}
          >
            <Ionicons name="close" size={19} color="#111111" />
          </Pressable>
        </View>
      )}

      <View style={styles.inputRow}>
        {onAttachment && (
          <Pressable
            onPress={onAttachment}
            disabled={disabled}
            hitSlop={8}
            style={styles.sideButton}
          >
            <Ionicons name="add-circle-outline" size={25} color="#111111" />
          </Pressable>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#929292"
            editable={!disabled}
            multiline
            maxLength={4000}
            style={styles.input}
          />

          {onCamera && (
            <Pressable
              onPress={onCamera}
              disabled={disabled}
              hitSlop={8}
              style={styles.cameraButton}
            >
              <Ionicons name="camera-outline" size={22} color="#555555" />
            </Pressable>
          )}
        </View>

        {canSend ? (
          <Pressable onPress={onSend} hitSlop={8} style={styles.sendButton}>
            <Ionicons name="arrow-up" size={21} color="#FFFFFF" />
          </Pressable>
        ) : onVoice ? (
          <Pressable
            onPress={onVoice}
            disabled={disabled}
            hitSlop={8}
            style={styles.sideButton}
          >
            <Ionicons name="mic-outline" size={24} color="#111111" />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 12,
    paddingTop: 7,
    paddingBottom: 10,
    backgroundColor: "#FFFFFF",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E5E5",
  },
  inputRow: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
  },
  sideButton: {
    width: 38,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    flex: 1,
    minHeight: 46,
    maxHeight: 120,
    flexDirection: "row",
    alignItems: "flex-end",
    borderRadius: 23,
    backgroundColor: "#F2F2F2",
  },
  input: {
    flex: 1,
    minHeight: 46,
    maxHeight: 120,
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 11,
    color: "#111111",
    fontSize: 15,
    lineHeight: 21,
  },
  cameraButton: {
    width: 42,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111111",
  },
  replyBar: {
    minHeight: 48,
    marginBottom: 7,
    paddingHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#F3F3F3",
  },
  replyContent: {
    flex: 1,
    flexDirection: "row",
  },
  replyLine: {
    width: 3,
    marginRight: 9,
    borderRadius: 2,
    backgroundColor: "#111111",
  },
  replyTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  replyCopy: {
    minHeight: 34,
    justifyContent: "center",
  },
  replyTitleRow: {
    minHeight: 15,
  },
  replyMessage: {
    minHeight: 12,
  },
  closeReply: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
});
