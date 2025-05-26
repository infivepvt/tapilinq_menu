export function isFloat(str) {
  return !isNaN(str) && parseFloat(str).toString() === str.trim();
}

export function generateOrderId() {
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase(); // 6 chars
  return `ORD-${randomStr}`;
}
