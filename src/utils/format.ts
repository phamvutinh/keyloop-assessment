type DateInput = string | number | Date;

const dateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "long",
  timeStyle: "short",
});

const toDate = (date: DateInput) =>
  date instanceof Date ? date : new Date(date);

export const formatDateTime = (date: DateInput) =>
  dateTimeFormatter.format(toDate(date));
