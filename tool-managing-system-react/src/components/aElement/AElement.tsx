type Props = {
  path: string;
  date?: string;
  punchId?: string;
};

export default function AElement(props: Props) {
  const { path } = props;
  const pdfName = path.substring(path.lastIndexOf("\\") + 1);
  const fullPath = `http://localhost:7070/resources/pdf/inspection/${pdfName}`;

  return (
    <a href={fullPath} target="_blank">
      {props.date}
    </a>
  );
}
