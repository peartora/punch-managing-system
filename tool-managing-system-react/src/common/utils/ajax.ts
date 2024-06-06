import { BusinessError } from "../error";

export type ResponseDTO =
  | {
      success: unknown;
      errro?: undefined;
    }
  | {
      success?: undefined;
      error: {
        code: string;
        message: string;
        detail?: unknown;
      };
    };

export const request = {
  get: async (url: string) => {
    const res = await fetch(url);
    const jsonRes = await res.json();

    return jsonRes;
  },
  post: async (url: string, payload: unknown): Promise<unknown> => {
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

    const dto = (await res.json()) as ResponseDTO;

    if (!res.ok) {
      console.log("res.ok is false");
      console.log(dto.error);

      if (!dto.error) {
        throw new BusinessError("UNKNOWN_ERROR", "Unknown error occurred");
      }

      const { code, message, detail } = dto.error;
      throw new BusinessError(code, message, detail);
    }

    if (!dto.success) {
      throw new BusinessError("UNKNOWN_ERROR", "Unknown error occurred");
    }

    return dto.success.data;
  },
  delete(url: string) {
    return fetch(url, { method: "DELETE" });
  },
};
