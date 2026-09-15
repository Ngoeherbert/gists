// app/(onboarding)/screen-3.jsx
import React from "react";
import colors from "../../constants/colors";
import OnboardingSlide from "../../components/auth/OnboardingSlide";

export default function OnboardingThree() {
  return (
    <OnboardingSlide
      index={2}
      total={3}
      icon="people-outline"
      accent={colors.secondary}
      title="Grow your community"
      description="Follow creators, discover what's trending and build an audience of your own."
    />
  );
}
