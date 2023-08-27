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
