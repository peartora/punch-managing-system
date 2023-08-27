type Props = {
  latestInspectionDate?: string;
  inspectionFilePath?: string;
  punchId: string;
};

export function InspectionHistoryTd({
  latestInspectionDate,
  inspectionFilePath,
}: Props) {
  if (!latestInspectionDate || !inspectionFilePath) {
    return (
      <td>
        <p>검수이력 없음</p>
      </td>
    );
  }

  const pdfName = inspectionFilePath.substring(
    inspectionFilePath.lastIndexOf("\\") + 1
  );
  const fullPath = `/resources/pdf/inspection/${pdfName}`;

  return (
    <td>
      <a href={fullPath} target="_blank" rel="noopener noreferrer">
        {latestInspectionDate}
      </a>
    </td>
  );
}

export default InspectionHistoryTd;
