import { useState, useEffect } from "react";

import { getSupplierList } from "../actions/supplier/getSupplierList";

export const useBringSupplierList = function () {
  const [isLoading, setLoading] = useState(true);
  const [supplierList, setSupplierList] = useState<Array<string>>([]);

  useEffect(() => {
    setLoading(true);

    const fetchSupplierList = async () => {
      let output;

      try {
        output = await getSupplierList();
      } catch (error) {
        alert(`${error.message}`);
        return;
      }

      setSupplierList(output);
      setLoading(false);
    };

    fetchSupplierList();
  }, []);

  return {
    supplierList,
    isLoading,
  };
};
