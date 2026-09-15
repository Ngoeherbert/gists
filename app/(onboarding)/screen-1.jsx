// app/(onboarding)/screen-1.jsx
import React from "react";
import colors from "../../constants/colors";
import OnboardingSlide from "../../components/auth/OnboardingSlide";

export default function OnboardingOne() {
  return (
    <OnboardingSlide
      index={0}
      total={3}
      icon="camera-outline"
      accent={colors.primary}
      title="Capture every moment"
      description="Share photos, short reels and stories with the people who matter most — all in one place."
    />
  );
}
