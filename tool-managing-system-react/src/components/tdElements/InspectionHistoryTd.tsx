type Props = {
  latestInspectionDate: string;
  inspectionFilePath: string;
  punchId: string;
};

function InspectionHistoryTd({
  latestInspectionDate,
  inspectionFilePath,
}: Props) {
  const pdfName = inspectionFilePath.substring(
    inspectionFilePath.lastIndexOf("\\") + 1
  );
  const fullPath = `/resources/pdf/inspection/${pdfName}`;

  return (
    <td>
      latestInspectionDate ? (
      <a href={fullPath} target="_blank" rel="noopener noreferrer">
        {latestInspectionDate}
      </a>
      ) : (<p>검수이력 없음</p>)
    </td>
  );
}

export default InspectionHistoryTd;
