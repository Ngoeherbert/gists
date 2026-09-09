import React from "react";
import { router } from "expo-router";

import CreateCamera from "../../../../components/create/CreateCamera";

export default function StoryCreateScreen() {
  const handleClose = () => {
    router.replace("/(main)/feeds");
  };

  const handleContinue = (payload) => {
    router.push({
      pathname: "/(main)/feeds/story/edit",
      params: payload,
    });
  };

  return (
    <CreateCamera
      closeLabel="Close"
      continueLabel="Next"
      onClose={handleClose}
      onContinue={handleContinue}
      modes={[
        { id: "photo", label: "Photo", icon: "camera-outline" },
        { id: "text", label: "Text", icon: "text-outline" },
      ]}
    />
  );
}
