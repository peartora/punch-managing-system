type Props = {
  path: string;
  date?: string;
  punchId?: string;
};

export default function AElement(props: Props) {
  const { path, date } = props;

  let fullPath = "";

  if (path !== null) {
    const pdfName = path.substring(path.lastIndexOf("\\") + 1);
    fullPath = `/resources/pdf/inspection/${pdfName}`;
  }

  return date ? (
    <a href={fullPath} target="_blank" rel="noopener noreferrer">
      {date}
    </a>
  ) : (
    <p>검수이력 없음</p>
  );
}
