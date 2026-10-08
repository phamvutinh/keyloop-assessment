type ClassDictionary = Record<string, boolean | null | undefined>;
type ClassArray = ClassValue[];
export type ClassValue =
  string | number | boolean | null | undefined | ClassDictionary | ClassArray;

const toClassName = (value: ClassValue): string => {
  if (!value || typeof value === "boolean") {
    return "";
  }

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map(toClassName).filter(Boolean).join(" ");
  }

  return Object.entries(value)
    .filter(([, isEnabled]) => Boolean(isEnabled))
    .map(([className]) => className)
    .join(" ");
};

export const cn = (...inputs: ClassValue[]) =>
  inputs.map(toClassName).filter(Boolean).join(" ");
