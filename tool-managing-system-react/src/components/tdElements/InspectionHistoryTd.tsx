import OpenFileButton from "../buttonElement/OpenFileButton";

type Props = {
  latestInspectionDate: string;
};

function InspectionHistoryTd({ latestInspectionDate }: Props) {
  return (
    <td>
      {latestInspectionDate}
      <OpenFileButton text="이력 확인" onClick={() => alert(`!!!`)}  />
    </td>
  );
}

export default InspectionHistoryTd;
