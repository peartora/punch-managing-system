type Props = {
  path: string;
  onClick: () => void;
};

export default function AElement(props: Props) {
  const { path } = props;
  const pdfName = path.substring(path.lastIndexOf("\\") + 1);
  const fullPath = `http://localhost:8080/resources/pdf/${pdfName}`;

  console.log("pdfName");
  console.log(pdfName);

  console.log("path");
  console.log(path);

  return (
    <a href={fullPath} onClick={props.onClick} target="_blank">
      {pdfName}
    </a>
  );
}
