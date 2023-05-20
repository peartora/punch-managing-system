type Props = {
  totalUsageNumber: number;
};

function TotalUsageNumberTd({ totalUsageNumber }: Props) {
  return <td>{totalUsageNumber}</td>;
}

export default TotalUsageNumberTd;
