import { useBringProductList } from "@/common/hooks";
import { useBringSupplierList } from "@/common/hooks";

import Filter from "./Filter";

type Props = {
  setParams: (params: URLSearchParams) => void;
};

export default function FilterController(props: Props) {
  const { productList, isLoading } = useBringProductList();
  const { supplierList } = useBringSupplierList();

  console.log(supplierList);

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
