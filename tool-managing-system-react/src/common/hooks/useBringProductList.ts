import { useState, useEffect } from "react";

import { request } from "@/common/utils/ajax";

export const useBringProductList = function () {
  const [isLoading, setLoading] = useState(true);
  const [medicineNameList, setMedicineNameList] = useState<Array<string>>([]);

  useEffect(() => {
    setLoading(true);

    request
      .get(`/api/tool-managing-system/getMedicine`)
      .then((response) => {
        if (!response.ok)
          throw new Error(`제품 정보를 불러오는데 실패 하였습니다.`);
        return response.json();
      })
      .then((medicineNameList: string[]) => {
        setMedicineNameList([...medicineNameList]);
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, []);

  return {
    medicineNameList,
    isLoading,
  };
};
