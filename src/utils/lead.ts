export const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

export const getInquiryExcerpt = (message: string, maxLength = 120) => {
  if (message.length <= maxLength) {
    return message;
  }

  return `${message.slice(0, maxLength - 3).trimEnd()}…`;
};
