/**
 * Format number as Indian Rupee (INR) with Indian number system
 * 120000 → ₹1,20,000
 */
export function formatINR(number) {
  if (number == null || isNaN(number)) return '₹0';
  
  const num = Math.round(Math.abs(number));
  const sign = number < 0 ? '-' : '';
  
  // Indian numbering: lakhs, crores
  if (num >= 10000000) {
    const crores = (num / 10000000).toFixed(1);
    return `${sign}₹${crores} Cr`;
  } else if (num >= 100000) {
    const lakhs = (num / 100000).toFixed(1);
    return `${sign}₹${lakhs} L`;
  } else if (num >= 1000) {
    const thousands = Math.floor(num / 1000);
    const hundreds = num % 1000;
    return `${sign}₹${thousands.toLocaleString('en-IN')},${hundreds.toString().padStart(3, '0')}`;
  } else {
    return `${sign}₹${num.toLocaleString('en-IN')}`;
  }
}

/**
 * Short format for large numbers
 */
export function formatINRShort(number) {
  const num = Math.round(number);
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(1)}Cr`;
  } else if (num >= 100000) {
    return `₹${(num / 100000).toFixed(1)}L`;
  } else if (num >= 1000) {
    return `₹${(num / 1000).toFixed(1)}K`;
  }
  return formatINR(num);
}

/**
 * Plain number formatter (Indian commas)
 */
export function formatNumberIndian(number) {
  return number.toLocaleString('en-IN');
}

