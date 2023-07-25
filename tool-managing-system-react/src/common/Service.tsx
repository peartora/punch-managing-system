type Data = {
  number: string;
  date: string;
  type: string;
  manufacturer: string;
  status: string;
  location: string;
  product: string;
  productType: string;
};

export const request = {
  get(url: string) {
    return fetch(url);
  },
  post(
    url: string,
    payload: Data[] | FormData | Record<string, unknown>,
    headers: Record<string, string> = {}
  ) {
    if (payload instanceof FormData) {
      return fetch(url, {
        method: "POST",
        // headers: { "content-Type": "multipart/form-data" },
        body: payload,
      });
    } else {
      return fetch(url, {
        method: "POST",
        headers: { "content-Type": "application/json", ...headers },
        body: JSON.stringify(payload),
      });
    }
  },
  delete(url: string) {
    return fetch(url, { method: "DELETE" });
  },
};

export const formatDate = function (date: Date): string {
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are 0-indexed in JavaScript
  const day = ("0" + date.getDate()).slice(-2);

  return `${year}-${month}-${day}`;
};
