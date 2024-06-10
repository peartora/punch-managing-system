import { useState, useEffect, useCallback } from "react";

import { type PunchRow as PunchRowType } from "@/common/types";
import { request } from "@/common/utils/ajax";

import { getPunchList } from "@/common/actions/punch/getPunchList";

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

    const fetchPunchList = async function () {
      console.log(`fetchPunchList called`);

      let output;

      try {
        output = await getPunchList();
      } catch (error) {
        alert(`${error.message}`);
        return;
      }

      setRows(output);
      if (isFirst) {
        setIsFirst(false);
      }
    };

    fetchPunchList();
    setLoading(false);
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
