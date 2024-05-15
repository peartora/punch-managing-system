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

    const resJson = await res.json();
    console.log("res", resJson);

    const errorCode = resJson.error.code;
    console.log("errorCode", errorCode);

    if (!res.ok) {
      console.log("here error is occured");
      throw new Error(errorCode);
    }

    return resJson;
  },
  delete(url: string) {
    return fetch(url, { method: "DELETE" });
  },
};
