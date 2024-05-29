import { BusinessError } from "../error";

export const request = {
  get: async (url: string) => {
    const res = await fetch(url);
    const jsonRes = await res.json();

    return jsonRes;
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

    if (!res.ok) {
      console.log("res.ok is false");

      const { code, message, detail } = resJson.error;
      console.log(resJson.error);
      throw new BusinessError(code, message, detail);
    }

    console.log("res.ok is true");
    return resJson;
  },
  delete(url: string) {
    return fetch(url, { method: "DELETE" });
  },
};
