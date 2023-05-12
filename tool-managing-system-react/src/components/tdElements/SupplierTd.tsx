type Props = {
  supplier: string;
};

function SupplierTd({ supplier }: Props) {
  return <td>{supplier}</td>;
}

export default SupplierTd;
