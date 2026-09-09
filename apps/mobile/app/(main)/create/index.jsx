import React from "react";
import { router } from "expo-router";

import CreateCamera from "../../../components/create/CreateCamera";

export default function CreateScreen() {
  const handleClose = () => {
    router.replace("/(main)/feeds");
  };

  const handleContinue = (payload) => {
    router.push({
      pathname: "/(main)/feeds/story/edit",
      params: {
        ...payload,
        fromCreate: "true",
      },
    });
  };

  return (
    <CreateCamera
      closeLabel="Close"
      continueLabel="Next"
      onClose={handleClose}
      onContinue={handleContinue}
      modes={[
        {
          id: "story",
          label: "Story",
          icon: "images-outline",
          route: "/(main)/create/story",
        },
        {
          id: "reel",
          label: "Reel",
          icon: "videocam-outline",
          route: "/(main)/create/reel",
        },
        {
          id: "post",
          label: "Post",
          icon: "grid-outline",
          route: "/(main)/create/post",
        },
      ]}
    />
  );
}