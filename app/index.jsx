// app/index.jsx
// Entry route. Hands control straight to the splash screen, which is
// responsible for deciding where the user goes next.

import React from "react";
import { Redirect } from "expo-router";

export default function Index() {
  return <Redirect href="/(onboarding)/splash" />;
}
