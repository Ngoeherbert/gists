import { formatNumber } from "../../utils/formatNumber";

export function getEarningsAmount(earnings) {
  return Number(earnings?.amount ?? earnings?.total ?? earnings?.balance ?? 0);
}

export function getAvailableEarnings(earnings) {
  return Number(
    earnings?.available ??
      earnings?.availableBalance ??
      earnings?.withdrawable ??
      0,
  );
}

export function getPendingEarnings(earnings) {
  return Number(earnings?.pending ?? earnings?.pendingBalance ?? 0);
}

export function getLifetimeEarnings(earnings) {
  return Number(
    earnings?.lifetime ??
      earnings?.lifetimeEarnings ??
      earnings?.totalEarned ??
      0,
  );
}

export function formatEarningsAmount(amount, currency = "XAF") {
  const value = Number(amount) || 0;

  return `${formatNumber(value)} ${currency}`;
}

export function getEarningsSummary(earnings = {}) {
  return {
    available: getAvailableEarnings(earnings),
    pending: getPendingEarnings(earnings),
    lifetime: getLifetimeEarnings(earnings),
    total: getEarningsAmount(earnings),
  };
}

export function calculateEarningsGrowth(current = 0, previous = 0) {
  const currentValue = Number(current) || 0;
  const previousValue = Number(previous) || 0;

  if (previousValue === 0) {
    return currentValue > 0 ? 100 : 0;
  }

  return ((currentValue - previousValue) / previousValue) * 100;
}

export function getEarningsGrowthLabel(current, previous) {
  const growth = calculateEarningsGrowth(current, previous);

  if (growth > 0) {
    return `+${growth.toFixed(1)}%`;
  }

  return `${growth.toFixed(1)}%`;
}

export function sortEarningsByDate(earnings = [], descending = true) {
  return [...earnings].sort((a, b) => {
    const first = new Date(a?.createdAt || a?.date || 0).getTime();

    const second = new Date(b?.createdAt || b?.date || 0).getTime();

    return descending ? second - first : first - second;
  });
}

export function groupEarningsByType(earnings = []) {
  return earnings.reduce((groups, earning) => {
    const type = earning?.type || "other";

    if (!groups[type]) {
      groups[type] = [];
    }

    groups[type].push(earning);

    return groups;
  }, {});
}

export default {
  getEarningsAmount,
  getAvailableEarnings,
  getPendingEarnings,
  getLifetimeEarnings,
  formatEarningsAmount,
  getEarningsSummary,
  calculateEarningsGrowth,
  getEarningsGrowthLabel,
  sortEarningsByDate,
  groupEarningsByType,
};
