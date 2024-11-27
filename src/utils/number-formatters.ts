export const moneyFormatter = (money: number) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  return formatIfNumber(money, formatter);
}

export const dollarFormatter = (money: number) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatIfNumber(money, formatter);
}

export const decimalFormatter = (digits: number, number: number) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
  return formatIfNumber(number, formatter);
}

const formatIfNumber = (number: any, formatter: any) => {
  const hasNumber = isNaN(number) === false;
  if (!hasNumber) {
    return '...';
  } else {
    return formatter.format(number)
  }
}
