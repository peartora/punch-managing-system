import OpenFileButton from "../buttonElement/OpenFileButton";

type Props = {
  latestInspectionDate: string;
};

function InspectionHistoryTd({ latestInspectionDate }: Props) {
  if (latestInspectionDate === null) {
    latestInspectionDate = `검수 이력이 없습니다.`;
  }

  return (
    <td>
      {latestInspectionDate}
      <OpenFileButton text="이력 확인" onClick={() => alert(`!!!`)} />
    </td>
  );
}

export default InspectionHistoryTd;
