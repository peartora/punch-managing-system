import { useState, useEffect, useCallback } from "react";

import { type PunchRow as PunchRowType } from "@/common/types";
import { request } from "@/common/utils/ajax";

export const useDisplay = function (params?: URLSearchParams) {
  const [key, setKey] = useState(() => Date.now());
  const [isFirst, setIsFirst] = useState(true);
  const [isLoading, setLoading] = useState(true);
  const [rows, setRows] = useState<Array<PunchRowType>>([]);

  console.log(`useDisplay called`);

  useEffect(() => {
    console.log(`effect happen`);
    if (isFirst) {
      setLoading(true);
    }

    let query = "";
    if (params) {
      query = params.toString();
    }

    request
      .get(`/api/tool-managing-system/display?${query}`)
      .then((response) => {
        if (!response.ok) {
          console.error(response.statusText);
          throw new Error(`Punch 리스트 로딩 중 error가 발생 하였습니다.`);
        }
        return response.json();
      })
      .then((response) => {
        console.log("response");
        console.log(response);

        setRows(response);
        if (isFirst) {
          setIsFirst(false);
        }
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, [params, key, isFirst]);

  const refetch = useCallback(() => {
    setKey(Date.now());
  }, []);

  return {
    rows,
    isLoading,
    refetch,
  };
};
