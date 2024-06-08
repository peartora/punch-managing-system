import { useBringMedicineList } from "@/common/hooks/useBringMedicineList";
import { useBringSupplierList } from "@/common/hooks/useBringSupplierList";

import { Filter } from "./components/Filter";

type Props = {
  setParams: (params: URLSearchParams) => void;
};

export function FilterController(props: Props) {
  const { medicineNameList, isLoading } = useBringMedicineList();
  const { supplierList } = useBringSupplierList();

  if (isLoading) {
    <div>로딩</div>;
  }

  return (
    <Filter
      medicineNameList={medicineNameList}
      supplierList={supplierList}
      setParams={props.setParams}
    />
  );
}
