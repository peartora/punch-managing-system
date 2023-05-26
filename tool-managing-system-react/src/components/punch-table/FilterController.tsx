import { useBringProductList } from "@/common/hooks";
import Filter from "./Filter";

type Props = {
  setParams: (params: URLSearchParams) => void;
};

export default function FilterController(props: Props) {
  const { productList, isLoading } = useBringProductList();

  if (isLoading) {
    <div>로딩</div>;
  }

  return <Filter productList={productList} setParams={props.setParams} />;
}
