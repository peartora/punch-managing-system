import { useEffect, useState } from "react";

import { request } from "@/common/service";

export default function useBringProductList() {
  const [productList, setProductList] = useState<Array<string>>([]);

  useEffect(() => {
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
      .catch((error) => console.log(error));
  }, []);

  return productList;
}