export function getGiftId(gift) {
  return gift?.id || gift?._id || null;
}

export function getGiftName(gift) {
  return gift?.name || gift?.title || "Gift";
}

export function getGiftIcon(gift) {
  return gift?.icon || gift?.image || gift?.imageUrl || null;
}

export function getGiftValue(gift) {
  return Number(gift?.value ?? gift?.price ?? gift?.coins ?? 0);
}

export function getGiftQuantity(gift) {
  return Math.max(1, Number(gift?.quantity) || 1);
}

export function calculateGiftTotal(gift, quantity = 1) {
  return getGiftValue(gift) * Math.max(1, Number(quantity) || 1);
}

export function getGiftSender(gift) {
  return gift?.sender || gift?.from || null;
}

export function getGiftRecipient(gift) {
  return gift?.recipient || gift?.to || null;
}

export function isGiftReceived(gift, userId) {
  const recipient = getGiftRecipient(gift);

  return (
    String(recipient?.id || recipient?.userId || gift?.recipientId || "") ===
    String(userId)
  );
}

export function isGiftSent(gift, userId) {
  const sender = getGiftSender(gift);

  return (
    String(sender?.id || sender?.userId || gift?.senderId || "") ===
    String(userId)
  );
}

export function normalizeGift(gift = {}) {
  return {
    ...gift,
    id: getGiftId(gift),
    name: getGiftName(gift),
    icon: getGiftIcon(gift),
    value: getGiftValue(gift),
    quantity: getGiftQuantity(gift),
  };
}

export function normalizeGifts(gifts = []) {
  return gifts.map(normalizeGift);
}

export function sortGiftsByValue(gifts = [], descending = true) {
  return [...gifts].sort((a, b) => {
    const first = getGiftValue(a);
    const second = getGiftValue(b);

    return descending ? second - first : first - second;
  });
}

export function getGiftTotalValue(gifts = []) {
  return gifts.reduce(
    (total, gift) => total + getGiftValue(gift) * getGiftQuantity(gift),
    0,
  );
}

export default {
  getGiftId,
  getGiftName,
  getGiftIcon,
  getGiftValue,
  getGiftQuantity,
  calculateGiftTotal,
  getGiftSender,
  getGiftRecipient,
  isGiftReceived,
  isGiftSent,
  normalizeGift,
  normalizeGifts,
  sortGiftsByValue,
  getGiftTotalValue,
};
