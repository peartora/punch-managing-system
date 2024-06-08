import { useState, useEffect } from "react";

import { getMedicineList } from "../actions/medicine/getMedicineList";

export const useBringMedicineList = function () {
  const [isLoading, setLoading] = useState(true);
  const [medicineNameList, setMedicineNameList] = useState<Array<string>>([]);

  useEffect(() => {
    setLoading(true);

    const fetchMedicineList = async () => {
      let output;

      try {
        output = await getMedicineList();
      } catch (error) {
        console.log("error", error);
        alert(`${error.message}`);
        return;
      }

      setMedicineNameList(output);
      setLoading(false);
    };

    fetchMedicineList();
  }, []);

  return {
    medicineNameList,
    isLoading,
  };
};
