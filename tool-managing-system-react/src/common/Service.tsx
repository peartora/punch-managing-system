export const request = {
  get(url: string) {
    return fetch(url);
  },
  post(url: string, payload: Record<string, unknown>) {
    return fetch(url, {
      method: "POST",
      headers: { "content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  },
  delete(url: string) {
    return fetch(url, { method: "DELETE" });
  },
};
