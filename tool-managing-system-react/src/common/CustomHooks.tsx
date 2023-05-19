import { useState, useEffect } from "react";
import { request } from "./Service";

export const useDisplay = function() {
  let rows;
  
  useEffect(() => {
    request
      .get(`/api/tool-managing-system/display`)
      .then((response) => {
        if (!response.ok) {
          console.error(response.statusText);
          throw new Error(`Punch 리스트 로딩 중 error가 발생 하였습니다.`);
        }
        return response.json();
      })
      .then((response) => {
        rows = response;
        // setRows(response);
      })
      .catch((error) => console.error(error));
  }, []);

  return rows;
}



export const useBringProductList = function () {
  const [productList, setProductList] = useState<Array<string>>([]);

  useEffect(() => {
    request
      .get(`/api/tool-managing-system/getProducts`)
      .then((response) => {
        if (!response.ok)
          throw new Error(
            `제품 정보를 불러오는데 실패 하였습니다.`
          );
        return response.json();
      })
      .then((productList) => {
        setProductList([...productList]);
      })
      .catch((error) => console.log(error));
  }, []);

  return productList;
}

export const useUpdatePuncState = function(targetState: string, formData: any) {
  useEffect(() => {
    request.post(`/api/tool-managing-system/updateMultiplePunchStatus`, formData)
    .then(response => {
      if (!response.ok) throw new Error(`펀치 상태 변경중 error가 발생 하였습니다.`);
      return response.text();
    })
    .then();
  })
}




