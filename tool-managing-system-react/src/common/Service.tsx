

export const formatDate = function (date: Date): string {
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are 0-indexed in JavaScript
  const day = ("0" + date.getDate()).slice(-2);

  return `${year}-${month}-${day}`;
};
