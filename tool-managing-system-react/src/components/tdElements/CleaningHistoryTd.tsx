import MyButton from "../buttonElement/Button";

type Props = {
  latestCleaningHistory: string;
};

function CleaningHistoryTd({ latestCleaningHistory }: Props) {
  return (
    <td>
      {latestCleaningHistory}
      <MyButton text="이력 추가" />
      <MyButton text="이력 확인" />
    </td>
  );
}

export default CleaningHistoryTd;
