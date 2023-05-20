import { useEffect, useState } from "react";
import { request } from "@/common/service";
import { PunchRow, UseFetchReturn } from "@/common/types";

type UseDisplayReturn = UseFetchReturn<undefined, Array<PunchRow>, Error>;

export default function useDisplay(): UseDisplayReturn {
  const [status, setStatus] = useState<UseDisplayReturn["status"]>("loading");
  const [data, setData] = useState<UseDisplayReturn["data"]>();
  const [error, setError] = useState<UseDisplayReturn["error"]>();

  const fetch = () => {
    setStatus("loading");
    request
      .get(`/api/tool-managing-system/display`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Punch 리스트 로딩 중 error가 발생 하였습니다.`, {
            cause: response,
          });
        }
        return response.json();
      })
      .then((json) => PunchRow.array().parse(json))
      .then((data) => {
        setStatus("success");
        setData(data);
      })
      .catch((error) => {
        console.error(error);
        setStatus("error");
        if (error instanceof Error) {
          setError(error);
        } else {
          setError(
            new Error("알 수 없는 에러 발생", {
              cause: error,
            })
          );
        }
      });
  };

  useEffect(() => {
    fetch();
  }, []);

  return {
    status,
    isLoading: status === "loading",
    isError: status === "error",
    isSuccess: status === "success",
    data,
    error,
    refetch: fetch,
  } as UseDisplayReturn;
}
