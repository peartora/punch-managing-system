import { useState, useEffect } from "react";
import { request } from "./Service";
import { type PunchRow as PunchRowType } from "@/common/types";

export const useDisplay = function (params: URLSearchParams) {
  const [key, setKey] = useState(() => Date.now());
  const [isLoading, setLoading] = useState(true);
  const [rows, setRows] = useState<Array<PunchRowType>>([]);

  useEffect(() => {
    console.log(`effect happen`);
    setLoading(true);

    request
      .get(`/api/tool-managing-system/display?${params.toString()}`)
      .then((response) => {
        if (!response.ok) {
          console.error(response.statusText);
          throw new Error(`Punch 리스트 로딩 중 error가 발생 하였습니다.`);
        }
        return response.json();
      })
      .then((response) => {
        setRows(response);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, [params, key]);

  const refetch = () => {
    setKey(Date.now());
  };

  return {
    rows,
    isLoading,
    refetch,
  };
};

export const useBringProductList = function () {
  const [isLoading, setLoading] = useState(true);
  const [productList, setProductList] = useState<Array<string>>([]);

  useEffect(() => {
    setLoading(true);

    request
      .get(`/api/tool-managing-system/getProducts`)
      .then((response) => {
        if (!response.ok)
          throw new Error(`제품 정보를 불러오는데 실패 하였습니다.`);
        return response.json();
      })
      .then((productList) => {
        setProductList([...productList]);
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, []);

  return {
    productList,
    isLoading,
  };
};

export const useBringSupplierList = function () {
  const [isLoading, setLoading] = useState(true);
  const [supplierList, setSupplierList] = useState<Array<string>>([]);

  useEffect(() => {
    setLoading(true);

    request
      .get(`/api/tool-managing-system/getSuppliers`)
      .then((response) => {
        if (!response.ok)
          throw new Error(`업체 정보를 불러오는데 실패 하였습니다.`);
        return response.json();
      })
      .then((supplierList) => {
        setSupplierList([...supplierList]);
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, []);

  return {
    supplierList,
    isLoading,
  };
};
