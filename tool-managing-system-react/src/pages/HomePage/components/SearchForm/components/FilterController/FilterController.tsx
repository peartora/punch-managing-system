import { useBringProductList } from "@/common/hooks/useBringProductList";
import { useBringSupplierList } from "@/common/hooks/useBringSupplierList";

import { Filter } from "./components/Filter";

type Props = {
  setParams: (params: URLSearchParams) => void;
};

export function FilterController(props: Props) {
  const { productList, isLoading } = useBringProductList();
  const { supplierList } = useBringSupplierList();

  if (isLoading) {
    <div>로딩</div>;
  }

  return (
    <Filter
      productList={productList}
      supplierList={supplierList}
      setParams={props.setParams}
    />
  );
}
