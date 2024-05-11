export const request = {
  get(url: string) {
    return fetch(url);
  },
  post: async (url: string, payload: unknown) => {
    let res: Response;
    if (payload instanceof FormData) {
      res = await fetch(url, {
        method: "POST",
        body: payload,
      });
    } else {
      res = await fetch(url, {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    }

    const jsonRes = res.json();

    console.log("res before", res);
    console.log("res", jsonRes);

    if (!res.ok) {
      throw new Error("network error");
      // 왜?, 상세 내용?
    }

    return jsonRes;
  },
  delete(url: string) {
    return fetch(url, { method: "DELETE" });
  },
};
