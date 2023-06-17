type Props = {
  specification: string;
};

function SpecificationTd({ specification }: Props) {
  const pdfName = specification.substring(specification.lastIndexOf("\\") + 1);

  console.log("pdfName");
  console.log(pdfName);

  const fullPath = `http://localhost:8080/resources/pdf/specification/${pdfName}`;

  return (
    <td>
      <a href={fullPath} target="_blank">
        {pdfName}
      </a>
    </td>
  );
}

export default SpecificationTd;
