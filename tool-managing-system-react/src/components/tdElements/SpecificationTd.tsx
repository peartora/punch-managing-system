type Props = {
  specification: string;
};

function SpecificationTd({ specification }: Props) {
  const pdfName = specification.substring(specification.lastIndexOf("\\") + 1);

  const fullPath = `/resources/pdf/specification/${pdfName}`;

  return (
    <td>
      <a href={fullPath} target="_blank">
        {pdfName}
      </a>
    </td>
  );
}

export default SpecificationTd;
