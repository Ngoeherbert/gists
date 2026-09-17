// components/ui/AppIcon.jsx
// Provider-aware icon renderer over @expo/vector-icons. Accepts any supported
// family so callers are never locked to Ionicons.
//
// `icon` may be:
//   - a string                 → rendered via `provider` (defaults to Ionicons)
//   - { name, provider }       → rendered via the named provider
//   - a React element          → rendered as-is (custom SVG, etc.)
//
// Provider keys are case-insensitive ("ionicons", "Ionicons", "material", …).
// Unknown providers fall back to Ionicons so a typo never blanks the UI.

import React from "react";
import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome,
  FontAwesome5,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
  Zocial,
} from "@expo/vector-icons";

export const ICON_PROVIDERS = {
  antdesign: AntDesign,
  entypo: Entypo,
  feather: Feather,
  fontawesome: FontAwesome,
  fontawesome5: FontAwesome5,
  foundation: Foundation,
  ionicons: Ionicons,
  ionicon: Ionicons,
  material: MaterialIcons,
  materialicons: MaterialIcons,
  materialcommunity: MaterialCommunityIcons,
  materialcommunityicons: MaterialCommunityIcons,
  octicons: Octicons,
  simpleline: SimpleLineIcons,
  simplelineicons: SimpleLineIcons,
  zocial: Zocial,
};

function normalizeProvider(provider) {
  if (!provider) return "ionicons";
  const key = String(provider).toLowerCase().replace(/[\s_-]/g, "");
  return ICON_PROVIDERS[key] ? key : "ionicons";
}

export function resolveIconComponent(provider) {
  return ICON_PROVIDERS[normalizeProvider(provider)] || Ionicons;
}

export default function AppIcon({ icon, name, provider, size, color, style }) {
  if (React.isValidElement(icon)) return icon;
  if (React.isValidElement(name)) return name;

  let resolvedName = name;
  let resolvedProvider = provider;

  if (icon != null && typeof icon === "object" && !React.isValidElement(icon)) {
    resolvedName = icon.name ?? resolvedName;
    resolvedProvider = icon.provider ?? icon.family ?? resolvedProvider;
  } else if (typeof icon === "string") {
    resolvedName = icon;
  }

  if (!resolvedName) return null;

  const IconComponent = resolveIconComponent(resolvedProvider);
  return (
    <IconComponent
      name={resolvedName}
      size={size}
      color={color}
      style={style}
    />
  );
}
