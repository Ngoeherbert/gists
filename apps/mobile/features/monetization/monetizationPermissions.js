import { Linking, Platform } from "react-native";

export function canUseMonetization(user) {
  return Boolean(user?.id || user?._id);
}

export function canReceiveEarnings(user) {
  return Boolean(
    user?.monetizationEnabled || user?.isCreator || user?.creatorEnabled,
  );
}

export function canWithdraw(earnings = {}, user = {}) {
  const balance = Number(
    earnings?.available ?? earnings?.availableBalance ?? 0,
  );

  return (
    canReceiveEarnings(user) &&
    balance > 0 &&
    Boolean(user?.kycVerified || user?.isVerified)
  );
}

export function canSendGift(user) {
  return Boolean(user?.id || user?._id);
}

export function canCreateSubscription(user) {
  return Boolean(user?.id || user?._id);
}

export function isKycRequired(user) {
  return !Boolean(user?.kycVerified || user?.isKycVerified);
}

export function canManageMonetization(user) {
  return Boolean(
    user?.isCreator || user?.creatorEnabled || user?.monetizationEnabled,
  );
}

export async function openPaymentSettings() {
  if (Platform.OS === "web") {
    return false;
  }

  await Linking.openSettings();

  return true;
}

export default {
  canUseMonetization,
  canReceiveEarnings,
  canWithdraw,
  canSendGift,
  canCreateSubscription,
  isKycRequired,
  canManageMonetization,
  openPaymentSettings,
};
