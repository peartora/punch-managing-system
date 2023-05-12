type Props = {
  specification: string;
};

function SpecificationTd({ specification }: Props) {
  return <td>{specification}</td>;
}

export default SpecificationTd;
