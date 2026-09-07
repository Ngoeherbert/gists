// apps/mobile/components/create/CreateMenu.jsx
import { StyleSheet, View } from "react-native";
import CreateOption from "./CreateOption";

const DEFAULT_OPTIONS = [
  {
    id: "post",
    title: "Post",
    description: "Share photos, videos or thoughts",
    icon: "images-outline",
  },
  {
    id: "reel",
    title: "Reel",
    description: "Create a short video",
    icon: "play-circle-outline",
  },
  {
    id: "story",
    title: "Story",
    description: "Share something for 24 hours",
    icon: "add-circle-outline",
  },
];

export default function CreateMenu({
  options = DEFAULT_OPTIONS,
  onSelect,
}) {
  return (
    <View style={styles.container}>
      {options.map((option) => (
        <CreateOption
          key={option.id}
          icon={option.icon}
          title={option.title}
          description={option.description}
          onPress={() => onSelect?.(option)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 10,
  },
});