type Props = {
  product: string;
};

function ProductTd({ product }: Props) {
  return <td>{product}</td>;
}

export default ProductTd;
