// app/(onboarding)/screen-2.jsx
import React from "react";
import colors from "../../constants/colors";
import OnboardingSlide from "../../components/auth/OnboardingSlide";

export default function OnboardingTwo() {
  return (
    <OnboardingSlide
      index={1}
      total={3}
      icon="chatbubbles-outline"
      accent={colors.accent}
      title="Chat without limits"
      description="Message friends, start group gist rooms and hop on voice or video calls whenever you like."
    />
  );
}
