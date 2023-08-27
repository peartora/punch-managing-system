import { useState, useEffect } from "react";

import { request } from "@/common/utils/ajax";

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
