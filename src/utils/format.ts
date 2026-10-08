type DateInput = string | number | Date;

const dateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "long",
  timeStyle: "short",
});

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
});

const currencyFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

const toDate = (date: DateInput) =>
  date instanceof Date ? date : new Date(date);

export const formatDateTime = (date: DateInput) =>
  dateTimeFormatter.format(toDate(date));

export const formatDate = (date: DateInput) =>
  dateFormatter.format(toDate(date));

export const formatCurrency = (value: number) =>
  currencyFormatter.format(value);

export const formatPercent = (value: number) => `${Math.round(value)}%`;
