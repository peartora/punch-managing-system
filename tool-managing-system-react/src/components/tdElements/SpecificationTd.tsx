type Props = {
  specification: string;
};

function SpecificationTd({ specification }: Props) {
  const pdfName = specification.substring(specification.lastIndexOf("\\") + 1);
  const fullPath = `http://localhost:8080/resources/pdf/${pdfName}`;

  return (
    <td>
      <a href={specification}>{pdfName}</a>
    </td>
  );
}

export default SpecificationTd;
