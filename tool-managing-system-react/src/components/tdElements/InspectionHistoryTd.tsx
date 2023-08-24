import AElement from "../aElement/AElement";

type Props = {
  latestInspectionDate: string;
  inspectionFilePath: string;
  punchId: string;
};

function InspectionHistoryTd({
  latestInspectionDate,
  inspectionFilePath,
}: Props) {
  return (
    <td>
      <AElement path={inspectionFilePath} date={latestInspectionDate} />
    </td>
  );
}

export default InspectionHistoryTd;
