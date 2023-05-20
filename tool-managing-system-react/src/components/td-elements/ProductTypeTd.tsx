type Props = {
  productType: string;
};

function ProductTypeTd({ productType }: Props) {
  return <td>{productType}</td>;
}

export default ProductTypeTd;
