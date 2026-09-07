export function getSubscriptionId(subscription) {
  return subscription?.id || subscription?._id || null;
}

export function getSubscriptionCreator(subscription) {
  return subscription?.creator || subscription?.user || null;
}

export function getSubscriptionPlan(subscription) {
  return subscription?.plan || subscription?.subscriptionPlan || null;
}

export function getSubscriptionPrice(subscription) {
  return Number(
    subscription?.price ??
      subscription?.amount ??
      getSubscriptionPlan(subscription)?.price ??
      0,
  );
}

export function getSubscriptionCurrency(subscription) {
  return (
    subscription?.currency ||
    getSubscriptionPlan(subscription)?.currency ||
    "XAF"
  );
}

export function isSubscriptionActive(subscription) {
  return Boolean(
    subscription?.active ||
    subscription?.isActive ||
    subscription?.status === "active",
  );
}

export function isSubscriptionExpired(subscription) {
  if (subscription?.status === "expired") {
    return true;
  }

  const expiry = subscription?.expiresAt || subscription?.endDate;

  if (!expiry) return false;

  const date = new Date(expiry);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return date.getTime() <= Date.now();
}

export function getSubscriptionExpiry(subscription) {
  return subscription?.expiresAt || subscription?.endDate || null;
}

export function getSubscriptionRemainingDays(subscription) {
  const expiry = getSubscriptionExpiry(subscription);

  if (!expiry) return 0;

  const date = new Date(expiry);

  if (Number.isNaN(date.getTime())) {
    return 0;
  }

  const difference = date.getTime() - Date.now();

  return Math.max(0, Math.ceil(difference / (1000 * 60 * 60 * 24)));
}

export function getSubscriptionStatusLabel(subscription) {
  if (isSubscriptionExpired(subscription)) {
    return "Expired";
  }

  if (isSubscriptionActive(subscription)) {
    return "Active";
  }

  if (subscription?.status === "cancelled") {
    return "Cancelled";
  }

  if (subscription?.status === "pending") {
    return "Pending";
  }

  return "Inactive";
}

export function normalizeSubscription(subscription = {}) {
  return {
    ...subscription,
    id: getSubscriptionId(subscription),
    price: getSubscriptionPrice(subscription),
    currency: getSubscriptionCurrency(subscription),
    creator: getSubscriptionCreator(subscription),
    plan: getSubscriptionPlan(subscription),
    active: isSubscriptionActive(subscription),
    expired: isSubscriptionExpired(subscription),
  };
}

export function normalizeSubscriptions(subscriptions = []) {
  return subscriptions.map(normalizeSubscription);
}

export function calculateSubscriptionRevenue(subscriptions = []) {
  return subscriptions
    .filter(isSubscriptionActive)
    .reduce(
      (total, subscription) => total + getSubscriptionPrice(subscription),
      0,
    );
}

export default {
  getSubscriptionId,
  getSubscriptionCreator,
  getSubscriptionPlan,
  getSubscriptionPrice,
  getSubscriptionCurrency,
  isSubscriptionActive,
  isSubscriptionExpired,
  getSubscriptionExpiry,
  getSubscriptionRemainingDays,
  getSubscriptionStatusLabel,
  normalizeSubscription,
  normalizeSubscriptions,
  calculateSubscriptionRevenue,
};
