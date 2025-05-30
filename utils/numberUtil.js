export function isFloat(str) {
  return !isNaN(str) && parseFloat(str).toString() === str.trim();
}

export function generateOrderId() {
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase(); // 6 chars
  return `ORD-${randomStr}`;
}

// utils/generateGuestName.js
export function generateGuestName() {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `Guest${randomNum}`;
}
