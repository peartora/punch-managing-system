type Props = {
  path: string;
  date: string;
};

export default function AElement(props: Props) {
  const { path } = props;
  const pdfName = path.substring(path.lastIndexOf("\\") + 1);
  const fullPath = `http://localhost:8080/resources/pdf/${pdfName}`;

  return <a href={fullPath}>{props.date}</a>;
}
