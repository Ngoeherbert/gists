export function formatNumber(number, options = {}) {
  if (number === null || number === undefined || number === "") {
    return "0";
  }

  const value = Number(number);

  if (Number.isNaN(value)) {
    return "0";
  }

  const {
    locale = undefined,
    maximumFractionDigits = 1,
    notation = "compact",
  } = options;

  return new Intl.NumberFormat(locale, {
    notation,
    maximumFractionDigits,
  }).format(value);
}

export function formatCount(number) {
  return formatNumber(number);
}

export function formatExactNumber(number) {
  if (number === null || number === undefined || number === "") {
    return "0";
  }

  const value = Number(number);

  if (Number.isNaN(value)) {
    return "0";
  }

  return new Intl.NumberFormat().format(value);
}

export function formatPercentage(value, decimals = 0) {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return "0%";
  }

  return `${number.toFixed(decimals)}%`;
}

export default formatNumber;
