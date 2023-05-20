type Props = {
  latestCleaningHistory: string;
};

function CleaningHistoryTd({ latestCleaningHistory }: Props) {
  return <td>{latestCleaningHistory}</td>;
}

export default CleaningHistoryTd;
