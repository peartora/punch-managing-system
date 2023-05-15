import MyButton from "../buttonElement/Button";

type Props = {
  latestInspectionHistory: string;
};

function InspectionHistoryTd({ latestInspectionHistory }: Props) {
  return (
    <td>
      {latestInspectionHistory}
      <MyButton text="이력 확인" />
    </td>
  );
}

export default InspectionHistoryTd;
